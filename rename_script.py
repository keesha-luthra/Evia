import os
import shutil

# Define the root path (the Desktop folder "Adermis" stays as is to not break workspace)
ROOT_DIR = r"c:\Users\KEESHA LUTHRA\OneDrive\Desktop\Adermis"

# Step 1: Rename folders
adermis1_path = os.path.join(ROOT_DIR, "Adermis1")
evia_path = os.path.join(ROOT_DIR, "Evia")

if os.path.exists(adermis1_path):
    print("Renaming Adermis1 to Evia...")
    os.rename(adermis1_path, evia_path)
else:
    print("Adermis1 not found, assuming already renamed to Evia.")

adermis_frontend_path = os.path.join(evia_path, "adermis")
evia_frontend_path = os.path.join(evia_path, "frontend")

if os.path.exists(adermis_frontend_path):
    print("Renaming Evia/adermis to Evia/frontend...")
    os.rename(adermis_frontend_path, evia_frontend_path)
else:
    print("Evia/adermis not found, assuming already renamed.")

# Step 2: Global Find and Replace
def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return # Skip files that cannot be read as utf-8 (binary files like images, fonts)

    # Perform replacements
    new_content = content.replace("Adermis1", "Evia")
    new_content = new_content.replace("Adermis", "Evia")
    new_content = new_content.replace("adermis", "frontend")

    if new_content != content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {filepath}")
        except Exception as e:
            print(f"Failed to write: {filepath} ({e})")

# Traverse and replace
EXCLUDE_DIRS = {'node_modules', '.next', '.git', '__pycache__', 'venv', 'env'}
EXCLUDE_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pth', '.pt', '.sqlite3', '.pyc'}

for dirpath, dirnames, filenames in os.walk(evia_path):
    # Modify dirnames in-place to avoid traversing excluded directories
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
    
    for filename in filenames:
        ext = os.path.splitext(filename)[1].lower()
        if ext in EXCLUDE_EXTS:
            continue
            
        filepath = os.path.join(dirpath, filename)
        replace_in_file(filepath)

print("Renaming and text replacement complete!")
