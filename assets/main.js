/**
 * Shree Bhramani Industries — Main JavaScript
 * Handles: Mobile Menu, Scroll Reveal, Back to Top, Product Modals,
 *          Contact Form, Quote Form (all connected to the backend API)
 */

'use strict';

// ============================================================
// CONFIG — change this to your deployed backend URL in production
// ============================================================
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : '/api'; // Same-origin when deployed

// ============================================================
// Utility: Show a toast notification
// ============================================================
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const colors = {
        success: 'background: linear-gradient(135deg, #00598b, #002d46); color: white;',
        error:   'background: linear-gradient(135deg, #dc2626, #7f1d1d); color: white;',
        info:    'background: linear-gradient(135deg, #0284c7, #0c4a6e); color: white;'
    };

    const toast = document.createElement('div');
    toast.style.cssText = `
        ${colors[type] || colors.success}
        padding: 14px 20px; border-radius: 10px;
        font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 360px; pointer-events: all;
        transform: translateX(120%); transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
    `;
    toast.textContent = message;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
    });

    // Animate out after 4 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// ============================================================
// Utility: Disable/enable a button during async operations
// ============================================================
function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
        btn.dataset.originalText = btn.textContent;
        btn.textContent = 'Sending…';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.textContent = btn.dataset.originalText || 'Submit';
        btn.disabled = false;
        btn.style.opacity = '';
        btn.style.cursor = '';
    }
}

// ============================================================
// API: Submit a form to the backend
// ============================================================
async function submitForm(endpoint, data) {
    const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Submission failed. Please try again.');
    return json;
}

