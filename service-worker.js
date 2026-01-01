// Enhanced Service Worker for Kingu Electrical PWA
// Version: 6.0.0 - Optimized for Performance
// Cache Name: kingu-electrical-v6.0.0

const CACHE_VERSION = '6.0.0';
const CACHE_NAME = `kingu-electrical-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';
const APP_SHELL = 'app-shell-v1';

// Enhanced core assets with priority levels
const CORE_ASSETS = {
    critical: [
        '/',
        '/index.html',
        '/Kinguelectrical-shop.html',
        '/offline.html',
        '/styles.css',
        '/script.js',
        '/manifest.json'
    ],
    high: [
        '/assets/icons/optimized/icon-192x192.png',
        '/assets/icons/optimized/icon-512x512.png',
        '/assets/icons/optimized/icon-192x192.webp',
        '/assets/icons/optimized/icon-512x512.webp',
        '/assets/icons/favicon.svg',
        '/assets/icons/optimized/company-logo-400x400.png',
        '/assets/icons/optimized/company-logo-200x200.png'
    ],
    medium: [
        '/assets/icons/optimized/icon-72x72.png',
        '/assets/icons/optimized/icon-96x96.png',
        '/assets/icons/optimized/icon-128x128.png',
        '/assets/icons/optimized/icon-144x144.png'
    ]
};

// Performance monitoring
const PERFORMANCE_CONFIG = {
    maxCacheSize: 100, // Maximum URLs per cache
    maxCacheAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxImageCache: 50, // Maximum images in cache
    cacheCleanupThreshold: 0.8, // Clean when 80% full
};

// Enhanced cache strategies
const CACHE_STRATEGIES = {
    STATIC_ASSETS: {
        cacheName: 'static-assets-v1',
        strategy: 'cache-first',
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        patterns: [
            /\.(css|js|woff2|woff|ttf)$/i,
            /assets\/icons\//i,
            /assets\/fonts\//i
        ]
    },
    IMAGES: {
        cacheName: 'images-v1',
        strategy: 'cache-first',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        patterns: [
            /\.(jpg|jpeg|png|webp|gif|svg)$/i,
            /images\/optimized\//i
        ]
    },
    PAGES: {
        cacheName: 'pages-v1',
        strategy: 'network-first',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        patterns: [
            /\.html$/i,
            /^\/$/,
            /Kinguelectrical-shop/i
        ]
    },
    API: {
        cacheName: 'api-v1',
        strategy: 'stale-while-revalidate',
        maxAge: 5 * 60 * 1000, // 5 minutes
        patterns: [
            /\/api\//i
        ]
    },
    DYNAMIC: {
        cacheName: 'dynamic-v1',
        strategy: 'network-first',
        maxAge: 60 * 60 * 1000, // 1 hour
        patterns: []
    }
};

// API endpoints with refresh intervals
const API_ENDPOINTS = {
    '/api/products': { maxAge: 3600000, strategy: 'stale-while-revalidate' },
    '/api/services': { maxAge: 86400000, strategy: 'stale-while-revalidate' },
    '/api/locations': { maxAge: 86400000, strategy: 'stale-while-revalidate' },
    '/api/contact': { maxAge: 300000, strategy: 'network-first' }
};

// Analytics event tracking
const ANALYTICS_EVENTS = {
    INSTALL: 'sw_install',
    ACTIVATE: 'sw_activate',
    FETCH: 'sw_fetch',
    CACHE_HIT: 'cache_hit',
    CACHE_MISS: 'cache_miss',
    SYNC_SUCCESS: 'sync_success',
    SYNC_FAILED: 'sync_failed',
    OFFLINE: 'offline_mode',
    UPDATE: 'sw_update'
};

// ===== INSTALL EVENT =====
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing v' + CACHE_VERSION);
    
    event.waitUntil(
        Promise.allSettled([
            // Install app shell first
            installAppShell(),
            
            // Cache critical assets in parallel
            cacheCriticalAssets(),
            
            // Preload important data
            preloadImportantData(),
            
            // Initialize database
            initializeIndexedDB(),
            
            // Register periodic sync
            registerPeriodicSync(),
            
            // Skip waiting for faster activation
            self.skipWaiting()
        ])
        .then(results => {
            logInstallResults(results);
            
            // Track installation
            trackEvent(ANALYTICS_EVENTS.INSTALL, {
                version: CACHE_VERSION,
                timestamp: new Date().toISOString()
            });
            
            // Notify clients
            sendMessageToClients({
                type: 'SW_INSTALLED',
                data: {
                    version: CACHE_VERSION,
                    timestamp: new Date().toISOString()
                }
            });
        })
        .catch(error => {
            console.error('❌ Installation failed:', error);
            trackEvent('install_error', { error: error.message });
        })
    );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker: Activating v' + CACHE_VERSION);
    
    event.waitUntil(
        Promise.allSettled([
            // Clean up old caches
            cleanupOldCaches(),
            
            // Claim clients
            self.clients.claim(),
            
            // Check for updates
            checkForContentUpdates(),
            
            // Initialize background sync
            initializeBackgroundSync(),
            
            // Start performance monitoring
            startPerformanceMonitoring()
        ])
        .then(results => {
            logActivateResults(results);
            
            trackEvent(ANALYTICS_EVENTS.ACTIVATE, {
                version: CACHE_VERSION,
                timestamp: new Date().toISOString()
            });
            
            sendMessageToClients({
                type: 'SW_ACTIVATED',
                data: {
                    version: CACHE_VERSION,
                    timestamp: new Date().toISOString()
                }
            });
            
            console.log('✅ Service Worker activated successfully');
        })
        .catch(error => {
            console.error('❌ Activation failed:', error);
            trackEvent('activate_error', { error: error.message });
        })
    );
});

// ===== FETCH EVENT - Enhanced Strategy =====
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const request = event.request;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except APIs we control)
    if (!url.origin.startsWith(self.location.origin) && 
        !url.hostname.includes('googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com')) {
        return;
    }
    
    // Handle different request types
    const strategy = getCacheStrategy(request);
    
    event.respondWith(
        handleFetchWithStrategy(request, strategy)
            .catch(error => {
                console.error('Fetch error:', error);
                return handleOfflineFallback(request);
            })
    );
    
    // Log fetch for analytics
    trackEvent(ANALYTICS_EVENTS.FETCH, {
        url: url.pathname,
        strategy: strategy.name,
        timestamp: new Date().toISOString()
    });
});

// ===== SYNC EVENT - Enhanced =====
self.addEventListener('sync', event => {
    console.log('🔄 Sync event triggered:', event.tag);
    
    switch (event.tag) {
        case 'sync-orders':
            event.waitUntil(
                syncWithRetry('orders', syncPendingOrders)
            );
            break;
            
        case 'sync-cart':
            event.waitUntil(
                syncWithRetry('cart', syncCartData)
            );
            break;
            
        case 'sync-products':
            event.waitUntil(
                syncWithRetry('products', syncProducts)
            );
            break;
            
        case 'sync-forms':
            event.waitUntil(
                syncWithRetry('forms', syncPendingForms)
            );
            break;
            
        case 'sync-analytics':
            event.waitUntil(
                syncAnalyticsData()
            );
            break;
            
        default:
            console.log('Unknown sync tag:', event.tag);
    }
});

// ===== PUSH NOTIFICATIONS - Enhanced =====
self.addEventListener('push', event => {
    console.log('📨 Push notification received');
    
    const options = {
        title: 'Kingu Electrical',
        body: 'Stay updated with our latest services',
        icon: '/assets/icons/optimized/icon-192x192.png',
        badge: '/assets/icons/optimized/badge-72x72.png',
        image: '/assets/icons/optimized/notification-banner.webp',
        timestamp: Date.now(),
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: false,
        renotify: true,
        tag: 'kingu-update',
        data: {
            url: '/',
            timestamp: new Date().toISOString()
        },
        actions: [
            {
                action: 'open',
                title: 'Open App',
                icon: '/assets/icons/optimized/open.png'
            },
            {
                action: 'view-shop',
                title: 'View Shop',
                icon: '/assets/icons/optimized/shop.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/assets/icons/optimized/close.png'
            }
        ]
    };
    
    // Parse custom push data
    if (event.data) {
        try {
            const data = event.data.json();
            Object.assign(options, data);
        } catch (error) {
            options.body = event.data.text() || options.body;
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

self.addEventListener('notificationclick', event => {
    console.log('🖱️ Notification clicked:', event.action);
    
    event.notification.close();
    
    let urlToOpen = '/';
    
    switch (event.action) {
        case 'open':
            urlToOpen = event.notification.data?.url || '/';
            break;
        case 'view-shop':
            urlToOpen = '/Kinguelectrical-shop.html';
            break;
        case 'dismiss':
            return;
        default:
            urlToOpen = event.notification.data?.url || '/';
    }
    
    event.waitUntil(
        handleNotificationClick(urlToOpen)
    );
});

// ===== BACKGROUND SYNC & FETCH =====
if ('backgroundFetch' in self.registration) {
    self.addEventListener('backgroundfetchsuccess', async event => {
        console.log('✅ Background fetch succeeded:', event.registration.id);
        
        try {
            const records = await event.registration.matchAll();
            const response = await records[0].responseReady;
            
            if (response.ok) {
                const data = await response.json();
                await processBackgroundFetchData(event.registration.id, data);
                
                event.updateUI({ 
                    title: 'Download Complete',
                    body: 'Your data has been updated'
                });
            }
        } catch (error) {
            console.error('Background fetch processing failed:', error);
        }
    });
    
    self.addEventListener('backgroundfetchfail', event => {
        console.error('❌ Background fetch failed:', event.registration.id);
        event.updateUI({ 
            title: 'Download Failed',
            body: 'Please check your connection'
        });
    });
}

// ===== MESSAGE HANDLING =====
self.addEventListener('message', async event => {
    const { type, data, id } = event.data;
    console.log('📨 Message received:', type);
    
    try {
        let response;
        
        switch (type) {
            case 'CACHE_PRODUCTS':
                response = await cacheProducts(data);
                break;
                
            case 'SAVE_CART':
                response = await saveCartToIndexedDB(data);
                break;
                
            case 'SAVE_ORDER':
                response = await saveOrderToIndexedDB(data);
                break;
                
            case 'GET_CACHED_DATA':
                response = await getCachedData(data);
                break;
                
            case 'CLEAR_CACHE':
                response = await clearCache(data);
                break;
                
            case 'UPDATE_AVAILABLE':
                response = await triggerUpdate();
                break;
                
            case 'GET_STATS':
                response = await getServiceWorkerStats();
                break;
                
            case 'PING':
                response = {
                    type: 'PONG',
                    data: {
                        version: CACHE_VERSION,
                        timestamp: new Date().toISOString(),
                        uptime: performance.now()
                    }
                };
                break;
                
            case 'DEBUG_INFO':
                response = {
                    type: 'DEBUG_INFO_RESPONSE',
                    data: await getDebugInfo()
                };
                break;
                
            case 'PERFORMANCE_REPORT':
                response = await handlePerformanceReport(data);
                break;
                
            case 'SETTINGS_UPDATE':
                response = await updateServiceWorkerSettings(data);
                break;
        }
        
        // Send response back
        if (response && event.source) {
            event.source.postMessage({
                ...response,
                messageId: id
            });
        }
        
    } catch (error) {
        console.error('Message handling error:', error);
        
        if (event.source) {
            event.source.postMessage({
                type: 'ERROR',
                error: error.message,
                messageId: id
            });
        }
    }
});

// ===== CORE FUNCTIONS =====

async function installAppShell() {
    const cache = await caches.open(APP_SHELL);
    await cache.addAll(CORE_ASSETS.critical);
    console.log('✅ App shell installed');
}

async function cacheCriticalAssets() {
    const cachePromises = [];
    
    // Cache high priority assets
    const highCache = await caches.open('high-priority');
    cachePromises.push(highCache.addAll(CORE_ASSETS.high));
    
    // Cache medium priority assets
    const mediumCache = await caches.open('medium-priority');
    cachePromises.push(mediumCache.addAll(CORE_ASSETS.medium));
    
    // Cache fonts
    if ('caches' in self) {
        const fonts = [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
            'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
            'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
        ];
        
        const fontCache = await caches.open('fonts-v1');
        for (const font of fonts) {
            try {
                const response = await fetch(font, { mode: 'cors' });
                if (response.ok) {
                    cachePromises.push(fontCache.put(font, response.clone()));
                }
            } catch (error) {
                console.warn('Failed to cache font:', font);
            }
        }
    }
    
    await Promise.allSettled(cachePromises);
    console.log('✅ Critical assets cached');
}

async function preloadImportantData() {
    const preloadPromises = [];
    
    // Preload product data
    preloadPromises.push(
        fetch('/api/products?limit=5').then(async response => {
            if (response.ok) {
                const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
                await cache.put('/api/products', response.clone());
                
                const data = await response.json();
                await storeInIndexedDB('products', data);
            }
        }).catch(() => {})
    );
    
    // Preload service data
    preloadPromises.push(
        fetch('/api/services').then(async response => {
            if (response.ok) {
                const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
                await cache.put('/api/services', response.clone());
            }
        }).catch(() => {})
    );
    
    await Promise.allSettled(preloadPromises);
    console.log('✅ Important data preloaded');
}

async function initializeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 5);
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            const version = event.oldVersion;
            
            console.log(`🗄️ Upgrading IndexedDB from v${version} to v5`);
            
            // Create or upgrade object stores
            if (version < 1) {
                // Products store
                if (!db.objectStoreNames.contains('products')) {
                    const store = db.createObjectStore('products', { keyPath: 'id' });
                    store.createIndex('category', 'category', { unique: false });
                    store.createIndex('updated', 'updatedAt', { unique: false });
                    store.createIndex('price', 'price', { unique: false });
                }
            }
            
            if (version < 2) {
                // Orders store
                if (!db.objectStoreNames.contains('orders')) {
                    const store = db.createObjectStore('orders', { 
                        keyPath: 'id',
                        autoIncrement: true 
                    });
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('timestamp', 'createdAt', { unique: false });
                }
            }
            
            if (version < 3) {
                // Cart store
                if (!db.objectStoreNames.contains('cart')) {
                    db.createObjectStore('cart', { keyPath: 'productId' });
                }
            }
            
            if (version < 4) {
                // Forms store
                if (!db.objectStoreNames.contains('forms')) {
                    const store = db.createObjectStore('forms', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('status', 'status', { unique: false });
                }
                
                // Settings store
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            }
            
            if (version < 5) {
                // Analytics store
                if (!db.objectStoreNames.contains('analytics')) {
                    const store = db.createObjectStore('analytics', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    store.createIndex('type', 'type', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                    store.createIndex('session', 'sessionId', { unique: false });
                }
                
                // Sessions store
                if (!db.objectStoreNames.contains('sessions')) {
                    const store = db.createObjectStore('sessions', { 
                        keyPath: 'id' 
                    });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
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

async function registerPeriodicSync() {
    if ('periodicSync' in self.registration) {
        try {
            const status = await navigator.permissions.query({
                name: 'periodic-background-sync'
            });
            
            if (status.state === 'granted') {
                await self.registration.periodicSync.register('content-update', {
                    minInterval: 24 * 60 * 60 * 1000, // 24 hours
                    powerState: 'auto'
                });
                console.log('✅ Periodic sync registered');
            }
        } catch (error) {
            console.warn('Periodic sync not available:', error);
        }
    }
}

async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = [
        APP_SHELL,
        'high-priority',
        'medium-priority',
        'fonts-v1',
        ...Object.values(CACHE_STRATEGIES).map(s => s.cacheName)
    ];
    
    const cleanupPromises = cacheNames.map(async cacheName => {
        if (!currentCaches.includes(cacheName) && cacheName.startsWith('kingu-')) {
            console.log('🗑️ Deleting old cache:', cacheName);
            await caches.delete(cacheName);
        }
    });
    
    await Promise.all(cleanupPromises);
    
    // Clean expired cache entries
    await cleanExpiredCacheEntries();
    
    console.log('✅ Old caches cleaned up');
}

async function cleanExpiredCacheEntries() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const date = response.headers.get('date');
                const cacheControl = response.headers.get('cache-control');
                
                if (date && cacheControl) {
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

async function checkForContentUpdates() {
    console.log('🔍 Checking for content updates...');
    
    try {
        // Check for service worker updates
        const registration = await self.registration;
        if (registration.waiting) {
            sendMessageToClients({
                type: 'UPDATE_AVAILABLE',
                data: {
                    version: CACHE_VERSION,
                    timestamp: new Date().toISOString()
                }
            });
            
            trackEvent(ANALYTICS_EVENTS.UPDATE, {
                type: 'sw_update_available',
                timestamp: new Date().toISOString()
            });
        }
        
        // Check critical pages for updates
        const pagesToCheck = ['/', '/index.html', '/Kinguelectrical-shop.html'];
        const cache = await caches.open(CACHE_STRATEGIES.PAGES.cacheName);
        
        for (const page of pagesToCheck) {
            try {
                const networkResponse = await fetch(page);
                const cachedResponse = await cache.match(page);
                
                if (networkResponse.ok && cachedResponse) {
                    const networkETag = networkResponse.headers.get('etag');
                    const cachedETag = cachedResponse.headers.get('etag');
                    
                    if (networkETag && cachedETag && networkETag !== cachedETag) {
                        console.log(`🔄 Page updated: ${page}`);
                        await cache.put(page, networkResponse.clone());
                        
                        sendMessageToClients({
                            type: 'CONTENT_UPDATED',
                            data: { page }
                        });
                    }
                }
            } catch (error) {
                // Silently fail for individual pages
            }
        }
        
    } catch (error) {
        console.warn('Update check failed:', error);
    }
}

function getCacheStrategy(request) {
    const url = request.url;
    
    for (const [name, strategy] of Object.entries(CACHE_STRATEGIES)) {
        if (strategy.patterns.some(pattern => pattern.test(url))) {
            return { name, ...strategy };
        }
    }
    
    // Check API endpoints
    for (const endpoint in API_ENDPOINTS) {
        if (url.includes(endpoint)) {
            return {
                name: 'api',
                cacheName: CACHE_STRATEGIES.API.cacheName,
                strategy: API_ENDPOINTS[endpoint].strategy,
                maxAge: API_ENDPOINTS[endpoint].maxAge
            };
        }
    }
    
    // Default strategy
    return {
        name: 'default',
        cacheName: CACHE_STRATEGIES.DYNAMIC.cacheName,
        strategy: 'network-first',
        maxAge: 3600000
    };
}

async function handleFetchWithStrategy(request, strategy) {
    const cache = await caches.open(strategy.cacheName);
    
    switch (strategy.strategy) {
        case 'cache-first':
            return handleCacheFirst(request, cache);
            
        case 'network-first':
            return handleNetworkFirst(request, cache);
            
        case 'stale-while-revalidate':
            return handleStaleWhileRevalidate(request, cache);
            
        case 'network-only':
            return handleNetworkOnly(request);
            
        default:
            return handleNetworkFirst(request, cache);
    }
}

async function handleCacheFirst(request, cache) {
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        // Update cache in background
        updateCacheInBackground(request, cache);
        
        // Track cache hit
        trackEvent(ANALYTICS_EVENTS.CACHE_HIT, {
            url: request.url,
            strategy: 'cache-first'
        });
        
        return cachedResponse;
    }
    
    // Cache miss - try network
    trackEvent(ANALYTICS_EVENTS.CACHE_MISS, {
        url: request.url,
        strategy: 'cache-first'
    });
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return getOfflineFallback(request);
    }
}

async function handleNetworkFirst(request, cache) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache the fresh response
            await cache.put(request, networkResponse.clone());
            return networkResponse;
        }
        
        throw new Error('Network request failed');
        
    } catch (error) {
        // Try cache as fallback
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            trackEvent(ANALYTICS_EVENTS.CACHE_HIT, {
                url: request.url,
                strategy: 'network-first'
            });
            return cachedResponse;
        }
        
        // No cache, return offline fallback
        trackEvent(ANALYTICS_EVENTS.OFFLINE, {
            url: request.url,
            strategy: 'network-first'
        });
        
        return getOfflineFallback(request);
    }
}

async function handleStaleWhileRevalidate(request, cache) {
    const cachedResponse = await cache.match(request);
    
    // Update cache in background
    const fetchPromise = fetch(request)
        .then(async networkResponse => {
            if (networkResponse.ok) {
                await cache.put(request, networkResponse.clone());
            }
        })
        .catch(() => {
            // Silently fail - we have cached version
        });
    
    // Return cached if available
    if (cachedResponse) {
        // Don't wait for background update
        fetchPromise.catch(() => {});
        
        trackEvent(ANALYTICS_EVENTS.CACHE_HIT, {
            url: request.url,
            strategy: 'stale-while-revalidate'
        });
        
        return cachedResponse;
    }
    
    // No cache, wait for network
    await fetchPromise;
    return cache.match(request) || getOfflineFallback(request);
}

async function handleNetworkOnly(request) {
    try {
        return await fetch(request);
    } catch (error) {
        return getOfflineFallback(request);
    }
}

async function updateCacheInBackground(request, cache) {
    fetch(request)
        .then(async networkResponse => {
            if (networkResponse.ok) {
                const cachedResponse = await cache.match(request);
                
                // Only update if different
                if (!cachedResponse || 
                    networkResponse.headers.get('etag') !== cachedResponse.headers.get('etag')) {
                    await cache.put(request, networkResponse.clone());
                    console.log('🔄 Cache updated in background:', request.url);
                }
            }
        })
        .catch(() => {
            // Silently fail
        });
}

async function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // HTML pages - return offline page
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        const offlinePage = await caches.match(OFFLINE_PAGE);
        if (offlinePage) {
            trackEvent('offline_fallback', {
                type: 'html',
                url: url.pathname
            });
            return offlinePage;
        }
    }
    
    // Images - return placeholder
    if (request.destination === 'image') {
        const placeholder = await getImagePlaceholder(url.pathname);
        if (placeholder) {
            trackEvent('offline_fallback', {
                type: 'image',
                url: url.pathname
            });
            return placeholder;
        }
    }
    
    // API responses - return cached or empty
    if (url.pathname.includes('/api/')) {
        const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        
        return new Response(
            JSON.stringify({
                offline: true,
                message: 'You are offline. Data may be outdated.',
                timestamp: new Date().toISOString()
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            }
        );
    }
    
    // Generic fallback
    return new Response(
        'You are offline. Please check your internet connection.',
        {
            headers: { 'Content-Type': 'text/plain' },
            status: 503
        }
    );
}

async function getImagePlaceholder(pathname) {
    const placeholders = {
        'generator': '/assets/images/placeholder/generator.webp',
        'solar': '/assets/images/placeholder/solar.webp',
        'spare': '/assets/images/placeholder/tools.webp',
        'product': '/assets/images/placeholder/product.webp'
    };
    
    for (const [key, path] of Object.entries(placeholders)) {
        if (pathname.includes(key)) {
            const cached = await caches.match(path);
            if (cached) return cached;
        }
    }
    
    // Default placeholder
    return caches.match('/assets/icons/optimized/icon-512x512.png');
}

async function handleOfflineFallback(request) {
    trackEvent(ANALYTICS_EVENTS.OFFLINE, {
        url: request.url,
        timestamp: new Date().toISOString()
    });
    
    return getOfflineFallback(request);
}

async function syncWithRetry(type, syncFunction, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
        try {
            await syncFunction();
            trackEvent(ANALYTICS_EVENTS.SYNC_SUCCESS, { type, retries });
            return;
        } catch (error) {
            retries++;
            console.error(`Sync failed (attempt ${retries}):`, error);
            
            if (retries === maxRetries) {
                trackEvent(ANALYTICS_EVENTS.SYNC_FAILED, { 
                    type, 
                    error: error.message,
                    retries 
                });
                throw error;
            }
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, retries) * 1000)
            );
        }
    }
}

async function syncPendingOrders() {
    const db = await getDatabase();
    const orders = await getFromIndexedDB('orders', 'status', 'pending');
    
    if (orders.length === 0) return;
    
    console.log(`📤 Syncing ${orders.length} pending orders`);
    
    for (const order of orders) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            
            if (response.ok) {
                order.status = 'synced';
                order.syncedAt = new Date().toISOString();
                await updateInIndexedDB('orders', order);
                
                console.log(`✅ Order ${order.id} synced`);
            }
        } catch (error) {
            console.error(`❌ Failed to sync order ${order.id}:`, error);
        }
    }
    
    sendMessageToClients({
        type: 'SYNC_COMPLETE',
        data: { type: 'orders', count: orders.length }
    });
}

async function syncCartData() {
    const db = await getDatabase();
    const cartItems = await getAllFromIndexedDB('cart');
    
    if (cartItems.length === 0) return;
    
    try {
        const response = await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartItems, timestamp: new Date().toISOString() })
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
        throw error;
    }
}

async function syncProducts() {
    try {
        const lastSync = await getSetting('lastProductSync');
        const url = lastSync 
            ? `/api/products?updatedSince=${lastSync}`
            : '/api/products';
        
        const response = await fetch(url);
        
        if (response.ok) {
            const products = await response.json();
            
            // Update cache
            const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
            await cache.put('/api/products', response.clone());
            
            // Update IndexedDB
            await storeInIndexedDB('products', products);
            
            // Update sync time
            await setSetting('lastProductSync', new Date().toISOString());
            
            console.log(`✅ ${products.length} products synced`);
            
            sendMessageToClients({
                type: 'PRODUCTS_UPDATED',
                data: { count: products.length }
            });
        }
    } catch (error) {
        console.error('❌ Products sync failed:', error);
        throw error;
    }
}

async function syncPendingForms() {
    const forms = await getFromIndexedDB('forms', 'status', 'pending');
    
    for (const form of forms) {
        try {
            const response = await fetch('/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            
            if (response.ok) {
                form.status = 'synced';
                form.syncedAt = new Date().toISOString();
                await updateInIndexedDB('forms', form);
            }
        } catch (error) {
            console.error('Form sync failed:', error);
        }
    }
}

async function syncAnalyticsData() {
    const analytics = await getFromIndexedDB('analytics', 'synced', false);
    
    if (analytics.length === 0) return;
    
    try {
        const response = await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(analytics)
        });
        
        if (response.ok) {
            // Mark as synced
            for (const item of analytics) {
                item.synced = true;
                await updateInIndexedDB('analytics', item);
            }
            
            console.log(`✅ ${analytics.length} analytics events synced`);
        }
    } catch (error) {
        console.error('Analytics sync failed:', error);
    }
}

async function handleNotificationClick(url) {
    const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    });
    
    // Look for existing window
    for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
            await client.focus();
            
            if (client.url !== url) {
                await client.navigate(url);
            }
            return;
        }
    }
    
    // Open new window
    if (self.clients.openWindow) {
        await self.clients.openWindow(url);
    }
}

async function processBackgroundFetchData(fetchId, data) {
    console.log(`Processing background fetch: ${fetchId}`);
    
    // Store data
    if (Array.isArray(data)) {
        await storeInIndexedDB('products', data);
    }
    
    // Notify clients
    sendMessageToClients({
        type: 'BACKGROUND_FETCH_COMPLETE',
        data: {
            fetchId,
            count: Array.isArray(data) ? data.length : 1,
            timestamp: new Date().toISOString()
        }
    });
}

async function initializeBackgroundSync() {
    if ('backgroundSync' in self.registration) {
        try {
            const tags = await self.registration.sync.getTags();
            console.log('Registered sync tags:', tags);
        } catch (error) {
            console.warn('Background sync initialization failed:', error);
        }
    }
}

async function startPerformanceMonitoring() {
    // Start periodic performance checks
    setInterval(async () => {
        await monitorPerformance();
    }, 15 * 60 * 1000); // Every 15 minutes
}

async function monitorPerformance() {
    try {
        // Check cache sizes
        const cacheNames = await caches.keys();
        const cacheSizes = {};
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const requests = await cache.keys();
            cacheSizes[cacheName] = requests.length;
        }
        
        // Check IndexedDB sizes
        const dbStats = await getDatabaseStats();
        
        // Log performance data
        await storeInIndexedDB('analytics', {
            type: 'performance',
            data: { cacheSizes, dbStats },
            timestamp: new Date().toISOString()
        });
        
        // Auto-clean if needed
        await autoCleanupIfNeeded(cacheSizes);
        
    } catch (error) {
        console.error('Performance monitoring failed:', error);
    }
}

async function autoCleanupIfNeeded(cacheSizes) {
    // Clean up if any cache is too large
    for (const [cacheName, size] of Object.entries(cacheSizes)) {
        if (size > PERFORMANCE_CONFIG.maxCacheSize) {
            console.log(`🔄 Cleaning cache ${cacheName} (size: ${size})`);
            await cleanupCache(cacheName);
        }
    }
}

async function cleanupCache(cacheName) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    // Delete oldest 20% of entries
    const toDelete = Math.floor(requests.length * 0.2);
    const deletePromises = requests
        .slice(0, toDelete)
        .map(request => cache.delete(request));
    
    await Promise.all(deletePromises);
    console.log(`🗑️ Cleaned ${toDelete} entries from ${cacheName}`);
}

async function getDatabaseStats() {
    const db = await getDatabase();
    const stats = {};
    
    const storeNames = Array.from(db.objectStoreNames);
    for (const storeName of storeNames) {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const count = await store.count();
        stats[storeName] = { count };
    }
    
    return stats;
}

// ===== INDEXEDDB HELPERS =====

async function storeInIndexedDB(storeName, items) {
    const db = await getDatabase();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const promises = Array.isArray(items) 
        ? items.map(item => store.put(item))
        : [store.put(items)];
    
    await Promise.all(promises);
}

async function getFromIndexedDB(storeName, indexName, value) {
    const db = await getDatabase();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    
    return new Promise((resolve, reject) => {
        const request = index.getAll(value);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllFromIndexedDB(storeName) {
    const db = await getDatabase();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function updateInIndexedDB(storeName, item) {
    const db = await getDatabase();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getSetting(key) {
    const db = await getDatabase();
    const transaction = db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result?.value);
        request.onerror = () => reject(request.error);
    });
}

async function setSetting(key, value) {
    const db = await getDatabase();
    const transaction = db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
        const request = store.put({ key, value });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// ===== ENHANCED MESSAGE HANDLERS =====

async function cacheProducts(products) {
    // Store in IndexedDB
    await storeInIndexedDB('products', products);
    
    // Cache API response
    const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
    const response = new Response(JSON.stringify(products), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${API_ENDPOINTS['/api/products'].maxAge}`
        }
    });
    
    await cache.put('/api/products', response);
    
    return { success: true, count: products.length };
}

