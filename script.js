/**
 * Kingu Electrical Company Website - Enhanced JavaScript
 * All interactive functionality with PWA, e-commerce, and performance optimizations
 * Version: 6.0.0
 */

// Configuration Constants
const CONFIG = {
    PHONE_NUMBER: '255677014740',
    WHATSAPP_NUMBER: '255682843552',
    DISPLAY_PHONE: '+255 677 014 740',
    DISPLAY_WHATSAPP: '+255 682 843 552',
    EMAIL: 'kinguelectricaltz@gmail.com',
    WEBSITE: 'https://kingueletrical.com',
    COMPANY_NAME: 'Kingu Electrical Company Ltd',
    CURRENCY: 'TZS',
    FREE_DELIVERY_THRESHOLD: 1000000,
    BASE_DELIVERY_FEE: 25000,
    INSTALLATION_FEE: 50000,
    API_BASE_URL: 'https://api.kingueletrical.com/v1',
    ASSET_PATH: '/assets',
    IMAGE_PATH: '/images/optimized',
    ICON_PATH: '/assets/icons/optimized'
};

// Complete Products Data with enhanced details
const PRODUCTS = [
    {
        id: 1,
        category: "generators",
        name: "100kVA Diesel Generator",
        description: "Complete 100kVA diesel generator set with ATS control panel. Perfect for commercial use. Made with Perkins engine.",
        price: 25500000,
        originalPrice: 27000000,
        image: `${CONFIG.IMAGE_PATH}/generator-100kva.webp`,
        images: [
            `${CONFIG.IMAGE_PATH}/generator-100kva-1.webp`,
            `${CONFIG.IMAGE_PATH}/generator-100kva-2.webp`
        ],
        stock: 5,
        delivery: "Free in Dar-es-salaam & Arusha",
        installation: "Professional installation included",
        warranty: "12 months",
        brand: "Perkins",
        specifications: {
            power: "100kVA",
            fuel: "Diesel",
            phase: "Three Phase",
            voltage: "415V",
            frequency: "50Hz",
            engine: "Perkins 1006TG2"
        },
        badge: "Best Seller",
        rating: 4.8,
        reviews: 24,
        tags: ["commercial", "perkins", "ats-included", "warranty"]
    },
    {
        id: 2,
        category: "generators",
        name: "500kVA Industrial Generator",
        description: "Industrial 500kVA diesel generator for factories and large facilities with advanced control panel.",
        price: 65000000,
        originalPrice: 68000000,
        image: `${CONFIG.IMAGE_PATH}/generator-500kva.webp`,
        stock: 2,
        delivery: "Free nationwide",
        installation: "Professional installation included",
        warranty: "24 months",
        brand: "Caterpillar",
        specifications: {
            power: "500kVA",
            fuel: "Diesel",
            phase: "Three Phase",
            voltage: "415V",
            frequency: "50Hz"
        },
        badge: "Limited Stock",
        rating: 4.9,
        reviews: 18,
        tags: ["industrial", "caterpillar", "high-power"]
    },
    {
        id: 9,
        category: "solar",
        name: "5kW Solar System with Lithium Batteries",
        description: "Complete 5kW solar power system with lithium batteries, hybrid inverter, and professional installation.",
        price: 8500000,
        originalPrice: 9200000,
        image: `${CONFIG.IMAGE_PATH}/solar-5kw.webp`,
        stock: 8,
        delivery: "Free installation in Dar/Arusha",
        installation: "Complete installation included",
        warranty: "5 years on panels, 2 years on batteries",
        brand: "Canadian Solar",
        specifications: {
            panels: "12 x 415W",
            battery: "10kWh Lithium",
            inverter: "5kW Hybrid",
            backup: "24 hours"
        },
        badge: "Popular",
        rating: 4.7,
        reviews: 32,
        tags: ["residential", "lithium", "backup"]
    },
    {
        id: 15,
        category: "spares",
        name: "Generator Alternator - Perkins/Caterpillar",
        description: "Original alternator for Perkins/Caterpillar generators. 12-month warranty. Genuine part.",
        price: 850000,
        originalPrice: 950000,
        image: `${CONFIG.IMAGE_PATH}/alternator.webp`,
        stock: 15,
        delivery: "25,000 TZS (Free for orders above 1M)",
        installation: "Professional installation available",
        warranty: "12 months",
        brand: "Perkins",
        specifications: {
            type: "Brushless Alternator",
            output: "24V DC",
            compatibility: "Perkins 1000 series, Caterpillar C4.4"
        },
        rating: 4.6,
        reviews: 45,
        tags: ["genuine", "perkins", "caterpillar"]
    },
    {
        id: 101,
        category: "tools",
        name: "Megger MIT515 5kV Insulation Tester",
        description: "Professional 5kV insulation resistance tester with 5 ranges up to 2000GΩ. CAT IV 600V.",
        price: 1850000,
        originalPrice: 2100000,
        image: `${CONFIG.IMAGE_PATH}/megger-mit515.webp`,
        stock: 4,
        delivery: "25,000 TZS",
        installation: "Not needed",
        warranty: "3 years",
        brand: "Megger",
        specifications: {
            voltage: "50V to 5kV",
            resistance: "1kΩ to 2000GΩ",
            safety: "CAT IV 600V",
            features: "PI, DAR, DD, ramp test"
        },
        badge: "Professional",
        rating: 4.9,
        reviews: 28,
        tags: ["test-equipment", "professional", "safety"]
    },
    {
        id: 131,
        category: "services",
        name: "Generator Maintenance Service",
        description: "Professional generator maintenance including oil change, filter replacement, and load testing.",
        price: 150000,
        image: `${CONFIG.IMAGE_PATH}/maintenance.webp`,
        stock: "available",
        delivery: "Service at your location",
        installation: "Professional service",
        duration: "2-4 hours",
        includes: [
            "Oil and filter change",
            "Fuel system check",
            "Battery testing",
            "Load bank testing",
            "Full inspection report"
        ],
        rating: 4.8,
        reviews: 67,
        tags: ["maintenance", "service", "preventive"]
    },
    {
        id: 141,
        category: "deals",
        name: "Professional Tester Combo: Megger MIT515 + Fluke 117",
        description: "Special combo deal: Insulation tester and true RMS multimeter for complete electrical testing.",
        price: 2450000,
        originalPrice: 2950000,
        image: `${CONFIG.IMAGE_PATH}/tester-combo.webp`,
        stock: 3,
        delivery: "FREE delivery",
        installation: "Not needed",
        warranty: "3 years combined",
        badge: "Special Deal",
        savings: "Save 500,000 TZS",
        rating: 5.0,
        reviews: 12,
        tags: ["combo", "special-deal", "save"]
    }
];

// Shopping Cart with enhanced features
let cart = {
    items: [],
    total: 0,
    subtotal: 0,
    delivery: 0,
    installation: 0,
    lastUpdated: null
};

// Application State
const APP_STATE = {
    currentCategory: 'all',
    currentFilter: 'all',
    searchQuery: '',
    sortBy: 'default',
    userLocation: null,
    isOnline: navigator.onLine,
    isPWAInstalled: window.matchMedia('(display-mode: standalone)').matches,
    darkMode: false,
    currency: 'TZS',
    performance: {
        loadTime: 0,
        fcp: 0,
        lcp: 0,
        fid: 0,
        cls: 0
    }
};

// Performance Metrics
const PERFORMANCE_METRICS = {
    startTime: performance.now(),
    resourcesLoaded: 0,
    totalResources: 0,
    largestContentfulPaint: 0,
    firstContentfulPaint: 0
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kingu Electrical App Initializing v6.0.0...');
    
    // Start performance monitoring
    startPerformanceMonitoring();
    
    // Load saved state
    loadAppState();
    
    // Initialize core functionality
    initCoreFeatures();
    
    // Initialize e-commerce
    initEcommerce();
    
    // Initialize PWA features
    initPWAFeatures();
    
    // Initialize UI enhancements
    initUIEnhancements();
    
    // Initialize analytics
    initAnalytics();
    
    // Check for updates
    checkForUpdates();
    
    // Initialize service worker messaging
    initServiceWorkerMessaging();
    
    console.log('✅ Kingu Electrical App Initialized Successfully');
    
    // Mark as loaded
    setTimeout(() => {
        document.documentElement.classList.add('loaded');
        trackLoadPerformance();
    }, 100);
});

