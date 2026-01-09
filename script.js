/**
 * Kingu Electrical Company Website - JavaScript
 * Mobile-First Optimized Version
 */

// Contact numbers configuration
const PHONE_NUMBER = '+255677014740';
const WHATSAPP_NUMBER = '255682843552';
const DISPLAY_PHONE = '+255 677 014 740';
const DISPLAY_WHATSAPP = '0682 843 552';

// Complete Products Data
const products = [
    // GENERATORS
    {
        id: 1,
        category: "generators",
        name: "100kVA Diesel Generator",
        description: "Complete 100kVA diesel generator set with ATS control panel. Perfect for commercial use.",
        price: "25,500,000",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "Free",
        installation: "Included",
        badge: "Best Seller"
    },
    {
        id: 2,
        category: "generators",
        name: "500kVA Industrial Generator",
        description: "Industrial 500kVA diesel generator for factories and large facilities.",
        price: "65,000,000",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "low-stock",
        delivery: "Free",
        installation: "Included",
        badge: "Limited Stock"
    },
    {
        id: 3,
        category: "generators",
        name: "50kVA Silent Generator",
        description: "Super silent 50kVA generator with soundproof canopy for residential areas.",
        price: "12,500,000",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "Free",
        installation: "Included"
    },
    // SOLAR SYSTEMS
    {
        id: 9,
        category: "solar",
        name: "5kW Solar System",
        description: "Complete 5kW solar power system with batteries, inverter, and installation.",
        price: "8,500,000",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "Free in Dar/Arusha",
        installation: "Included",
        badge: "Popular"
    },
    {
        id: 10,
        category: "solar",
        name: "10kW Solar System",
        description: "Commercial 10kW solar system with lithium batteries.",
        price: "15,000,000",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "Free",
        installation: "Included"
    },
    // SPARE PARTS
    {
        id: 15,
        category: "spares",
        name: "Generator Alternator",
        description: "Original alternator for Perkins/Caterpillar generators. 12-month warranty.",
        price: "850,000",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "25,000 TZS",
        installation: "Extra"
    },
    // ELECTRICAL TOOLS
    {
        id: 101,
        category: "tools",
        name: "Megger MIT515 5kV Insulation Tester",
        description: "Professional 5kV insulation resistance tester with 5 ranges up to 2000GΩ.",
        price: "1,850,000",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "25,000 TZS",
        installation: "Not needed",
        badge: "Professional"
    },
    // SERVICES
    {
        id: 131,
        category: "services",
        name: "Generator Maintenance",
        description: "Professional generator maintenance service including oil change and testing.",
        price: "150,000",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "available",
        delivery: "Included",
        installation: "Service"
    },
    // SPECIAL DEALS
    {
        id: 141,
        category: "deals",
        name: "Combo Deal: Megger MIT515 + Fluke 117",
        description: "Professional insulation tester and multimeter combo at special price.",
        price: "2,450,000",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
        stock: "in-stock",
        delivery: "FREE",
        installation: "Not needed",
        badge: "Special Deal"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('kinguCart')) || [];
let currentCategory = 'all';
let currentFilter = 'all';

// Mobile detection
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const isAndroid = /Android/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE-SPECIFIC INITIALIZATION =====
    initializeMobileOptimizations();
    
    // Initialize all components
    initMobileNavigation();
    initFormSubmissions();
    initScrollAnimations();
    initBookingForm();
    initCurrentYear();
    initNotifications();
    
    // Initialize e-commerce features
    setupCategoryNavigation();
    displayCategoryProducts(currentCategory);
    setupFilters();
    setupSearch();
    updateCartCount();
    loadCartFromStorage();
    
    // Fix all broken links
    fixBrokenLinks();
    
    // Set initial active category
    showCategory('all');
    
    // Setup offline detection
    setupOfflineDetection();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Add active state to current section in navigation
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Prevent zoom on double-tap for iOS
    if (isIOS) {
        preventDoubleTapZoom();
    }
    
    // Fix viewport height for mobile browsers
    fixViewportHeight();
    
    // Setup keyboard shortcuts (desktop only)
    if (!isMobile) {
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }
});

