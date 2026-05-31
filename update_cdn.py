import os
import re

files = ['Home.html', 'index.html', 'CIJ_Printer_Detail.html', 'contact_us.html', 'About_Contact.html', 'Our_Printers.html']

for file in files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and remove the Tailwind CDN script, the config script, and the style block
    # Since they are contiguous, we can use a regex to match from <script src="https://cdn.tailwindcss.com to </style>
    pattern = re.compile(r'<script src="https://cdn\.tailwindcss\.com.*?</style>', re.DOTALL)
    
    new_head = '<link rel="stylesheet" href="assets/output.css">'
    
    content = pattern.sub(new_head, content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("HTML files updated successfully")