// ===== PERFORMANCE MONITORING =====

function startPerformanceMonitoring() {
    // Mark time for First Contentful Paint
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
            PERFORMANCE_METRICS.firstContentfulPaint = entry.startTime;
            trackEvent('performance', 'first-contentful-paint', Math.round(entry.startTime).toString());
        }
    }).observe({ type: 'paint', buffered: true });

    // Mark time for Largest Contentful Paint
    new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        PERFORMANCE_METRICS.largestContentfulPaint = lastEntry.startTime;
        trackEvent('performance', 'largest-contentful-paint', Math.round(lastEntry.startTime).toString());
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Monitor layout shifts
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsValue += entry.value;
                trackEvent('performance', 'layout-shift', entry.value.toString());
            }
        }
        PERFORMANCE_METRICS.cls = clsValue;
    }).observe({ type: 'layout-shift', buffered: true });

    // Monitor resource loading
    if (performance.getEntriesByType) {
        PERFORMANCE_METRICS.totalResources = performance.getEntriesByType('resource').length;
    }
}

function trackLoadPerformance() {
    const loadTime = performance.now() - PERFORMANCE_METRICS.startTime;
    PERFORMANCE_METRICS.loadTime = loadTime;
    
    // Log performance metrics
    console.log('📊 Performance Metrics:', {
        loadTime: Math.round(loadTime),
        fcp: Math.round(PERFORMANCE_METRICS.firstContentfulPaint),
        lcp: Math.round(PERFORMANCE_METRICS.largestContentfulPaint),
        cls: PERFORMANCE_METRICS.cls.toFixed(3)
    });
    
    // Store in app state
    APP_STATE.performance = {
        loadTime: Math.round(loadTime),
        fcp: Math.round(PERFORMANCE_METRICS.firstContentfulPaint),
        lcp: Math.round(PERFORMANCE_METRICS.largestContentfulPaint),
        cls: PERFORMANCE_METRICS.cls
    };
    
    // Send to analytics
    trackEvent('performance', 'page_load_complete', loadTime.toString());
    
    // Show warning if load time is high
    if (loadTime > 3000) {
        console.warn('⚠️ Page load time is high:', Math.round(loadTime), 'ms');
        trackEvent('performance', 'slow_load', loadTime.toString());
    }
}

// ===== CORE FUNCTIONALITY =====

function initCoreFeatures() {
    initMobileNavigation();
    initSmoothScrolling();
    initFormHandling();
    initScrollAnimations();
    initNotifications();
    initCurrentYear();
    initAccessibility();
    initServiceWorkerMessaging();
    initImageOptimization();
    initResourcePreloading();
}

// Mobile Navigation with enhanced accessibility
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle menu
    hamburger.addEventListener('click', (e) => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.innerHTML = isExpanded ? '☰' : '✕';
        
        // Add animation class
        if (!isExpanded) {
            navMenu.classList.add('animate-in');
            setTimeout(() => navMenu.classList.remove('animate-in'), 500);
        }
        
        // Trap focus when menu is open
        if (!isExpanded) {
            trapFocus(navMenu);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
            hamburger.focus();
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on link click (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.innerHTML = '☰';
                document.body.style.overflow = '';
            }
        });
    });
}

// Smooth Scrolling with offset
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without scroll jump
            history.pushState(null, null, href);
            
            // Update active nav link
            updateActiveNavLink();
            
            // Track scroll event
            trackEvent('navigation', 'scroll_to', href);
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

// Form Handling with validation
function initFormHandling() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        initFormValidation(contactForm);
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Booking Form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        initBookingForm(bookingForm);
        bookingForm.addEventListener('submit', handleBookingForm);
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
    
    // Quick Order Form
    const quickOrderForm = document.getElementById('quickOrderForm');
    if (quickOrderForm) {
        quickOrderForm.addEventListener('submit', handleQuickOrderForm);
    }
    
    // Inquiry Form
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiryForm);
    }
}

// Form Validation
function initFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        // Add validation styles
        input.classList.add('validate-me');
        
        // Add validation event listeners
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        input.addEventListener('invalid', handleInvalid);
    });
    
    function validateField(e) {
        const field = e.target;
        const errorSpan = field.parentElement.querySelector('.field-error') || createErrorSpan(field);
        
        // Clear previous state
        field.classList.remove('invalid', 'valid');
        
        if (!field.checkValidity()) {
            errorSpan.textContent = getValidationMessage(field);
            field.classList.add('invalid');
            return false;
        } else {
            errorSpan.textContent = '';
            field.classList.add('valid');
            return true;
        }
    }
    
    function clearFieldError(e) {
        const field = e.target;
        const errorSpan = field.parentElement.querySelector('.field-error');
        if (errorSpan) errorSpan.textContent = '';
        field.classList.remove('invalid');
    }
    
    function handleInvalid(e) {
        e.preventDefault();
        validateField(e);
    }
    
    function createErrorSpan(field) {
        const span = document.createElement('span');
        span.className = 'field-error';
        span.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 0.25rem; display: block;';
        field.parentElement.appendChild(span);
        return span;
    }
    
    function getValidationMessage(field) {
        if (field.validity.valueMissing) return 'This field is required';
        if (field.validity.typeMismatch) {
            if (field.type === 'email') return 'Please enter a valid email address';
            if (field.type === 'tel') return 'Please enter a valid phone number';
        }
        if (field.validity.patternMismatch) return 'Please check the format';
        if (field.validity.tooShort) return `Minimum length is ${field.minLength} characters`;
        if (field.validity.tooLong) return `Maximum length is ${field.maxLength} characters`;
        return 'Please check this field';
    }
}

// Booking Form Initialization
function initBookingForm(form) {
    const dateInput = form.querySelector('input[type="date"]');
    const timeInput = form.querySelector('input[type="time"]');
    
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default to 3 days from now
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 3);
        dateInput.value = defaultDate.toISOString().split('T')[0];
        
        // Add date validation
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            if (selectedDate < today.setHours(0,0,0,0)) {
                this.setCustomValidity('Please select a future date');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    if (timeInput) {
        // Set default to 10:00 AM
        timeInput.value = '10:00';
        timeInput.min = '08:00';
        timeInput.max = '17:00';
        
        // Add time validation
        timeInput.addEventListener('change', function() {
            const [hours, minutes] = this.value.split(':').map(Number);
            if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
                this.setCustomValidity('Please select a time between 8:00 AM and 5:00 PM');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Form Submission Handlers
async function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Validate all fields before submission
    const inputs = form.querySelectorAll('.validate-me');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please check all fields and try again.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = `
        <span class="loading-spinner"></span>
        Sending Message...
    `;
    submitBtn.disabled = true;
    
    try {
        // Simulate API call - replace with actual Formspree
        const data = Object.fromEntries(formData);
        await simulateAPIRequest(data);
        
        // Success
        submitBtn.innerHTML = '<span class="success-icon">✓</span> Message Sent!';
        submitBtn.classList.add('success');
        
        showNotification('Thank you! We will contact you within 24 hours.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('success');
            submitBtn.disabled = false;
            
            // Clear validation states
            inputs.forEach(input => {
                input.classList.remove('valid', 'invalid');
                const errorSpan = input.parentElement.querySelector('.field-error');
                if (errorSpan) errorSpan.textContent = '';
            });
        }, 3000);
        
        // Track conversion
        trackEvent('form', 'submit', 'contact');
        
    } catch (error) {
        // Error
        submitBtn.innerHTML = '<span class="error-icon">✗</span> Failed to Send';
        submitBtn.classList.add('error');
        
        showNotification('Failed to send message. Please try again or call us directly.', 'error');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('error');
            submitBtn.disabled = false;
        }, 3000);
        
        trackEvent('form', 'error', 'contact');
    }
}

async function handleBookingForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate date and time
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date for the inspection.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="loading-spinner"></span> Scheduling...`;
    submitBtn.disabled = true;
    
    try {
        // Create WhatsApp message
        const message = `📅 New Site Inspection Request:
        
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'Not provided'}
Service: ${data.service}
Date: ${data.date}
Time: ${data.time}
Location: ${data.location || 'To be confirmed'}
        
