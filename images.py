import os
import subprocess

folder_path = "./images"

# Iterate through all files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".jpg") or filename.endswith(".png") or filename.endswith(".jpeg"):
        # Get the image dimensions using the identify command
        image_path = os.path.join(folder_path, filename)
        command = ["identify", "-format", "%w %h", image_path]
        result = subprocess.run(command, capture_output=True, text=True)
        output = result.stdout.strip()
        dimensions = output.split()

        if len(dimensions) == 2:
            width, height = dimensions

            # Create the new file name with dimensions appended
            dimensions = f"{width}x{height}"
            new_filename = f"{os.path.splitext(filename)[0]}_{dimensions}{os.path.splitext(filename)[1]}"

            # Rename the file
            new_image_path = os.path.join(folder_path, new_filename)
            os.rename(image_path, new_image_path)

            print(f"Renamed '{filename}' to '{new_filename}'")
        else:
            print(f"Failed to retrieve dimensions for '{filename}'")
