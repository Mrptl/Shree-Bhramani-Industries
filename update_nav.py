import os
import re

files = ['Home.html', 'index.html', 'CIJ_Printer_Detail.html', 'contact_us.html', 'About_Contact.html', 'Our_Printers.html']

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update Nav padding
    content = content.replace('<nav class="relative flex justify-between items-center px-8 h-20 max-w-screen-2xl mx-auto">', 
                              '<nav class="relative flex justify-between items-center px-4 md:px-8 h-20 max-w-screen-2xl mx-auto">')
    
    # Update Logo div
    logo_pattern = re.compile(r'<div class="flex items-center">\s*<img alt="Shree Bhramani Logo" class="object-contain" style="height: 72px; width: auto;" src="assets/company_logo_cropped\.png"/>\s*</div>')
    new_logo = '''<div class="flex items-center gap-3">
<button id="mobile-menu-btn" class="md:hidden text-slate-700 dark:text-slate-300 hover:text-blue-900 transition-colors" aria-label="Toggle Menu">
<span class="material-symbols-outlined text-3xl" data-icon="menu">menu</span>
</button>
<img alt="Shree Bhramani Logo" class="object-contain" style="height: 60px; width: auto;" src="assets/SHREE_BRAHMANI_INDUSTRIES_LOGO.png"/>
</div>'''
    content = logo_pattern.sub(new_logo, content)

    # Hide desktop Quote button
    content = re.sub(r'<button class="bg-industrial-gradient text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm scale-95 active:scale-90 duration-200 shadow-md">',
                     r'<button class="hidden sm:block bg-industrial-gradient text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm scale-95 active:scale-90 duration-200 shadow-md">', content)
    
    # Insert mobile menu before </header>
    if 'id="mobile-menu"' not in content:
        mobile_menu = '''
<!-- Mobile Menu Drawer -->
<div id="mobile-menu" class="hidden absolute top-20 left-0 w-full bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-xl flex-col px-6 py-8 gap-6 z-40 transition-all origin-top">
<div class="flex flex-col gap-4">
<a class="text-xl font-['Manrope'] font-bold text-blue-900 dark:text-blue-400 border-b border-slate-200 dark:border-slate-800 pb-2" href="index.html">Home</a>
<a class="text-xl font-['Manrope'] font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2" href="About_Contact.html">About</a>
<div class="flex flex-col border-b border-slate-200 dark:border-slate-800 pb-2">
    <span class="text-xl font-['Manrope'] font-bold text-slate-600 dark:text-slate-400 mb-2">Products</span>
    <div class="flex flex-col pl-4 gap-2">
        <a class="text-lg font-['Manrope'] font-semibold text-slate-500 dark:text-slate-400" href="Our_Printers.html">Printers</a>
        <a class="text-lg font-['Manrope'] font-semibold text-slate-500 dark:text-slate-400" href="Our_Accessories.html">Accessories</a>
    </div>
</div>
<a class="text-xl font-['Manrope'] font-bold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2" href="contact_us.html">Contact</a>
</div>
<button class="w-full bg-industrial-gradient text-on-primary px-6 py-3.5 rounded-lg font-bold text-base shadow-md mt-4">
    Get Quote
</button>
</div>
</header>'''
        content = content.replace('</header>', mobile_menu)

    # Add mobile menu toggle script before </body>
    if 'mobile-menu-btn' not in content[content.rfind('<script>'):]:
        script = '''
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        const icon = btn ? btn.querySelector('span') : null;
        if(btn && menu) {
            btn.addEventListener('click', () => {
                if (menu.classList.contains('hidden')) {
                    menu.classList.remove('hidden');
                    menu.classList.add('flex');
                    if(icon) icon.textContent = 'close';
                } else {
                    menu.classList.add('hidden');
                    menu.classList.remove('flex');
                    if(icon) icon.textContent = 'menu';
                }
            });
        }
    });
</script>
</body>'''
        content = content.replace('</body>', script)

    # Typography and padding fixes for responsive hero (Home and index)
    if 'min-h-[921px]' in content:
        content = content.replace('<section class="relative min-h-[921px] flex items-center overflow-hidden bg-surface">',
                                  '<section class="relative min-h-[100vh] lg:min-h-[921px] py-32 lg:py-0 flex items-center overflow-hidden bg-surface">')
        content = content.replace('px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10',
                                  'px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10')
        content = content.replace('<h1 class="font-headline text-[3.5rem] leading-[1.1] font-extrabold text-on-surface mb-6 tracking-tight">',
                                  '<h1 class="font-headline text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold text-on-surface mb-6 tracking-tight">')
        # specific to index.html formatting
        content = content.replace('<h1\n                        class="font-headline text-[3.5rem] leading-[1.1] font-extrabold text-on-surface mb-6 tracking-tight">',
                                  '<h1 class="font-headline text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] font-extrabold text-on-surface mb-6 tracking-tight">')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
