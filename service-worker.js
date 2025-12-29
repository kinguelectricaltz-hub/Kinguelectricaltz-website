/**
 * Service Worker for Kingu Electrical Website
 * Enhanced with WhatsApp Shop support and advanced caching
 */

const CACHE_NAME = 'kingu-electrical-v3.1';
const OFFLINE_CACHE = 'kingu-offline-v1';
const WHATSAPP_SHOP_CACHE = 'whatsapp-shop-v1';
const DYNAMIC_CACHE = 'kingu-dynamic-v1';

// Core assets that should be cached immediately
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/whatsapp-shop.html',
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
    '/assets/icons/whatsapp.svg',
    '/assets/icons/company-logo.svg',
    '/assets/icons/icon-72.png',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png',
    '/assets/icons/shopping-cart.svg',
    '/assets/icons/email.svg',
    '/assets/icons/phone.svg',
    '/assets/icons/location.svg',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
    'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/whatsapp.svg'
];

// Product images to cache
const PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&w=400&h=300&fit=crop&q=80'
];

// Install event - cache essential files
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    
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
                                .then(response => cache.put(url, response))
                                .catch(err => console.log('Failed to cache:', url, err));
                        })
                    );
                }),
            
            // Cache offline page
            caches.open(OFFLINE_CACHE)
                .then(cache => cache.add('/offline.html'))
        ]).then(() => {
            console.log('[Service Worker] All assets cached');
            return self.skipWaiting();
        }).catch(error => {
            console.error('[Service Worker] Installation failed:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Delete old caches
                    if (![CACHE_NAME, STATIC_CACHE, PRODUCT_IMAGES_CACHE, OFFLINE_CACHE, DYNAMIC_CACHE, WHATSAPP_SHOP_CACHE].includes(cacheName)) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
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
    
    // Handle different strategies based on request type
    if (requestUrl.origin === location.origin) {
        // Same-origin requests
        if (event.request.destination === 'document') {
            // HTML pages - Network First, Cache Fallback
            event.respondWith(networkFirstWithOfflineFallback(event));
        } else if (event.request.destination === 'style' || 
                   event.request.destination === 'script' ||
                   event.request.url.includes('styles.css') ||
                   event.request.url.includes('script.js')) {
            // CSS & JS - Cache First, Network Fallback
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else if (event.request.destination === 'image') {
            // Images - Cache First, Network Fallback
            event.respondWith(imageCacheStrategy(event));
        } else {
            // Other resources - Network First
            event.respondWith(networkFirstWithCacheFallback(event));
        }
    } else {
        // Cross-origin requests
        if (event.request.destination === 'image' || 
            event.request.url.includes('unsplash.com') ||
            event.request.url.includes('cdn.jsdelivr.net')) {
            // External images - Cache First
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else if (event.request.url.includes('fonts.googleapis.com') ||
                   event.request.url.includes('fonts.gstatic.com')) {
            // Fonts - Cache First
            event.respondWith(cacheFirstWithNetworkFallback(event));
        } else {
            // Other external resources - Network only
            return;
        }
    }
});

// Cache strategies
async function cacheFirstWithNetworkFallback(event) {
    const cachedResponse = await caches.match(event.request);
    
    if (cachedResponse) {
        // Update cache in background
        event.waitUntil(
            updateCache(event.request).catch(() => {})
        );
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(event.request);
        
        // Cache the response if valid
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return offline page for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
        }
        
        // Return generic error for other requests
        return new Response('Network error happened', {
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
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // For HTML, return offline page
        if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
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
        // Try cache
        const cachedResponse = await caches.match(event.request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        return caches.match('/offline.html');
    }
}

async function imageCacheStrategy(event) {
    const requestUrl = new URL(event.request.url);
    const cache = await caches.open(PRODUCT_IMAGES_CACHE);
    const cachedResponse = await cache.match(event.request);
    
    // If image is in cache and it's from our product images, return it
    if (cachedResponse && PRODUCT_IMAGES.includes(requestUrl.href)) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(event.request);
        
        // Cache image if it's from our domain or unsplash
        if (networkResponse.status === 200 && 
            (requestUrl.origin === location.origin || 
             requestUrl.hostname.includes('unsplash.com'))) {
            await cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return cached response if available
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return placeholder image for product images
        if (PRODUCT_IMAGES.includes(requestUrl.href)) {
            return caches.match(PRODUCT_IMAGES[0]);
        }
        
        throw error;
    }
}

// Update cache in background
async function updateCache(request, response) {
    if (!response) {
        response = await fetch(request);
    }
    
    if (response.status === 200) {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(request, response);
    }
}

// Background sync for form submissions and orders
self.addEventListener('sync', event => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'whatsapp-order-sync') {
        event.waitUntil(syncWhatsAppOrders());
    } else if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForms());
    } else if (event.tag === 'product-view-sync') {
        event.waitUntil(syncProductViews());
    }
});

// WhatsApp order sync
async function syncWhatsAppOrders() {
    const db = await openOrderDatabase();
    const orders = await getAllOrders(db);
    
    for (const order of orders) {
        if (!order.synced) {
            try {
                // Send order to server/API
                await sendOrderToServer(order);
                
                // Mark as synced
                order.synced = true;
                await updateOrder(db, order);
                
                console.log('[Service Worker] Order synced:', order.id);
            } catch (error) {
                console.error('[Service Worker] Failed to sync order:', error);
                throw error; // Retry on next sync
            }
        }
    }
}

// Contact form sync
async function syncContactForms() {
    const db = await openFormDatabase();
    const forms = await getAllForms(db);
    
    for (const form of forms) {
        if (!form.synced) {
            try {
                // Send form data to server
                await sendFormToServer(form);
                
                // Mark as synced
                form.synced = true;
                await updateForm(db, form);
                
                console.log('[Service Worker] Form synced:', form.id);
            } catch (error) {
                console.error('[Service Worker] Failed to sync form:', error);
                throw error;
            }
        }
    }
}

// Product view sync
async function syncProductViews() {
    const db = await openAnalyticsDatabase();
    const views = await getAllProductViews(db);
    
    for (const view of views) {
        try {
            // Send analytics data
            await sendAnalyticsData(view);
            
            // Remove after successful sync
            await deleteProductView(db, view.id);
            
            console.log('[Service Worker] Product view synced:', view.id);
        } catch (error) {
            console.error('[Service Worker] Failed to sync product view:', error);
            throw error;
        }
    }
}

// IndexedDB setup for offline data
async function openOrderDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('kinguOrders', 1);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('orders')) {
                const store = db.createObjectStore('orders', { keyPath: 'id' });
                store.createIndex('synced', 'synced', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        
        request.onsuccess = function(event) {
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
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
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            reject(event.target.error);
        };
    });
}

