import os
import re

def check_files(start_dir):
    cn_call_regex = re.compile(r'\bcn\(')
    cn_import_regex = re.compile(r'import\s+.*?\bcn\b.*?from')
    
    results = []
    
    for root, dirs, files in os.walk(start_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        has_call = cn_call_regex.search(content)
                        has_import = cn_import_regex.search(content)
                        
                        if has_call and not has_import:
                            # Verify if it's a false positive (e.g. constant definition or something)
                            # But usually cn( counts as a call
                            results.append(path)
                except Exception as e:
                    print(f"Error reading {path}: {e}")
                    
    return results

if __name__ == "__main__":
    src_dir = "/Users/truth/.gemini/antigravity/scratch/Nexus-HR-Platform/client/src"
    invalid_files = check_files(src_dir)
    
    if invalid_files:
        print("FOUND INVALID FILES (cn used but not imported):")
        for f in invalid_files:
            print(f)
    else:
        print("No files found with unimported cn calls.")
