import os
import re

def check_cn_imports(directory):
    files_with_cn = []
    files_missing_import = []
    
    # Regex to find cn() calls
    cn_call_pattern = re.compile(r'\bcn\(')
    # Regex to find cn imports from utils/cn
    cn_import_pattern = re.compile(r'import\s+.*?\bcn\b.*?from\s+[\'"].*?utils/cn[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Find all cn() calls but EXCLUDE the definition and imports
                        calls = cn_call_pattern.finditer(content)
                        has_calls = False
                        for call in calls:
                            # Simple heuristic: ignore if it's in an import statement or function definition
                            line_start = content.rfind('\n', 0, call.start()) + 1
                            line = content[line_start:content.find('\n', call.start())]
                            if 'import' not in line and 'export function cn' not in line:
                                has_calls = True
                                break
                        
                        if has_calls:
                            files_with_cn.append(filepath)
                            if not cn_import_pattern.search(content):
                                files_missing_import.append(filepath)
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")

    return files_with_cn, files_missing_import

if __name__ == "__main__":
    src_dir = "/Users/truth/.gemini/antigravity/scratch/Nexus-HR-Platform/client/src"
    all_cn, missing = check_cn_imports(src_dir)
    
    print(f"Total files using cn(): {len(all_cn)}")
    print(f"Files missing cn import: {len(missing)}")
    for f in missing:
        print(f"MISSING IMPORT: {f}")