Additional Details:
${data.details || 'None provided'}`;
        
        // Show confirmation modal
        showBookingConfirmation(message, data);
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Reset date to default
            const dateInput = form.querySelector('input[type="date"]');
            if (dateInput) {
                const defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 3);
                dateInput.value = defaultDate.toISOString().split('T')[0];
            }
            
            // Reset time to default
            const timeInput = form.querySelector('input[type="time"]');
            if (timeInput) timeInput.value = '10:00';
            
        }, 2000);
        
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('Failed to schedule inspection. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email || !validateEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
    
    // Show success
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    
    // Add animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="success-icon">✓</span> Subscribed!';
    submitBtn.classList.add('success');
    
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('success');
    }, 2000);
    
    trackEvent('newsletter', 'subscribe', email);
}

function handleQuickOrderForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const data = {
        name: form.querySelector('#orderName').value,
        phone: form.querySelector('#orderPhone').value,
        category: form.querySelector('#orderCategory').value,
        requirements: form.querySelector('#orderRequirements').value
    };
    
    // Validate phone number
    if (!data.phone || data.phone.length < 10) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }
    
    const message = `🛒 Quick Order Request:
    
Customer: ${data.name}
Phone: ${data.phone}
Interested in: ${data.category}
Requirements: ${data.requirements}
    
Please contact with available options and pricing.`;
    
    showOrderConfirmation(message);
    
    // Reset form with animation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="success-icon">✓</span> Sent!';
    submitBtn.classList.add('success');
    
    setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.classList.remove('success');
    }, 2000);
    
    trackEvent('order', 'quick_request');
}

function handleInquiryForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    const message = `📝 New Product Inquiry:
    
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
Product: ${data.product}
Quantity: ${data.quantity}
Message: ${data.message}
    
Please provide quotation and availability.`;
    
    // Open WhatsApp with message
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Show success
    showNotification('Inquiry sent! We will contact you shortly.', 'success');
    
    // Reset form
    setTimeout(() => form.reset(), 1000);
    
    trackEvent('inquiry', 'submit', data.product);
}

// Scroll Animations with Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add stagger effect for child elements
                if (entry.target.classList.contains('stagger-parent')) {
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
                
                // Unobserve after animation
                if (!entry.target.classList.contains('repeat-animate')) {
                    observer.unobserve(entry.target);
                }
            } else if (entry.target.classList.contains('repeat-animate')) {
                entry.target.classList.remove('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-parent').forEach(el => {
        observer.observe(el);
    });
}

// Notifications System
function initNotifications() {
    // Add notification container if not exists
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    const id = 'notification-' + Date.now();
    
    // Icon mapping
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.id = id;
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-icon">${icons[type] || icons.info}</div>
        <div class="notification-content">${message}</div>
        <button class="notification-close" aria-label="Close notification" onclick="removeNotification('${id}')">×</button>
    `;
    
    // Prepend so newest notifications are at top
    container.insertBefore(notification, container.firstChild);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => removeNotification(id), duration);
    }
    
    // Track notification
    trackEvent('notification', 'show', type);
    
    return id;
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('notification-exit');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Current Year in Footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year, #current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Accessibility Features
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '1');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add focus styles for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Improve focus management
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('button, a, input, select, textarea, [tabindex]')) {
            e.target.classList.add('focus-visible');
        }
    });
    
    document.addEventListener('focusout', (e) => {
        e.target.classList.remove('focus-visible');
    });
    
    // Add aria-labels to icons
    document.querySelectorAll('.icon-button, [class*="icon"]').forEach(icon => {
        if (!icon.getAttribute('aria-label') && !icon.textContent.trim()) {
            const label = icon.getAttribute('title') || 
                         icon.className.replace(/icon-|btn-/g, '').replace(/-/g, ' ') || 
                         'icon';
            icon.setAttribute('aria-label', label);
        }
    });
}

// Image Optimization
function initImageOptimization() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // Observe all lazy images
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            // Add low-quality placeholder
            if (img.dataset.placeholder) {
                img.src = img.dataset.placeholder;
            }
            
            // Add loading class
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    }
    
    // Handle image errors
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            const img = e.target;
            img.classList.add('image-error');
            
            // Try fallback image
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            } else {
                // Generic placeholder
                img.src = `${CONFIG.ICON_PATH}/placeholder.webp`;
            }
        }
    }, true);
}

// Resource Preloading
function initResourcePreloading() {
    // Preload critical resources
    const criticalResources = [
        `${CONFIG.ICON_PATH}/whatsapp-60x60.webp`,
        `${CONFIG.ICON_PATH}/company-logo-400x400.webp`,
        `${CONFIG.ICON_PATH}/icon-192x192.webp`
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
    
    // Preconnect to critical domains
    const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.kingueletrical.com'
    ];
    
    preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

// Service Worker Messaging
function initServiceWorkerMessaging() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
                case 'UPDATE_AVAILABLE':
                    showUpdateNotification(data);
                    break;
                    
                case 'SYNC_COMPLETE':
                    showNotification(data.message || 'Data synced successfully', 'success');
                    break;
                    
                case 'OFFLINE_DATA_SAVED':
                    console.log('Data saved for offline:', data);
                    break;
                    
                case 'NEW_CONTENT_AVAILABLE':
                    showNewContentNotification(data);
                    break;
            }
        });
        
        // Send initial message to service worker
        navigator.serviceWorker.controller.postMessage({
            type: 'CLIENT_LOADED',
            data: {
                url: window.location.href,
                timestamp: new Date().toISOString()
            }
        });
    }
}

// ===== E-COMMERCE FUNCTIONALITY =====

function initEcommerce() {
    loadCartFromStorage();
    setupCategoryNavigation();
    setupProductFilters();
    setupSearch();
    setupSorting();
    updateCartUI();
    initProductModal();
    initWishlist();
    initPriceFilters();
    initProductComparison();
    initStockNotifications();
}

// Load Cart from Storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('kinguCart');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            cart = {
                ...cart,
                items: parsed.items || [],
                lastUpdated: parsed.lastUpdated || new Date().toISOString()
            };
            calculateCartTotals();
        } catch (error) {
            console.error('Error loading cart:', error);
            cart.items = [];
            localStorage.removeItem('kinguCart');
        }
    }
}

// Setup Category Navigation
function setupCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update state
            APP_STATE.currentCategory = category;
            
            // Show category
            showCategory(category);
            
            // Update URL
            history.pushState(null, null, `#${category}`);
            
            // Track event
            trackEvent('ecommerce', 'category_select', category);
        });
    });
    
    // Handle initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const link = document.querySelector(`[data-category="${hash}"]`);
        if (link) link.click();
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', () => {
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const link = document.querySelector(`[data-category="${hash}"]`);
            if (link) link.click();
        }
    });
}

// Show Category
function showCategory(category) {
    APP_STATE.currentCategory = category;
    
    // Hide all sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(category);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load and display products
        displayProducts(category);
        
        // Scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 100);
    }
}

// Create Products Grid
function createProductsGrid() {
    const container = document.createElement('div');
    container.className = 'products-grid';
    container.setAttribute('role', 'list');
    container.setAttribute('aria-label', 'Products list');
    
    // Find appropriate parent
    const parent = document.querySelector('.products-section') || 
                  document.querySelector('.products-container') ||
                  document.querySelector('#products');
    
    if (parent) {
        parent.appendChild(container);
    } else {
        document.querySelector('main')?.appendChild(container);
    }
    
    return container;
}

// Display Products
function displayProducts(category) {
    let products = PRODUCTS;
    
    // Filter by category
    if (category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    
    // Apply search filter
    if (APP_STATE.searchQuery) {
        const query = APP_STATE.searchQuery.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query))) ||
            (p.brand && p.brand.toLowerCase().includes(query))
        );
    }
    
    // Apply other filters
    products = applyFilters(products);
    
    // Sort products
    products = sortProducts(products);
    
    // Update UI
    updateProductsGrid(products);
    
    // Update results count
    updateResultsCount(products.length);
}

// Apply Filters
function applyFilters(products) {
    let filtered = [...products];
    
    switch (APP_STATE.currentFilter) {
        case 'best':
            filtered = filtered.filter(p => p.badge === 'Best Seller' || p.badge === 'Popular');
            break;
        case 'new':
            filtered = filtered.filter(p => p.id >= 130);
            break;
        case 'stock':
            filtered = filtered.filter(p => p.stock > 0);
            break;
        case 'install':
            filtered = filtered.filter(p => p.installation && p.installation.includes('included'));
            break;
        case 'sale':
            filtered = filtered.filter(p => p.originalPrice && p.price < p.originalPrice);
            break;
        case 'warranty':
            filtered = filtered.filter(p => p.warranty && parseInt(p.warranty) >= 12);
            break;
    }
    
    return filtered;
}

