import os
import re

def find_ghost_cn(directory):
    ghost_files = []
    
    # Matches cn(...) but NOT cn: or .cn or something that looks like an object property or selector
    # Specifically looking for the function call
    cn_usage_pattern = re.compile(r'(?<![.\w])cn\(')
    
    # Matches typical import statements for cn
    cn_import_pattern = re.compile(r'import\s+({[^}]*cn[^}]*}|cn)\s+from')
    
    # Matches local definitions
    cn_definition_pattern = re.compile(r'(function\s+cn|const\s+cn\s*=)')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        content = "".join(lines)
                        
                        # Check if cn() is used as a function call
                        if cn_usage_pattern.search(content):
                            # Check if it's imported OR defined locally
                            if not cn_import_pattern.search(content) and not cn_definition_pattern.search(content):
                                # It's a ghost!
                                print(f"GHOST DETECTED in {path}")
                                # Find the line number(s)
                                for i, line in enumerate(lines):
                                    if cn_usage_pattern.search(line):
                                        print(f"  Line {i+1}: {line.strip()}")
                                ghost_files.append(path)
                except Exception as e:
                    pass
                    
    return ghost_files

if __name__ == "__main__":
    src_dir = 'client/src'
    results = find_ghost_cn(src_dir)
    if not results:
        print("No ghost cn() calls found.")
