/**
 * Kingu Electrical Company Website - JavaScript
 * All interactive functionality
 */

// WhatsApp number configuration
const WHATSAPP_NUMBER = '255682843552';
const DISPLAY_NUMBER = '0682 843 552';

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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initFormSubmissions();
    initScrollAnimations();
    initBookingForm();
    initCurrentYear();
    initNotifications();
    initVideoPlayer();
    
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
    
    // Register service worker for PWA
    registerServiceWorker();
    
    // Setup offline detection
    setupOfflineDetection();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Add active state to current section in navigation
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Load products from API if online
    if (navigator.onLine) {
        loadProductsFromAPI();
    }
    
    // Setup keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
});

// ===== E-COMMERCE FUNCTIONALITY =====

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
                window.location.hash = category;
                resetFiltersToCategory();
            }
        });
    });
    
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const matchingLink = document.querySelector(`.category-nav a[data-category="${hash}"]`);
        if (matchingLink) {
            matchingLink.click();
        }
    }
}

// Show Category
function showCategory(category) {
    currentCategory = category;
    
    document.querySelectorAll('.category-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(category);
    if (targetSection) {
        targetSection.classList.add('active');
        displayCategoryProducts(category);
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Display Products for Category
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
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">📦</div>
                    <h3>No products found in this category</h3>
                    <p>Try adjusting your search or filter criteria</p>
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

// Create Product Card HTML
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
                        ${product.stock === 'in-stock' ? 'In Stock' : 
                          product.stock === 'low-stock' ? 'Low Stock' : 'Available'}
                    </div>
                    <div>Delivery: ${product.delivery}</div>
                </div>
            </div>
            <button class="whatsapp-order-btn" onclick="addToCart(${product.id})">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg" alt="WhatsApp">
                Order on WhatsApp
            </button>
        </div>
    `;
}

// Apply Additional Filters
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

// Setup Filters
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

// Setup Search
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
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                        <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;">🔍</div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filter criteria</p>
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

// Debounce function for search
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

// Reset Filters to Category
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

// Reset All Filters
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

// Add to Cart
function addToCart(productId) {
    showLoader();
    
    setTimeout(() => {
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
        showNotification(`Added ${product.name} to cart!`);
        hideLoader();
        
        // Send to service worker for background sync
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CART_UPDATED',
                cart: cart
            });
        }
    }, 300);
}

// Update Cart
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
    
    document.getElementById('cartSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('cartDelivery').textContent = formatCurrency(delivery);
    document.getElementById('cartInstallation').textContent = formatCurrency(installation);
    document.getElementById('cartTotal').textContent = formatCurrency(total);
}

// Update Quantity
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

// Format Currency
function formatCurrency(amount) {
    return amount.toLocaleString('en-TZ') + ' TZS';
}

// Update Cart Count
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = cartCount;
    }
    
    const badge = document.querySelector('.whatsapp-badge');
    if (badge && cartCount > 0) {
        badge.innerHTML = `
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg" alt="WhatsApp">
            <span>${cartCount} items in cart • Chat to order (${DISPLAY_NUMBER})</span>
        `;
    }
}

// Load Cart from Storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('kinguCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
            updateCartCount();
        } catch (e) {
            console.error('Error loading cart from storage:', e);
            cart = [];
        }
    }
}

// Save Cart to Storage
function saveCartToStorage() {
    localStorage.setItem('kinguCart', JSON.stringify(cart));
    
    // Also save for background sync
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SAVE_CART',
            cart: cart
        });
    }
}

// Open Cart
function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('open');
    }
}

// Close Cart
function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

// Checkout Cart
function checkoutCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add some products first.', 'error');
        return;
    }
    
    let message = `Hello Kingu Electrical! I'd like to order the following products:\n\n`;
    
    cart.forEach((item, index) => {
        const price = parseFloat(item.price.replace(/,/g, ''));
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantity: ${item.quantity}\n`;
        message += `   Price per unit: ${item.price} TZS\n`;
        message += `   Subtotal: ${formatCurrency(price * item.quantity)}\n\n`;
    });
    
    const subtotal = cart.reduce((total, item) => 
        total + (parseFloat(item.price.replace(/,/g, '')) * item.quantity), 0);
    const delivery = subtotal > 1000000 ? 0 : 25000;
    const installation = cart.some(item => item.installation === 'Included') ? 0 : 
                        cart.some(item => item.installation === 'Extra') ? 50000 : 0;
    const total = subtotal + delivery + installation;
    
    message += `Order Summary:\n`;
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    if (delivery > 0) message += `Delivery: ${formatCurrency(delivery)}\n`;
    if (installation > 0) message += `Installation: ${formatCurrency(installation)}\n`;
    message += `Total: ${formatCurrency(total)}\n\n`;
    message += `Please contact me to confirm availability and arrange delivery.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Save order for offline sync
    saveOrderForSync({
        cart: cart,
        total: total,
        timestamp: new Date().toISOString()
    });
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after checkout
    cart = [];
    saveCartToStorage();
    updateCart();
    updateCartCount();
    closeCart();
    
    showNotification('Order sent to WhatsApp! We\'ll contact you shortly.');
}

// ===== PWA & OFFLINE FUNCTIONALITY =====

// Register Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Service Worker update found!');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                showNotification('New version available! Refresh to update.', 'info');
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        
        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data.type === 'CART_UPDATED') {
                updateCartCount();
            }
        });
    }
}

