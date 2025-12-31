// Enhanced Service Worker for Kingu Electrical PWA
// Version: 5.2.0
// Cache Name: kingu-electrical-v5.2.0

const CACHE_NAME = 'kingu-electrical-v5.2.0';
const OFFLINE_PAGE = '/offline.html';
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/Kinguelectrical-shop.html',
    '/styles.css',
    '/script.js',
    
    // Core assets
    '/manifest.json',
    '/assets/icons/icon-72x72.png',
    '/assets/icons/icon-96x96.png',
    '/assets/icons/icon-128x128.png',
    '/assets/icons/icon-144x144.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-384x384.png',
    '/assets/icons/icon-512x512.png',
    '/assets/icons/favicon.svg',
    
    // Fonts
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
    
    // Fallback images
    '/assets/images/offline/offline-generator.jpg',
    '/assets/images/offline/offline-solar.jpg',
    '/assets/images/offline/offline-tools.jpg'
];

// Dynamic caches
const API_CACHE_NAME = 'kingu-api-v1';
const IMAGES_CACHE_NAME = 'kingu-images-v1';
const PAGES_CACHE_NAME = 'kingu-pages-v1';

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/products',
    '/api/services',
    '/api/locations',
    '/api/contact'
];

// Install Event - Cache core assets
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching core assets');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => {
                console.log('✅ Core assets cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && 
                            cacheName !== API_CACHE_NAME &&
                            cacheName !== IMAGES_CACHE_NAME &&
                            cacheName !== PAGES_CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Claim clients immediately
            self.clients.claim(),
            
            // Initialize IndexedDB
            initializeIndexedDB()
        ]).then(() => {
            console.log('✅ Service Worker activated and ready');
            
            // Send update notification to all clients
            sendUpdateNotification();
        })
    );
});

// Fetch Event - Network with cache fallback
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (!url.origin.startsWith(self.location.origin)) {
        return;
    }
    
    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
        // API requests - Cache then network
        event.respondWith(handleApiRequest(event.request));
    } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        // Image requests - Cache first, network fallback
        event.respondWith(handleImageRequest(event.request));
    } else if (url.pathname.endsWith('.html') || url.pathname === '/') {
        // HTML pages - Network first, cache fallback
        event.respondWith(handlePageRequest(event.request));
    } else if (url.pathname.match(/\.(css|js|json)$/)) {
        // Static assets - Cache first, update in background
        event.respondWith(handleStaticAssetRequest(event.request));
    } else {
        // Default - Network first, cache fallback
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
                .catch(() => caches.match(OFFLINE_PAGE))
        );
    }
});

// Handle API Requests
async function handleApiRequest(request) {
    const cache = await caches.open(API_CACHE_NAME);
    
    try {
        // Try network first
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache the response
            const responseClone = response.clone();
            cache.put(request, responseClone);
            
            // Store in IndexedDB for offline access
            if (request.url.includes('/api/products') || 
                request.url.includes('/api/services')) {
                storeApiDataInIndexedDB(request.url, await response.json());
            }
            
            return response;
        }
        
        throw new Error('API request failed');
        
    } catch (error) {
        // Try to serve from cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📡 Serving API from cache:', request.url);
            return cachedResponse;
        }
        
        // Try IndexedDB
        const data = await getApiDataFromIndexedDB(request.url);
        if (data) {
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Return offline response
        return new Response(JSON.stringify({ 
            offline: true, 
            message: 'You are offline. Data will sync when you reconnect.',
            timestamp: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle Image Requests
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGES_CACHE_NAME);
    
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        // Try network
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache the response
            const responseClone = response.clone();
            cache.put(request, responseClone);
            
            // Update cache size
            updateImageCacheSize();
            
            return response;
        }
        
        throw new Error('Image fetch failed');
        
    } catch (error) {
        // Return fallback image based on category
        const fallbackImage = getFallbackImageForRequest(request.url);
        const fallbackResponse = await caches.match(fallbackImage);
        
        if (fallbackResponse) {
            return fallbackResponse;
        }
        
        // Return placeholder image
        return new Response(
            `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
                      font-family="Arial" font-size="16" fill="#666">
                    Image not available offline
                </text>
            </svg>`,
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// Handle Page Requests
async function handlePageRequest(request) {
    const cache = await caches.open(PAGES_CACHE_NAME);
    
    try {
        // Try network first
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache the response
            const responseClone = response.clone();
            cache.put(request, responseClone);
            
            return response;
        }
        
        throw new Error('Page fetch failed');
        
    } catch (error) {
        // Try to serve from cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page
        const offlineResponse = await caches.match(OFFLINE_PAGE);
        if (offlineResponse) {
            return offlineResponse;
        }
        
        // Create basic offline page
        return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
                <title>Kingu Electrical - Offline</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #1a5632; }
                </style>
            </head>
            <body>
                <h1>📶 You are offline</h1>
                <p>Some features of Kingu Electrical are not available.</p>
                <p>You can still:</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Browse cached products</li>
                    <li>View saved information</li>
                    <li>Access contact details</li>
                </ul>
                <br>
                <p>Phone: +255 682 843 552</p>
                <p>Email: kinguelectricaltz@gmail.com</p>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
        );
    }
}

// Handle Static Asset Requests
async function handleStaticAssetRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request);
        return cachedResponse;
    }
    
    try {
        // Try network
        const response = await fetch(request);
        
        if (response.ok) {
            // Cache the response
            const responseClone = response.clone();
            cache.put(request, responseClone);
            
            return response;
        }
        
        throw new Error('Asset fetch failed');
        
    } catch (error) {
        // Return generic error response
        if (request.url.endsWith('.css')) {
            return new Response('/* Offline - Styles not available */', {
                headers: { 'Content-Type': 'text/css' }
            });
        }
        
        if (request.url.endsWith('.js')) {
            return new Response('// Offline - Script not available', {
                headers: { 'Content-Type': 'application/javascript' }
            });
        }
        
        throw error;
    }
}

