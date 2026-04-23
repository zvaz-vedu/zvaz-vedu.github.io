import os
from PIL import Image

def trim_webp_folders(base_paths):
    for folder in base_paths:
        if not os.path.exists(folder):
            print(f"Skipping: {folder} (Path not found)")
            continue

        print(f"Processing folder: {folder}")
        
        for filename in os.listdir(folder):
            if filename.lower().endswith(".webp"):
                file_path = os.path.join(folder, filename)
                
                with Image.open(file_path) as img:
                    # Convert to RGBA to ensure alpha channel exists
                    img = img.convert("RGBA")
                    
                    # Find the bounding box of non-transparent pixels
                    bbox = img.getbbox()
                    
                    if bbox:
                        # Crop the image to the bounding box
                        cropped_img = img.crop(bbox)
                        
                        # Overwrite the original file with the tight-cropped version
                        cropped_img.save(file_path, "WEBP")
                        print(f"  ✓ Trimmed: {filename}")
                    else:
                        print(f"  ! Skipped: {filename} (Image appears empty)")

if __name__ == "__main__":
    # Define your paths
    paths = [
        "static/media/imgs/partners/black",
        "static/media/imgs/partners/white"
    ]
    
    trim_webp_folders(paths)
    print("\nProcessing complete. All logos are now tight-cropped.")