// Sort Products
function sortProducts(products) {
    const sorted = [...products];
    
    switch (APP_STATE.sortBy) {
        case 'price-low':
            sorted.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sorted.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'newest':
            sorted.sort((a, b) => b.id - a.id);
            break;
        case 'popular':
            sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
            break;
    }
    
    return sorted;
}

// Update Results Count
function updateResultsCount(count) {
    const countElements = document.querySelectorAll('.results-count');
    countElements.forEach(el => {
        el.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
        el.setAttribute('aria-live', 'polite');
    });
}

// Update Products Grid
function updateProductsGrid(products) {
    const container = document.querySelector('.products-grid') || createProductsGrid();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <div class="no-products-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button onclick="resetFilters()" class="btn btn-primary">Reset Filters</button>
                <button onclick="showCategory('all')" class="btn btn-secondary">View All Products</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add event listeners to new product cards
    container.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const product = PRODUCTS.find(p => p.id === productId);
        
        if (!product) return;
        
        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => addToCart(product));
        }
        
        // Quick view button
        const quickViewBtn = card.querySelector('.quick-view');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', () => showProductModal(product));
        }
        
        // Wishlist button
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => toggleWishlist(product));
        }
        
        // Compare button
        const compareBtn = card.querySelector('.compare-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', () => addToComparison(product));
        }
        
        // Stock notification button
        const notifyBtn = card.querySelector('.notify-btn');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => setupStockNotification(product));
        }
    });
}

// Create Product Card
function createProductCard(product) {
    const discount = product.originalPrice && product.price < product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;
    
    // Calculate savings
    const savings = product.originalPrice ? product.originalPrice - product.price : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}" role="listitem">
            <div class="product-card-header">
                ${product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase().replace(' ', '-')}">${product.badge}</span>` : ''}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="wishlist-btn" aria-label="Add to wishlist" title="Add to wishlist">♥</button>
                    <button class="compare-btn" aria-label="Add to comparison" title="Compare product">↔</button>
                </div>
            </div>
            
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy"
                     width="300"
                     height="200"
                     onerror="this.src='${CONFIG.ICON_PATH}/placeholder.webp'">
                <div class="product-overlay">
                    <button class="quick-view" aria-label="Quick view">👁️ Quick View</button>
                    ${product.stock <= 3 && product.stock > 0 ? `
                    <button class="notify-btn" aria-label="Get notified when back in stock">
                        ⚡ Low Stock
                    </button>
                    ` : ''}
                </div>
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">
                    <a href="#product-${product.id}" onclick="showProductModal(${product.id}); return false;">
                        ${product.name}
                    </a>
                </h3>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                
                ${product.specifications ? `
                <div class="product-specs">
                    ${Object.entries(product.specifications)
                        .slice(0, 2)
                        .map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-key">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                </div>
                ` : ''}
                
                ${savings > 0 ? `
                <div class="product-savings">
                    <span class="savings-text">You save ${formatCurrency(savings)}</span>
                </div>
                ` : ''}
                
                <div class="product-price-section">
                    <div class="price">
                        <span class="current-price">${formatCurrency(product.price)}</span>
                        ${product.originalPrice && product.price < product.originalPrice
                            ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>`
                            : ''}
                    </div>
                    
                    <div class="product-meta">
                        <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                            ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                        ${product.rating ? `
                            <div class="product-rating" aria-label="Rating: ${product.rating} out of 5 stars">
                                ⭐ ${product.rating} <small>(${product.reviews || 0})</small>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="product-actions-footer">
                    <button class="add-to-cart" ${product.stock <= 0 ? 'disabled aria-disabled="true"' : ''}
                            aria-label="Add ${product.name} to cart">
                        <span class="cart-icon">🛒</span>
                        Add to Cart
                    </button>
                    <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=I'm interested in ${encodeURIComponent(product.name)}" 
                       class="btn-whatsapp" 
                       target="_blank"
                       aria-label="Inquire about ${product.name} on WhatsApp">
                        💬 Inquire
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Setup Product Filters
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update state
            APP_STATE.currentFilter = button.dataset.filter;
            
            // Update products
            displayProducts(APP_STATE.currentCategory);
            
            // Track event
            trackEvent('ecommerce', 'filter', APP_STATE.currentFilter);
        });
    });
}

// Setup Price Filters
function initPriceFilters() {
    const priceRange = document.getElementById('priceRange');
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    
    if (priceRange && priceMin && priceMax) {
        // Get min and max prices from products
        const prices = PRODUCTS.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Set range values
        priceRange.min = minPrice;
        priceRange.max = maxPrice;
        priceRange.value = maxPrice;
        
        // Update display
        priceMin.textContent = formatCurrency(minPrice);
        priceMax.textContent = formatCurrency(maxPrice);
        
        priceRange.addEventListener('input', () => {
            const value = parseInt(priceRange.value);
            priceMax.textContent = formatCurrency(value);
            
            // Filter products
            const filtered = PRODUCTS.filter(p => p.price <= value);
            updateProductsGrid(filtered);
        });
    }
}

// Setup Search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // Debounced search
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            APP_STATE.searchQuery = e.target.value.trim();
            displayProducts(APP_STATE.currentCategory);
            
            // Track search
            if (APP_STATE.searchQuery) {
                trackEvent('search', 'query', APP_STATE.searchQuery);
            }
        }, 300);
    });
    
    // Clear search
    const clearSearch = document.getElementById('clearSearch');
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            APP_STATE.searchQuery = '';
            displayProducts(APP_STATE.currentCategory);
            searchInput.focus();
        });
    }
    
    // Handle Enter key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            APP_STATE.searchQuery = searchInput.value.trim();
            displayProducts(APP_STATE.currentCategory);
        }
    });
}

// Setup Sorting
function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        APP_STATE.sortBy = e.target.value;
        displayProducts(APP_STATE.currentCategory);
        trackEvent('ecommerce', 'sort', APP_STATE.sortBy);
    });
}

// Add to Cart
function addToCart(product, quantity = 1) {
    if (!product || !product.id) {
        console.error('Invalid product:', product);
        showNotification('Unable to add product to cart.', 'error');
        return;
    }
    
    // Check stock
    if (product.stock <= 0) {
        showNotification('This product is out of stock.', 'error');
        return;
    }
    
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        // Check if adding more than available stock
        const newQuantity = existingItem.quantity + quantity;
        if (product.stock !== 'available' && newQuantity > product.stock) {
            showNotification(`Only ${product.stock} units available in stock.`, 'warning');
            return;
        }
        existingItem.quantity = newQuantity;
    } else {
        cart.items.push({
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString(),
            cartId: Date.now() + Math.random().toString(36).substr(2, 9)
        });
    }
    
    // Update cart
    calculateCartTotals();
    saveCartToStorage();
    updateCartUI();
    
    // Show feedback
    showNotification(`Added ${product.name} to cart!`, 'success');
    
    // Track event
    trackEvent('ecommerce', 'add_to_cart', product.id.toString(), quantity);
    
    // Update cart badge with animation
    setTimeout(() => animateCartBadge(), 100);
    
    // Show cart sidebar if on mobile
    if (window.innerWidth <= 768) {
        showCartSidebar();
    }
}

// Calculate Cart Totals
function calculateCartTotals() {
    if (!cart.items || !Array.isArray(cart.items)) {
        cart.items = [];
    }
    
    cart.subtotal = cart.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    
    // Delivery fee
    cart.delivery = cart.subtotal >= CONFIG.FREE_DELIVERY_THRESHOLD 
        ? 0 
        : CONFIG.BASE_DELIVERY_FEE;
    
    // Installation fee (if any item needs installation)
    cart.installation = cart.items.some(item => 
        item.installation && item.installation.includes('Extra')
    ) ? CONFIG.INSTALLATION_FEE : 0;
    
    cart.total = cart.subtotal + cart.delivery + cart.installation;
    cart.lastUpdated = new Date().toISOString();
}