// ===== MOBILE OPTIMIZATIONS =====
function initializeMobileOptimizations() {
    // Add mobile-specific CSS
    addMobileStyles();
    
    // Fix touch events
    fixTouchEvents();
    
    // Optimize animations for mobile
    optimizeAnimations();
    
    // Setup mobile navigation gestures
    setupMobileGestures();
    
    // Prevent bounce/overscroll on iOS
    preventBounce();
    
    // Add mobile-specific meta tags
    addMobileMetaTags();
    
    // Fix form inputs on mobile
    fixMobileFormInputs();
    
    // Setup orientation change handling
    setupOrientationChange();
}

function addMobileStyles() {
    const mobileStyles = `
        /* Mobile-specific styles */
        @media (max-width: 768px) {
            /* Prevent horizontal scroll */
            html, body {
                max-width: 100%;
                overflow-x: hidden;
                -webkit-text-size-adjust: 100%;
                text-size-adjust: 100%;
            }
            
            /* Fix 100vh issue on mobile */
            .full-height {
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
            }
            
            /* Improve button touch targets */
            button, 
            .btn, 
            .kingu-order-btn, 
            a[role="button"] {
                min-height: 44px;
                min-width: 44px;
            }
            
            /* Fix form input zoom on iOS */
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            input[type="number"],
            select,
            textarea {
                font-size: 16px; /* Prevents iOS zoom */
            }
            
            /* Improve scrolling performance */
            * {
                -webkit-overflow-scrolling: touch;
            }
            
            /* Fix fixed elements on mobile */
            .whatsapp,
            .back-to-top {
                bottom: 20px;
                right: 20px;
                transform: scale(0.9);
            }
            
            /* Reduce padding for mobile */
            section {
                padding: 40px 0;
            }
            
            /* Optimize grid layout for mobile */
            .grid,
            .products-grid,
            .project-gallery {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            /* Optimize card layout for mobile */
            .card {
                padding: 20px;
                margin: 10px;
            }
            
            /* Improve contact header for mobile */
            .contact-header {
                flex-direction: column;
                gap: 10px;
            }
            
            .contact-header a {
                width: 100%;
                text-align: center;
                font-size: 14px;
                padding: 12px;
            }
            
            /* Fix sticky navigation */
            nav {
                height: 60px;
            }
            
            .nav-container {
                height: 60px;
                padding: 0 15px;
            }
            
            /* Improve mobile menu */
            .nav-menu {
                position: fixed;
                top: 60px;
                left: 0;
                right: 0;
                background: var(--secondary-green);
                max-height: calc(100vh - 60px);
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
                padding: 20px;
                z-index: 999;
            }
            
            .nav-menu.active {
                transform: translateX(0);
            }
            
            .nav-menu a {
                padding: 15px;
                font-size: 16px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            /* Fix modal for mobile */
            .modal-content {
                width: 90%;
                margin: 20px auto;
                max-height: 80vh;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            /* Improve product cards for mobile */
            .product-card {
                margin: 0 10px 20px;
            }
            
            /* Fix cart sidebar for mobile */
            #cartSidebar {
                width: 100%;
                max-width: 100vw;
            }
        }
        
        /* Small mobile devices */
        @media (max-width: 480px) {
            header h1 {
                font-size: 2rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            h2 {
                font-size: 1.8rem;
                padding-bottom: 15px;
                margin-bottom: 30px;
            }
            
            .emergency-btn,
            .promo-btn,
            .btn {
                padding: 14px 25px;
                font-size: 14px;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .stat-number {
                font-size: 2.5rem;
            }
        }
        
        /* iOS specific fixes */
        @supports (-webkit-touch-callout: none) {
            /* iOS specific styles */
            input, textarea {
                border-radius: 0; /* Remove iOS rounded corners */
            }
            
            button {
                -webkit-appearance: none;
                border-radius: 0;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = mobileStyles;
    document.head.appendChild(style);
}

function fixTouchEvents() {
    // Remove hover effects on touch devices
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }
    
    // Add CSS class for touch devices
    const touchCSS = `
        .touch-device *:hover {
            transform: none !important;
            box-shadow: none !important;
        }
        
        .touch-device button:hover,
        .touch-device a:hover {
            opacity: 1 !important;
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = touchCSS;
    document.head.appendChild(style);
}

function optimizeAnimations() {
    // Reduce animation intensity on mobile
    if (isMobile) {
        // Disable parallax effects on mobile
        document.documentElement.style.setProperty('--parallax-speed', '0');
        
        // Reduce animation duration
        const animations = document.querySelectorAll('*[style*="animation"]');
        animations.forEach(el => {
            const style = window.getComputedStyle(el);
            const animationDuration = style.animationDuration;
            if (animationDuration && parseFloat(animationDuration) > 1) {
                el.style.animationDuration = '0.5s';
            }
        });
    }
}

function setupMobileGestures() {
    if (!isMobile) return;
    
    // Handle swipe gestures for mobile
    let touchstartX = 0;
    let touchendX = 0;
    
    document.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchendX - touchstartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe right - open navigation
                const navMenu = document.getElementById('nav-menu');
                if (!navMenu.classList.contains('active') && window.innerWidth <= 768) {
                    navMenu.classList.add('active');
                    const hamburger = document.getElementById('hamburger');
                    if (hamburger) hamburger.innerHTML = '✕';
                }
            } else {
                // Swipe left - close navigation
                const navMenu = document.getElementById('nav-menu');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const hamburger = document.getElementById('hamburger');
                    if (hamburger) hamburger.innerHTML = '☰';
                }
                
                // Also close cart on swipe
                const cartSidebar = document.getElementById('cartSidebar');
                if (cartSidebar && cartSidebar.classList.contains('open')) {
                    cartSidebar.classList.remove('open');
                }
            }
        }
    }
}

function preventBounce() {
    // Prevent pull-to-refresh and bounce effect
    if (isIOS) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Allow scrolling within specific containers
        const scrollableElements = document.querySelectorAll('.scrollable');
        scrollableElements.forEach(el => {
            el.style.overflowY = 'auto';
            el.style.webkitOverflowScrolling = 'touch';
        });
    }
}

function addMobileMetaTags() {
    // Add additional meta tags for mobile
    const existingMeta = document.querySelector('meta[name="viewport"]');
    if (existingMeta) {
        // Update existing viewport meta
        existingMeta.content = existingMeta.content + ', maximum-scale=1.0, user-scalable=0';
    }
    
    // Add apple-mobile-web-app-capable meta tag
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);
    
    // Add apple-mobile-web-app-status-bar-style
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);
    
    // Add format-detection to prevent phone number detection
    const formatMeta = document.createElement('meta');
    formatMeta.name = 'format-detection';
    formatMeta.content = 'telephone=no';
    document.head.appendChild(formatMeta);
}

function fixMobileFormInputs() {
    // Fix form input issues on mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Prevent zoom on focus in iOS
        if (isIOS) {
            input.addEventListener('focus', () => {
                // Add a small delay to ensure proper rendering
                setTimeout(() => {
                    input.style.fontSize = '16px';
                }, 100);
            });
            
            input.addEventListener('blur', () => {
                setTimeout(() => {
                    input.style.fontSize = '';
                }, 100);
            });
        }
        
        // Add touch-friendly clear button
        if (input.type === 'text' || input.type === 'tel' || input.type === 'email') {
            input.style.paddingRight = '40px';
            
            const clearBtn = document.createElement('button');
            clearBtn.type = 'button';
            clearBtn.innerHTML = '×';
            clearBtn.style.cssText = `
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: #999;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
                min-width: 30px;
                min-height: 30px;
                display: none;
            `;
            
            // Position relative wrapper
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(clearBtn);
            
            // Show/hide clear button
            input.addEventListener('input', () => {
                clearBtn.style.display = input.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                input.value = '';
                clearBtn.style.display = 'none';
                input.focus();
            });
        }
    });
}

