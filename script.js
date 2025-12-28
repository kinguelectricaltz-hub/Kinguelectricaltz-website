/**
 * Kingu Electrical Company Website - JavaScript
 * All interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileNavigation();
    initFormSubmissions();
    initScrollAnimations();
    initBookingForm();
    initCurrentYear();
    initNotifications();
});

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

// Initialize video player when DOM is loaded
document.addEventListener('DOMContentLoaded', initVideoPlayer);

// ===== ADDITIONAL ENHANCEMENTS =====

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

window.addEventListener('scroll', updateActiveNavLink);

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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLazyLoading);