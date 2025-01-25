import os
import json

# Specify the directory containing the images
directory = './blog/zvazvedu-2024-plzen/gallery'

# Get a list of all image files in the directory
image_files = [file for file in os.listdir(directory) if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]

# Save the list to a JSON file
with open(os.path.join(directory, 'images.json'), 'w') as json_file:
    json.dump(image_files, json_file, indent=4)

print("JSON file created successfully!")