function setupOrientationChange() {
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        // Fix viewport height after orientation change
        setTimeout(fixViewportHeight, 300);
        
        // Recalculate any layout-dependent elements
        if (typeof displayCategoryProducts === 'function') {
            displayCategoryProducts(currentCategory);
        }
    });
}

function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function fixViewportHeight() {
    // Fix 100vh issue on mobile browsers
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// ===== E-COMMERCE FUNCTIONALITY (Mobile Optimized) =====

// Setup Category Navigation
function setupCategoryNavigation() {
    const categoryLinks = document.querySelectorAll('.category-nav a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            if (category) {
                categoryLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                showCategory(category);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    const navMenu = document.getElementById('nav-menu');
                    const hamburger = document.getElementById('hamburger');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (hamburger) hamburger.innerHTML = '☰';
                    }
                }
            }
        });
    });
    
    // Handle hash URLs
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const matchingLink = document.querySelector(`.category-nav a[data-category="${hash}"]`);
        if (matchingLink) {
            // Small delay to ensure DOM is ready
            setTimeout(() => matchingLink.click(), 100);
        }
    }
}

// Display Products for Category (Mobile Optimized)
function displayCategoryProducts(category) {
    let filteredProducts = [...products];
    
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    filteredProducts = applyAdditionalFilters(filteredProducts);
    
    const targetSection = document.getElementById(category);
    if (targetSection) {
        let productsContainer = targetSection.querySelector('.products-grid');
        if (!productsContainer) {
            productsContainer = document.createElement('div');
            productsContainer.className = 'products-grid';
            targetSection.appendChild(productsContainer);
        }
        
        productsContainer.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;">📦</div>
                    <h3 style="font-size: 1.3rem;">No products found</h3>
                    <p style="font-size: 1rem;">Try adjusting your search</p>
                </div>
            `;
            return;
        }
        
        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            productsContainer.innerHTML += productCard;
        });
    }
}

// Create Product Card HTML (Mobile Optimized)
function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} TZS</div>
                <div class="product-meta">
                    <div class="stock-status ${product.stock}">
                        ${product.stock === 'in-stock' ? '✓ In Stock' : 
                          product.stock === 'low-stock' ? '⚠ Low Stock' : 'Available'}
                    </div>
                    <div>🚚 ${product.delivery}</div>
                </div>
            </div>
            <button class="kingu-order-btn" onclick="addToCart(${product.id})">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/shopping-cart.svg" alt="Cart">
                Add to Cart
            </button>
        </div>
    `;
}

// Add to Cart (Mobile Optimized)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCart();
    updateCartCount();
    
    // Mobile-specific feedback
    if (isMobile) {
        // Vibration feedback (if supported)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Visual feedback
        showMobileNotification(`Added ${product.name} to cart!`, 'success');
        
        // Optionally open cart on mobile after adding
        setTimeout(() => {
            if (window.innerWidth <= 768) {
                openCart();
            }
        }, 500);
    } else {
        showNotification(`Added ${product.name} to cart!`, 'success');
    }
}