// Save Cart to Storage
function saveCartToStorage() {
    localStorage.setItem('kinguCart', JSON.stringify(cart));
    
    // Sync with service worker if available
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SAVE_CART',
            data: cart
        });
    }
}

// Update Cart UI
function updateCartUI() {
    // Update cart count
    const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount;
        el.style.display = cartCount > 0 ? 'flex' : 'none';
        el.setAttribute('aria-label', `${cartCount} items in cart`);
    });
    
    // Update cart sidebar if open
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar && cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
    
    // Update cart badge
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        if (cartCount > 0) {
            cartBadge.innerHTML = `
                🛒 ${cartCount} ${cartCount === 1 ? 'item' : 'items'} • ${formatCurrency(cart.total)}
                <br>
                <small>Call ${CONFIG.DISPLAY_PHONE} to order</small>
            `;
        } else {
            cartBadge.innerHTML = `
                🛒 Your cart is empty
                <br>
                <small>Browse our products</small>
            `;
        }
    }
}

// Render Cart Items
function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;
    
    if (cart.items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started</p>
                <button onclick="showCategory('all')" class="btn btn-primary">Browse Products</button>
                <button onclick="closeCartSidebar()" class="btn btn-secondary">Continue Shopping</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-item-id="${item.id}" role="listitem">
            <img src="${item.image}" 
                 alt="${item.name}" 
                 class="cart-item-image"
                 loading="lazy"
                 width="80"
                 height="80"
                 onerror="this.src='${CONFIG.ICON_PATH}/placeholder.webp'">
            
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" 
                            aria-label="Remove ${item.name} from cart">×</button>
                </div>
                
                <div class="cart-item-price">${formatCurrency(item.price)} each</div>
                
                <div class="cart-item-meta">
                    ${item.warranty ? `<span class="cart-item-warranty">${item.warranty}</span>` : ''}
                    ${item.delivery ? `<span class="cart-item-delivery">${item.delivery}</span>` : ''}
                </div>
                
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)" 
                                aria-label="Decrease quantity">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)" 
                                aria-label="Increase quantity">+</button>
                    </div>
                    
                    <div class="cart-item-total">
                        ${formatCurrency(item.price * item.quantity)}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update totals display
    updateCartTotals();
}

// Update Cart Totals Display
function updateCartTotals() {
    const elements = {
        subtotal: document.getElementById('cartSubtotal'),
        delivery: document.getElementById('cartDelivery'),
        installation: document.getElementById('cartInstallation'),
        total: document.getElementById('cartTotal')
    };
    
    if (elements.subtotal) elements.subtotal.textContent = formatCurrency(cart.subtotal);
    if (elements.delivery) {
        elements.delivery.textContent = formatCurrency(cart.delivery);
        if (cart.delivery === 0) {
            elements.delivery.innerHTML = `<span class="free-delivery">FREE</span>`;
        }
    }
    if (elements.installation) elements.installation.textContent = formatCurrency(cart.installation);
    if (elements.total) elements.total.textContent = formatCurrency(cart.total);
    
    // Update free delivery progress
    updateDeliveryProgress();
}

// Update Delivery Progress
function updateDeliveryProgress() {
    const progressBar = document.getElementById('deliveryProgress');
    if (!progressBar) return;
    
    const progress = Math.min((cart.subtotal / CONFIG.FREE_DELIVERY_THRESHOLD) * 100, 100);
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    
    const progressText = document.getElementById('deliveryProgressText');
    if (progressText) {
        if (progress >= 100) {
            progressText.textContent = '🎉 You qualify for FREE delivery!';
        } else {
            const remaining = CONFIG.FREE_DELIVERY_THRESHOLD - cart.subtotal;
            progressText.textContent = `Add ${formatCurrency(remaining)} more for FREE delivery`;
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    const item = cart.items.find(item => item.id === productId);
    if (!item) return;
    
    cart.items = cart.items.filter(item => item.id !== productId);
    calculateCartTotals();
    saveCartToStorage();
    updateCartUI();
    
    showNotification(`${item.name} removed from cart`, 'info');
    trackEvent('ecommerce', 'remove_from_cart', productId.toString());
}

// Update Cart Quantity
function updateCartQuantity(productId, change) {
    const item = cart.items.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    
    // Check if product has stock limit
    if (item.stock !== 'available' && newQuantity > item.stock) {
        showNotification(`Only ${item.stock} units available in stock.`, 'warning');
        return;
    }
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        item.quantity = newQuantity;
        calculateCartTotals();
        saveCartToStorage();
        updateCartUI();
        
        // Show notification for quantity change
        if (change > 0) {
            showNotification(`Increased ${item.name} quantity to ${newQuantity}`, 'success');
        } else {
            showNotification(`Decreased ${item.name} quantity to ${newQuantity}`, 'info');
        }
    }
}

// Animate Cart Badge
function animateCartBadge() {
    const badge = document.querySelector('.cart-count');
    if (badge) {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 300);
    }
}

// Product Comparison
function initProductComparison() {
    let comparisonList = JSON.parse(localStorage.getItem('kinguComparison') || '[]');
    
    window.addToComparison = function(product) {
        if (comparisonList.some(p => p.id === product.id)) {
            showNotification(`${product.name} is already in comparison`, 'info');
            return;
        }
        
        if (comparisonList.length >= 4) {
            showNotification('Maximum 4 products can be compared at once', 'warning');
            return;
        }
        
        comparisonList.push(product);
        localStorage.setItem('kinguComparison', JSON.stringify(comparisonList));
        
        showNotification(`${product.name} added to comparison`, 'success');
        updateComparisonCount(comparisonList.length);
        trackEvent('ecommerce', 'add_to_comparison', product.id.toString());
    };
    
    window.showComparison = function() {
        if (comparisonList.length < 2) {
            showNotification('Add at least 2 products to compare', 'info');
            return;
        }
        
        // Create comparison modal
        showProductComparisonModal(comparisonList);
    };
    
    updateComparisonCount(comparisonList.length);
}

function updateComparisonCount(count) {
    const comparisonElements = document.querySelectorAll('.comparison-count');
    comparisonElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline' : 'none';
    });
}

// Stock Notifications
function initStockNotifications() {
    const notifications = JSON.parse(localStorage.getItem('kinguStockNotifications') || '[]');
    
    window.setupStockNotification = function(product) {
        if (product.stock > 0) {
            showNotification('This product is in stock. You can order it now!', 'info');
            return;
        }
        
        // Check if already subscribed
        if (notifications.some(n => n.productId === product.id)) {
            showNotification('You will be notified when this product is back in stock', 'info');
            return;
        }
        
        // Show notification subscription form
        showStockNotificationForm(product);
    };
}

function showStockNotificationForm(product) {
    const form = document.createElement('div');
    form.className = 'stock-notification-form';
    form.innerHTML = `
        <div class="form-header">
            <h4>Get Notified When Back in Stock</h4>
            <button class="close-form" aria-label="Close">×</button>
        </div>
        <div class="form-body">
            <p>We'll email you when ${product.name} is back in stock.</p>
            <div class="form-group">
                <label for="notifyEmail">Email Address</label>
                <input type="email" id="notifyEmail" placeholder="your@email.com" required>
            </div>
            <div class="form-group">
                <label for="notifyPhone">Phone Number (Optional)</label>
                <input type="tel" id="notifyPhone" placeholder="+255 XXX XXX XXX">
            </div>
        </div>
        <div class="form-footer">
            <button class="btn btn-primary" onclick="subscribeStockNotification(${product.id})">
                Notify Me
            </button>
        </div>
    `;
    
    document.body.appendChild(form);
    
    // Close button
    form.querySelector('.close-form').addEventListener('click', () => {
        form.remove();
    });
    
    // Close on outside click
    form.addEventListener('click', (e) => {
        if (e.target === form) {
            form.remove();
        }
    });
}