// Setup Offline Detection
function setupOfflineDetection() {
    function updateOnlineStatus() {
        const status = document.getElementById('onlineStatus');
        if (status) {
            if (navigator.onLine) {
                status.textContent = '🟢 Online';
                status.style.color = 'var(--success)';
                showNotification('Back online!', 'success');
            } else {
                status.textContent = '🔴 Offline - Order will sync when online';
                status.style.color = 'var(--danger)';
                showNotification('You are offline. Orders will sync when you reconnect.', 'warning');
            }
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

// Load Products from API
async function loadProductsFromAPI() {
    try {
        showLoader();
        const response = await fetch('/api/products');
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const apiProducts = await response.json();
        
        // Merge with local products
        if (apiProducts && apiProducts.length > 0) {
            // Update products array with API data
            // In a real app, you would properly merge and update
            console.log('Loaded products from API:', apiProducts.length);
            
            // Update UI if needed
            if (currentCategory !== 'all') {
                displayCategoryProducts(currentCategory);
            }
        }
    } catch (error) {
        console.log('Using cached products:', error.message);
    } finally {
        hideLoader();
    }
}

// Save Order for Offline Sync
function saveOrderForSync(order) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Save order to IndexedDB
            saveOrderToIndexedDB(order).then(() => {
                // Register for sync
                return registration.sync.register('sync-orders');
            }).then(() => {
                console.log('Order saved for sync');
            }).catch(err => {
                console.error('Failed to save order for sync:', err);
            });
        });
    }
}