async function saveCartToIndexedDB(cartData) {
    await storeInIndexedDB('cart', cartData.items || []);
    
    // Register for sync
    if ('sync' in self.registration) {
        try {
            await self.registration.sync.register('sync-cart');
        } catch (error) {
            console.warn('Cart sync registration failed:', error);
        }
    }
    
    return { success: true };
}

async function saveOrderToIndexedDB(orderData) {
    const order = {
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        id: Date.now() + Math.random().toString(36).substr(2, 9)
    };
    
    await storeInIndexedDB('orders', order);
    
    // Register for sync
    if ('sync' in self.registration) {
        try {
            await self.registration.sync.register('sync-orders');
        } catch (error) {
            console.warn('Order sync registration failed:', error);
        }
    }
    
    sendMessageToClients({
        type: 'ORDER_SAVED',
        data: { orderId: order.id }
    });
    
    return { success: true, orderId: order.id };
}

async function getCachedData(query) {
    const { type, key } = query;
    
    try {
        switch (type) {
            case 'products':
                const cache = await caches.open(CACHE_STRATEGIES.API.cacheName);
                const response = await cache.match('/api/products');
                return response ? await response.json() : [];
                
            case 'product':
                const products = await getFromIndexedDB('products', 'id', parseInt(key));
                return products[0] || null;
                
            case 'cart':
                return await getAllFromIndexedDB('cart');
                
            case 'settings':
                return await getSetting(key);
        }
    } catch (error) {
        console.error('Failed to get cached data:', error);
        return null;
    }
}