// Periodic sync for price updates and notifications
self.addEventListener('periodicsync', event => {
    console.log('[Service Worker] Periodic sync:', event.tag);
    
    if (event.tag === 'price-update-sync') {
        event.waitUntil(checkForPriceUpdates());
    } else if (event.tag === 'notification-check') {
        event.waitUntil(checkForNotifications());
    }
});

// Check for price updates
async function checkForPriceUpdates() {
    try {
        const response = await fetch('/api/prices/latest', {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (response.ok) {
            const priceData = await response.json();
            
            // Store updated prices
            await storePriceUpdates(priceData);
            
            // Notify user if prices changed significantly
            const shouldNotify = await checkForSignificantChanges(priceData);
            
            if (shouldNotify) {
                await showPriceUpdateNotification();
            }
        }
    } catch (error) {
        console.error('[Service Worker] Failed to check price updates:', error);
    }
}

// Show notification for price updates
async function showPriceUpdateNotification() {
    const clients = await self.clients.matchAll();
    
    if (clients.length > 0) {
        // Send message to clients
        clients.forEach(client => {
            client.postMessage({
                type: 'PRICE_UPDATE',
                message: 'Product prices have been updated'
            });
        });
    } else {
        // Show notification
        self.registration.showNotification('Price Update', {
            body: 'Some product prices have been updated. Check the WhatsApp shop for latest prices.',
            icon: '/assets/icons/icon-192.png',
            badge: '/assets/icons/badge-72.png',
            tag: 'price-update',
            renotify: true,
            actions: [
                { action: 'view', title: 'View Shop' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        });
    }
}

// Push notifications
self.addEventListener('push', event => {
    console.log('[Service Worker] Push received:', event);
    
    let data = {};
    
    if (event.data) {
        try {
            data = event.data.json();
        } catch (error) {
            data = {
                title: 'Kingu Electrical',
                body: event.data.text() || 'New update available',
                icon: '/assets/icons/icon-192.png'
            };
        }
    }
    
    const options = {
        body: data.body || 'New message from Kingu Electrical',
        icon: data.icon || '/assets/icons/icon-192.png',
        badge: '/assets/icons/badge-72.png',
        tag: data.tag || 'kingu-notification',
        data: {
            url: data.url || '/',
            timestamp: Date.now()
        },
        actions: data.actions || [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Kingu Electrical', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click:', event.notification.tag);
    
    event.notification.close();
    
    if (event.action === 'view' || event.action === '') {
        // Open the URL from notification data
        const urlToOpen = event.notification.data.url || '/';
        
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then(windowClients => {
                // Check if there's already a window open
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
    } else if (event.action === 'dismiss') {
        // Notification dismissed, do nothing
        console.log('[Service Worker] Notification dismissed');
    }
});

// Message handler for communication with pages
self.addEventListener('message', event => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'CACHE_PRODUCTS') {
        // Cache products on demand
        event.waitUntil(cacheProducts(event.data.products));
    } else if (event.data && event.data.type === 'GET_CACHE_INFO') {
        // Send cache information back
        event.ports[0].postMessage({
            cacheNames: Array.from(caches.keys())
        });
    } else if (event.data && event.data.type === 'CLEAR_CACHE') {
        // Clear specific cache
        event.waitUntil(clearCache(event.data.cacheName));
    }
});

// Cache products on demand
async function cacheProducts(products) {
    const cache = await caches.open(WHATSAPP_SHOP_CACHE);
    
    for (const product of products) {
        if (product.imageUrl) {
            try {
                const response = await fetch(product.imageUrl);
                if (response.ok) {
                    await cache.put(product.imageUrl, response);
                }
            } catch (error) {
                console.error('[Service Worker] Failed to cache product image:', error);
            }
        }
    }
}

// Clear specific cache
async function clearCache(cacheName) {
    return caches.delete(cacheName);
}

// Cache name constants
const STATIC_CACHE = 'kingu-static-v1';
const PRODUCT_IMAGES_CACHE = 'kingu-images-v1';

// Add error boundaries and logging
self.addEventListener('error', event => {
    console.error('[Service Worker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('[Service Worker] Unhandled rejection:', event.reason);
});

// Health check function
async function healthCheck() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        console.log(`[Service Worker] Health check: ${keys.length} items in cache`);
        
        // Verify critical assets are cached
        const criticalAssets = ['/', '/index.html', '/offline.html'];
        for (const asset of criticalAssets) {
            const response = await cache.match(asset);
            if (!response) {
                console.warn(`[Service Worker] Critical asset missing: ${asset}`);
                // Attempt to re-cache
                await cache.add(asset).catch(err => {
                    console.error(`[Service Worker] Failed to re-cache ${asset}:`, err);
                });
            }
        }
        
        return true;
    } catch (error) {
        console.error('[Service Worker] Health check failed:', error);
        return false;
    }
}

// Run health check on activation
self.addEventListener('activate', (event) => {
    event.waitUntil(
        healthCheck().then(isHealthy => {
            if (!isHealthy) {
                console.warn('[Service Worker] Health check failed, performing cleanup');
                return caches.delete(CACHE_NAME).then(() => {
                    return self.skipWaiting();
                });
            }
        })
    );
});

// Version tracking
const SERVICE_WORKER_VERSION = '3.1.0';
console.log(`[Service Worker] Version ${SERVICE_WORKER_VERSION} activated`);

// Broadcast update to all clients
self.clients.matchAll().then(clients => {
    clients.forEach(client => {
        client.postMessage({
            type: 'SERVICE_WORKER_UPDATE',
            version: SERVICE_WORKER_VERSION,
            timestamp: new Date().toISOString()
        });
    });
});