// Save Order to IndexedDB
function saveOrderToIndexedDB(order) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguOrders', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('orders')) {
                db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['orders'], 'readwrite');
            const store = transaction.objectStore('orders');
            const addRequest = store.add(order);
            
            addRequest.onsuccess = function() {
                resolve();
            };
            
            addRequest.onerror = function() {
                reject(addRequest.error);
            };
        };
        
        request.onerror = function() {
            reject(request.error);
        };
    });
}

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '☰';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// ===== FORM HANDLING =====
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
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <svg class="loading-spinner" width="20" height="20" viewBox="0 0 50 50" style="margin-right: 10px;">
            <circle cx="25" cy="25" r="20" fill="none" stroke="white" stroke-width="4" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
        Sending...
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    
    // Simulate API call (replace with actual Formspree submission)
    setTimeout(() => {
        // Success message
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 10px;">
                <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Message Sent!
        `;
        submitBtn.style.background = '#2e8b57';
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
            
            // Show success notification
            showNotification('✅ Thank you! We will contact you within 24 hours.', 'success');
        }, 3000);
    }, 1500);
}

function handleQuickOrderFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const category = document.getElementById('orderCategory').value;
    const requirements = document.getElementById('orderRequirements').value;
    
    let message = `Hello Kingu Electrical!\n\n`;
    message += `I'm interested in ordering electrical products.\n\n`;
    message += `Customer Details:\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Product Category: ${category}\n`;
    message += `Requirements: ${requirements}\n\n`;
    message += `Please contact me with available options and prices.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    e.target.reset();
    showNotification('Quick order sent! We\'ll contact you on WhatsApp.');
}

// ===== BOOKING FORM =====
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

function handleBookingFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = `
        <svg class="loading-spinner" width="20" height="20" viewBox="0 0 50 50" style="margin-right: 10px;">
            <circle cx="25" cy="25" r="20" fill="none" stroke="white" stroke-width="4" stroke-linecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
            </circle>
        </svg>
        Scheduling...
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    
    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name') || 'Customer';
    const phone = formData.get('phone') || '';
    const email = formData.get('email') || '';
    const service = form.querySelector('select').value;
    const date = formData.get('date') || '';
    const time = formData.get('time') || '';
    
    // Simulate API call
    setTimeout(() => {
        // Success message
        submitBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right: 10px;">
                <path d="M20 6L9 17L4 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Scheduled!
        `;
        submitBtn.style.background = '#2e8b57';
        
        // Create WhatsApp message
        const whatsappMessage = `Hi! I booked a site inspection:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}`;
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
            
            // Show success notification with WhatsApp option
            showNotificationWithAction(
                '✅ Inspection Scheduled! We\'ll call you to confirm.',
                'Send details via WhatsApp',
                `https://wa.me/255677014740?text=${encodeURIComponent(whatsappMessage)}`
            );
        }, 3000);
    }, 1500);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Initialize fade elements
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    const fadeInOnScroll = () => {
        fadeElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.animationDelay = `${index * 0.1}s`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Check on load and scroll
    window.addEventListener('load', fadeInOnScroll);
    window.addEventListener('scroll', fadeInOnScroll);
    
    // Initial check
    fadeInOnScroll();
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
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
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 30px;
            padding: 20px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.5s ease;
            max-width: 400px;
            color: white;
            font-family: 'Roboto', sans-serif;
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
        
        .notification-info {
            background: #3498db;
        }
        
        .notification a {
            color: white;
            text-decoration: underline;
            display: inline-block;
            margin-top: 10px;
            font-weight: 600;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .loading-spinner circle {
            animation: rotate 1s linear infinite;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

function showNotificationWithAction(message, actionText, actionUrl) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <strong>${message}</strong><br>
        <a href="${actionUrl}" target="_blank">${actionText}</a>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 7000);
}

// ===== VIDEO PLAYER =====
function initVideoPlayer() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            // Replace with actual video embed
            const videoUrl = 'https://www.youtube.com/embed/YOUR_VIDEO_ID';
            videoPlaceholder.innerHTML = `
                <iframe width="100%" height="450" src="${videoUrl}" 
                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
                    encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                </iframe>
            `;
        });
    }
}

// ===== ADDITIONAL ENHANCEMENTS =====

// Fix all broken links
function fixBrokenLinks() {
    document.querySelectorAll('a[href*="kinguelectrical.com"]').forEach(link => {
        link.href = link.href.replace('kinguelectrical.com', 'kingueletrical.com');
    });
    
    const backLink = document.querySelector('.back-to-main');
    if (backLink) {
        backLink.href = 'https://kingueletrical.com';
        backLink.target = '_blank';
    }
    
    document.querySelectorAll('a[href*="mailto"]').forEach(link => {
        link.href = 'mailto:kinguelectricaltz@gmail.com';
    });
    
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.href = `https://wa.me/${WHATSAPP_NUMBER}`;
        link.target = '_blank';
    });
    
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.href = `tel:${DISPLAY_NUMBER.replace(/\s/g, '')}`;
    });
}

// Add active state to current section in navigation
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 150) {
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

// Add intersection observer for lazy loading images
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
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Show Loader
function showLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('show');
    }
}

// Hide Loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.remove('show');
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // ESC to close cart
    if (event.key === 'Escape') {
        closeCart();
    }
    
    // Ctrl/Cmd + K to search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar && cartSidebar.classList.contains('open') &&
        !cartSidebar.contains(event.target) && 
        !cartIcon.contains(event.target)) {
        closeCart();
    }
});

// Install PWA prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button
    const installButton = document.createElement('button');
    installButton.innerHTML = '📱 Install App';
    installButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--primary-green);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 25px;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            installButton.remove();
        });
    });
    
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.style.opacity = '0';
            setTimeout(() => installButton.remove(), 300);
        }
    }, 10000);
});