async function clearCache(options = {}) {
    const { cacheName = 'all', preserve = [] } = options;
    
    try {
        if (cacheName === 'all') {
            const cacheNames = await caches.keys();
            
            const deletePromises = cacheNames
                .filter(name => !preserve.includes(name))
                .map(name => caches.delete(name));
            
            await Promise.all(deletePromises);
            console.log(`🗑️ All caches cleared (preserved: ${preserve.join(', ')})`);
            
        } else {
            await caches.delete(cacheName);
            console.log(`🗑️ Cache cleared: ${cacheName}`);
        }
        
        sendMessageToClients({
            type: 'CACHE_CLEARED',
            data: { cacheName, timestamp: new Date().toISOString() }
        });
        
        return { success: true };
        
    } catch (error) {
        console.error('Failed to clear cache:', error);
        return { success: false, error: error.message };
    }
}

async function triggerUpdate() {
    const registration = await self.registration;
    
    if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        sendMessageToClients({
            type: 'UPDATE_TRIGGERED',
            data: { timestamp: new Date().toISOString() }
        });
        
        return { success: true };
    }
    
    return { success: false, message: 'No update available' };
}

async function getServiceWorkerStats() {
    const cacheNames = await caches.keys();
    const cacheStats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        cacheStats[cacheName] = {
            size: requests.length,
            sample: requests.slice(0, 3).map(req => ({
                url: req.url,
                method: req.method
            }))
        };
    }
    
    const dbStats = await getDatabaseStats();
    
    return {
        version: CACHE_VERSION,
        timestamp: new Date().toISOString(),
        caches: cacheStats,
        indexedDB: dbStats,
        performance: {
            memory: performance.memory || {},
            timing: performance.timing || {}
        }
    };
}

