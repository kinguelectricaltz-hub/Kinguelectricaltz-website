/**
 * Service Worker for Kingu Electrical Website
 * Enhanced with Kingu Electrical Shop support and advanced caching
 */

const CACHE_NAME = 'kingu-electrical-v5.0';
const OFFLINE_CACHE = 'kingu-offline-v2';
const KINGU_SHOP_CACHE = 'kingu-shop-v1';
const DYNAMIC_CACHE = 'kingu-dynamic-v2';
const STATIC_CACHE = 'kingu-static-v2';
const PRODUCT_IMAGES_CACHE = 'kingu-images-v2';

// Core assets that should be cached immediately
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/Kinguelectrical-shop.html',
    '/offline.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/shop-manifest.json',
    '/service-worker-shop.js'
];

// Static assets (icons, logos, fonts)
const STATIC_ASSETS = [
    '/assets/icons/favicon.svg',
    '/assets/icons/shop.svg',
    '/assets/icons/company-logo.svg',
    '/assets/icons/icon-72.png',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/assets/icons/shopping-cart.svg',
    '/assets/icons/email.svg',
    '/assets/icons/phone.svg',
    '/assets/icons/location.svg',
    '/assets/icons/send.svg',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
    'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/phone.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/shopping-cart.svg',
    'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/send.svg'
];

// Product images to cache
const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing v5.0...');
    
    event.waitUntil(
        Promise.all([
            // Cache core assets
            caches.open(CACHE_NAME)
                .then(cache => {
                    console.log('[Service Worker] Caching core assets');
                    return cache.addAll(CORE_ASSETS);
                }),
            
            // Cache static assets
            caches.open(STATIC_CACHE)
                .then(cache => {
                    console.log('[Service Worker] Caching static assets');
                    return cache.addAll(STATIC_ASSETS);
                }),
            
            // Cache product images
            caches.open(PRODUCT_IMAGES_CACHE)
                .then(cache => {
                    console.log('[Service Worker] Caching product images');
                    return Promise.all(
                        PRODUCT_IMAGES.map(url => {
                            return fetch(url)
                                .then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response);
                                    }
                                    throw new Error(`Failed to fetch: ${url}`);
                                })
                                .catch(err => {
                                    console.warn('[Service Worker] Failed to cache image:', url, err);
                                    return Promise.resolve();
                                });
                        })
                    );
                }),
            
            // Cache offline page
            caches.open(OFFLINE_CACHE)
                .then(cache => cache.add('/offline.html')),
            
            // Cache Kingu Electrical Shop data
            caches.open(KINGU_SHOP_CACHE)
                .then(cache => {
                    console.log('[Service Worker] Setting up Kingu Electrical Shop cache');
                    return cache.put('/kingu-shop-data', new Response(JSON.stringify({
                        version: '1.0',
                        lastUpdated: new Date().toISOString(),
                        message: 'Kingu Electrical Shop Data Cache'
                    }), {
                        headers: { 'Content-Type': 'application/json' }
                    }));
                })
        ]).then(() => {
            console.log('[Service Worker] All assets cached successfully');
            return self.skipWaiting();
        }).catch(error => {
            console.error('[Service Worker] Installation failed:', error);
            throw error;
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating v5.0...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches (not in current list)
                    if (![CACHE_NAME, STATIC_CACHE, PRODUCT_IMAGES_CACHE, OFFLINE_CACHE, DYNAMIC_CACHE, KINGU_SHOP_CACHE].includes(cacheName)) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
        }).then(() => {
            // Run health check after activation
            return healthCheck();
        })
    );
});