// Background Sync
self.addEventListener('sync', event => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'sync-orders') {
        event.waitUntil(syncPendingOrders());
    } else if (event.tag === 'sync-products') {
        event.waitUntil(syncProducts());
    } else if (event.tag === 'sync-cart') {
        event.waitUntil(syncCart());
    }
});

// Periodic Background Sync
self.addEventListener('periodicsync', event => {
    console.log('📅 Periodic sync:', event.tag);
    
    if (event.tag === 'update-content') {
        event.waitUntil(updateContent());
    }
});

// Push Notifications
self.addEventListener('push', event => {
    console.log('📨 Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from Kingu Electrical',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explore',
                icon: '/assets/icons/explore.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Kingu Electrical', options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'close') {
        return;
    }
    
    // Open the app
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(clientList => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Background Fetch (for large downloads)
if ('backgroundFetch' in self.registration) {
    self.addEventListener('backgroundfetchsuccess', event => {
        console.log('✅ Background fetch succeeded:', event.registration.id);
        event.updateUI({ title: 'Download complete!' });
    });
    
    self.addEventListener('backgroundfetchfail', event => {
        console.error('❌ Background fetch failed:', event.registration.id);
        event.updateUI({ title: 'Download failed!' });
    });
}

// Message Handling from Client
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    console.log('📨 Message received:', type);
    
    switch (type) {
        case 'SYNC_CART':
            syncCartToServer(data);
            break;
            
        case 'SAVE_ORDER':
            saveOrderForSync(data);
            break;
            
        case 'UPDATE_PRODUCTS':
            updateProductsCache();
            break;
            
        case 'GET_CACHED_DATA':
            getCachedData(data).then(response => {
                event.source.postMessage({
                    type: 'CACHED_DATA_RESPONSE',
                    data: response
                });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearSpecificCache(data);
            break;
            
        case 'PING':
            event.source.postMessage({ type: 'PONG', data: 'Service Worker is alive' });
            break;
    }
});

// ===== HELPER FUNCTIONS =====

// Initialize IndexedDB
async function initializeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 3);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            
            // Create object stores
            if (!db.objectStoreNames.contains('orders')) {
                const ordersStore = db.createObjectStore('orders', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                ordersStore.createIndex('status', 'status', { unique: false });
                ordersStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('products')) {
                const productsStore = db.createObjectStore('products', { 
                    keyPath: 'id'
                });
                productsStore.createIndex('category', 'category', { unique: false });
                productsStore.createIndex('updated', 'updatedAt', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('cart')) {
                db.createObjectStore('cart', { keyPath: 'productId' });
            }
            
            if (!db.objectStoreNames.contains('apiCache')) {
                const apiStore = db.createObjectStore('apiCache', { keyPath: 'url' });
                apiStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
        };
        
        request.onsuccess = function(event) {
            console.log('🗄️ IndexedDB initialized');
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            console.error('❌ IndexedDB initialization failed:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Store API data in IndexedDB
async function storeApiDataInIndexedDB(url, data) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['apiCache'], 'readwrite');
        const store = transaction.objectStore('apiCache');
        
        await store.put({
            url,
            data,
            timestamp: new Date().toISOString(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
        
        console.log('💾 API data stored:', url);
    } catch (error) {
        console.error('❌ Failed to store API data:', error);
    }
}

// Get API data from IndexedDB
async function getApiDataFromIndexedDB(url) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['apiCache'], 'readonly');
        const store = transaction.objectStore('apiCache');
        
        const request = store.get(url);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const cached = request.result;
                
                if (cached && cached.expiresAt > Date.now()) {
                    resolve(cached.data);
                } else if (cached) {
                    // Expired, remove it
                    store.delete(url);
                    resolve(null);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('❌ Failed to get API data:', error);
        return null;
    }
}

// Get Database Connection
async function getDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 3);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get Fallback Image
function getFallbackImageForRequest(url) {
    if (url.includes('generator')) {
        return '/assets/images/offline/offline-generator.jpg';
    } else if (url.includes('solar')) {
        return '/assets/images/offline/offline-solar.jpg';
    } else if (url.includes('tools') || url.includes('megger') || url.includes('fluke')) {
        return '/assets/images/offline/offline-tools.jpg';
    } else {
        return '/assets/icons/icon-512x512.png';
    }
}

// Update Cache in Background
function updateCacheInBackground(request) {
    fetch(request).then(response => {
        if (response.ok) {
            caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response);
            });
        }
    }).catch(() => {
        // Silently fail - we have cached version
    });
}

