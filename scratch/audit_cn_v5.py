import os
import re

def find_missing_cn_imports(directory):
    missing_files = []
    
    # Updated regex to be more robust
    cn_usage_pattern = re.compile(r'\bcn\(')
    cn_import_pattern = re.compile(r'import\s+{[^}]*cn[^}]*}\s+from\s+[\'"].*cn[\'"]')
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Check if cn() is used
                        if cn_usage_pattern.search(content):
                            # Check if cn is imported
                            if not cn_import_pattern.search(content):
                                # Double check for common false positives
                                if 'function cn(' not in content and 'const cn =' not in content:
                                    missing_files.append(path)
                except Exception as e:
                    print(f"Error reading {path}: {e}")
                    
    return missing_files

if __name__ == "__main__":
    src_dir = 'client/src'
    results = find_missing_cn_imports(src_dir)
    if results:
        print("Files with missing cn imports:")
        for path in results:
            print(path)
    else:
        print("All cn() usages have corresponding imports.")