function subscribeStockNotification(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const email = document.getElementById('notifyEmail').value;
    const phone = document.getElementById('notifyPhone').value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    const notifications = JSON.parse(localStorage.getItem('kinguStockNotifications') || '[]');
    notifications.push({
        productId: product.id,
        productName: product.name,
        email: email,
        phone: phone,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('kinguStockNotifications', JSON.stringify(notifications));
    
    showNotification('You will be notified when this product is back in stock!', 'success');
    document.querySelector('.stock-notification-form').remove();
    
    trackEvent('ecommerce', 'stock_notification', product.id.toString());
}

// ===== PWA FUNCTIONALITY =====

function initPWAFeatures() {
    registerServiceWorker();
    setupInstallPrompt();
    setupOfflineDetection();
    initBackgroundSync();
    initPushNotifications();
    initPeriodicSync();
}

// Register Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
            updateViaCache: 'none'
        })
        .then(registration => {
            console.log('Service Worker registered:', registration);
            
            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // Check every hour
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New Service Worker found:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification({
                            version: '6.0.0',
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            });
            
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
            trackEvent('pwa', 'registration_failed', error.message);
        });
    }
}

// Setup Install Prompt
function setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Update app state
        APP_STATE.canInstall = true;
        
        // Show install button after delay
        setTimeout(() => {
            if (deferredPrompt && !APP_STATE.isPWAInstalled) {
                showInstallPrompt();
            }
        }, 10000);
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        APP_STATE.isPWAInstalled = true;
        showNotification('Kingu Electrical app installed successfully!', 'success');
        trackEvent('pwa', 'installed');
        
        // Hide install prompt if shown
        const prompt = document.querySelector('.install-prompt');
        if (prompt) prompt.remove();
    });
    
    function showInstallPrompt() {
        // Check if user dismissed recently
        const lastDismissed = localStorage.getItem('installPromptDismissed');
        if (lastDismissed && Date.now() - parseInt(lastDismissed) < 30 * 24 * 60 * 60 * 1000) {
            return; // Don't show for 30 days
        }
        
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt fade-in';
        prompt.innerHTML = `
            <div class="install-content">
                <img src="${CONFIG.ICON_PATH}/icon-192x192.webp" 
                     alt="Kingu Electrical" 
                     width="64" 
                     height="64">
                <div class="install-text">
                    <h4>Install Kingu Electrical App</h4>
                    <p>Get faster access and work offline</p>
                </div>
                <div class="install-actions">
                    <button class="install-btn btn btn-primary">Install</button>
                    <button class="install-later btn btn-secondary">Later</button>
                    <button class="install-close" aria-label="Close">×</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(prompt);
        
        // Install button
        prompt.querySelector('.install-btn').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            trackEvent('pwa', 'install_prompt', outcome);
            
            if (outcome === 'accepted') {
                prompt.remove();
                deferredPrompt = null;
            }
        });
        
        // Later button
        prompt.querySelector('.install-later').addEventListener('click', () => {
            prompt.remove();
            localStorage.setItem('installPromptDismissed', Date.now().toString());
        });
        
        // Close button
        prompt.querySelector('.install-close').addEventListener('click', () => {
            prompt.remove();
            localStorage.setItem('installPromptDismissed', Date.now().toString());
        });
        
        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.remove();
                localStorage.setItem('installPromptDismissed', Date.now().toString());
            }
        }, 30000);
    }
}

// Setup Offline Detection
function setupOfflineDetection() {
    function updateOnlineStatus() {
        APP_STATE.isOnline = navigator.onLine;
        
        const statusIndicator = document.getElementById('onlineStatus');
        if (statusIndicator) {
            if (APP_STATE.isOnline) {
                statusIndicator.textContent = '🟢 Online';
                statusIndicator.className = 'online';
                statusIndicator.setAttribute('aria-label', 'Online');
                
                // Sync data when coming back online
                setTimeout(syncOfflineData, 1000);
            } else {
                statusIndicator.textContent = '🔴 Offline';
                statusIndicator.className = 'offline';
                statusIndicator.setAttribute('aria-label', 'Offline - Working locally');
                
                showNotification('You are offline. Changes will sync when you reconnect.', 'info', 7000);
            }
        }
        
        // Update UI based on online status
        document.documentElement.classList.toggle('online', APP_STATE.isOnline);
        document.documentElement.classList.toggle('offline', !APP_STATE.isOnline);
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Sync Offline Data
async function syncOfflineData() {
    try {
        // Sync cart
        if (cart.items.length > 0) {
            await syncCartWithServer();
        }
        
        // Sync forms
        const pendingForms = JSON.parse(localStorage.getItem('pendingForms') || '[]');
        if (pendingForms.length > 0) {
            await syncPendingForms(pendingForms);
        }
        
        // Sync analytics
        const pendingAnalytics = JSON.parse(localStorage.getItem('pendingAnalytics') || '[]');
        if (pendingAnalytics.length > 0) {
            await syncAnalytics(pendingAnalytics);
        }
        
    } catch (error) {
        console.error('Sync error:', error);
    }
}

async function syncCartWithServer() {
    // Simulate cart sync with server
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Cart synced with server');
            trackEvent('sync', 'cart', cart.items.length.toString());
            resolve();
        }, 1000);
    });
}

async function syncPendingForms(forms) {
    // Simulate form sync
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Forms synced:', forms.length);
            localStorage.removeItem('pendingForms');
            resolve();
        }, 1000);
    });
}

async function syncAnalytics(events) {
    // Simulate analytics sync
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('Analytics synced:', events.length);
            localStorage.removeItem('pendingAnalytics');
            resolve();
        }, 1000);
    });
}

// Background Sync
function initBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Register sync events
            registration.sync.register('sync-forms').catch(console.error);
            registration.sync.register('sync-analytics').catch(console.error);
            
            console.log('Background sync registered');
        }).catch(console.error);
    }
}

// Periodic Sync
function initPeriodicSync() {
    if ('periodicSync' in self.registration) {
        self.registration.periodicSync.register('update-content', {
            minInterval: 24 * 60 * 60 * 1000, // 24 hours
            powerState: 'auto'
        }).then(() => {
            console.log('Periodic sync registered');
        }).catch(console.error);
    }
}

// Push Notifications
function initPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        // Check current permission
        if (Notification.permission === 'granted') {
            subscribeToPushNotifications();
        }
        
        // Request permission on user action
        const notifyBtn = document.getElementById('enableNotifications');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', requestNotificationPermission);
        }
    }
}

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        console.log('Notification permission granted');
        subscribeToPushNotifications();
        showNotification('Notifications enabled!', 'success');
        trackEvent('notifications', 'enabled');
    } else if (permission === 'denied') {
        showNotification('Notifications blocked. You can enable them in browser settings.', 'warning');
        trackEvent('notifications', 'denied');
    }
}

async function subscribeToPushNotifications() {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY_HERE')
        });
        
        // Send subscription to server
        await sendSubscriptionToServer(subscription);
        
        console.log('Push subscription successful');
        
    } catch (error) {
        console.error('Push subscription failed:', error);
        trackEvent('notifications', 'subscription_failed', error.message);
    }
}

async function sendSubscriptionToServer(subscription) {
    // Send to your server
    const response = await fetch(`${CONFIG.API_BASE_URL}/push/subscribe`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    });
    
    if (!response.ok) {
        throw new Error('Failed to send subscription to server');
    }
}

// URL base64 to Uint8Array conversion for push notifications
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// ===== UI ENHANCEMENTS =====

function initUIEnhancements() {
    initThemeToggle();
    initImageLazyLoading();
    initTooltips();
    initCopyButtons();
    initShareButtons();
    initProgressBars();
    initCounters();
    initBackToTop();
    initPrintButton();
    initFeedbackSystem();
    initCookieConsent();
    initWhatsAppWidget();
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check saved theme or prefer-color-scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = APP_STATE.darkMode ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        trackEvent('ui', 'theme_toggle', newTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    APP_STATE.darkMode = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#0d3b1f' : '#1a5632';
    }
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Scroll to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        trackEvent('ui', 'back_to_top');
    });
}

// Print Button
function initPrintButton() {
    const printBtn = document.getElementById('printBtn');
    if (!printBtn) return;
    
    printBtn.addEventListener('click', () => {
        window.print();
        trackEvent('ui', 'print_page');
    });
}

// Feedback System
function initFeedbackSystem() {
    const feedbackBtn = document.getElementById('feedbackBtn');
    if (!feedbackBtn) return;
    
    feedbackBtn.addEventListener('click', showFeedbackForm);
}

function showFeedbackForm() {
    const form = document.createElement('div');
    form.className = 'feedback-form';
    form.innerHTML = `
        <div class="feedback-header">
            <h4>Feedback & Suggestions</h4>
            <button class="close-feedback" aria-label="Close">×</button>
        </div>
        <div class="feedback-body">
            <div class="form-group">
                <label for="feedbackType">Type of Feedback</label>
                <select id="feedbackType">
                    <option value="suggestion">Suggestion</option>
                    <option value="bug">Bug Report</option>
                    <option value="compliment">Compliment</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="feedbackMessage">Your Feedback</label>
                <textarea id="feedbackMessage" placeholder="Tell us what you think..." rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label for="feedbackEmail">Email (Optional)</label>
                <input type="email" id="feedbackEmail" placeholder="your@email.com">
            </div>
        </div>
        <div class="feedback-footer">
            <button class="btn btn-primary" onclick="submitFeedback()">Submit Feedback</button>
        </div>
    `;
    
    document.body.appendChild(form);
    
    // Close button
    form.querySelector('.close-feedback').addEventListener('click', () => form.remove());
    
    // Close on outside click
    form.addEventListener('click', (e) => {
        if (e.target === form) form.remove();
    });
}

function submitFeedback() {
    const type = document.getElementById('feedbackType').value;
    const message = document.getElementById('feedbackMessage').value;
    const email = document.getElementById('feedbackEmail').value;
    
    if (!message.trim()) {
        showNotification('Please enter your feedback message', 'error');
        return;
    }
    
    // Save feedback
    const feedbacks = JSON.parse(localStorage.getItem('kinguFeedback') || '[]');
    feedbacks.push({
        type,
        message,
        email,
        timestamp: new Date().toISOString(),
        url: window.location.href
    });
    
    localStorage.setItem('kinguFeedback', JSON.stringify(feedbacks));
    
    showNotification('Thank you for your feedback!', 'success');
    document.querySelector('.feedback-form').remove();
    
    trackEvent('feedback', 'submit', type);
}

// Cookie Consent
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;
    
    const consent = document.createElement('div');
    consent.id = 'cookieConsent';
    consent.className = 'cookie-consent';
    consent.innerHTML = `
        <div class="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <div class="cookie-actions">
                <button class="btn btn-primary" onclick="acceptCookies()">Accept</button>
                <button class="btn btn-secondary" onclick="declineCookies()">Decline</button>
                <a href="/privacy.html" class="cookie-link">Learn More</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(consent);
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent').remove();
    trackEvent('cookies', 'accepted');
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieConsent').remove();
    trackEvent('cookies', 'declined');
}