// Update Image Cache Size
async function updateImageCacheSize() {
    const cache = await caches.open(IMAGES_CACHE_NAME);
    const keys = await cache.keys();
    
    // Limit cache to 100 images
    if (keys.length > 100) {
        // Delete oldest 20 images
        const oldestKeys = keys.slice(0, 20);
        await Promise.all(oldestKeys.map(key => cache.delete(key)));
        console.log('🧹 Cleared old images from cache');
    }
}

// Sync Pending Orders
async function syncPendingOrders() {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['orders'], 'readonly');
        const store = transaction.objectStore('orders');
        
        const pendingOrders = await new Promise((resolve, reject) => {
            const index = store.index('status');
            const request = index.getAll('pending');
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        if (pendingOrders.length === 0) {
            return;
        }
        
        console.log(`📤 Syncing ${pendingOrders.length} pending orders`);
        
        // Send to server (simulated)
        for (const order of pendingOrders) {
            try {
                // Simulate API call
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });
                
                if (response.ok) {
                    // Update status in IndexedDB
                    const updateTransaction = db.transaction(['orders'], 'readwrite');
                    const updateStore = updateTransaction.objectStore('orders');
                    order.status = 'synced';
                    order.syncedAt = new Date().toISOString();
                    await updateStore.put(order);
                    
                    console.log(`✅ Order synced: ${order.id}`);
                    
                    // Send notification to client
                    sendNotificationToClients({
                        type: 'ORDER_SYNCED',
                        data: { orderId: order.id }
                    });
                }
            } catch (error) {
                console.error(`❌ Failed to sync order ${order.id}:`, error);
            }
        }
        
        sendNotificationToClients({
            type: 'SYNC_COMPLETE',
            data: { type: 'orders', count: pendingOrders.length }
        });
        
    } catch (error) {
        console.error('❌ Sync pending orders failed:', error);
    }
}

// Sync Products
async function syncProducts() {
    try {
        console.log('🔄 Syncing products');
        
        const response = await fetch('/api/products');
        if (response.ok) {
            const products = await response.json();
            
            // Cache response
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('/api/products', response.clone());
            
            // Store in IndexedDB
            const db = await getDatabase();
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            
            for (const product of products) {
                product.updatedAt = new Date().toISOString();
                await store.put(product);
            }
            
            console.log(`✅ ${products.length} products synced`);
            
            // Send notification to update UI
            sendNotificationToClients({
                type: 'PRODUCTS_UPDATED',
                data: { count: products.length }
            });
        }
    } catch (error) {
        console.error('❌ Products sync failed:', error);
    }
}

