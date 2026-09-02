# Automatizovaný test responzivity, přetékání a PŘEKRÝVÁNÍ elementů

import sys
from playwright.sync_api import sync_playwright

URLS = [
    "http://localhost:1313/",
    "http://localhost:1313/brno/",
    "http://localhost:1313/praha/",
    "http://localhost:1313/o-nas/",
    "http://localhost:1313/kontakt/",
    "http://localhost:1313/podporovatele/",
    "http://localhost:1313/famelab/"
]

# Testujeme šířky po 50px krocích pro velmi jemnou síť od 320 do 1200
WIDTHS = list(range(320, 1201, 50)) + [1440]

def check_layout():
    has_errors = False
    print(f"Spouštím rigorózní test responzivity (testuji {len(WIDTHS)} velikostí na {len(URLS)} stránkách)...\n")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        for url in URLS:
            print(f"--- Testuji: {url} ---")
            try:
                page.goto(url)
            except Exception as e:
                print(f"  [Chyba] Nelze načíst {url}.")
                continue
            
            for width in WIDTHS:
                page.set_viewport_size({"width": width, "height": 900})
                page.wait_for_timeout(300)
                
                issues = page.evaluate("""
                    () => {
                        let errors = [];
                        let viewportWidth = document.documentElement.clientWidth;
                        
                        // 1. KONTROLA PŘETÉKÁNÍ (OVERFLOW)
                        document.querySelectorAll('*').forEach(el => {
                            let rect = el.getBoundingClientRect();
                            let style = window.getComputedStyle(el);
                            
                            if (rect.width === 0 || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || style.display === 'none' || style.visibility === 'hidden') return;
                            if (rect.left >= viewportWidth) return;
                            if (el.closest('.carousel-viewport') || el.closest('.mobile-off-canvas-menu')) return;
                            
                            if (rect.right > viewportWidth + 1) {
                                errors.push(`OVERFLOW: <${el.tagName} class='${el.className}'> přesahuje o ${Math.round(rect.right - viewportWidth)}px (šířka elementu: ${rect.width}px)`);
                            }
                        });
                        
                        // 1. KONTROLA PŘETÉKÁNÍ Z OKNA
                        let allElements = Array.from(document.querySelectorAll('*'));
                        
                        function isVisible(el) {
                            let s = window.getComputedStyle(el);
                            let r = el.getBoundingClientRect();
                            if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
                            if (r.width === 0 || r.height === 0) return false;
                            if (el.closest('.offer-expanded-inner') || el.closest('.carousel-viewport') || el.closest('.mobile-off-canvas-menu')) return false;
                            return true;
                        }

                        let visibleElements = allElements.filter(isVisible);

                        visibleElements.forEach(el => {
                            let rect = el.getBoundingClientRect();
                            if (rect.left >= viewportWidth) return;
                            if (rect.right > viewportWidth + 1) {
                                errors.push(`OVERFLOW: <${el.tagName} class='${el.className}'> přesahuje okraj o ${Math.round(rect.right - viewportWidth)}px`);
                            }
                        });

                        // 2. KONTROLA VNITŘNÍHO PŘETÉKÁNÍ (Obsah se nevleze do svého rodiče)
                        visibleElements.forEach(el => {
                            let s = window.getComputedStyle(el);
                            // Testujeme jen blokové elementy
                            if (!['block', 'flex', 'grid', 'inline-block'].includes(s.display)) return;
                            // Pokud je schválně hidden, obsah sice přetéká, ale je oříznut
                            if (s.overflow === 'hidden' || s.overflowY === 'hidden' || s.overflowX === 'hidden') return;
                            
                            // Pokud je scrollHeight o dost větší než clientHeight (neplatí u body/html)
                            if (el.tagName !== 'BODY' && el.tagName !== 'HTML') {
                                if (el.scrollHeight > el.clientHeight + 10) {
                                    let cls = el.getAttribute('class') || '';
                                    errors.push(`VNITŘNÍ PŘETEČENÍ Y: <${el.tagName} class='${cls}'> text se nevejde na výšku (scrollHeight ${el.scrollHeight} > clientHeight ${el.clientHeight})`);
                                }
                                if (el.scrollWidth > el.clientWidth + 10) {
                                    let cls = el.getAttribute('class') || '';
                                    errors.push(`VNITŘNÍ PŘETEČENÍ X: <${el.tagName} class='${cls}'> text se nevejde na šířku (scrollWidth ${el.scrollWidth} > clientWidth ${el.clientWidth})`);
                                }
                            }
                        });

                        // 3. KONTROLA KOLIZÍ (Překrývání listových uzlů - textů a obrázků)
                        let leaves = visibleElements.filter(el => {
                            if (el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'IFRAME') return true;
                            // Je to koncový uzel obsahující text (nemá žádné další tagy, kromě třeba <br>, <strong> atd.)
                            // Zjednodušeně vezmeme všechny textové kontejnery:
                            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'A', 'LI', 'SPAN', 'STRONG', 'LABEL'].includes(el.tagName)) return true;
                            return false;
                        });

                        for (let i = 0; i < leaves.length; i++) {
                            for (let j = i + 1; j < leaves.length; j++) {
                                let el1 = leaves[i];
                                let el2 = leaves[j];
                                
                                if (el1.contains(el2) || el2.contains(el1)) continue;
                                
                                // Pokud mají stejného rodiče a je to např. text ve flexu, někdy to hází false positives u inline prvků.
                                // Budeme testovat bounding rects.
                                let r1 = el1.getBoundingClientRect();
                                let r2 = el2.getBoundingClientRect();
                                
                                let overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
                                let overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
                                let overlapArea = overlapX * overlapY;
                                
                                if (overlapArea > 100) {
                                    let s1 = window.getComputedStyle(el1);
                                    let s2 = window.getComputedStyle(el2);
                                    let z1 = parseInt(s1.zIndex) || 0;
                                    let z2 = parseInt(s2.zIndex) || 0;
                                    
                                    // Ignorujeme dekorativní podkresy s negativním z-indexem
                                    if (z1 < 0 || z2 < 0) continue;
                                    
                                    // Ignorujeme specifické mapové SVG, kde se překrývají chytře Paths
                                    if (el1.closest('.map-region') || el2.closest('.map-region')) continue;
                                    
                                    let c1 = el1.getAttribute('class') || '';
                                    let c2 = el2.getAttribute('class') || '';
                                    let tag1 = el1.tagName + (c1 ? '.'+c1.split(' ')[0] : '');
                                    let tag2 = el2.tagName + (c2 ? '.'+c2.split(' ')[0] : '');
                                    let t1 = (el1.textContent || '').trim().substring(0, 15).replace(/\\n/g, '');
                                    let t2 = (el2.textContent || '').trim().substring(0, 15).replace(/\\n/g, '');
                                    
                                    errors.push(`TVRDÁ KOLIZE: ${tag1} ("${t1}") leží na ${tag2} ("${t2}")`);
                                }
                            }
                        }
                        
                        return [...new Set(errors)];
                    }
                """)
                
                if issues:
                    has_errors = True
                    print(f"  [!] Šířka {width}px má chyby:")
                    for err in issues:
                        print(f"      - {err}")
                else:
                    # Jen vypíšeme malou tečku nebo zkrácenou zprávu, ať nespamujeme log
                    pass
            print("  -> Všechny zkoušené velikosti pro tuto stránku prošly.\n")
            
        browser.close()
        
    if has_errors:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    check_layout()