// Enhanced fetch event with different strategies
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || requestUrl.protocol === 'chrome-extension:') {
        return;
    }
    
    // Skip analytics and tracking requests
    if (requestUrl.hostname.includes('google-analytics') || 
        requestUrl.hostname.includes('facebook.com') ||
        requestUrl.hostname.includes('googletagmanager')) {
        return;
    }
    
    // Handle different strategies based on request type
    if (requestUrl.origin === location.origin) {
        // Same-origin requests
        if (event.request.destination === 'document' || 
            event.request.headers.get('accept')?.includes('text/html')) {
            // HTML pages - Network First, Cache Fallback
            event.respondWith(networkFirstWithOfflineFallback(event));
        } else if (event.request.destination === 'style' || 
                   event.request.destination === 'script' ||
                   requestUrl.pathname.endsWith('.css') ||
                   requestUrl.pathname.endsWith('.js')) {
            // CSS & JS - Cache First, Network Fallback
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else if (event.request.destination === 'image') {
            // Images - Cache First, Network Fallback
            event.respondWith(imageCacheStrategy(event));
        } else if (requestUrl.pathname === '/Kinguelectrical-shop.html' ||
                   requestUrl.pathname === '/kingu-shop-data') {
            // Kingu Electrical Shop specific handling
            event.respondWith(kinguShopStrategy(event));
        } else {
            // Other resources - Network First
            event.respondWith(networkFirstWithCacheFallback(event));
        }
    } else {
        // Cross-origin requests
        if (event.request.destination === 'image' || 
            requestUrl.hostname.includes('unsplash.com') ||
            requestUrl.hostname.includes('cdn.jsdelivr.net')) {
            // External images - Cache First
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else if (requestUrl.hostname.includes('fonts.googleapis.com') ||
                   requestUrl.hostname.includes('fonts.gstatic.com')) {
            // Fonts - Cache First
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else {
            // Other external resources - Network only
            return;
        }
    }
});

// Kingu Electrical Shop specific strategy
async function kinguShopStrategy(event) {
    const requestUrl = new URL(event.request.url);
    
    try {
        // Always try network first for shop page
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(KINGU_SHOP_CACHE);
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('[Service Worker] Kingu Shop fetch failed, trying cache:', error);
        
        // Try cache
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // For shop page, return offline version
        if (requestUrl.pathname === '/Kinguelectrical-shop.html') {
            const shopOfflineResponse = await caches.match('/offline-shop.html');
            if (shopOfflineResponse) return shopOfflineResponse;
        }
        
        // Return generic offline page
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) return offlineResponse;
        
        throw error;
    }
}

// Cache strategies
async function cacheFirstWithNetworkFallback(event) {
    try {
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            // Update cache in background
            event.waitUntil(
                updateCache(event.request).catch(() => {})
            );
            return cachedResponse;
        }
        
        const networkResponse = await fetch(event.request);
        
        // Cache the response if valid
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[Service Worker] Cache first failed:', error);
        
        // Return offline page for HTML requests
        if (event.request.headers.get('accept')?.includes('text/html')) {
            const offlineResponse = await caches.match('/offline.html');
            if (offlineResponse) return offlineResponse;
        }
        
        // Return generic error for other requests
        return new Response('Network error occurred', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

async function networkFirstWithCacheFallback(event) {
    try {
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('[Service Worker] Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // For HTML, return offline page
        if (event.request.headers.get('accept')?.includes('text/html')) {
            const offlineResponse = await caches.match('/offline.html');
            if (offlineResponse) return offlineResponse;
        }
        
        throw error;
    }
}

async function networkFirstWithOfflineFallback(event) {
    try {
        // Try network first
        const networkResponse = await fetch(event.request);
        
        // Update cache in background
        event.waitUntil(
            updateCache(event.request, networkResponse.clone()).catch(() => {})
        );
        
        return networkResponse;
    } catch (error) {
        console.warn('[Service Worker] Network failed for HTML, trying cache:', error);
        
        // Try cache
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        const offlineResponse = await caches.match('/offline.html');
        if (offlineResponse) return offlineResponse;
        
        // Create a basic offline response
        return new Response(
            '<h1>Offline</h1><p>Please check your internet connection.</p>',
            { 
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
}

async function imageCacheStrategy(event) {
    const requestUrl = event.request.url;
    
    try {
        // Try cache first for images
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
            // Background update
            event.waitUntil(
                fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            return caches.open(PRODUCT_IMAGES_CACHE)
                                .then(cache => cache.put(event.request, response));
                        }
                    })
                    .catch(() => {}) // Silent fail for background update
            );
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        const networkResponse = await fetch(event.request);
        
        // Cache image if successful
        if (networkResponse.status === 200) {
            const cache = await caches.open(PRODUCT_IMAGES_CACHE);
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('[Service Worker] Image fetch failed:', error);
        
        // Return placeholder for product images
        if (PRODUCT_IMAGES.includes(requestUrl)) {
            const placeholder = await caches.match(PRODUCT_IMAGES[0]);
            if (placeholder) return placeholder;
        }
        
        // Return generic image placeholder
        return new Response(
            '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial">Image not available</text></svg>',
            { 
                status: 200,
                headers: { 'Content-Type': 'image/svg+xml' }
            }
        );
    }
}

// Update cache in background
async function updateCache(request, response = null) {
    try {
        if (!response) {
            response = await fetch(request);
        }
        
        if (response.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(request, response);
        }
    } catch (error) {
        console.warn('[Service Worker] Background cache update failed:', error);
    }
}

// Background sync for form submissions and orders
self.addEventListener('sync', event => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'kingu-order-sync') {
        event.waitUntil(syncKinguOrders());
    } else if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForms());
    } else if (event.tag === 'shop-cart-sync') {
        event.waitUntil(syncShopCart());
    }
});

