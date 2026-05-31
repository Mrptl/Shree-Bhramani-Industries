import os
import re

files = ['Home.html', 'index.html', 'CIJ_Printer_Detail.html', 'contact_us.html', 'About_Contact.html', 'Our_Printers.html', 'Service_Support.html']

inactive_dropdown = '''<div class="relative group">
                    <button class="font-['Manrope'] font-bold tracking-tight text-slate-600 dark:text-slate-400 hover:text-blue-950 dark:hover:text-blue-200 transition-colors flex items-center gap-1">
                        Products <span class="material-symbols-outlined text-sm transition-transform group-hover:rotate-180" aria-hidden="true">expand_more</span>
                    </button>
                    <div class="absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
                            <a href="Our_Printers.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800">Printers</a>
                            <a href="Our_Accessories.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">Accessories</a>
                        </div>
                    </div>
                </div>'''

active_dropdown = '''<div class="relative group">
                    <button class="font-['Manrope'] font-bold tracking-tight text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 pb-1 flex items-center gap-1">
                        Products <span class="material-symbols-outlined text-sm transition-transform group-hover:rotate-180" aria-hidden="true">expand_more</span>
                    </button>
                    <div class="absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
                            <a href="Our_Printers.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800">Printers</a>
                            <a href="Our_Accessories.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">Accessories</a>
                        </div>
                    </div>
                </div>'''

# We want to replace the `a` tag for Products with the new dropdown.
inactive_pattern = re.compile(r'<a class="font-\[\'Manrope\'\] font-bold tracking-tight text-slate-600 dark:text-slate-400 hover:text-blue-950 dark:hover:text-blue-200 transition-colors"\s+href="Our_Printers\.html">Products</a>')
active_pattern = re.compile(r'<a class="font-\[\'Manrope\'\] font-bold tracking-tight text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 pb-1"\s+href="Our_Printers\.html">Products</a>')

for file in files:
    if not os.path.exists(file):
        print(f"File not found: {file}")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    if inactive_pattern.search(content):
        content = inactive_pattern.sub(inactive_dropdown, content)
        modified = True
    if active_pattern.search(content):
        content = active_pattern.sub(active_dropdown, content)
        modified = True
        
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated desktop nav in {file}")

print("Done")
