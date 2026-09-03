#!/usr/bin/env python3
"""
scripts/optimize_images.py

Chytrý vícevláknový skript pro generování responzivních velikostí fotografií (-sm, -md).
- Původní soubory zůstávají 100% zachovány v plné kvalitě (vhodné pro lightbox/stažení).
- Vytváří zmenšené varianty:
    * -sm.webp (max 600px - ideální pro 300px boxy, mobil a miniatury v galeriích)
    * -md.webp (max 1200px - pro tablety a větší karty)
- Automaticky narovnává EXIF orientaci (exif_transpose).
- Je idempotentní: přeskočí soubory, které už mají aktuální varianty.
- Bezpečný: ignoruje loga (base, partners, orgs) a malé ikony.
- Paralelní zpracování: využívá všechna dostupná CPU jádra.
"""

import os
import sys
import argparse
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor, as_completed
from PIL import Image, ImageOps

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Složky, které se standardně ignorují (loga a vektorová/malá grafika)
DEFAULT_IGNORE_DIRS = {"base", "partners", "orgs", "favicon"}

# Výchozí velikosti pro varianty (název -> max rozměr v pixelech)
DEFAULT_SIZES = {
    "sm": 600,
    "md": 1200,
    "hd": 1920,
}

# Přípony souborů k optimalizaci
TARGET_EXTENSIONS = {".webp", ".jpg", ".jpeg", ".png"}

def should_skip_file(file_path: Path) -> bool:
    """Zkontroluje, zda soubor není již vygenerovanou variantou."""
    stem = file_path.stem
    for suffix in ["-sm", "-md", "-hd", "-lg", "-thumb"]:
        if stem.endswith(suffix):
            return True
    return False

def resize_image(img: Image.Image, max_dim: int) -> Image.Image:
    """Zmenší obrázek se zachováním poměru stran, pokud přesahuje max_dim."""
    width, height = img.size
    if width <= max_dim and height <= max_dim:
        return img.copy()

    if width > height:
        new_width = max_dim
        new_height = int(round(height * (max_dim / width)))
    else:
        new_height = max_dim
        new_width = int(round(width * (max_dim / height)))

    return img.resize((new_width, new_height), resample=Image.Resampling.LANCZOS)

def process_file_worker(args_tuple):
    """Pracovní funkce pro ProcessPoolExecutor."""
    file_path, sizes, quality, force, dry_run = args_tuple
    file_path = Path(file_path)

    if should_skip_file(file_path):
        return 0, 0, 0, None

    src_mtime = file_path.stat().st_mtime
    src_size = file_path.stat().st_size

    variants_to_generate = []
    for label, max_dim in sizes.items():
        out_path = file_path.with_name(f"{file_path.stem}-{label}.webp")
        if not force and out_path.exists():
            if out_path.stat().st_mtime >= src_mtime:
                continue
        variants_to_generate.append((label, max_dim, out_path))

    if not variants_to_generate:
        return 0, 1, 0, None

    try:
        with Image.open(file_path) as raw_img:
            img = ImageOps.exif_transpose(raw_img)
            orig_w, orig_h = img.size

            created = 0
            msg_list = []
            for label, max_dim, out_path in variants_to_generate:
                if dry_run:
                    msg_list.append(f"  [DRY-RUN] {file_path.name} -> {out_path.name} (max {max_dim}px)")
                    created += 1
                    continue

                if orig_w <= max_dim and orig_h <= max_dim:
                    resized = img.copy()
                else:
                    resized = resize_image(img, max_dim)
                
                if resized.mode in ("RGBA", "LA") or (resized.mode == "P" and "transparency" in resized.info):
                    save_img = resized.convert("RGBA")
                else:
                    save_img = resized.convert("RGB")

                save_img.save(out_path, format="WEBP", quality=quality, method=6)
                out_size = out_path.stat().st_size
                savings = (1 - (out_size / src_size)) * 100 if src_size > 0 else 0
                msg_list.append(f"  [OK] {file_path.name} -> {out_path.name} [{save_img.width}x{save_img.height}, {out_size // 1024} KB, -{savings:.1f}%]")
                created += 1

            return created, 0, 0, "\n".join(msg_list)
    except Exception as e:
        return 0, 0, 0, f"  [ERR] Chyba při zpracování {file_path}: {e}"

def optimize_directory(base_dir: Path, sizes: dict, quality: int, force: bool, dry_run: bool, ignore_dirs: set, workers: int = None):
    """Projde celou složku a paralelně optimalizuje všechny vhodné obrázky."""
    if workers is None:
        workers = os.cpu_count() or 4

    print(f"Skenuji složku: {base_dir}")
    print(f"Velikosti k vygenerování: {', '.join(f'{k}={v}px' for k, v in sizes.items())}")
    print(f"WebP kvalita: {quality}")
    print(f"Paralelní vlákna: {workers}")
    if dry_run:
        print("Režim DRY-RUN (žádné soubory nebudou zapsány)\n")
    else:
        print()

    # Najdeme všechny soubory
    files_to_process = []
    for root, dirs, files in os.walk(base_dir):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            p = Path(root) / f
            if p.suffix.lower() in TARGET_EXTENSIONS and not should_skip_file(p):
                files_to_process.append(p)

    total_files = len(files_to_process)
    print(f"Nalezeno {total_files} kandidátů ke kontrole. Spouštím optimalizaci...\n")

    tasks = [(str(p), sizes, quality, force, dry_run) for p in files_to_process]

    total_created = 0
    total_skipped = 0

    with ProcessPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(process_file_worker, t): t[0] for t in tasks}
        for future in as_completed(futures):
            created, skipped, _, msg = future.result()
            total_created += created
            total_skipped += skipped
            if msg:
                print(msg, flush=True)

    print("\n" + "=" * 50)
    print("Dokončeno!")
    print(f"Celkem zkontrolováno souborů: {total_files}")
    print(f"Nově vygenerováno / aktualizováno variant: {total_created}")
    print(f"Přeskočeno (již aktuální nebo malé): {total_skipped}")
    print("=" * 50)

def main():
    parser = argparse.ArgumentParser(description="Optimalizátor obrázků pro Zvaž vědu!")
    parser.add_argument(
        "--dir",
        type=str,
        default="static/media/imgs",
        help="Cílová složka (výchozí: static/media/imgs)"
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=82,
        help="WebP kvalita komprese (výchozí: 82)"
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=None,
        help="Počet paralelních procesů (výchozí: počet jader CPU)"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Vynutit přegenerování existujících variant"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Pouze zobrazí, co by bylo vygenerováno, bez zápisu na disk"
    )
    parser.add_argument(
        "--include-all-dirs",
        action="store_true",
        help="Zpracovat i složky s logy (base, partners, orgs)"
    )

    args = parser.parse_args()

    target_dir = Path(args.dir)
    if not target_dir.exists():
        print(f"Chyba: Složka '{target_dir}' neexistuje.", file=sys.stderr)
        sys.exit(1)

    ignore_dirs = set() if args.include_all_dirs else DEFAULT_IGNORE_DIRS

    optimize_directory(
        base_dir=target_dir,
        sizes=DEFAULT_SIZES,
        quality=args.quality,
        force=args.force,
        dry_run=args.dry_run,
        ignore_dirs=ignore_dirs,
        workers=args.workers
    )

if __name__ == "__main__":
    main()