// Kingu Electrical order sync
async function syncKinguOrders() {
    try {
        const db = await openOrderDatabase();
        const orders = await getAllOrders(db);
        
        for (const order of orders) {
            if (!order.synced) {
                try {
                    // For Kingu Electrical, we could sync with multiple channels
                    const syncedChannels = [];
                    
                    // Phone order sync
                    if (order.contactMethod === 'phone' || !order.contactMethod) {
                        syncedChannels.push('phone');
                    }
                    
                    // WhatsApp order sync (backup)
                    if (order.contactMethod === 'whatsapp' || !order.contactMethod) {
                        syncedChannels.push('whatsapp');
                    }
                    
                    order.synced = true;
                    order.syncedChannels = syncedChannels;
                    order.syncedAt = new Date().toISOString();
                    await updateOrder(db, order);
                    
                    console.log('[Service Worker] Kingu order synced via:', syncedChannels, order.id);
                } catch (error) {
                    console.error('[Service Worker] Failed to sync order:', error);
                    throw error; // Retry on next sync
                }
            }
        }
    } catch (error) {
        console.error('[Service Worker] Order sync failed:', error);
        throw error;
    }
}

// Shop cart sync
async function syncShopCart() {
    try {
        // Get cart from IndexedDB or localStorage
        const cartData = await getShopCartData();
        
        if (cartData && cartData.items && cartData.items.length > 0) {
            // Sync cart to server or other storage
            console.log('[Service Worker] Syncing shop cart:', cartData.items.length, 'items');
            
            // Mark as synced
            await markCartAsSynced(cartData);
        }
    } catch (error) {
        console.error('[Service Worker] Shop cart sync failed:', error);
        throw error;
    }
}

// Contact form sync
async function syncContactForms() {
    try {
        const db = await openFormDatabase();
        const forms = await getAllForms(db);
        
        for (const form of forms) {
            if (!form.synced) {
                try {
                    form.synced = true;
                    form.syncedAt = new Date().toISOString();
                    await updateForm(db, form);
                    
                    console.log('[Service Worker] Form synced:', form.id);
                } catch (error) {
                    console.error('[Service Worker] Failed to sync form:', error);
                    throw error;
                }
            }
        }
    } catch (error) {
        console.error('[Service Worker] Form sync failed:', error);
        throw error;
    }
}

// IndexedDB setup for offline data
async function openOrderDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('kinguOrders', 2);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('orders')) {
                const store = db.createObjectStore('orders', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                store.createIndex('synced', 'synced', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
                store.createIndex('contactMethod', 'contactMethod', { unique: false });
            }
            
            // Version 2 upgrade: add syncedChannels field
            if (event.oldVersion < 2) {
                const transaction = event.currentTarget.transaction;
                const store = transaction.objectStore('orders');
                if (!store.indexNames.contains('syncedChannels')) {
                    // Can't modify existing indexes in this way, but we can handle in code
                }
            }
        };
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(new Error('IndexedDB error: ' + event.target.error));
        };
    });
}