async function getDebugInfo() {
    const stats = await getServiceWorkerStats();
    
    // Add additional debug info
    const clients = await self.clients.matchAll();
    
    return {
        ...stats,
        clients: clients.map(client => ({
            url: client.url,
            type: client.type,
            frameType: client.frameType
        })),
        settings: {
            maxCacheSize: PERFORMANCE_CONFIG.maxCacheSize,
            maxCacheAge: PERFORMANCE_CONFIG.maxCacheAge,
            maxImageCache: PERFORMANCE_CONFIG.maxImageCache
        }
    };
}

async function handlePerformanceReport(data) {
    // Store performance report
    await storeInIndexedDB('analytics', {
        type: 'performance_report',
        data,
        timestamp: new Date().toISOString()
    });
    
    // Analyze and take action if needed
    if (data.loadTime > 3000) {
        // Consider preloading more assets
        console.log('⚠️ High load time detected:', data.loadTime);
    }
    
    return { received: true };
}

async function updateServiceWorkerSettings(settings) {
    // Validate settings
    const validSettings = {};
    
    if (settings.maxCacheSize && settings.maxCacheSize > 0) {
        PERFORMANCE_CONFIG.maxCacheSize = settings.maxCacheSize;
        validSettings.maxCacheSize = settings.maxCacheSize;
    }
    
    if (settings.maxCacheAge && settings.maxCacheAge > 0) {
        PERFORMANCE_CONFIG.maxCacheAge = settings.maxCacheAge;
        validSettings.maxCacheAge = settings.maxCacheAge;
    }
    
    // Store settings
    await storeInIndexedDB('settings', {
        key: 'performance_config',
        value: PERFORMANCE_CONFIG,
        updated: new Date().toISOString()
    });
    
    return { success: true, updated: validSettings };
}

function getDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('KinguElectricalDB', 5);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function sendMessageToClients(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            try {
                client.postMessage(message);
            } catch (error) {
                console.warn('Failed to send message to client:', error);
            }
        });
    });
}

function trackEvent(eventType, data = {}) {
    const event = {
        type: eventType,
        data,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        userAgent: navigator.userAgent
    };
    
    // Store in IndexedDB
    storeInIndexedDB('analytics', event).catch(() => {
        // Silently fail if IndexedDB is unavailable
    });
}

function getSessionId() {
    if (!self.sessionId) {
        self.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    return self.sessionId;
}

function logInstallResults(results) {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`✅ Task ${index + 1} completed`);
        } else {
            console.error(`❌ Task ${index + 1} failed:`, result.reason);
        }
    });
}

function logActivateResults(results) {
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            console.log(`✅ Activation task ${index + 1} completed`);
        } else {
            console.error(`❌ Activation task ${index + 1} failed:`, result.reason);
        }
    });
}

// ===== ERROR HANDLING =====
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
    
    trackEvent('sw_error', {
        message: event.error?.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

self.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    
    trackEvent('sw_unhandled_rejection', {
        reason: event.reason?.message || String(event.reason),
        stack: event.reason?.stack
    });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CACHE_VERSION,
        CACHE_STRATEGIES,
        handleCacheFirst,
        handleNetworkFirst,
        handleStaleWhileRevalidate,
        getCacheStrategy
    };
}
