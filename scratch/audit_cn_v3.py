import os
import re

def check_cn_imports(directory):
    missing_files = []
    # Regex for cn() calls
    cn_pattern = re.compile(r'\bcn\(')
    # Regex for cn import (flexible for whitespace/quotes)
    import_pattern = re.compile(r"import\s+\{\s*cn\s*\}\s+from\s+['\"].*utils/cn['\"]")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        if cn_pattern.search(content):
                            if not import_pattern.search(content):
                                missing_files.append(path)
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    
    return missing_files

if __name__ == "__main__":
    src_dir = "/Users/truth/.gemini/antigravity/scratch/Nexus-HR-Platform/client/src"
    missing = check_cn_imports(src_dir)
    if missing:
        print("Files with cn() but NO import:")
        for m in missing:
            print(m)
    else:
        print("All files with cn() have the core import.")