// Database helper functions
async function getAllOrders(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readonly');
        const store = transaction.objectStore('orders');
        const request = store.getAll();
        
        request.onsuccess = function(event) {
            resolve(event.target.result || []);
        };
        
        request.onerror = function(event) {
            reject(new Error('Get orders error: ' + event.target.error));
        };
    });
}

async function updateOrder(db, order) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.put(order);
        
        request.onsuccess = function() {
            resolve();
        };
        
        request.onerror = function(event) {
            reject(new Error('Update order error: ' + event.target.error));
        };
    });
}

// Shop cart data management
async function getShopCartData() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('kinguShop', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('cart')) {
                const store = db.createObjectStore('cart', { 
                    keyPath: 'id'
                });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['cart'], 'readonly');
            const store = transaction.objectStore('cart');
            const request = store.get('current');
            
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            
            request.onerror = function(event) {
                reject(new Error('Get cart error: ' + event.target.error));
            };
        };
        
        request.onerror = function(event) {
            reject(new Error('IndexedDB error: ' + event.target.error));
        };
    });
}

async function markCartAsSynced(cartData) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('kinguShop', 1);
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            
            cartData.synced = true;
            cartData.syncedAt = new Date().toISOString();
            
            const putRequest = store.put(cartData);
            
            putRequest.onsuccess = function() {
                resolve();
            };
            
            putRequest.onerror = function(event) {
                reject(new Error('Update cart error: ' + event.target.error));
            };
        };
        
        request.onerror = function(event) {
            reject(new Error('IndexedDB error: ' + event.target.error));
        };
    });
}

async function openFormDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('kinguForms', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('forms')) {
                const store = db.createObjectStore('forms', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                store.createIndex('synced', 'synced', { unique: false });
            }
        };
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(new Error('IndexedDB error: ' + event.target.error));
        };
    });
}

async function getAllForms(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['forms'], 'readonly');
        const store = transaction.objectStore('forms');
        const request = store.getAll();
        
        request.onsuccess = function(event) {
            resolve(event.target.result || []);
        };
        
        request.onerror = function(event) {
            reject(new Error('Get forms error: ' + event.target.error));
        };
    });
}

async function updateForm(db, form) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['forms'], 'readwrite');
        const store = transaction.objectStore('forms');
        const request = store.put(form);
        
        request.onsuccess = function() {
            resolve();
        };
        
        request.onerror = function(event) {
            reject(new Error('Update form error: ' + event.target.error));
        };
    });
}

// Push notifications
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received:', event);
    
    let notificationData = {
        title: 'Kingu Electrical',
        body: 'New update from Kingu Electrical',
        icon: '/assets/icons/icon-192.png',
        badge: '/assets/icons/icon-72.png',
        data: {
            url: '/',
            timestamp: Date.now()
        }
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            notificationData.body = event.data.text() || notificationData.body;
        }
    }
    
    const options = {
        body: notificationData.body,
        icon: notificationData.icon,
        badge: notificationData.badge,
        tag: 'kingu-notification',
        renotify: true,
        data: notificationData.data,
        actions: [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'view' || event.action === '') {
        const urlToOpen = event.notification.data?.url || '/';
        
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(windowClients => {
                // Check if there's already a window/tab open
                for (const client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Open new window if none exists
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
        );
    }
});

// Message handler for communication with pages
self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'CACHE_PRODUCTS') {
        event.waitUntil(cacheProducts(event.data.products));
    } else if (event.data && event.data.type === 'GET_CACHE_INFO') {
        event.ports[0].postMessage({
            cacheNames: Array.from(caches.keys()),
            version: '5.0',
            status: 'active'
        });
    } else if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(clearCache(event.data.cacheName));
    } else if (event.data && event.data.type === 'HEALTH_CHECK') {
        healthCheck().then(status => {
            event.ports[0].postMessage({ status });
        });
    } else if (event.data && event.data.type === 'SAVE_CART') {
        event.waitUntil(saveCartToDB(event.data.cart));
    }
});

