// DOM Ready - Fixed loading logic
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Kingu Electrical');
    
    const loadingScreen = document.getElementById('loading-screen');
    const body = document.body;
    
    // Function to hide loading screen
    function hideLoadingScreen() {
        if (!loadingScreen) {
            console.warn('Loading screen element not found');
            body.classList.remove('loading');
            return;
        }
        
        loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            body.classList.remove('loading');
            
            // Show all content
            document.querySelectorAll('body > *:not(#loading-screen)').forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
            
            console.log('Loading screen hidden');
            initPage();
        }, 500);
    }
    
    // Start page initialization
    function initPage() {
        console.log('Initializing page...');
        
        // Initialize all components
        initNavigation();
        initAnimations();
        initForms();
        updateFooterYear();
        initLazyLoading();
        
        console.log('Page initialization complete');
    }
    
    // Check if all critical assets are loaded
    const criticalAssets = [
        'Background.jpg',
        'assets/icons/kingu.svg',
        'style.css',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    let assetsLoaded = 0;
    const totalAssets = criticalAssets.length;
    
    // Function to check if asset is loaded
    function checkAssetLoaded(asset) {
        assetsLoaded++;
        console.log(`Asset loaded: ${asset} (${assetsLoaded}/${totalAssets})`);
        
        if (assetsLoaded >= totalAssets) {
            // All assets loaded, hide loading screen
            setTimeout(hideLoadingScreen, 500);
        }
    }
    
    // Monitor font loading
    document.fonts.ready.then(() => {
        console.log('Web fonts loaded');
        checkAssetLoaded('fonts');
    });
    
    // Monitor CSS loading
    const styleSheets = Array.from(document.styleSheets);
    let cssLoadedCount = 0;
    
    styleSheets.forEach((sheet, index) => {
        if (sheet.href) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = sheet.href;
            link.onload = () => {
                cssLoadedCount++;
                console.log(`CSS loaded: ${sheet.href}`);
                if (cssLoadedCount === styleSheets.filter(s => s.href).length) {
                    checkAssetLoaded('all-css');
                }
            };
            // Re-add to trigger onload
            document.head.appendChild(link);
        }
    });
    
    // Monitor image loading
    const criticalImages = document.querySelectorAll('img[src*="kingu"]');
    criticalImages.forEach(img => {
        if (img.complete) {
            checkAssetLoaded(img.src);
        } else {
            img.onload = () => checkAssetLoaded(img.src);
            img.onerror = () => {
                console.warn(`Failed to load image: ${img.src}`);
                checkAssetLoaded(img.src); // Continue even if image fails
            };
        }
    });
    
    // Fallback: Hide loading screen after max 3 seconds
    setTimeout(() => {
        console.log('Fallback: Hiding loading screen after timeout');
        hideLoadingScreen();
    }, 3000);
    
    // Initialize basic navigation immediately
    initNavigation();
});

// Initialize navigation (called early for mobile menu)
function initNavigation() {
    console.log('Initializing navigation...');
    
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (!hamburger || !navMenu) {
        console.warn('Navigation elements not found');
        return;
    }
    
    hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth <= 768) {
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (hamburger && navMenu.classList.contains('active')) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                }
                
                // Calculate offset (consider fixed nav height)
                const navHeight = 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animated-text');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.style.opacity = '1'; // Make visible
    });
}

// Initialize forms
function initForms() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            alert('Thank you! Your message has been sent. We will contact you soon.');
            this.reset();
        });
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Update footer year
function updateFooterYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
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
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Error handling for images
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        
        // If it's the kingu icon, show fallback
        if (e.target.src.includes('kingu.svg')) {
            const parent = e.target.parentElement;
            if (parent && (parent.classList.contains('main-electrical-container') || 
                parent.classList.contains('electrical-container'))) {
                e.target.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = 'E';
                fallback.style.color = '#dc3545';
                fallback.style.fontSize = 'inherit';
                parent.insertBefore(fallback, e.target.nextSibling);
            }
        }
    }
}, true);

// Handle window load event as backup
window.addEventListener('load', function() {
    console.log('Window fully loaded');
    
    // Ensure loading screen is hidden
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.log('Window load: Hiding loading screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.remove('loading');
        }, 300);
    }
});

// Quick test: Check if page is interactive
document.addEventListener('readystatechange', function() {
    console.log('Ready state:', document.readyState);
    
    if (document.readyState === 'interactive') {
        // Page is interactive, we can show content soon
        console.log('Page is interactive');
    }
    
    if (document.readyState === 'complete') {
        // Page is fully loaded
        console.log('Page is complete');
    }
});
