/**
 * Kingu Electrical Company Website - Enhanced JavaScript
 * All interactive functionality with PWA, e-commerce, and performance optimizations
 * Version: 5.2.0
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
    API_BASE_URL: 'https://api.kingueletrical.com/v1'
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
        image: "/assets/images/products/generator-100kva.webp",
        images: [
            "/assets/images/products/generator-100kva-1.webp",
            "/assets/images/products/generator-100kva-2.webp"
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
        image: "/assets/images/products/generator-500kva.webp",
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
        image: "/assets/images/products/solar-5kw.webp",
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
        image: "/assets/images/products/alternator.webp",
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
        image: "/assets/images/products/megger-mit515.webp",
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
        image: "/assets/images/services/maintenance.webp",
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
        image: "/assets/images/products/tester-combo.webp",
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
    currency: 'TZS'
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Kingu Electrical App Initializing...');
    
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
    
    console.log('✅ Kingu Electrical App Initialized');
});

// ===== CORE FUNCTIONALITY =====

function initCoreFeatures() {
    initMobileNavigation();
    initSmoothScrolling();
    initFormHandling();
    initScrollAnimations();
    initNotifications();
    initCurrentYear();
    initAccessibility();
    initPerformanceMonitoring();
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
        
        // Trap focus when menu is open
        if (!isExpanded) {
            trapFocus(navMenu);
        }
    });
    
    // Close menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
            hamburger.focus();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.innerHTML = '☰';
        }
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
        });
    });
}

// Form Handling with validation
function initFormHandling() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        initFormValidation(contactForm);
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
}

// Form Validation
function initFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const errorSpan = field.parentElement.querySelector('.field-error') || createErrorSpan(field);
        
        if (!field.checkValidity()) {
            errorSpan.textContent = getValidationMessage(field);
            field.classList.add('invalid');
            return false;
        } else {
            errorSpan.textContent = '';
            field.classList.remove('invalid');
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
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (timeInput) {
        // Set default to 9:00 AM
        timeInput.value = '09:00';
        timeInput.min = '08:00';
        timeInput.max = '17:00';
    }
}

// Form Submission Handlers
async function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <span class="loading-spinner"></span>
        Sending Message...
    `;
    submitBtn.disabled = true;
    
    try {
        // Simulate API call - replace with actual Formspree
        await simulateAPIRequest(formData);
        
        // Success
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.background = 'var(--success)';
        
        showNotification('Thank you! We will contact you within 24 hours.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
        
        // Track conversion
        trackEvent('form', 'submit', 'contact');
        
    } catch (error) {
        // Error
        submitBtn.innerHTML = '✗ Failed to Send';
        submitBtn.style.background = 'var(--danger)';
        
        showNotification('Failed to send message. Please try again or call us directly.', 'error');
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);
    }
}

async function handleBookingForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
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
}

function handleNewsletterForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }
    
    // Show success
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    form.reset();
    
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
    
    const message = `🛒 Quick Order Request:
    
Customer: ${data.name}
Phone: ${data.phone}
Interested in: ${data.category}
Requirements: ${data.requirements}
    
Please contact with available options and pricing.`;
    
    showOrderConfirmation(message);
    form.reset();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.fade-in, .slide-in, .stagger-item').forEach(el => {
        observer.observe(el);
    });
}

// Notifications System
function initNotifications() {
    // Add notification container
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    const id = 'notification-' + Date.now();
    
    notification.id = id;
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">${message}</div>
        <button class="notification-close" aria-label="Close notification">×</button>
    `;
    
    container.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(id);
    });
    
    // Auto-remove
    if (duration > 0) {
        setTimeout(() => removeNotification(id), duration);
    }
    
    return id;
}

function removeNotification(id) {
    const notification = document.getElementById(id);
    if (notification) {
        notification.classList.add('notification-exit');
        setTimeout(() => notification.remove(), 300);
    }
}

// Current Year in Footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
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
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add focus styles
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
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Log performance metrics
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
            
            // Report to analytics if slow
            if (loadTime > 3000) {
                trackEvent('performance', 'slow_load', loadTime.toString());
            }
        });
    }
    
    // Monitor memory usage
    if ('memory' in performance) {
        setInterval(() => {
            const usedJSHeapSize = performance.memory.usedJSHeapSize;
            const totalJSHeapSize = performance.memory.totalJSHeapSize;
            const heapLimit = performance.memory.jsHeapSizeLimit;
            
            if (usedJSHeapSize > heapLimit * 0.8) {
                console.warn('High memory usage detected');
            }
        }, 30000);
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
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
            (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
        );
    }
    
    // Apply other filters
    products = applyFilters(products);
    
    // Sort products
    products = sortProducts(products);
    
    // Update UI
    updateProductsGrid(products);
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
    }
    
    return sorted;
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
                <button onclick="resetFilters()" class="btn">Reset Filters</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add event listeners to new product cards
    container.querySelectorAll('.product-card').forEach(card => {
        const productId = parseInt(card.dataset.productId);
        const product = PRODUCTS.find(p => p.id === productId);
        
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
    });
}

// Create Product Card
function createProductCard(product) {
    const discount = product.originalPrice && product.price < product.originalPrice
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-card-header">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                <button class="wishlist-btn" aria-label="Add to wishlist">♥</button>
            </div>
            
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy"
                     width="300"
                     height="200">
                <button class="quick-view" aria-label="Quick view">👁️ Quick View</button>
            </div>
            
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                
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
                            <div class="product-rating">
                                ⭐ ${product.rating} (${product.reviews || 0})
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <button class="add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                    <span class="cart-icon">🛒</span>
                    Add to Cart
                </button>
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
        });
    }
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
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    // Update cart
    calculateCartTotals();
    saveCartToStorage();
    updateCartUI();
    
    // Show feedback
    showNotification(`Added ${product.name} to cart!`, 'success');
    
    // Track event
    trackEvent('ecommerce', 'add_to_cart', product.id.toString());
    
    // Update cart badge with animation
    animateCartBadge();
}

// Calculate Cart Totals
function calculateCartTotals() {
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
            type: 'SYNC_CART',
            cart: cart
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
                🛒 ${cartCount} items • ${formatCurrency(cart.total)}
                <br>
                <small>Call ${CONFIG.DISPLAY_PHONE} to order</small>
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
                <button onclick="showCategory('all')" class="btn">Browse Products</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.items.map(item => `
        <div class="cart-item" data-item-id="${item.id}">
            <img src="${item.image}" 
                 alt="${item.name}" 
                 class="cart-item-image"
                 loading="lazy"
                 width="80"
                 height="80">
            
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <button class="remove-item" onclick="removeFromCart(${item.id})" 
                            aria-label="Remove item">×</button>
                </div>
                
                <div class="cart-item-price">${formatCurrency(item.price)} each</div>
                
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
    document.getElementById('cartSubtotal').textContent = formatCurrency(cart.subtotal);
    document.getElementById('cartDelivery').textContent = formatCurrency(cart.delivery);
    document.getElementById('cartInstallation').textContent = formatCurrency(cart.installation);
    document.getElementById('cartTotal').textContent = formatCurrency(cart.total);
}

// Remove from Cart
function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== productId);
    calculateCartTotals();
    saveCartToStorage();
    updateCartUI();
    
    showNotification('Item removed from cart', 'info');
    trackEvent('ecommerce', 'remove_from_cart', productId.toString());
}

// Update Cart Quantity
function updateCartQuantity(productId, change) {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            calculateCartTotals();
            saveCartToStorage();
            updateCartUI();
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

// Product Modal
function initProductModal() {
    // Create modal container
    if (!document.getElementById('productModal')) {
        const modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-body" id="productModalContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal on click outside or escape
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-close')) {
                closeProductModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeProductModal();
            }
        });
    }
}

function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const content = document.getElementById('productModalContent');
    
    if (!modal || !content) return;
    
    content.innerHTML = createProductModalContent(product);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    const addToCartBtn = content.querySelector('.modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            addToCart(product);
            closeProductModal();
        });
    }
    
    // Track view
    trackEvent('ecommerce', 'product_view', product.id.toString());
}

function createProductModalContent(product) {
    return `
        <div class="product-modal">
            <div class="product-modal-images">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="main-image"
                     loading="lazy">
                ${product.images && product.images.length > 0 ? `
                <div class="thumbnail-gallery">
                    ${product.images.map(img => `
                        <img src="${img}" 
                             alt="${product.name}" 
                             class="thumbnail"
                             onclick="this.closest('.product-modal').querySelector('.main-image').src = this.src">
                    `).join('')}
                </div>
                ` : ''}
            </div>
            
            <div class="product-modal-details">
                <h2>${product.name}</h2>
                <div class="product-price">
                    <span class="current-price">${formatCurrency(product.price)}</span>
                    ${product.originalPrice && product.price < product.originalPrice
                        ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>`
                        : ''}
                </div>
                
                <div class="product-rating-section">
                    ${product.rating ? `
                    <div class="rating">
                        ⭐ ${product.rating}/5 (${product.reviews || 0} reviews)
                    </div>
                    ` : ''}
                    <div class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}
                    </div>
                </div>
                
                <div class="product-description">
                    <h3>Description</h3>
                    <p>${product.description}</p>
                </div>
                
                ${product.specifications ? `
                <div class="product-specifications">
                    <h3>Specifications</h3>
                    <div class="specs-grid">
                        ${Object.entries(product.specifications).map(([key, value]) => `
                            <div class="spec-item">
                                <strong>${key}:</strong>
                                <span>${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${product.includes ? `
                <div class="product-includes">
                    <h3>Service Includes</h3>
                    <ul>
                        ${product.includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="this.nextElementSibling.stepDown()">−</button>
                        <input type="number" 
                               min="1" 
                               max="${product.stock}" 
                               value="1" 
                               class="quantity-input">
                        <button class="qty-btn" onclick="this.previousElementSibling.stepUp()">+</button>
                    </div>
                    
                    <button class="modal-add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                        🛒 Add to Cart
                    </button>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <span class="meta-label">Delivery:</span>
                        <span class="meta-value">${product.delivery}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Installation:</span>
                        <span class="meta-value">${product.installation}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Warranty:</span>
                        <span class="meta-value">${product.warranty || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Wishlist
function initWishlist() {
    // Load wishlist from storage
    let wishlist = JSON.parse(localStorage.getItem('kinguWishlist') || '[]');
    
    // Update wishlist count
    updateWishlistCount(wishlist.length);
    
    // Expose toggle function
    window.toggleWishlist = function(product) {
        const index = wishlist.findIndex(item => item.id === product.id);
        
        if (index === -1) {
            wishlist.push(product);
            showNotification(`Added ${product.name} to wishlist`, 'success');
        } else {
            wishlist.splice(index, 1);
            showNotification(`Removed ${product.name} from wishlist`, 'info');
        }
        
        // Save to storage
        localStorage.setItem('kinguWishlist', JSON.stringify(wishlist));
        
        // Update UI
        updateWishlistCount(wishlist.length);
        
        // Track event
        trackEvent('ecommerce', 'wishlist_toggle', product.id.toString());
    };
}

function updateWishlistCount(count) {
    const wishlistElements = document.querySelectorAll('.wishlist-count');
    wishlistElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ===== PWA FUNCTIONALITY =====

function initPWAFeatures() {
    registerServiceWorker();
    setupInstallPrompt();
    setupOfflineDetection();
    initBackgroundSync();
    initPushNotifications();
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
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New Service Worker found:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
            
            // Handle messages
            navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    }
}

// Handle Service Worker Messages
function handleServiceWorkerMessage(event) {
    const { type, data } = event.data;
    
    switch (type) {
        case 'UPDATE_AVAILABLE':
            showUpdateNotification();
            break;
        case 'SYNC_COMPLETE':
            if (data && data.type === 'orders') {
                showNotification('Orders synced successfully!', 'success');
            }
            break;
        case 'BACKGROUND_FETCH':
            console.log('Background fetch completed:', data);
            break;
    }
}

// Setup Install Prompt
function setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
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
    });
    
    function showInstallPrompt() {
        const prompt = document.createElement('div');
        prompt.className = 'install-prompt';
        prompt.innerHTML = `
            <div class="install-content">
                <img src="/assets/icons/icon-192.png" alt="Kingu Electrical" width="64" height="64">
                <div>
                    <h4>Install Kingu Electrical App</h4>
                    <p>Get faster access and work offline</p>
                </div>
                <button class="install-btn">Install</button>
                <button class="install-close">×</button>
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
        
        // Close button
        prompt.querySelector('.install-close').addEventListener('click', () => {
            prompt.remove();
            localStorage.setItem('pwaPromptDismissed', Date.now().toString());
        });
        
        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.remove();
                localStorage.setItem('pwaPromptDismissed', Date.now().toString());
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
            } else {
                statusIndicator.textContent = '🔴 Offline - Working locally';
                statusIndicator.className = 'offline';
                showNotification('You are offline. Changes will sync when you reconnect.', 'info', 7000);
            }
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Background Sync
function initBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Register for periodic sync (if supported)
            if ('periodicSync' in registration) {
                registration.periodicSync.register('update-products', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 hours
                }).then(() => {
                    console.log('Periodic sync registered');
                });
            }
            
            // Sync orders when online
            window.addEventListener('online', () => {
                syncPendingOrders();
            });
        });
    }
}

async function syncPendingOrders() {
    const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
    
    if (pendingOrders.length === 0) return;
    
    showNotification('Syncing pending orders...', 'info');
    
    for (const order of pendingOrders) {
        try {
            // Simulate API call
            await simulateAPIRequest(order);
            
            // Remove from pending
            pendingOrders.splice(pendingOrders.indexOf(order), 1);
            localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
            
        } catch (error) {
            console.error('Failed to sync order:', error);
        }
    }
    
    if (pendingOrders.length === 0) {
        showNotification('All orders synced successfully!', 'success');
    }
}

// Push Notifications
function initPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        // Request permission on user action
        const notifyBtn = document.getElementById('enableNotifications');
        if (notifyBtn) {
            notifyBtn.addEventListener('click', requestNotificationPermission);
        }
        
        // Check current permission
        if (Notification.permission === 'granted') {
            console.log('Notifications already granted');
        }
    }
}

async function requestNotificationPermission() {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
        console.log('Notification permission granted');
        
        // Subscribe to push notifications
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
                }).then(subscription => {
                    console.log('Push subscription:', subscription);
                    // Send subscription to server
                });
            });
        }
        
        showNotification('Notifications enabled!', 'success');
        trackEvent('notifications', 'enabled');
    }
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
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = APP_STATE.darkMode ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

function setTheme(theme) {
    APP_STATE.darkMode = theme === 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Image Lazy Loading
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(e) {
    const element = e.target;
    const tooltipText = element.dataset.tooltip;
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    tooltip.id = 'current-tooltip';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.top - 40) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    
    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.getElementById('current-tooltip');
    if (tooltip) tooltip.remove();
}

// Copy Buttons
function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', (e) => {
            const text = e.target.dataset.copy;
            copyToClipboard(text);
        });
    });
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy to clipboard', 'error');
    }
}

// Share Buttons
function initShareButtons() {
    if ('share' in navigator) {
        document.querySelectorAll('[data-share]').forEach(button => {
            button.style.display = 'inline-block';
            button.addEventListener('click', () => {
                const shareData = {
                    title: button.dataset.shareTitle || CONFIG.COMPANY_NAME,
                    text: button.dataset.shareText || 'Check out Kingu Electrical services',
                    url: button.dataset.shareUrl || CONFIG.WEBSITE
                };
                
                navigator.share(shareData).catch(console.error);
            });
        });
    }
}

// Progress Bars
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const value = bar.dataset.value || '0';
        bar.style.width = value + '%';
        bar.setAttribute('aria-valuenow', value);
    });
}

// Counters (for stats)
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target || '0');
        const duration = parseInt(counter.dataset.duration || '2000');
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        // Start when in viewport
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// ===== ANALYTICS =====

function initAnalytics() {
    // Page view tracking
    trackPageView();
    
    // Performance tracking
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            trackEvent('performance', 'lcp', Math.round(lastEntry.startTime).toString());
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                trackEvent('performance', 'fid', Math.round(entry.processingStart - entry.startTime).toString());
            });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
    }
}

function trackPageView() {
    const pageData = {
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString(),
        referrer: document.referrer || 'direct'
    };
    
    // Save to localStorage for offline tracking
    const pageViews = JSON.parse(localStorage.getItem('pageViews') || '[]');
    pageViews.push(pageData);
    localStorage.setItem('pageViews', JSON.stringify(pageViews.slice(-100))); // Keep last 100
    
    // Send to analytics (simulated)
    if (APP_STATE.isOnline) {
        setTimeout(() => {
            // Simulate analytics call
            console.log('Page view tracked:', pageData);
        }, 100);
    }
}

function trackEvent(category, action, label, value) {
    const eventData = {
        category,
        action,
        label,
        value,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage for offline tracking
    const events = JSON.parse(localStorage.getItem('trackedEvents') || '[]');
    events.push(eventData);
    localStorage.setItem('trackedEvents', JSON.stringify(events.slice(-200))); // Keep last 200
    
    // Send to analytics (simulated)
    if (APP_STATE.isOnline) {
        setTimeout(() => {
            // Simulate analytics call
            console.log('Event tracked:', eventData);
        }, 100);
    }
}

// ===== UTILITY FUNCTIONS =====

function formatCurrency(amount) {
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
    
    element.addEventListener('keydown', (e) => {
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
    });
    
    firstElement.focus();
}

async function simulateAPIRequest(data) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.95) { // 95% success rate
                resolve({ success: true, data });
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 1000);
    });
}

function showUpdateNotification() {
    const notification = showNotification(
        'A new version is available. Refresh to update?',
        'info',
        10000
    );
    
    // Add refresh button
    const notificationEl = document.getElementById(notification);
    if (notificationEl) {
        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'Refresh';
        refreshBtn.className = 'btn btn-sm';
        refreshBtn.style.marginLeft = '10px';
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
        
        notificationEl.querySelector('.notification-content').appendChild(refreshBtn);
    }
}

function showBookingConfirmation(message, data) {
    // Create booking confirmation modal
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="confirmation-content">
            <h3>📅 Site Inspection Scheduled!</h3>
            <p>We will call you at <strong>${data.phone}</strong> to confirm the details.</p>
            
            <div class="booking-details">
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Time:</strong> ${data.time}</p>
                <p><strong>Service:</strong> ${data.service}</p>
            </div>
            
            <p>Need to make changes? Call us at ${CONFIG.DISPLAY_PHONE}</p>
            
            <div class="confirmation-actions">
                <button class="btn btn-primary" onclick="shareBooking('${encodeURIComponent(message)}')">
                    Share via WhatsApp
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.confirmation-modal').remove()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Track booking
    trackEvent('booking', 'scheduled', data.service);
}

function shareBooking(message) {
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
}

// Load App State
function loadAppState() {
    const savedState = localStorage.getItem('kinguAppState');
    if (savedState) {
        try {
            Object.assign(APP_STATE, JSON.parse(savedState));
        } catch (error) {
            console.error('Error loading app state:', error);
        }
    }
}

// Save App State
function saveAppState() {
    localStorage.setItem('kinguAppState', JSON.stringify(APP_STATE));
}

// Check for Updates
function checkForUpdates() {
    if (!APP_STATE.isOnline) return;
    
    // Check for content updates
    fetch('/version.json')
        .then(response => response.json())
        .then(data => {
            const currentVersion = '5.2.0';
            if (data.version !== currentVersion) {
                showUpdateNotification();
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
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${current}`);
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
    if (searchInput) searchInput.value = '';
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';
    
    // Show all products
    displayProducts('all');
    
    trackEvent('filters', 'reset');
}

// Export to global scope
window.APP_STATE = APP_STATE;
window.PRODUCTS = PRODUCTS;
window.CONFIG = CONFIG;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.showCategory = showCategory;
window.resetFilters = resetFilters;
window.formatCurrency = formatCurrency;
window.showNotification = showNotification;
window.copyToClipboard = copyToClipboard;

// Initialize on window load
window.addEventListener('load', () => {
    console.log('🎉 Kingu Electrical App Loaded Successfully');
    
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    initScrollAnimations();
    
    // Update cart UI
    updateCartUI();
    
    // Save initial state
    saveAppState();
});