// Mobile-specific notification
function showMobileNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `mobile-notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 70px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#2e8b57' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        white-space: nowrap;
        max-width: 90vw;
        overflow: hidden;
        text-overflow: ellipsis;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Checkout Cart (Mobile Optimized)
function checkoutCart() {
    if (cart.length === 0) {
        showMobileNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (isMobile) {
        // On mobile, directly open WhatsApp or phone
        const confirmation = confirm("Would you like to place your order via WhatsApp? (Cancel for phone call)");
        
        if (confirmation) {
            placeOrderViaWhatsApp();
        } else {
            placeOrderViaPhone();
        }
    } else {
        // On desktop, show modal
        showOrderConfirmation();
    }
}

// Place Order via Phone (Mobile Optimized)
function placeOrderViaPhone() {
    if (isMobile) {
        // Direct call on mobile
        window.location.href = `tel:${PHONE_NUMBER}`;
    } else {
        // On desktop, show phone number
        showMobileNotification(`Call us at: ${DISPLAY_PHONE}`, 'info');
    }
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCart();
    updateCartCount();
    closeCart();
}

// Place Order via WhatsApp (Mobile Optimized)
function placeOrderViaWhatsApp() {
    let message = `Hello Kingu Electrical! I'd like to order:\n\n`;
    
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace(/,/g, ''));
        message += `${index + 1}. ${item.name} (x${item.quantity}) - ${formatCurrency(price * item.quantity)}\n`;
    });
    
    const subtotal = cart.reduce((total, item) => 
        total + (parseFloat(item.price.replace(/,/g, '')) * item.quantity), 0);
    const delivery = subtotal > 1000000 ? 0 : 25000;
    const total = subtotal + delivery;
    
    message += `\nTotal: ${formatCurrency(total)}\n`;
    message += `Please contact me to confirm.`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    if (isMobile) {
        // Direct WhatsApp app opening on mobile
        window.location.href = whatsappUrl;
    } else {
        // New tab on desktop
        window.open(whatsappUrl, '_blank');
    }
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCart();
    updateCartCount();
    closeCart();
}

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '☰';
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target) && 
            navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== FORM HANDLING (Mobile Optimized) =====
function initFormSubmissions() {
    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // Quick Order Form
    const quickOrderForm = document.getElementById('quickOrderForm');
    if (quickOrderForm) {
        quickOrderForm.addEventListener('submit', handleQuickOrderFormSubmit);
    }

    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Fix form focus on mobile
    fixFormFocus();
}

function fixFormFocus() {
    if (!isMobile) return;
    
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // Scroll input into view
            setTimeout(() => {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    if (isMobile) {
        // On mobile, show simple feedback
        showMobileNotification('Message sent! We\'ll contact you soon.', 'success');
        e.target.reset();
        return;
    }
    
    // Desktop handling remains the same
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <svg class="loading-spinner" width="20" height="20" viewBox="0 0 50 50" style="margin-right: 10px;">
            <circle cx="25" cy="25" r="20" fill="none" stroke="white" stroke-width="4" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 10px;">
                <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Sent!
        `;
        
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            showNotification('✅ Thank you! We will contact you soon.', 'success');
        }, 2000);
    }, 1500);
}

// ===== SCROLL ANIMATIONS (Mobile Optimized) =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length === 0) return;
    
    // Reduce animation intensity on mobile
    const animationSpeed = isMobile ? 0.5 : 0.8;
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${animationSpeed}s ease, transform ${animationSpeed}s ease`;
    });
    
    const fadeInOnScroll = () => {
        fadeElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = isMobile ? 100 : 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Throttle scroll events for mobile performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            fadeInOnScroll();
            scrollTimeout = null;
        }, isMobile ? 100 : 50);
    });
    
    // Initial check
    fadeInOnScroll();
}