// WhatsApp Widget
function initWhatsAppWidget() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (!whatsappBtn) return;
    
    // Add animation
    whatsappBtn.classList.add('pulse-animation');
    
    // Add click event
    whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const message = `Hello Kingu Electrical! I'm interested in your services. Can you help me?`;
        const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        window.open(url, '_blank');
        trackEvent('contact', 'whatsapp_click');
    });
    
    // Add tooltip
    whatsappBtn.setAttribute('title', 'Chat with us on WhatsApp');
    whatsappBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
}

// ===== ANALYTICS =====

function initAnalytics() {
    // Page view tracking
    trackPageView();
    
    // Performance tracking
    trackPerformance();
    
    // Error tracking
    trackErrors();
    
    // User engagement tracking
    trackEngagement();
}

function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || 'direct',
        screen: {
            width: window.screen.width,
            height: window.screen.height
        },
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    };
    
    // Save to localStorage for offline tracking
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
    pageViews.push(pageData);
    localStorage.setItem('pageViews', JSON.stringify(pageViews.slice(-100)));
    
    // Send to analytics (simulated)
    if (APP_STATE.isOnline) {
        setTimeout(() => {
            console.log('Page view tracked:', pageData);
            // In production, send to your analytics service
        }, 100);
    }
    
    trackEvent('page', 'view', pageData.url);
}

function trackPerformance() {
    // Track various performance metrics
    const metrics = {
        navigation: performance.getEntriesByType('navigation')[0],
        paint: performance.getEntriesByType('paint'),
        resource: performance.getEntriesByType('resource')
    };
    
    if (metrics.navigation) {
        const navTiming = metrics.navigation;
        trackEvent('performance', 'navigation', JSON.stringify({
            loadTime: navTiming.loadEventEnd - navTiming.startTime,
            domInteractive: navTiming.domInteractive - navTiming.startTime,
            domComplete: navTiming.domComplete - navTiming.startTime
        }));
    }
}

function trackErrors() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
        const errorData = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            timestamp: new Date().toISOString()
        };
        
        trackEvent('error', 'javascript', JSON.stringify(errorData));
    });
    
    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        const errorData = {
            reason: event.reason?.message || String(event.reason),
            timestamp: new Date().toISOString()
        };
        
        trackEvent('error', 'promise_rejection', JSON.stringify(errorData));
    });
}

function trackEngagement() {
    // Time on page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Date.now() - startTime;
        trackEvent('engagement', 'time_on_page', Math.round(timeSpent / 1000).toString());
    });
    
    // Scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (scrollPercent % 25 === 0) { // Track every 25%
                trackEvent('engagement', 'scroll_depth', `${scrollPercent}%`);
            }
        }
    }, 500));
}

function trackEvent(category, action, label, value) {
    const eventData = {
        category,
        action,
        label,
        value,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        page: window.location.href
    };
    
    // Save to localStorage for offline tracking
    const events = JSON.parse(localStorage.getItem('trackedEvents') || '[]');
    events.push(eventData);
    localStorage.setItem('trackedEvents', JSON.stringify(events.slice(-200)));
    
    // Send to analytics (simulated)
    if (APP_STATE.isOnline) {
        setTimeout(() => {
            console.log('Event tracked:', eventData);
            // In production, send to your analytics service
        }, 100);
    }
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// ===== UTILITY FUNCTIONS =====

function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    
    return new Intl.NumberFormat('en-TZ', {
        style: 'currency',
        currency: APP_STATE.currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTabKey(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
    
    element.addEventListener('keydown', handleTabKey);
    firstElement.focus();
    
    // Return cleanup function
    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
}

async function simulateAPIRequest(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.95) {
                resolve({ 
                    success: true, 
                    data,
                    timestamp: new Date().toISOString()
                });
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 1000);
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function getDeviceInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth
        },
        connection: navigator.connection ? {
            effectiveType: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            rtt: navigator.connection.rtt
        } : null
    };
}

function showUpdateNotification(data) {
    const notification = showNotification(
        'A new version is available. Refresh to update?',
        'info',
        15000
    );
    
    // Add refresh button
    const notificationEl = document.getElementById(notification);
    if (notificationEl) {
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh Now';
        refreshBtn.className = 'btn btn-sm';
        refreshBtn.style.marginLeft = '10px';
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
            trackEvent('update', 'refresh');
        });
        
        notificationEl.querySelector('.notification-content').appendChild(refreshBtn);
    }
    
    trackEvent('update', 'available', data?.version || 'unknown');
}

function showNewContentNotification(data) {
    showNotification(
        'New content is available. Refresh to see the latest updates.',
        'info',
        10000
    );
}

function showOrderConfirmation(message) {
    showNotification('Order request sent! We will contact you shortly.', 'success');
    
    // Share via WhatsApp
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    trackEvent('order', 'quick_request');
}

function showBookingConfirmation(message, data) {
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-content">
            <h3>📅 Site Inspection Scheduled!</h3>
            <p>We will call you at <strong>${data.phone}</strong> to confirm the details.</p>
            
            <div class="booking-details">
                <p><strong>Date:</strong> ${formatDate(data.date)}</p>
                <p><strong>Time:</strong> ${data.time}</p>
                <p><strong>Service:</strong> ${data.service}</p>
                ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            </div>
            
            <p>Need to make changes? Call us at ${CONFIG.DISPLAY_PHONE}</p>
            
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="shareBooking('${encodeURIComponent(message)}')">
                    <span class="whatsapp-icon">💬</span> Share via WhatsApp
                </button>
                <button class="btn btn-secondary" onclick="addToCalendar(${JSON.stringify(data).replace(/"/g, '&quot;')})">
                    📅 Add to Calendar
                </button>
                <button class="btn btn-outline" onclick="this.closest('.confirmation-modal').remove()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Track booking
    trackEvent('booking', 'scheduled', data.service);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-TZ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function shareBooking(message) {
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
    trackEvent('booking', 'share_whatsapp');
}

