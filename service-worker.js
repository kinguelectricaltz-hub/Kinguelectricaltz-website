// Enhanced PWA Implementation for Kingu Electrical
document.addEventListener('DOMContentLoaded', function() {
    // Initialize PWA
    initPWA();
    initOfflineDetection();
    initBackgroundSync();
});

// PWA Initialization
function initPWA() {
    // Update year
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    }
    
    // PWA Installation Prompt
    setupInstallPrompt();
    
    // Check if app is already installed
    checkIfInstalled();
}

// Service Worker Registration
function registerServiceWorker() {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js', {
                scope: '/',
                updateViaCache: 'none'
            });
            
            console.log('✅ Service Worker registered with scope:', registration.scope);
            
            // Update UI status
            updateSWStatus('🟢 App Ready');
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 New service worker found:', newWorker.state);
                
                newWorker.addEventListener('statechange', () => {
                    console.log('Service Worker state changed to:', newWorker.state);
                    
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New update available
                        showUpdateNotification();
                    }
                });
            });
            
            // Periodic updates check
            setInterval(() => {
                registration.update();
            }, 60 * 60 * 1000); // Check for updates every hour
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
            updateSWStatus('🔴 Offline Mode');
        }
    });
}

// PWA Installation Prompt
let deferredPrompt;
const installContainer = document.getElementById('installContainer');
const installBtn = document.getElementById('installBtn');
const closeInstall = document.getElementById('closeInstall');

function setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt after 10 seconds
        setTimeout(() => {
            if (deferredPrompt && !isAppInstalled()) {
                const lastDismissed = localStorage.getItem('pwaPromptDismissed');
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                
                if (!lastDismissed || lastDismissed < oneWeekAgo) {
                    installContainer.style.display = 'block';
                }
            }
        }, 10000);
    });
    
    // Install button click
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        installBtn.textContent = 'Installing...';
        installBtn.disabled = true;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User ${outcome} the install prompt`);
        
        if (outcome === 'accepted') {
            installContainer.innerHTML = `
                <div class="install-content">
                    <img src="/assets/icons/success.svg" alt="Success" class="install-icon">
                    <div class="install-text">
                        <h4>Installation Started!</h4>
                        <p>Kingu Electrical app is being installed...</p>
                    </div>
                </div>
            `;
            setTimeout(() => {
                installContainer.style.display = 'none';
            }, 3000);
        } else {
            installBtn.textContent = 'Install';
            installBtn.disabled = false;
            localStorage.setItem('pwaPromptDismissed', Date.now());
        }
        
        deferredPrompt = null;
    });
    
    // Close button
    closeInstall.addEventListener('click', () => {
        installContainer.style.display = 'none';
        localStorage.setItem('pwaPromptDismissed', Date.now());
    });
    
    // Track successful installation
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA was installed successfully');
        deferredPrompt = null;
        installContainer.style.display = 'none';
        updateSWStatus('✅ App Installed');
        
        // Send analytics if you have it
        if (window.gtag) {
            gtag('event', 'app_installed');
        }
    });
}

// Offline Detection
function initOfflineDetection() {
    const statusElement = document.getElementById('swStatus');
    
    window.addEventListener('online', () => {
        updateSWStatus('🟢 Online');
        showOnlineNotification();
    });
    
    window.addEventListener('offline', () => {
        updateSWStatus('🔴 Offline');
        showOfflineNotification();
    });
    
    // Initial check
    if (!navigator.onLine) {
        updateSWStatus('🔴 Offline');
        showOfflineNotification();
    }
}

// Background Sync
function initBackgroundSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
            // Register for periodic sync
            registration.periodicSync.register('update-content', {
                minInterval: 24 * 60 * 60 * 1000 // Once per day
            }).catch(err => {
                console.log('Periodic sync registration failed:', err);
            });
        });
    }
}

// Helper Functions
function updateSWStatus(text) {
    const statusElement = document.getElementById('swStatus');
    if (statusElement) {
        statusElement.textContent = text;
        statusElement.style.display = 'block';
        
        // Auto-hide after 5 seconds if online
        if (text === '🟢 Online' || text === '✅ App Installed') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
}

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
}

function checkIfInstalled() {
    if (isAppInstalled()) {
        console.log('📱 App is running in standalone mode');
        document.body.classList.add('standalone-mode');
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <p>🔄 A new version of Kingu Electrical is available!</p>
            <button id="updateBtn" class="btn">Update Now</button>
            <button id="closeUpdate" class="btn-text">Later</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('updateBtn').addEventListener('click', () => {
        window.location.reload();
    });
    
    document.getElementById('closeUpdate').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 30000);
}

function showOfflineNotification() {
    const notification = document.createElement('div');
    notification.className = 'offline-notification';
    notification.innerHTML = `
        <div class="offline-content">
            <p>📶 You are currently offline. Some features may be limited.</p>
        </div>
    `;
    
    notification.id = 'offline-notif';
    if (!document.getElementById('offline-notif')) {
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }
}

function showOnlineNotification() {
    const notification = document.createElement('div');
    notification.className = 'online-notification';
    notification.innerHTML = `
        <div class="online-content">
            <p>✅ You are back online!</p>
        </div>
    `;
    
    notification.id = 'online-notif';
    if (!document.getElementById('online-notif')) {
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 3000);
    }
}

// Force update if needed
function forceUpdate() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration) {
                registration.unregister().then(() => {
                    console.log('Service Worker unregistered');
                    caches.keys().then(cacheNames => {
                        cacheNames.forEach(cacheName => {
                            caches.delete(cacheName);
                        });
                        console.log('All caches cleared');
                        window.location.reload();
                    });
                });
            }
        });
    }
}

// Add to global scope for debugging
window.pwaDebug = {
    forceUpdate,
    checkStatus: () => {
        console.log('PWA Status:', {
            isInstalled: isAppInstalled(),
            isOnline: navigator.onLine,
            deferredPrompt: !!deferredPrompt,
            serviceWorker: 'serviceWorker' in navigator
        });
    },
    clearStorage: () => {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Storage cleared');
    }
};