// ===== SMOOTH SCROLLING (Mobile Optimized) =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// ===== NOTIFICATIONS =====
function initNotifications() {
    const style = document.createElement('style');
    style.textContent = `
        .notification, .mobile-notification {
            position: fixed;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            color: white;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
        }
        
        .notification {
            top: 100px;
            right: 20px;
            max-width: 300px;
        }
        
        .notification.success {
            background: #2e8b57;
        }
        
        .notification.error {
            background: #e74c3c;
        }
        
        .notification.warning {
            background: #f39c12;
        }
        
        .notification.info {
            background: #3498db;
        }
        
        @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
            .notification {
                top: 70px;
                right: 10px;
                left: 10px;
                max-width: none;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ADDITIONAL ENHANCEMENTS =====

function fixBrokenLinks() {
    // Fix phone number links for mobile
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        const phoneNumber = link.getAttribute('href').replace('tel:', '');
        if (!phoneNumber.startsWith('+255')) {
            link.href = `tel:${PHONE_NUMBER}`;
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Start loading before they become visible
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

function setupOfflineDetection() {
    const statusElement = document.createElement('div');
    statusElement.id = 'offlineStatus';
    statusElement.style.cssText = `
        position: fixed;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #e74c3c;
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 1000;
        display: none;
        text-align: center;
        max-width: 90vw;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(statusElement);
    
    function updateOnlineStatus() {
        if (navigator.onLine) {
            statusElement.style.display = 'none';
        } else {
            statusElement.textContent = '🔴 You are offline. Orders will sync when you reconnect.';
            statusElement.style.display = 'block';
            statusElement.style.background = '#e74c3c';
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
    return amount.toLocaleString('en-TZ') + ' TZS';
}

function showLoader() {
    let loader = document.getElementById('loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            display: none;
        `;
        loader.innerHTML = `
            <div style="text-align: center;">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid var(--primary-green);
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <div style="color: var(--primary-green); font-family: 'Poppins', sans-serif;">
                    Loading...
                </div>
            </div>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
}

function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
}

function handleKeyboardShortcuts(event) {
    // Only on desktop
    if (isMobile) return;
    
    // ESC to close cart
    if (event.key === 'Escape') {
        closeCart();
    }
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar && cartSidebar.classList.contains('open') &&
        !cartSidebar.contains(event.target) && 
        (!cartIcon || !cartIcon.contains(event.target))) {
        closeCart();
    }
});

// Apply additional filters (keep existing logic)
function applyAdditionalFilters(productsList) {
    let filteredProducts = [...productsList];
    
    switch(currentFilter) {
        case 'best':
            filteredProducts = filteredProducts.filter(p => p.badge === 'Best Seller' || p.badge === 'Popular');
            break;
        case 'new':
            filteredProducts = filteredProducts.filter(p => p.id >= 130);
            break;
        case 'stock':
            filteredProducts = filteredProducts.filter(p => p.stock === 'in-stock');
            break;
        case 'install':
            filteredProducts = filteredProducts.filter(p => p.installation === 'Included');
            break;
    }
    
    return filteredProducts;
}

// Setup filters (keep existing logic)
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            displayCategoryProducts(currentCategory);
        });
    });
}

