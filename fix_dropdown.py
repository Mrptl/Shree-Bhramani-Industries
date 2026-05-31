import os

files = ['Home.html', 'index.html', 'CIJ_Printer_Detail.html', 'contact_us.html', 'About_Contact.html', 'Our_Printers.html', 'Our_Accessories.html', 'Service_Support.html']

bad_dropdown = '''<div class="absolute top-full left-0 mt-4 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden z-50">
                        <a href="Our_Printers.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800">Printers</a>
                        <a href="Our_Accessories.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">Accessories</a>
                    </div>'''

good_dropdown = '''<div class="absolute top-full left-0 pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl flex flex-col overflow-hidden">
                            <a href="Our_Printers.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800">Printers</a>
                            <a href="Our_Accessories.html" class="px-4 py-3 text-sm font-['Inter'] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary transition-colors">Accessories</a>
                        </div>
                    </div>'''

for file in files:
    if not os.path.exists(file):
        print(f"File not found: {file}")
        continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if bad_dropdown in content:
        content = content.replace(bad_dropdown, good_dropdown)
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file}")
    else:
        print(f"Not found in {file}")