function addToCalendar(bookingData) {
    // Create calendar event
    const startDate = new Date(`${bookingData.date}T${bookingData.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const calendarEvent = {
        title: `Site Inspection - ${bookingData.service}`,
        description: `Site inspection for ${bookingData.service} at ${bookingData.location || 'location to be confirmed'}. Contact: ${bookingData.phone}`,
        location: bookingData.location || 'Location to be confirmed',
        start: startDate.toISOString(),
        end: endDate.toISOString()
    };
    
    // Create .ics file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${calendarEvent.title}
DESCRIPTION:${calendarEvent.description}
LOCATION:${calendarEvent.location}
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
UID:${Date.now()}@kingueletrical.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`;
    
    // Download .ics file
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-inspection-${bookingData.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Calendar event downloaded. Import it to your calendar.', 'success');
    trackEvent('booking', 'add_to_calendar');
}

// Load App State
function loadAppState() {
    const savedState = localStorage.getItem('kinguAppState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            Object.assign(APP_STATE, parsed);
        } catch (error) {
            console.error('Error loading app state:', error);
            localStorage.removeItem('kinguAppState');
        }
    }
}

// Save App State
function saveAppState() {
    try {
        localStorage.setItem('kinguAppState', JSON.stringify(APP_STATE));
    } catch (error) {
        console.error('Error saving app state:', error);
    }
}

// Check for Updates
function checkForUpdates() {
    if (!APP_STATE.isOnline) return;
    
    // Check for content updates
    fetch('/version.json', { cache: 'no-store' })
        .then(response => response.json())
        .then(data => {
            const currentVersion = '6.0.0';
            if (data.version !== currentVersion) {
                showUpdateNotification(data);
            }
        })
        .catch(() => {
            // Silently fail
        });
}

// Update Active Nav Link on Scroll
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === `#${current}` || 
                        (current === '' && href === '#home');
        
        link.classList.toggle('active', isActive);
        link.setAttribute('aria-current', isActive ? 'page' : null);
    });
}

// Reset All Filters
function resetFilters() {
    APP_STATE.currentCategory = 'all';
    APP_STATE.currentFilter = 'all';
    APP_STATE.searchQuery = '';
    APP_STATE.sortBy = 'default';
    
    // Reset UI
    document.querySelectorAll('[data-category]').forEach(link => {
        link.classList.toggle('active', link.dataset.category === 'all');
    });
    
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';
    
    // Reset price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        const maxPrice = Math.max(...PRODUCTS.map(p => p.price));
        priceRange.value = maxPrice;
        const priceMax = document.getElementById('priceMax');
        if (priceMax) priceMax.textContent = formatCurrency(maxPrice);
    }
    
    // Show all products
    displayProducts('all');
    
    // Show success message
    showNotification('All filters have been reset', 'success');
    
    trackEvent('filters', 'reset');
}

// Show Cart Sidebar
function showCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Render cart items
        renderCartItems();
        
        // Trap focus
        setTimeout(() => trapFocus(sidebar), 100);
    }
}

// Close Cart Sidebar
function closeCartSidebar() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Safe Execute with Error Boundary
function safeExecute(fn, fallback = null) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`Error in ${fn.name}:`, error);
            
            // Log error to analytics
            trackEvent('error', 'function', fn.name, error.message);
            
            // Show user-friendly error
            if (fallback !== null) {
                return fallback;
            }
            
            // Default error handling
            showNotification('Something went wrong. Please try again.', 'error');
            return null;
        }
    };
}

// Optimize Image URL
function optimizeImageUrl(url, width = 300, format = 'webp') {
    // Use your optimization service or logic here
    // For now, just return the original URL
    return url;
}

// Get Delivery Estimate
async function getDeliveryEstimate(location = null) {
    if (!APP_STATE.isOnline) {
        return 'Delivery estimates available when online';
    }
    
    if (!location && 'geolocation' in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 5000,
                    maximumAge: 60000
                });
            });
            
            APP_STATE.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            
            // Simulate delivery calculation based on location
            return calculateDeliveryEstimate(APP_STATE.userLocation);
            
        } catch (error) {
            console.error('Geolocation error:', error);
            trackEvent('delivery', 'geolocation_error', error.message);
        }
    }
    
    // Default estimate
    return '2-3 business days';
}

function calculateDeliveryEstimate(location) {
    // Simulate delivery calculation
    // In production, integrate with Google Maps API or similar
    const estimates = {
        'Dar-es-salaam': '1-2 business days',
        'Arusha': '2-3 business days',
        'Dodoma': '2-4 business days',
        'Mwanza': '3-5 business days',
        'Mbeya': '3-5 business days',
        'default': '3-7 business days'
    };
    
    // This is a simplified simulation
    return estimates['default'];
}

// Export to global scope
window.APP_STATE = APP_STATE;
window.PRODUCTS = PRODUCTS;
window.CONFIG = CONFIG;
window.cart = cart;
window.addToCart = safeExecute(addToCart);
window.removeFromCart = safeExecute(removeFromCart);
window.updateCartQuantity = safeExecute(updateCartQuantity);
window.showCategory = safeExecute(showCategory);
window.resetFilters = safeExecute(resetFilters);
window.formatCurrency = safeExecute(formatCurrency);
window.showNotification = safeExecute(showNotification);
window.copyToClipboard = safeExecute(copyToClipboard);
window.showOrderConfirmation = safeExecute(showOrderConfirmation);
window.getDeliveryEstimate = safeExecute(getDeliveryEstimate, '2-3 business days');
window.showCartSidebar = safeExecute(showCartSidebar);
window.closeCartSidebar = safeExecute(closeCartSidebar);

// Initialize on window load
window.addEventListener('load', () => {
    console.log('🎉 Kingu Electrical App Loaded Successfully v6.0.0');
    
    // Add loaded class to body
    document.documentElement.classList.add('loaded');
    
    // Trigger initial animations
    initScrollAnimations();
    
    // Update cart UI
    updateCartUI();
    
    // Save initial state
    saveAppState();
    
    // Backup cart to server if online
    if (APP_STATE.isOnline) {
        backupCartToCloud();
    }
    
    // Track successful load
    trackEvent('app', 'loaded', 'v6.0.0');
});

// Listen for page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible again
        checkForUpdates();
        if (APP_STATE.isOnline) {
            backupCartToCloud();
        }
        trackEvent('engagement', 'page_visible');
    } else {
        trackEvent('engagement', 'page_hidden');
    }
});

// Handle offline/online events
window.addEventListener('offline', () => {
    // Save unsaved data
    backupLocalData();
});

window.addEventListener('online', () => {
    // Sync when back online
    setTimeout(syncOfflineData, 1000);
});

// Backup local data
function backupLocalData() {
    const backup = {
        cart: cart,
        appState: APP_STATE,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('kinguBackup', JSON.stringify(backup));
    console.log('Local data backed up for offline use');
}

// Backup cart to cloud
function backupCartToCloud() {
    if (!APP_STATE.isOnline || cart.items.length === 0) return;
    
    // Simulate cloud backup
    setTimeout(() => {
        console.log('Cart backed up to cloud');
        trackEvent('sync', 'cart_backup', cart.items.length.toString());
    }, 1000);
}

// Handle beforeunload
window.addEventListener('beforeunload', (e) => {
    // Save current state
    saveAppState();
    
    // If there are pending changes, warn user
    const pendingForms = JSON.parse(localStorage.getItem('pendingForms') || '[]');
    if (pendingForms.length > 0 && APP_STATE.isOnline === false) {
        e.preventDefault();
        e.returnValue = 'You have unsaved form data that will be lost if you leave.';
    }
});

// Service Worker message handler
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        switch (type) {
            case 'CACHE_UPDATED':
                console.log('Cache updated:', data);
                break;
                
            case 'OFFLINE_READY':
                console.log('App is ready for offline use');
                showNotification('App is ready for offline use', 'success');
                break;
                
            case 'RESOURCE_LOAD_FAILED':
                console.warn('Resource load failed:', data);
                break;
        }
    });
}

// Periodic state save
setInterval(saveAppState, 30000); // Save every 30 seconds

// Periodic cart backup
setInterval(() => {
    if (APP_STATE.isOnline) {
        backupCartToCloud();
    }
}, 60000); // Backup every minute

console.log('📦 Kingu Electrical Script v6.0.0 Loaded');