// Setup search (keep existing logic)
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            displayCategoryProducts(currentCategory);
            return;
        }
        
        let filteredProducts = products;
        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === currentCategory);
        }
        
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        
        const targetSection = document.getElementById(currentCategory);
        if (targetSection) {
            let productsContainer = targetSection.querySelector('.products-grid');
            if (!productsContainer) {
                productsContainer = document.createElement('div');
                productsContainer.className = 'products-grid';
                targetSection.appendChild(productsContainer);
            }
            
            productsContainer.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                        <div style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
                        <h3 style="font-size: 1.3rem;">No products found</h3>
                        <p style="font-size: 1rem;">Try different keywords</p>
                    </div>
                `;
                return;
            }
            
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                productsContainer.innerHTML += productCard;
            });
        }
    }, 300));
}

// Debounce function
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

// Show category
function showCategory(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(category);
    if (targetSection) {
        targetSection.classList.add('active');
        displayCategoryProducts(category);
        
        // Smooth scroll to section
        if (window.innerWidth > 768) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Open cart
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('open');
        
        // On mobile, prevent body scroll when cart is open
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }
    }
}

// Close cart
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
        
        // Restore body scroll on mobile
        if (isMobile) {
            document.body.style.overflow = '';
        }
    }
}

// Save cart to storage
function saveCartToStorage() {
    localStorage.setItem('kinguCart', JSON.stringify(cart));
}

// Load cart from storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('kinguCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
            updateCartCount();
        } catch (e) {
            cart = [];
        }
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/,/g, ''));
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${formatCurrency(itemTotal)}</div>
                    <div class="cart-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItems.innerHTML += cartItem;
    });
    
    const delivery = subtotal > 1000000 ? 0 : 25000;
    const installation = cart.some(item => item.installation === 'Included') ? 0 : 
                        cart.some(item => item.installation === 'Extra') ? 50000 : 0;
    const total = subtotal + delivery + installation;
    
    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('cartDelivery');
    const installationEl = document.getElementById('cartInstallation');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
    if (deliveryEl) deliveryEl.textContent = formatCurrency(delivery);
    if (installationEl) installationEl.textContent = formatCurrency(installation);
    if (totalEl) totalEl.textContent = formatCurrency(total);
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCartToStorage();
        updateCart();
        updateCartCount();
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = cartCount;
    }
}

// Booking form initialization
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (!bookingForm) return;
    
    // Set minimum date to today
    const dateInput = bookingForm.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Set default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    // Set default time to 9:00 AM
    const timeInput = bookingForm.querySelector('input[type="time"]');
    if (timeInput) {
        timeInput.value = '09:00';
    }
    
    bookingForm.addEventListener('submit', handleBookingFormSubmit);
}

// Handle booking form submit
function handleBookingFormSubmit(e) {
    e.preventDefault();
    
    if (isMobile) {
        // Simple confirmation on mobile
        showMobileNotification('Inspection scheduled! We\'ll call you soon.', 'success');
        e.target.reset();
        return;
    }
    
    // Desktop handling
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'Scheduling...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = 'Scheduled!';
        
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            showNotification('✅ Inspection scheduled! We\'ll call you soon.', 'success');
        }, 2000);
    }, 1500);
}

// Handle quick order form submit
function handleQuickOrderFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const category = document.getElementById('orderCategory').value;
    const requirements = document.getElementById('orderRequirements').value;
    
    let message = `Hello Kingu Electrical!\n\n`;
    message += `I'm interested in ordering:\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Category: ${category}\n`;
    message += `Requirements: ${requirements}\n\n`;
    message += `Please contact me with options and prices.`;
    
    // Show order confirmation
    if (isMobile) {
        const confirmation = confirm("Send order via WhatsApp? (Cancel for phone call)");
        if (confirmation) {
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            window.location.href = `tel:${PHONE_NUMBER}`;
        }
    } else {
        showOrderConfirmation(message);
    }
    
    e.target.reset();
}

// Show order confirmation
function showOrderConfirmation(message) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            text-align: center;
        ">
            <h3 style="color: var(--primary-green); margin-bottom: 20px;">
                How would you like to order?
            </h3>
            
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="placeOrderViaWhatsApp('${encodeURIComponent(message)}')" style="
                    background: #25D366;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                ">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg" alt="WhatsApp" style="width: 20px;">
                    WhatsApp Order
                </button>
                
                <button onclick="placeOrderViaPhone()" style="
                    background: var(--primary-green);
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                ">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/phone.svg" alt="Phone" style="width: 20px;">
                    Call to Order
                </button>
                
                <button onclick="closeModal()" style="
                    background: transparent;
                    color: #666;
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 10px;
                    font-size: 16px;
                    cursor: pointer;
                ">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    window.closeModal = function() {
        modal.remove();
    };
}

// Reset filters
function resetFilters() {
    const allCategoryLink = document.querySelector('.category-nav a[data-category="all"]');
    if (allCategoryLink) {
        allCategoryLink.click();
    }
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    currentFilter = 'all';
    displayCategoryProducts('all');
}

// Reset filters to category
function resetFiltersToCategory() {
    currentFilter = 'all';
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}