// Sync Cart
async function syncCart() {
    try {
        // Get cart from IndexedDB
        const db = await getDatabase();
        const transaction = db.transaction(['cart'], 'readonly');
        const store = transaction.objectStore('cart');
        
        const cartItems = await store.getAll();
        
        if (cartItems.length === 0) {
            return;
        }
        
        console.log(`🔄 Syncing ${cartItems.length} cart items`);
        
        // Send to server (simulated)
        const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cartItems })
        });
        
        if (response.ok) {
            console.log('✅ Cart synced successfully');
            sendNotificationToClients({
                type: 'CART_SYNCED',
                data: { timestamp: new Date().toISOString() }
            });
        }
    } catch (error) {
        console.error('❌ Cart sync failed:', error);
    }
}

// Sync Cart to Server
async function syncCartToServer(cartData) {
    try {
        // Store in IndexedDB first
        const db = await getDatabase();
        const transaction = db.transaction(['cart'], 'readwrite');
        const store = transaction.objectStore('cart');
        
        // Clear existing cart
        await store.clear();
        
        // Add new items
        for (const item of cartData.items) {
            await store.put({
                productId: item.id,
                ...item,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('💾 Cart saved to IndexedDB');
        
        // Try to sync if online
        if (navigator.onLine) {
            await syncCart();
        } else {
            // Register for sync when online
            self.registration.sync.register('sync-cart');
        }
        
    } catch (error) {
        console.error('❌ Failed to sync cart:', error);
    }
}

// Save Order for Sync
async function saveOrderForSync(orderData) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        
        const order = {
            ...orderData,
            status: 'pending',
            timestamp: new Date().toISOString(),
            id: Date.now() // Temporary ID
        };
        
        await store.add(order);
        
        console.log('💾 Order saved for sync');
        
        // Register for sync
        self.registration.sync.register('sync-orders');
        
        // Send confirmation to client
        sendNotificationToClients({
            type: 'ORDER_SAVED',
            data: { orderId: order.id }
        });
        
    } catch (error) {
        console.error('❌ Failed to save order:', error);
        sendNotificationToClients({
            type: 'ORDER_SAVE_FAILED',
            data: { error: error.message }
        });
    }
}

// Update Content
async function updateContent() {
    console.log('📅 Updating content...');
    
    try {
        // Update cache with fresh content
        const cache = await caches.open(PAGES_CACHE_NAME);
        const cachedUrls = await cache.keys();
        
        for (const request of cachedUrls) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.put(request, response);
                }
            } catch (error) {
                console.warn(`⚠️ Failed to update: ${request.url}`);
            }
        }
        
        // Update API cache
        await syncProducts();
        
        console.log('✅ Content update complete');
        
        sendNotificationToClients({
            type: 'CONTENT_UPDATED',
            data: { timestamp: new Date().toISOString() }
        });
        
    } catch (error) {
        console.error('❌ Content update failed:', error);
    }
}

// Update Products Cache
async function updateProductsCache() {
    try {
        console.log('🔄 Updating products cache');
        
        const response = await fetch('/api/products');
        if (response.ok) {
            const cache = await caches.open(API_CACHE_NAME);
            await cache.put('/api/products', response);
            
            console.log('✅ Products cache updated');
            
            sendNotificationToClients({
                type: 'CACHE_UPDATED',
                data: { type: 'products' }
            });
        }
    } catch (error) {
        console.error('❌ Failed to update products cache:', error);
    }
}

// Get Cached Data
async function getCachedData(request) {
    const { type, key } = request;
    
    try {
        switch (type) {
            case 'products':
                const cache = await caches.open(API_CACHE_NAME);
                const response = await cache.match('/api/products');
                if (response) {
                    return await response.json();
                }
                break;
                
            case 'order':
                const db = await getDatabase();
                const transaction = db.transaction(['orders'], 'readonly');
                const store = transaction.objectStore('orders');
                const order = await store.get(parseInt(key));
                return order;
                
            case 'cart':
                const cartTransaction = db.transaction(['cart'], 'readonly');
                const cartStore = cartTransaction.objectStore('cart');
                const items = await cartStore.getAll();
                return items;
        }
    } catch (error) {
        console.error('❌ Failed to get cached data:', error);
    }
    
    return null;
}

// Clear Specific Cache
async function clearSpecificCache(cacheName) {
    try {
        if (cacheName === 'all') {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('🗑️ All caches cleared');
        } else {
            await caches.delete(cacheName);
            console.log(`🗑️ Cache cleared: ${cacheName}`);
        }
        
        sendNotificationToClients({
            type: 'CACHE_CLEARED',
            data: { cacheName }
        });
        
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
    }
}

