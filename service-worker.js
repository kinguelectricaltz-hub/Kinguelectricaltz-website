// Enhanced Service Worker for Kingu Electrical PWA
// Version: 5.3.0
// Cache Name: kingu-electrical-v5.3.0

const CACHE_VERSION = '5.3.0';
const CACHE_NAME = `kingu-electrical-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Core assets to cache on install
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/Kinguelectrical-shop.html',
    
    // Main assets
    '/styles.css',
    '/script.js',
    '/manifest.json',
    
    // Optimized icons
    '/assets/icons/optimized/icon-72x72.png',
    '/assets/icons/optimized/icon-96x96.png',
    '/assets/icons/optimized/icon-128x128.png',
    '/assets/icons/optimized/icon-144x144.png',
    '/assets/icons/optimized/icon-192x192.png',
    '/assets/icons/optimized/icon-512x512.png',
    '/assets/icons/optimized/icon-192x192.webp',
    '/assets/icons/optimized/icon-512x512.webp',
    '/assets/icons/favicon.svg',
    
    // Critical product images
    '/images/optimized/generator-medium.jpg',
    '/images/optimized/solar-medium.jpg',
    '/images/optimized/spare-medium.jpg',
    
    // Fonts (cache these if you're self-hosting)
    // '/fonts/poppins-regular.woff2',
    // '/fonts/roboto-regular.woff2',
    
    // Fallback images for offline
    '/assets/images/offline/offline-generator.webp',
    '/assets/images/offline/offline-solar.webp',
    '/assets/images/offline/offline-tools.webp'
];

// Dynamic cache names for different resource types
const CACHE_TYPES = {
    API: 'kingu-api-v1',
    IMAGES: 'kingu-images-v1',
    PAGES: 'kingu-pages-v1',
    STATIC: 'kingu-static-v1',
    FONTS: 'kingu-fonts-v1'
};

// API endpoints to cache (example endpoints)
const API_ENDPOINTS = [
    '/api/products',
    '/api/services',
    '/api/locations',
    '/api/contact'
];

// Image patterns to cache
const IMAGE_PATTERNS = [
    /\.(jpg|jpeg|png|webp|gif|svg)$/i,
    /optimized\//i
];

// ===== INSTALL EVENT =====
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing v' + CACHE_VERSION);
    
    // Skip waiting to activate immediately
    event.waitUntil(
        Promise.all([
            // Cache core assets
            cacheCoreAssets(),
            
            // Initialize IndexedDB
            initializeIndexedDB(),
            
            // Skip waiting
            self.skipWaiting()
        ])
        .then(() => {
            console.log('✅ Service Worker installed successfully');
            
            // Send installation notification
            sendMessageToClients({
                type: 'SW_INSTALLED',
                data: { version: CACHE_VERSION }
            });
        })
        .catch(error => {
            console.error('❌ Installation failed:', error);
        })
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Activating v' + CACHE_VERSION);
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            cleanupOldCaches(),
            
            // Claim clients immediately
            self.clients.claim(),
            
            // Preload critical data
            preloadCriticalData(),
            
            // Setup periodic sync
            setupPeriodicSync()
        ])
        .then(() => {
            console.log('✅ Service Worker activated');
            
            // Send activation notification
            sendMessageToClients({
                type: 'SW_ACTIVATED',
                data: { version: CACHE_VERSION }
            });
            
            // Check for content updates
            checkForUpdates();
        })
        .catch(error => {
            console.error('❌ Activation failed:', error);
        })
    );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const request = event.request;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip browser extensions
    if (url.protocol === 'chrome-extension:') {
        return;
    }
    
    // Skip analytics and tracking
    if (url.hostname.includes('google-analytics') || 
        url.hostname.includes('googletagmanager')) {
        return;
    }
    
    // Handle different types of requests
    event.respondWith(
        (async () => {
            try {
                // Return from cache first for certain resources
                if (shouldCacheFirst(request)) {
                    return await cacheFirstWithUpdate(request);
                }
                
                // Network first for dynamic content
                if (shouldNetworkFirst(request)) {
                    return await networkFirstWithCacheFallback(request);
                }
                
                // Stale while revalidate for API calls
                if (shouldStaleWhileRevalidate(request)) {
                    return await staleWhileRevalidate(request);
                }
                
                // Default: Cache with network fallback
                return await cacheWithNetworkFallback(request);
                
            } catch (error) {
                console.error('Fetch error:', error);
                return await getOfflineResponse(request);
            }
        })()
    );
});

// ===== SYNC EVENT =====
self.addEventListener('sync', event => {
    console.log('🔄 Sync event:', event.tag);
    
    switch (event.tag) {
        case 'sync-orders':
            event.waitUntil(syncPendingOrders());
            break;
            
        case 'sync-cart':
            event.waitUntil(syncCartData());
            break;
            
        case 'sync-products':
            event.waitUntil(syncProducts());
            break;
            
        case 'sync-forms':
            event.waitUntil(syncPendingForms());
            break;
            
        default:
            console.log('Unknown sync tag:', event.tag);
    }
});

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', event => {
    console.log('📨 Push notification received');
    
    let notificationData = {
        title: 'Kingu Electrical',
        body: 'New update available',
        icon: '/assets/icons/optimized/icon-192x192.png',
        badge: '/assets/icons/badge-72x72.png',
        data: {
            url: '/'
        }
    };
    
    // Parse push data if available
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            notificationData.body = event.data.text() || notificationData.body;
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            data: notificationData.data,
            vibrate: [200, 100, 200],
            tag: 'kingu-update',
            renotify: true,
            actions: [
                {
                    action: 'open',
                    title: 'Open App',
                    icon: '/assets/icons/open.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/assets/icons/close.png'
                }
            ]
        })
    );
});

self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'dismiss') {
        return;
    }
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        }).then(windowClients => {
            // Check if there's already a window/tab open
            for (const client of windowClients) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus().then(() => {
                        // Navigate to the notification URL
                        if (client.url !== urlToOpen) {
                            return client.navigate(urlToOpen);
                        }
                    });
                }
            }
            
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// ===== BACKGROUND FETCH =====
if ('backgroundFetch' in self.registration) {
    self.addEventListener('backgroundfetchsuccess', event => {
        console.log('✅ Background fetch succeeded:', event.registration.id);
        
        event.updateUI({ title: 'Download complete!' });
        
        // Process fetched data
        event.waitUntil(
            processBackgroundFetch(event.registration)
        );
    });
    
    self.addEventListener('backgroundfetchfail', event => {
        console.error('❌ Background fetch failed:', event.registration.id);
        event.updateUI({ title: 'Download failed!' });
    });
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    console.log('📨 Message received:', type);
    
    switch (type) {
        case 'CACHE_PRODUCTS':
            cacheProducts(data);
            break;
            
        case 'SAVE_CART':
            saveCartToIndexedDB(data);
            break;
            
        case 'SAVE_ORDER':
            saveOrderToIndexedDB(data);
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
            clearCache(data);
            break;
            
        case 'UPDATE_AVAILABLE':
            triggerUpdate();
            break;
            
        case 'PING':
            event.source.postMessage({
                type: 'PONG',
                data: {
                    version: CACHE_VERSION,
                    timestamp: new Date().toISOString()
                }
            });
            break;
            
        case 'DEBUG_INFO':
            getDebugInfo().then(info => {
                event.source.postMessage({
                    type: 'DEBUG_INFO_RESPONSE',
                    data: info
                });
            });
            break;
    }
});

// ===== HELPER FUNCTIONS =====

// Cache Core Assets
async function cacheCoreAssets() {
    const cache = await caches.open(CACHE_NAME);
    
    // Add core assets to cache
    await cache.addAll(CORE_ASSETS);
    
    // Cache Google Fonts (if allowed)
    try {
        const fontsResponse = await fetch(
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap'
        );
        if (fontsResponse.ok) {
            await cache.put(
                'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
                fontsResponse.clone()
            );
        }
    } catch (error) {
        console.warn('Could not cache fonts:', error);
    }
}

// Initialize IndexedDB
async function initializeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 4);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            const oldVersion = event.oldVersion;
            
            console.log('🗄️ Upgrading IndexedDB from version', oldVersion, 'to', event.newVersion);
            
            // Create object stores
            if (!db.objectStoreNames.contains('products')) {
                const store = db.createObjectStore('products', { keyPath: 'id' });
                store.createIndex('category', 'category', { unique: false });
                store.createIndex('updated', 'updatedAt', { unique: false });
                store.createIndex('price', 'price', { unique: false });
            }
            
            if (!db.objectStoreNames.contains('orders')) {
                const store = db.createObjectStore('orders', { 
                    keyPath: 'id',
                    autoIncrement: true 
                });
                store.createIndex('status', 'status', { unique: false });
                store.createIndex('timestamp', 'createdAt', { unique: false });
            }
            
            if (!db.objectStore.contains('cart')) {
                db.createObjectStore('cart', { keyPath: 'productId' });
            }
            
            if (!db.objectStore.contains('forms')) {
                const store = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
                store.createIndex('type', 'type', { unique: false });
                store.createIndex('status', 'status', { unique: false });
            }
            
            if (!db.objectStore.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
            }
            
            if (!db.objectStore.contains('analytics')) {
                const store = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
                store.createIndex('type', 'type', { unique: false });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
        
        request.onsuccess = function(event) {
            console.log('✅ IndexedDB initialized');
            resolve(event.target.result);
        };
        
        request.onerror = function(event) {
            console.error('❌ IndexedDB initialization failed:', event.target.error);
            reject(event.target.error);
        };
    });
}

// Cleanup Old Caches
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = Object.values(CACHE_TYPES);
    currentCaches.push(CACHE_NAME);
    
    return Promise.all(
        cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
                console.log('🗑️ Deleting old cache:', cacheName);
                return caches.delete(cacheName);
            }
        })
    );
}

// Preload Critical Data
async function preloadCriticalData() {
    try {
        // Preload product data
        const productsCache = await caches.open(CACHE_TYPES.API);
        const productsResponse = await fetch('/api/products?limit=10');
        
        if (productsResponse.ok) {
            await productsCache.put('/api/products', productsResponse.clone());
            
            // Store in IndexedDB for offline access
            const products = await productsResponse.json();
            await storeProductsInIndexedDB(products);
        }
        
        // Preload service locations
        const locationsResponse = await fetch('/api/locations');
        if (locationsResponse.ok) {
            await productsCache.put('/api/locations', locationsResponse.clone());
        }
        
    } catch (error) {
        console.warn('Preload failed (may be offline):', error);
    }
}

// Setup Periodic Sync
async function setupPeriodicSync() {
    if ('periodicSync' in self.registration) {
        try {
            const status = await navigator.permissions.query({
                name: 'periodic-background-sync'
            });
            
            if (status.state === 'granted') {
                await self.registration.periodicSync.register('content-update', {
                    minInterval: 24 * 60 * 60 * 1000 // 24 hours
                });
                console.log('✅ Periodic sync registered');
            }
        } catch (error) {
            console.warn('Periodic sync not supported:', error);
        }
    }
}

// Check for Updates
async function checkForUpdates() {
    try {
        // Check for updated service worker
        const registration = await self.registration;
        if (registration.waiting) {
            sendMessageToClients({
                type: 'UPDATE_AVAILABLE',
                data: { version: CACHE_VERSION }
            });
        }
        
        // Check for content updates
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests.slice(0, 5)) { // Check first 5
            const networkResponse = await fetch(request);
            const cachedResponse = await cache.match(request);
            
            if (networkResponse.ok && cachedResponse) {
                const networkETag = networkResponse.headers.get('ETag');
                const cachedETag = cachedResponse.headers.get('ETag');
                
                if (networkETag && cachedETag && networkETag !== cachedETag) {
                    console.log('🔄 Content updated:', request.url);
                    await cache.put(request, networkResponse.clone());
                }
            }
        }
        
    } catch (error) {
        console.warn('Update check failed:', error);
    }
}

// Cache First with Update Strategy
async function cacheFirstWithUpdate(request) {
    const cache = await getCacheForRequest(request);
    const cachedResponse = await cache.match(request);
    
    // Return cached response immediately
    if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request, cache);
        return cachedResponse;
    }
    
    // If not in cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return fallback
        return getFallbackResponse(request);
    }
}

// Network First with Cache Fallback
async function networkFirstWithCacheFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the response
            const cache = await getCacheForRequest(request);
            await cache.put(request, networkResponse.clone());
            
            return networkResponse;
        }
        
        throw new Error('Network request failed');
        
    } catch (error) {
        // Try cache
        const cache = await getCacheForRequest(request);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response
        return getOfflineResponse(request);
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await getCacheForRequest(request);
    const cachedResponse = await cache.match(request);
    
    // Update cache in background regardless
    const fetchPromise = fetch(request).then(async networkResponse => {
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
    }).catch(() => {
        // Silently fail - we have cached version
    });
    
    // Return cached response if available
    if (cachedResponse) {
        return cachedResponse;
    }
    
    // Wait for network response
    await fetchPromise;
    return cache.match(request) || getOfflineResponse(request);
}

// Cache with Network Fallback
async function cacheWithNetworkFallback(request) {
    const cache = await getCacheForRequest(request);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return getOfflineResponse(request);
    }
}

// Get Appropriate Cache for Request
async function getCacheForRequest(request) {
    const url = request.url;
    
    if (url.includes('/api/')) {
        return caches.open(CACHE_TYPES.API);
    }
    
    if (IMAGE_PATTERNS.some(pattern => pattern.test(url))) {
        return caches.open(CACHE_TYPES.IMAGES);
    }
    
    if (url.endsWith('.html') || url === '/' || url.includes('/Kinguelectrical-shop')) {
        return caches.open(CACHE_TYPES.PAGES);
    }
    
    if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        return caches.open(CACHE_TYPES.FONTS);
    }
    
    return caches.open(CACHE_TYPES.STATIC);
}

// Update Cache in Background
async function updateCacheInBackground(request, cache) {
    fetch(request).then(async networkResponse => {
        if (networkResponse.ok) {
            const cachedResponse = await cache.match(request);
            const networkETag = networkResponse.headers.get('ETag');
            const cachedETag = cachedResponse?.headers.get('ETag');
            
            if (!cachedETag || networkETag !== cachedETag) {
                await cache.put(request, networkResponse.clone());
                console.log('🔄 Cache updated in background:', request.url);
            }
        }
    }).catch(() => {
        // Silently fail
    });
}

// Get Offline Response
async function getOfflineResponse(request) {
    const url = new URL(request.url);
    
    // Return cached offline page for HTML requests
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        const offlinePage = await caches.match(OFFLINE_PAGE);
        if (offlinePage) {
            return offlinePage;
        }
    }
    
    // Return fallback for images
    if (IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
        const fallbackImage = getFallbackImage(url.pathname);
        const cachedFallback = await caches.match(fallbackImage);
        if (cachedFallback) {
            return cachedFallback;
        }
    }
    
    // Generic offline response
    return new Response(
        JSON.stringify({
            offline: true,
            message: 'You are offline. Please check your connection.',
            timestamp: new Date().toISOString()
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        }
    );
}

// Get Fallback Image
function getFallbackImage(pathname) {
    if (pathname.includes('generator')) {
        return '/assets/images/offline/offline-generator.webp';
    } else if (pathname.includes('solar')) {
        return '/assets/images/offline/offline-solar.webp';
    } else if (pathname.includes('tools') || pathname.includes('test')) {
        return '/assets/images/offline/offline-tools.webp';
    } else {
        return '/assets/icons/optimized/icon-512x512.png';
    }
}

// Get Fallback Response
async function getFallbackResponse(request) {
    if (request.destination === 'image') {
        return getOfflineResponse(request);
    }
    
    if (request.destination === 'style') {
        return new Response('/* Fallback styles */', {
            headers: { 'Content-Type': 'text/css' }
        });
    }
    
    if (request.destination === 'script') {
        return new Response('// Fallback script', {
            headers: { 'Content-Type': 'application/javascript' }
        });
    }
    
    return getOfflineResponse(request);
}

// Request Strategy Selectors
function shouldCacheFirst(request) {
    const url = new URL(request.url);
    
    // Cache first for:
    // - Static assets (JS, CSS, images, fonts)
    // - Optimized images
    // - Icons
    return (
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font' ||
        url.pathname.includes('optimized/') ||
        url.pathname.includes('assets/icons/')
    );
}

function shouldNetworkFirst(request) {
    const url = new URL(request.url);
    
    // Network first for:
    // - HTML pages
    // - API calls that need fresh data
    // - Form submissions
    return (
        request.destination === 'document' ||
        url.pathname.includes('/api/orders') ||
        url.pathname.includes('/api/contact') ||
        request.method === 'POST'
    );
}

function shouldStaleWhileRevalidate(request) {
    const url = new URL(request.url);
    
    // Stale while revalidate for:
    // - Product listings
    // - Service data
    // - Location data
    return (
        url.pathname.includes('/api/products') ||
        url.pathname.includes('/api/services') ||
        url.pathname.includes('/api/locations')
    );
}

// Sync Pending Orders
async function syncPendingOrders() {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['orders'], 'readonly');
        const store = transaction.objectStore('orders');
        const index = store.index('status');
        
        const pendingOrders = await new Promise((resolve, reject) => {
            const request = index.getAll('pending');
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        if (pendingOrders.length === 0) {
            return;
        }
        
        console.log(`📤 Syncing ${pendingOrders.length} pending orders`);
        
        for (const order of pendingOrders) {
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });
                
                if (response.ok) {
                    // Mark as synced
                    const updateTransaction = db.transaction(['orders'], 'readwrite');
                    const updateStore = updateTransaction.objectStore('orders');
                    order.status = 'synced';
                    order.syncedAt = new Date().toISOString();
                    await updateStore.put(order);
                    
                    console.log(`✅ Order synced: ${order.id}`);
                    
                    sendMessageToClients({
                        type: 'ORDER_SYNCED',
                        data: { orderId: order.id }
                    });
                }
            } catch (error) {
                console.error(`❌ Failed to sync order ${order.id}:`, error);
            }
        }
        
        sendMessageToClients({
            type: 'SYNC_COMPLETE',
            data: { type: 'orders', count: pendingOrders.length }
        });
        
    } catch (error) {
        console.error('❌ Sync failed:', error);
    }
}

// Sync Cart Data
async function syncCartData() {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['cart'], 'readonly');
        const store = transaction.objectStore('cart');
        
        const cartItems = await store.getAll();
        
        if (cartItems.length === 0) {
            return;
        }
        
        const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ items: cartItems })
        });
        
        if (response.ok) {
            console.log('✅ Cart synced');
            sendMessageToClients({
                type: 'CART_SYNCED',
                data: { timestamp: new Date().toISOString() }
            });
        }
        
    } catch (error) {
        console.error('❌ Cart sync failed:', error);
    }
}

// Sync Products
async function syncProducts() {
    try {
        const response = await fetch('/api/products?updatedSince=' + getLastSyncTime());
        
        if (response.ok) {
            const products = await response.json();
            
            // Update cache
            const cache = await caches.open(CACHE_TYPES.API);
            await cache.put('/api/products', response.clone());
            
            // Update IndexedDB
            await storeProductsInIndexedDB(products);
            
            console.log(`✅ ${products.length} products synced`);
            
            sendMessageToClients({
                type: 'PRODUCTS_UPDATED',
                data: { count: products.length }
            });
        }
        
    } catch (error) {
        console.error('❌ Products sync failed:', error);
    }
}

// Sync Pending Forms
async function syncPendingForms() {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['forms'], 'readonly');
        const store = transaction.objectStore('forms');
        const index = store.index('status');
        
        const pendingForms = await index.getAll('pending');
        
        for (const form of pendingForms) {
            try {
                const response = await fetch('/api/forms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                });
                
                if (response.ok) {
                    // Update status
                    const updateTransaction = db.transaction(['forms'], 'readwrite');
                    const updateStore = updateTransaction.objectStore('forms');
                    form.status = 'synced';
                    form.syncedAt = new Date().toISOString();
                    await updateStore.put(form);
                }
            } catch (error) {
                console.error('Form sync failed:', error);
            }
        }
        
    } catch (error) {
        console.error('Forms sync failed:', error);
    }
}

// Store Products in IndexedDB
async function storeProductsInIndexedDB(products) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['products'], 'readwrite');
        const store = transaction.objectStore('products');
        
        for (const product of products) {
            product.updatedAt = new Date().toISOString();
            await store.put(product);
        }
        
        // Update last sync time
        const settingsTransaction = db.transaction(['settings'], 'readwrite');
        const settingsStore = settingsTransaction.objectStore('settings');
        await settingsStore.put({
            key: 'lastProductSync',
            value: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Failed to store products:', error);
    }
}

// Cache Products from Client
async function cacheProducts(products) {
    try {
        // Store in IndexedDB
        await storeProductsInIndexedDB(products);
        
        // Also cache API response
        const cache = await caches.open(CACHE_TYPES.API);
        const response = new Response(JSON.stringify(products), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600'
            }
        });
        
        await cache.put('/api/products', response);
        
    } catch (error) {
        console.error('Failed to cache products:', error);
    }
}

// Save Cart to IndexedDB
async function saveCartToIndexedDB(cartData) {
    try {
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
        
        // Register for sync
        self.registration.sync.register('sync-cart');
        
    } catch (error) {
        console.error('Failed to save cart:', error);
    }
}

// Save Order to IndexedDB
async function saveOrderToIndexedDB(orderData) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        
        const order = {
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            id: Date.now()
        };
        
        await store.add(order);
        
        // Register for sync
        self.registration.sync.register('sync-orders');
        
        sendMessageToClients({
            type: 'ORDER_SAVED',
            data: { orderId: order.id }
        });
        
    } catch (error) {
        console.error('Failed to save order:', error);
        
        sendMessageToClients({
            type: 'ORDER_SAVE_FAILED',
            data: { error: error.message }
        });
    }
}

// Get Cached Data
async function getCachedData(query) {
    const { type, key } = query;
    
    try {
        switch (type) {
            case 'products':
                const cache = await caches.open(CACHE_TYPES.API);
                const response = await cache.match('/api/products');
                if (response) {
                    return await response.json();
                }
                break;
                
            case 'product':
                const db = await getDatabase();
                const transaction = db.transaction(['products'], 'readonly');
                const store = transaction.objectStore('products');
                return await store.get(parseInt(key));
                
            case 'cart':
                const cartTransaction = db.transaction(['cart'], 'readonly');
                const cartStore = cartTransaction.objectStore('cart');
                return await cartStore.getAll();
        }
    } catch (error) {
        console.error('Failed to get cached data:', error);
    }
    
    return null;
}

// Clear Cache
async function clearCache(cacheName) {
    try {
        if (cacheName === 'all') {
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
            
            console.log('🗑️ All caches cleared');
            
        } else {
            await caches.delete(cacheName);
            console.log(`🗑️ Cache cleared: ${cacheName}`);
        }
        
        sendMessageToClients({
            type: 'CACHE_CLEARED',
            data: { cacheName }
        });
        
    } catch (error) {
        console.error('Failed to clear cache:', error);
    }
}

// Trigger Update
async function triggerUpdate() {
    const registration = await self.registration;
    
    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        sendMessageToClients({
            type: 'UPDATE_TRIGGERED',
            data: { timestamp: new Date().toISOString() }
        });
    }
}

// Get Database Instance
async function getDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 4);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get Last Sync Time
function getLastSyncTime() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return oneDayAgo.toISOString();
}

// Send Message to All Clients
function sendMessageToClients(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(message);
        });
    });
}

// Get Debug Info
async function getDebugInfo() {
    const cacheNames = await caches.keys();
    const cacheInfo = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        cacheInfo[cacheName] = {
            size: requests.length,
            urls: requests.slice(0, 3).map(req => req.url)
        };
    }
    
    // Get IndexedDB info
    const db = await getDatabase();
    const storeNames = Array.from(db.objectStoreNames);
    const dbInfo = {};
    
    for (const storeName of storeNames) {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const count = await store.count();
        dbInfo[storeName] = { count };
    }
    
    return {
        version: CACHE_VERSION,
        caches: cacheInfo,
        indexedDB: dbInfo,
        timestamp: new Date().toISOString()
    };
}

// Process Background Fetch
async function processBackgroundFetch(registration) {
    try {
        const records = await registration.matchAll();
        const response = await records[0].responseReady;
        
        if (response.ok) {
            const data = await response.json();
            
            // Store the data
            await storeProductsInIndexedDB(data);
            
            sendMessageToClients({
                type: 'BACKGROUND_FETCH_COMPLETE',
                data: { count: data.length }
            });
        }
    } catch (error) {
        console.error('Background fetch processing failed:', error);
    }
}

// ===== PERIODIC MAINTENANCE =====
setInterval(async () => {
    await performMaintenance();
}, 6 * 60 * 60 * 1000); // Every 6 hours

async function performMaintenance() {
    console.log('🔧 Performing maintenance...');
    
    try {
        // Clean expired cache entries
        await cleanExpiredCacheEntries();
        
        // Clean old IndexedDB data
        await cleanOldIndexedDBData();
        
        // Optimize image cache
        await optimizeImageCache();
        
        console.log('✅ Maintenance complete');
        
    } catch (error) {
        console.error('Maintenance failed:', error);
    }
}

async function cleanExpiredCacheEntries() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const cacheControl = response.headers.get('Cache-Control');
                const date = response.headers.get('Date');
                
                if (cacheControl && date) {
                    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
                    if (maxAgeMatch) {
                        const maxAge = parseInt(maxAgeMatch[1]) * 1000;
                        const responseDate = new Date(date).getTime();
                        
                        if (Date.now() - responseDate > maxAge) {
                            await cache.delete(request);
                        }
                    }
                }
            }
        }
    }
}

async function cleanOldIndexedDBData() {
    const db = await getDatabase();
    
    // Clean old analytics (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const transaction = db.transaction(['analytics'], 'readwrite');
    const store = transaction.objectStore('analytics');
    const index = store.index('timestamp');
    
    const range = IDBKeyRange.upperBound(thirtyDaysAgo.toISOString());
    const oldRecords = await index.getAll(range);
    
    for (const record of oldRecords) {
        await store.delete(record.id);
    }
}

async function optimizeImageCache() {
    const cache = await caches.open(CACHE_TYPES.IMAGES);
    const requests = await cache.keys();
    
    if (requests.length > 100) {
        // Delete oldest 20% of images
        const toDelete = Math.floor(requests.length * 0.2);
        const deleteRequests = requests.slice(0, toDelete);
        
        await Promise.all(deleteRequests.map(req => cache.delete(req)));
        
        console.log(`🗑️ Deleted ${toDelete} old images from cache`);
    }
}

// ===== ERROR HANDLING =====
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
    
    // Log to IndexedDB for debugging
    logErrorToIndexedDB(event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    logErrorToIndexedDB(event.reason);
});

async function logErrorToIndexedDB(error) {
    try {
        const db = await getDatabase();
        const transaction = db.transaction(['analytics'], 'readwrite');
        const store = transaction.objectStore('analytics');
        
        await store.add({
            type: 'error',
            message: error.message || String(error),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: self.location.href
        });
    } catch (dbError) {
        console.error('Failed to log error:', dbError);
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_NAME,
        CACHE_TYPES,
        cacheFirstWithUpdate,
        networkFirstWithCacheFallback,
        staleWhileRevalidate
    };
}