document.addEventListener('DOMContentLoaded', () => {
    let triggerOpenQuoteModal;

    // ============================================================
    // Preloader Fade Out
    // ============================================================
    window.addEventListener('load', () => {
        const preloader = document.getElementById('page-preloader');
        if (preloader) {
            // Small delay to ensure the animation is visible for a moment and feels deliberate
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 400); // match CSS transition duration
            }, 300);
        }
    });

    // ============================================================
    // Mobile Menu
    // ============================================================
    const mobileMenuBtn  = document.getElementById('mobile-menu-btn');
    const mobileMenu     = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('span') : null;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            mobileMenu.classList.toggle('flex', isHidden);
            if (mobileMenuIcon) mobileMenuIcon.textContent = isHidden ? 'close' : 'menu';
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
            }
        });
    }

    // ============================================================
    // Scroll Reveal Animation (IntersectionObserver — Progressive Enhancement)
    // Elements are visible by default; JS adds reveal-init (hidden state)
    // then reveals via IntersectionObserver as they enter the viewport.
    // ============================================================
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        revealEls.forEach(el => el.classList.add('reveal-init'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only reveal once
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }
    // If IntersectionObserver not available, elements stay visible (CSS default)

    // ============================================================
    // Back to Top Button
    // ============================================================
    const bttBtn = document.getElementById('back-to-top');
    if (bttBtn) {
        window.addEventListener('scroll', () => {
            bttBtn.classList.toggle('show', window.pageYOffset > 300);
        }, { passive: true });
        bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ============================================================
    // Product Specs Modal (Our_Printers.html)
    // ============================================================
    const modal    = document.getElementById('specs-modal');
    const closeBtn = document.getElementById('close-modal');
    const specBtns = document.querySelectorAll('.view-specs-btn');

    const setupImageZoom = () => {
        const modalImage = document.getElementById('modal-image');
        if (!modalImage) return;

        const imgContainer = modalImage.parentElement;
        if (!imgContainer) return;

        // Apply containing layouts
        imgContainer.style.position = 'relative';
        imgContainer.style.overflow = 'hidden';

        // Create overlay container
        const controls = document.createElement('div');
        controls.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800/60 shadow-lg z-20 opacity-90 hover:opacity-100 transition-all duration-300';
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';

        controls.innerHTML = `
            <button id="modal-zoom-out" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Zoom Out" type="button">
                <span class="material-symbols-outlined text-lg" style="font-size: 20px;">zoom_out</span>
            </button>
            <span id="modal-zoom-val" class="text-xs font-extrabold text-slate-800 dark:text-slate-100 font-['Manrope'] select-none w-10 text-center">100%</span>
            <button id="modal-zoom-in" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Zoom In" type="button">
                <span class="material-symbols-outlined text-lg" style="font-size: 20px;">zoom_in</span>
            </button>
            <div class="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button id="modal-zoom-reset" class="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Reset Zoom" type="button">
                <span class="material-symbols-outlined text-lg" style="font-size: 20px;">restart_alt</span>
            </button>
        `;

        imgContainer.appendChild(controls);

        let scale = 1.0;
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let translateX = 0;
        let translateY = 0;

        const updateTransform = () => {
            modalImage.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            const valLabel = document.getElementById('modal-zoom-val');
            if (valLabel) valLabel.textContent = `${Math.round(scale * 100)}%`;

            if (scale > 1.0) {
                modalImage.style.cursor = isDragging ? 'grabbing' : 'grab';
            } else {
                modalImage.style.cursor = 'zoom-in';
            }
        };

        const resetZoom = () => {
            scale = 1.0;
            translateX = 0;
            translateY = 0;
            isDragging = false;
            updateTransform();
        };

        const zoomIn = () => {
            if (scale < 3.0) {
                scale = parseFloat((scale + 0.25).toFixed(2));
                updateTransform();
            }
        };

        const zoomOut = () => {
            if (scale > 0.5) {
                scale = parseFloat((scale - 0.25).toFixed(2));
                if (scale <= 1.0) {
                    translateX = 0;
                    translateY = 0;
                }
                updateTransform();
            }
        };

        document.getElementById('modal-zoom-in')?.addEventListener('click', (e) => { e.stopPropagation(); zoomIn(); });
        document.getElementById('modal-zoom-out')?.addEventListener('click', (e) => { e.stopPropagation(); zoomOut(); });
        document.getElementById('modal-zoom-reset')?.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });

        imgContainer.addEventListener('wheel', (e) => {
            if (scale === 1.0 && e.deltaY > 0) return; // Allow natural page scroll if zoom is reset and scrolling down
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }, { passive: false });

        const startDrag = (e) => {
            if (scale <= 1.0) return;
            isDragging = true;
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            startX = clientX - (translateX * scale);
            startY = clientY - (translateY * scale);
            updateTransform();
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
            const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
            translateX = (clientX - startX) / scale;
            translateY = (clientY - startY) / scale;
            updateTransform();
        };

        const endDrag = () => {
            isDragging = false;
            updateTransform();
        };

        modalImage.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);

        modalImage.addEventListener('touchstart', startDrag, { passive: true });
        modalImage.addEventListener('touchmove', onDrag, { passive: false });
        modalImage.addEventListener('touchend', endDrag);

        modalImage.addEventListener('click', () => {
            if (scale > 1.0) {
                resetZoom();
            } else {
                scale = 1.5;
                updateTransform();
            }
        });

        window.resetSpecsModalZoom = resetZoom;
        modalImage.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        resetZoom();
    };

    if (modal && closeBtn) {
        setupImageZoom();

        const openModal = (data) => {
            if (typeof window.resetSpecsModalZoom === 'function') {
                window.resetSpecsModalZoom();
            }

            const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            set('modal-title', data.title);
            set('modal-category', data.category);
            set('modal-desc', data.desc);

            const img = document.getElementById('modal-image');
            if (img) img.src = data.image;

            const specsList = document.getElementById('modal-specs');
            if (specsList) {
                specsList.innerHTML = '';
                try {
                    const specs = typeof data.specs === 'string'
                        ? JSON.parse(data.specs.replace(/'/g, '"'))
                        : data.specs;
                    specs.forEach(spec => {
                        const li = document.createElement('li');
                        li.className = 'flex items-center gap-3 text-sm text-on-surface';
                        li.innerHTML = `<span class="material-symbols-outlined text-primary text-lg">check_circle</span> ${spec}`;
                        specsList.appendChild(li);
                    });
                } catch (e) { console.error('Error parsing specs:', e); }
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            if (typeof window.resetSpecsModalZoom === 'function') {
                window.resetSpecsModalZoom();
            }
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        specBtns.forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset)));
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
        });

        const specsRequestQuoteBtn = document.getElementById('specs-request-quote');
        if (specsRequestQuoteBtn) {
            specsRequestQuoteBtn.addEventListener('click', () => {
                const printerName = document.getElementById('modal-title')?.textContent || '';
                closeModal();
                setTimeout(() => {
                    if (typeof triggerOpenQuoteModal === 'function') {
                        triggerOpenQuoteModal(printerName);
                    }
                }, 300);
            });
        }
    }

    // ============================================================
    // Contact Form (contact_us.html)
    // ============================================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                const data = {
                    name:     contactForm.querySelector('[name="name"]')?.value.trim(),
                    company:  contactForm.querySelector('[name="company"]')?.value.trim(),
                    industry: contactForm.querySelector('[name="industry"]')?.value.trim(),
                    phone:    contactForm.querySelector('[name="phone"]')?.value.trim(),
                    email:    contactForm.querySelector('[name="email"]')?.value.trim(),
                    message:  contactForm.querySelector('[name="message"]')?.value.trim()
                };

                const result = await submitForm('contact', data);
                showToast(`✅ ${result.message}`, 'success');
                contactForm.reset();

            } catch (err) {
                showToast(`❌ ${err.message}`, 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    }

    // ============================================================
    // Get Quote Modal
    // ============================================================
    const quoteModal = document.getElementById('get-quote-modal');
    const getQuoteBtns = document.querySelectorAll('.get-quote-btn');
    const closeQuoteBtn = document.getElementById('close-quote-modal');
    const cancelQuoteBtn = document.getElementById('cancel-quote-btn');
    const closeQuoteOverlay = document.getElementById('close-quote-modal-overlay');

    if (quoteModal) {
        const openQuoteModal = (e, productName = '') => {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            
            const productInput = quoteModal.querySelector('[name="product"]');
            if (productInput) {
                productInput.value = productName || '';
            }

            quoteModal.classList.remove('opacity-0', 'pointer-events-none');
            quoteModal.classList.add('opacity-100', 'pointer-events-auto');
            const modalInner = quoteModal.querySelector('div.relative');
            if (modalInner) {
                modalInner.classList.remove('scale-95');
                modalInner.classList.add('scale-100');
            }
            document.body.style.overflow = 'hidden';
        };

        triggerOpenQuoteModal = (productName) => openQuoteModal(null, productName);

        const closeQuoteModalFunc = () => {
            quoteModal.classList.remove('opacity-100', 'pointer-events-auto');
            quoteModal.classList.add('opacity-0', 'pointer-events-none');
            const modalInner = quoteModal.querySelector('div.relative');
            if (modalInner) {
                modalInner.classList.remove('scale-100');
                modalInner.classList.add('scale-95');
            }
            document.body.style.overflow = '';
        };

        getQuoteBtns.forEach(btn => btn.addEventListener('click', (e) => openQuoteModal(e)));
        if (closeQuoteBtn) closeQuoteBtn.addEventListener('click', closeQuoteModalFunc);
        if (cancelQuoteBtn) cancelQuoteBtn.addEventListener('click', closeQuoteModalFunc);
        if (closeQuoteOverlay) closeQuoteOverlay.addEventListener('click', closeQuoteModalFunc);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !quoteModal.classList.contains('opacity-0')) {
                closeQuoteModalFunc();
            }
        });
    }

    // ============================================================
    // Quote Form (CIJ_Printer_Detail.html & general quote forms)
    // ============================================================
    const quoteForms = document.querySelectorAll('.quote-form');
    quoteForms.forEach(quoteForm => {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('[type="submit"]');
            setButtonLoading(submitBtn, true);

            try {
                const data = {
                    name:        quoteForm.querySelector('[name="name"]')?.value.trim(),
                    email:       quoteForm.querySelector('[name="email"]')?.value.trim(),
                    phone:       quoteForm.querySelector('[name="phone"]')?.value.trim() || '',
                    product:     quoteForm.querySelector('[name="product"]')?.value.trim() ||
                                 document.querySelector('[data-product-name]')?.dataset.productName || '',
                    message:     quoteForm.querySelector('[name="message"]')?.value.trim() || ''
                };

                // Format WhatsApp pre-filled message
                const whatsappNumber = '917984170484'; // Country code 91 + phone number 7984170484
                let whatsappText = `*New Quote Request - Shree Bhramani Industries*\n\n`;
                whatsappText += `*Name:* ${data.name}\n`;
                whatsappText += `*Email:* ${data.email}\n`;
                if (data.phone) {
                    whatsappText += `*Phone:* ${data.phone}\n`;
                }
                if (data.product) {
                    whatsappText += `*Product of Interest:* ${data.product}\n`;
                }
                if (data.message) {
                    whatsappText += `*Additional Requirements:* ${data.message}\n`;
                }

                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

                // Submit to backend in the background so it doesn't block the WhatsApp redirect
                try {
                    await submitForm('quote', data);
                } catch (apiErr) {
                    console.warn('Backend API submission skipped or failed:', apiErr);
                }

                // Show success toast and trigger redirect in a new window/tab
                showToast('✅ Redirecting to WhatsApp...', 'success');
                window.open(whatsappUrl, '_blank');
                quoteForm.reset();

                // If inside get-quote-modal, close it
                const parentModal = quoteForm.closest('#get-quote-modal');
                if (parentModal) {
                    setTimeout(() => {
                        const closeBtn = document.getElementById('close-quote-modal') || document.getElementById('cancel-quote-btn');
                        if (closeBtn) closeBtn.click();
                    }, 500);
                }

            } catch (err) {
                showToast(`❌ Something went wrong. Please try again.`, 'error');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });
    });

    // ============================================================
    // Product Filter — Our_Printers.html
    // ============================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const resultCount = document.getElementById('result-count');

    function updateResultCount() {
        const visible = document.querySelectorAll('.product-card:not(.hidden-by-filter)').length;
        if (resultCount) {
            resultCount.textContent = `Showing ${visible} Result${visible !== 1 ? 's' : ''}`;
        }
    }

    if (filterBtns.length && productCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                // Update active state on buttons
                filterBtns.forEach(b => {
                    b.classList.remove('bg-surface-container-highest', 'border-b-2', 'border-primary', 'text-on-surface');
                    b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                });
                btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
                btn.classList.add('bg-surface-container-highest', 'border-b-2', 'border-primary', 'text-on-surface');

                // Filter cards
                productCards.forEach(card => {
                    const categories = card.dataset.category || '';
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hidden-by-filter');
                    } else {
                        card.classList.add('hidden-by-filter');
                    }
                });

                updateResultCount();
            });
        });

        updateResultCount();
    }

    // ============================================================
    // Product Search — Our_Printers.html
    // ============================================================
    const searchInput = document.querySelector('input[placeholder="Search machinery..."]');
    if (searchInput && productCards.length) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();

            productCards.forEach(card => {
                const name = (card.dataset.name || card.querySelector('h3, h4')?.textContent || '').toLowerCase();
                if (!query || name.includes(query)) {
                    card.classList.remove('hidden-by-filter');
                } else {
                    card.classList.add('hidden-by-filter');
                }
            });

            // Reset active filter button to "All" when searching
            if (query) {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-surface-container-highest', 'border-b-2', 'border-primary', 'text-on-surface');
                    b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
                });
            }

            updateResultCount();
        });
    }

    // ============================================================
    // Newsletter Form — footer subscribe
    // ============================================================
    document.querySelectorAll('[id="newsletter-form"], form.newsletter-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput || !emailInput.value) return;
            showToast('✅ Thanks for subscribing! We\'ll keep you updated.', 'success');
            emailInput.value = '';
        });
    });

    // Generic footer email inputs with adjacent send buttons
    document.querySelectorAll('footer input[type="email"]').forEach(input => {
        const btn = input.parentElement?.querySelector('button');
        if (btn) {
            btn.addEventListener('click', () => {
                if (!input.value.trim()) {
                    showToast('Please enter your email address.', 'error');
                    return;
                }
                showToast('✅ Thanks for subscribing!', 'success');
                input.value = '';
            });
        }
    });

}); // end DOMContentLoaded
