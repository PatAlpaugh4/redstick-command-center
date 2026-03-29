/**
 * Landing Page Template - Main JavaScript
 * ========================================
 * Modular, vanilla JavaScript with no dependencies.
 * Features: Navigation, Animations, Form handling, Slider, FAQ accordion
 * 
 * @author Kimi Code
 * @version 1.0.0
 */

(function() {
    'use strict';

    // ========================================
    // Utility Functions
    // ========================================
    
    /**
     * Debounce function to limit how often a function can fire
     * @param {Function} func - Function to debounce
     * @param {number} wait - Milliseconds to wait
     * @returns {Function} Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Milliseconds between executions
     * @returns {Function} Throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @param {number} offset - Offset from viewport edge
     * @returns {boolean} Whether element is in viewport
     */
    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ========================================
    // Navigation Module
    // ========================================
    const Navigation = {
        navbar: null,
        navToggle: null,
        navMenu: null,
        navLinks: null,

        init() {
            this.navbar = document.getElementById('navbar');
            this.navToggle = document.getElementById('navToggle');
            this.navMenu = document.getElementById('navMenu');
            this.navLinks = document.querySelectorAll('.nav-link');

            if (!this.navbar) return;

            this.bindEvents();
            this.handleScroll();
        },

        bindEvents() {
            // Mobile menu toggle
            if (this.navToggle) {
                this.navToggle.addEventListener('click', () => this.toggleMenu());
            }

            // Close menu on link click (mobile)
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });

            // Close menu on click outside
            document.addEventListener('click', (e) => {
                if (this.navMenu?.classList.contains('active') && 
                    !this.navMenu.contains(e.target) && 
                    !this.navToggle.contains(e.target)) {
                    this.closeMenu();
                }
            });

            // Handle scroll for navbar styling
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleSmoothScroll(e));
            });
        },

        toggleMenu() {
            this.navToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        },

        closeMenu() {
            this.navToggle?.classList.remove('active');
            this.navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        },

        handleScroll() {
            const scrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        },

        handleSmoothScroll(e) {
            const href = e.currentTarget.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    // ========================================
    // Counter Animation Module
    // ========================================
    const CounterAnimation = {
        counters: null,
        hasAnimated: false,

        init() {
            this.counters = document.querySelectorAll('.stat-number[data-count]');
            if (!this.counters.length) return;

            // Use Intersection Observer for better performance
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });

            const statsSection = document.querySelector('.hero-stats');
            if (statsSection) {
                observer.observe(statsSection);
            }
        },

        animateCounters() {
            this.counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const startTime = performance.now();
                const startValue = 0;

                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out cubic)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(startValue + (target - startValue) * easeOut);
                    
                    counter.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        }
    };

    // ========================================
    // Pricing Toggle Module
    // ========================================
    const PricingToggle = {
        toggle: null,
        isYearly: false,

        init() {
            this.toggle = document.getElementById('pricingToggle');
            if (!this.toggle) return;

            this.bindEvents();
        },

        bindEvents() {
            this.toggle.addEventListener('click', () => this.togglePricing());
        },

        togglePricing() {
            this.isYearly = !this.isYearly;
            this.toggle.classList.toggle('active', this.isYearly);
            
            // Update toggle labels
            document.querySelectorAll('.toggle-label').forEach(label => {
                label.classList.toggle('active', 
                    (this.isYearly && label.dataset.period === 'yearly') ||
                    (!this.isYearly && label.dataset.period === 'monthly')
                );
            });

            // Update prices with animation
            document.querySelectorAll('.pricing-price .amount').forEach(price => {
                const monthly = price.dataset.monthly;
                const yearly = price.dataset.yearly;
                const newValue = this.isYearly ? yearly : monthly;
                
                // Animate price change
                price.style.opacity = '0';
                price.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    price.textContent = newValue;
                    price.style.opacity = '1';
                    price.style.transform = 'translateY(0)';
                }, 150);
            });
        }
    };

    // ========================================
    // Testimonials Slider Module
    // ========================================
    const TestimonialsSlider = {
        slider: null,
        track: null,
        cards: null,
        prevBtn: null,
        nextBtn: null,
        dots: null,
        currentIndex: 0,
        autoPlayInterval: null,

        init() {
            this.slider = document.getElementById('testimonialsSlider');
            this.track = this.slider?.querySelector('.testimonials-track');
            this.cards = this.track?.querySelectorAll('.testimonial-card');
            this.prevBtn = document.getElementById('sliderPrev');
            this.nextBtn = document.getElementById('sliderNext');
            this.dots = document.querySelectorAll('#sliderDots .dot');

            if (!this.slider || !this.cards?.length) return;

            this.bindEvents();
            this.startAutoPlay();
        },

        bindEvents() {
            // Navigation buttons
            this.prevBtn?.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });

            this.nextBtn?.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });

            // Dot navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.goToSlide(index);
                    this.resetAutoPlay();
                });
            });

            // Pause on hover
            this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.slider.addEventListener('mouseleave', () => this.startAutoPlay());

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            this.slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            this.slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            }, { passive: true });
        },

        handleSwipe(startX, endX) {
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
                this.resetAutoPlay();
            }
        },

        goToSlide(index) {
            this.currentIndex = index;
            this.updateSlider();
        },

        prev() {
            this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
            this.updateSlider();
        },

        next() {
            this.currentIndex = (this.currentIndex + 1) % this.cards.length;
            this.updateSlider();
        },

        updateSlider() {
            // Move track
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

            // Update dots
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        },

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => this.next(), 5000);
        },

        stopAutoPlay() {
            clearInterval(this.autoPlayInterval);
        },

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    };

    // ========================================
    // FAQ Accordion Module
    // ========================================
    const FAQAccordion = {
        items: null,

        init() {
            this.items = document.querySelectorAll('.faq-item');
            if (!this.items.length) return;

            this.bindEvents();
        },

        bindEvents() {
            this.items.forEach(item => {
                const question = item.querySelector('.faq-question');
                question?.addEventListener('click', () => this.toggleItem(item));
            });
        },

        toggleItem(item) {
            const isActive = item.classList.contains('active');
            const question = item.querySelector('.faq-question');

            // Close all items
            this.items.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                question?.setAttribute('aria-expanded', 'true');
            }
        }
    };

    // ========================================
    // Form Handling Module
    // ========================================
    const FormHandler = {
        form: null,
        toast: null,

        init() {
            this.form = document.getElementById('ctaForm');
            this.toast = document.getElementById('toast');

            if (!this.form) return;

            this.bindEvents();
        },

        bindEvents() {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        },

        handleSubmit(e) {
            e.preventDefault();
            
            const email = this.form.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            this.showToast('Success! Check your email for next steps.');
            this.form.reset();

            // In production, you would send this to your backend:
            // this.submitToBackend(email);
        },

        showToast(message) {
            if (!this.toast) return;

            const toastMessage = this.toast.querySelector('.toast-message');
            if (toastMessage) {
                toastMessage.textContent = message;
            }

            this.toast.classList.add('show');

            setTimeout(() => {
                this.toast.classList.remove('show');
            }, 4000);
        },

        // Example backend submission (uncomment and modify for production)
        async submitToBackend(email) {
            try {
                const response = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    this.showToast('Successfully subscribed!');
                    this.form.reset();
                } else {
                    throw new Error('Subscription failed');
                }
            } catch (error) {
                this.showToast('Something went wrong. Please try again.');
                console.error('Form submission error:', error);
            }
        }
    };

    // ========================================
    // Back to Top Module
    // ========================================
    const BackToTop = {
        button: null,

        init() {
            this.button = document.getElementById('backToTop');
            if (!this.button) return;

            this.bindEvents();
        },

        bindEvents() {
            window.addEventListener('scroll', throttle(() => this.handleScroll(), 100));
            this.button.addEventListener('click', () => this.scrollToTop());
        },

        handleScroll() {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // ========================================
    // Scroll Animations Module
    // ========================================
    const ScrollAnimations = {
        animatedElements: null,

        init() {
            // Check for reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                return;
            }

            this.animatedElements = document.querySelectorAll('[data-aos]');
            if (!this.animatedElements.length) return;

            this.setupObserver();
        },

        setupObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            this.animatedElements.forEach(el => observer.observe(el));
        },

        animateElement(element) {
            const delay = element.dataset.aosDelay || 0;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    };

    // ========================================
    // Initialize All Modules
    // ========================================
    function init() {
        // Initialize all modules when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeModules);
        } else {
            initializeModules();
        }
    }

    function initializeModules() {
        Navigation.init();
        CounterAnimation.init();
        PricingToggle.init();
        TestimonialsSlider.init();
        FAQAccordion.init();
        FormHandler.init();
        BackToTop.init();
        ScrollAnimations.init();

        console.log('🚀 Landing Page Template initialized successfully!');
    }

    // Start the application
    init();

})();