// Save cart to IndexedDB
async function saveCartToDB(cartData) {
    try {
        const request = indexedDB.open('kinguShop', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('cart')) {
                db.createObjectStore('cart', { keyPath: 'id' });
            }
        };
        
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['cart'], 'readwrite');
            const store = transaction.objectStore('cart');
            
            const cartRecord = {
                id: 'current',
                items: cartData,
                timestamp: new Date().toISOString(),
                synced: false
            };
            
            store.put(cartRecord);
        };
        
        request.onerror = function(event) {
            console.error('[Service Worker] Failed to save cart:', event.target.error);
        };
    } catch (error) {
        console.error('[Service Worker] Cart save failed:', error);
    }
}

// Cache products on demand
async function cacheProducts(products) {
    if (!products || !Array.isArray(products)) return;
    
    const cache = await caches.open(KINGU_SHOP_CACHE);
    
    for (const product of products) {
        if (product.imageUrl) {
            try {
                const response = await fetch(product.imageUrl);
                if (response.ok) {
                    await cache.put(product.imageUrl, response);
                }
            } catch (error) {
                console.warn('[Service Worker] Failed to cache product image:', error);
            }
        }
    }
}

// Clear specific cache
async function clearCache(cacheName) {
    try {
        const deleted = await caches.delete(cacheName);
        console.log(`[Service Worker] Cache ${cacheName} ${deleted ? 'deleted' : 'not found'}`);
        return deleted;
    } catch (error) {
        console.error('[Service Worker] Failed to clear cache:', error);
        return false;
    }
}

// Health check function
async function healthCheck() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        const criticalAssets = ['/', '/index.html', '/offline.html', '/Kinguelectrical-shop.html'];
        let missingAssets = [];
        
        for (const asset of criticalAssets) {
            const response = await cache.match(asset);
            if (!response) {
                missingAssets.push(asset);
                // Attempt to re-cache
                try {
                    await cache.add(asset);
                } catch (err) {
                    console.error(`[Service Worker] Failed to re-cache ${asset}:`, err);
                }
            }
        }
        
        const status = {
            healthy: missingAssets.length === 0,
            cacheSize: keys.length,
            missingAssets: missingAssets,
            timestamp: new Date().toISOString()
        };
        
        console.log('[Service Worker] Health check:', status);
        return status;
    } catch (error) {
        console.error('[Service Worker] Health check failed:', error);
        return {
            healthy: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Version tracking
const SERVICE_WORKER_VERSION = '5.0.0';

// Broadcast update to all clients
function broadcastUpdate() {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'SERVICE_WORKER_UPDATE',
                version: SERVICE_WORKER_VERSION,
                timestamp: new Date().toISOString(),
                shopUrl: '/Kinguelectrical-shop.html'
            });
        });
    });
}

// Initial broadcast
self.addEventListener('activate', (event) => {
    event.waitUntil(
        self.clients.claim().then(() => {
            setTimeout(broadcastUpdate, 1000);
        })
    );
});

// Error handling
self.addEventListener('error', event => {
    console.error('[Service Worker] Error:', event.error);
    // Report error to analytics if available
});

self.addEventListener('unhandledrejection', event => {
    console.error('[Service Worker] Unhandled rejection:', event.reason);
});

// Periodic cleanup (every 30 days)
const CLEANUP_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

async function periodicCleanup() {
    const now = Date.now();
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const dateHeader = response.headers.get('date');
            if (dateHeader) {
                const cachedDate = new Date(dateHeader).getTime();
                if (now - cachedDate > CLEANUP_INTERVAL) {
                    await cache.delete(request);
                }
            }
        }
    }
}

// Run cleanup on activation and periodically
self.addEventListener('activate', (event) => {
    event.waitUntil(periodicCleanup());
    // Set up periodic cleanup
    setInterval(periodicCleanup, CLEANUP_INTERVAL);
});

console.log(`[Service Worker] Version ${SERVICE_WORKER_VERSION} loaded`);