// Send Notification to Clients
function sendNotificationToClients(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(message);
        });
    });
}

// Send Update Notification
function sendUpdateNotification() {
    sendNotificationToClients({
        type: 'UPDATE_AVAILABLE',
        data: { version: '5.2.0', timestamp: new Date().toISOString() }
    });
}

// Background Fetch Handler
async function handleBackgroundFetch(fetchEvent) {
    const bgFetch = await self.registration.backgroundFetch.fetch(
        'large-file-download',
        ['/api/products/large'],
        {
            title: 'Downloading product catalog',
            icons: [{ src: '/assets/icons/download.png', sizes: '72x72', type: 'image/png' }],
            downloadTotal: 10 * 1024 * 1024 // 10MB
        }
    );
}

// ===== ERROR HANDLING =====

self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ===== DEBUGGING =====

// Expose debugging methods
self.addEventListener('message', event => {
    if (event.data.type === 'DEBUG') {
        switch (event.data.action) {
            case 'getCacheInfo':
                getCacheInfo().then(info => {
                    event.source.postMessage({
                        type: 'DEBUG_RESPONSE',
                        data: info
                    });
                });
                break;
                
            case 'clearAllCaches':
                clearAllCaches().then(() => {
                    event.source.postMessage({
                        type: 'DEBUG_RESPONSE',
                        data: { cleared: true }
                    });
                });
                break;
                
            case 'getStorageInfo':
                getStorageInfo().then(info => {
                    event.source.postMessage({
                        type: 'DEBUG_RESPONSE',
                        data: info
                    });
                });
                break;
        }
    }
});

async function getCacheInfo() {
    const cacheNames = await caches.keys();
    const info = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        info[cacheName] = {
            size: requests.length,
            urls: requests.slice(0, 5).map(req => req.url) // First 5 URLs
        };
    }
    
    return info;
}

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    
    // Clear IndexedDB
    const db = await getDatabase();
    const storeNames = Array.from(db.objectStoreNames);
    const transaction = db.transaction(storeNames, 'readwrite');
    
    await Promise.all(storeNames.map(name => {
        const store = transaction.objectStore(name);
        return store.clear();
    }));
    
    return { cachesCleared: cacheNames.length, storesCleared: storeNames.length };
}

async function getStorageInfo() {
    const db = await getDatabase();
    const storeNames = Array.from(db.objectStoreNames);
    const info = {};
    
    for (const storeName of storeNames) {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const count = await store.count();
        info[storeName] = { count };
    }
    
    return info;
}

// ===== LIFECYCLE =====

// Self-destruct if corrupted
self.addEventListener('statechange', event => {
    if (event.target.state === 'redundant') {
        console.log('🧹 Service Worker is redundant, cleaning up...');
        self.registration.unregister().then(() => {
            console.log('🗑️ Service Worker unregistered');
        });
    }
});

// Periodic maintenance
setInterval(async () => {
    await performMaintenance();
}, 60 * 60 * 1000); // Every hour

async function performMaintenance() {
    console.log('🔧 Performing maintenance...');
    
    try {
        // Clean expired API cache
        const db = await getDatabase();
        const transaction = db.transaction(['apiCache'], 'readwrite');
        const store = transaction.objectStore('apiCache');
        
        const allCached = await store.getAll();
        const now = Date.now();
        
        for (const cached of allCached) {
            if (cached.expiresAt && cached.expiresAt < now) {
                await store.delete(cached.url);
            }
        }
        
        // Clean old images from cache
        await updateImageCacheSize();
        
        // Clean old orders (older than 30 days)
        const ordersTransaction = db.transaction(['orders'], 'readwrite');
        const ordersStore = ordersTransaction.objectStore('orders');
        const index = ordersStore.index('timestamp');
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const range = IDBKeyRange.upperBound(thirtyDaysAgo.toISOString());
        const oldOrders = await index.getAll(range);
        
        for (const order of oldOrders) {
            await ordersStore.delete(order.id);
        }
        
        console.log('🧹 Maintenance complete');
        
    } catch (error) {
        console.error('❌ Maintenance failed:', error);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_NAME,
        handleApiRequest,
        handleImageRequest,
        handlePageRequest,
        syncPendingOrders
    };
}
