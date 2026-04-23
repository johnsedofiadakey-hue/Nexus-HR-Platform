import os
import re

def check_cn_import(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if re.search(r'\bcn\(', content):
                        # Match: import { cn } or import {..., cn, ...} or import {cn as something}
                        # Also check if it's the file THAT DEFINES CN
                        if 'export function cn(' in content or 'export const cn =' in content:
                            continue
                        
                        # Handle multiline imports and various spacings
                        if not re.search(r'import\s*{[^}]*\bcn\b[^}]*}\s*from', content, re.DOTALL):
                            print(f"MISSING IMPORT: {path}")
                        else:
                            # Log that it's okay for verification
                            # print(f"OK: {path}")
                            pass

if __name__ == "__main__":
    check_cn_import('client/src')
