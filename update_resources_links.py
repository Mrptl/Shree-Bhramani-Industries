import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

# We want to replace href="#" for the specific resource items if they are currently "#"
for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's replace the resources list specifically
    # Privacy Policy
    content = re.sub(r'href="[^"]*"\s*>Privacy Policy</a>', r'href="privacy_policy.html">Privacy Policy</a>', content)
    # Technical Support
    content = re.sub(r'href="[^"]*"\s*>Technical Support</a>', r'href="technical_support.html">Technical Support</a>', content)
    # Machine Maintenance
    content = re.sub(r'href="[^"]*"\s*>Machine Maintenance</a>', r'href="machine_maintenance.html">Machine Maintenance</a>', content)
    # Terms of Service
    content = re.sub(r'href="[^"]*"\s*>Terms of Service</a>', r'href="terms_of_service.html">Terms of Service</a>', content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Successfully updated resources links in {len(files)} HTML files.")
