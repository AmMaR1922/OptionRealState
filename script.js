/* ============================================
   EmailJS Configuration - إعدادات إرسال الإيميل
   ============================================
   
   خطوات الإعداد:
   1. اذهب إلى https://www.emailjs.com/
   2. سجل حساب مجاني
   3. من Dashboard:
      - اذهب إلى Email Services وأضف Gmail
      - اذهب إلى Email Templates وأنشئ Template جديد
      - اذهب إلى Account > API Keys وانسخ Public Key
   
   4. استبدل القيم التالية:
      - YOUR_PUBLIC_KEY: Public Key من Account Settings
      - YOUR_SERVICE_ID: Service ID من Email Services
      - YOUR_TEMPLATE_ID: Template ID من Email Templates
   
   ============================================ */

// EmailJS Configuration
// IMPORTANT: Replace these with your actual EmailJS credentials:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and set up an Email Service (Gmail, etc.)
// 3. Create an Email Template
// 4. Get your Service ID and Template ID from the dashboard
// 5. Replace the values below

const EMAILJS_CONFIG = {
    PUBLIC_KEY: "zp4hEJJUJWqRGf70-".trim(),   // Public Key from EmailJS Account (copy exactly from dashboard)
    SERVICE_ID: "service_j1rjw37",      // Service ID from Email Services
    TEMPLATE_ID: "template_s1ldd07"     // Template ID from Email Templates
};

// Verify Public Key format (should not be empty and should be a string)
if (!EMAILJS_CONFIG.PUBLIC_KEY || typeof EMAILJS_CONFIG.PUBLIC_KEY !== 'string') {
    console.error('Public Key is not properly configured');
} else {
    // Log Public Key info for debugging (first 5 and last 5 chars only for security)
    const keyPreview = EMAILJS_CONFIG.PUBLIC_KEY.length > 10 
        ? EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 5) + '...' + EMAILJS_CONFIG.PUBLIC_KEY.substring(EMAILJS_CONFIG.PUBLIC_KEY.length - 5)
        : EMAILJS_CONFIG.PUBLIC_KEY;
    console.log('Public Key loaded:', keyPreview, '(Length:', EMAILJS_CONFIG.PUBLIC_KEY.length + ')');
    
    // Check for common issues
    if (EMAILJS_CONFIG.PUBLIC_KEY.includes(' ')) {
        console.warn('⚠️ WARNING: Public Key contains spaces. Remove any spaces.');
    }
    if (EMAILJS_CONFIG.PUBLIC_KEY.startsWith(' ') || EMAILJS_CONFIG.PUBLIC_KEY.endsWith(' ')) {
        console.warn('⚠️ WARNING: Public Key has leading/trailing spaces.');
    }
}

// Initialize EmailJS - ensure it's only initialized once
(function() {
    // Flag to prevent multiple initializations
    let emailjsInitialized = false;
    
    const initEmailJS = () => {
        if (emailjsInitialized) {
            return; // Already initialized
        }
        
        try {
            if (typeof emailjs !== 'undefined' && emailjs.init) {
                emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
                emailjsInitialized = true;
                console.log('EmailJS initialized successfully with Public Key:', EMAILJS_CONFIG.PUBLIC_KEY);
            } else {
                console.warn('EmailJS is not available yet');
            }
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    };
    
    // Try to initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for EmailJS script to load
            setTimeout(initEmailJS, 100);
        });
    } else {
        // DOM is already ready
        setTimeout(initEmailJS, 100);
    }
    
    // Also try on window load as backup
    window.addEventListener('load', function() {
        if (!emailjsInitialized && typeof emailjs !== 'undefined') {
            initEmailJS();
        }
    });
    
    // Polling fallback - check every 100ms for up to 3 seconds
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max
    const checkInterval = setInterval(() => {
        attempts++;
        if (typeof emailjs !== 'undefined' && !emailjsInitialized) {
            initEmailJS();
        }
        if (emailjsInitialized || attempts >= maxAttempts) {
            clearInterval(checkInterval);
            if (!emailjsInitialized) {
                console.error('EmailJS failed to load after 3 seconds');
            }
        }
    }, 100);
})();

// Function to send email using EmailJS
function sendEmail(fullName, email, phone, purpose) {
    // Ensure EmailJS is initialized before sending
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS is not loaded');
        return Promise.reject(new Error('EmailJS library is not loaded'));
    }
    
    // Verify EmailJS is properly initialized
    if (!emailjs.init || typeof emailjs.send !== 'function') {
        console.error('EmailJS is not properly initialized');
        // Try to initialize again
        try {
            emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
            console.log('Re-initialized EmailJS');
        } catch (initError) {
            console.error('Failed to initialize EmailJS:', initError);
            return Promise.reject(new Error('EmailJS initialization failed'));
        }
    }
    
    // Verify configuration
    if (!EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID.includes('YOUR_')) {
        return Promise.reject(new Error('Service ID is not configured'));
    }
    
    if (!EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID.includes('YOUR_')) {
        return Promise.reject(new Error('Template ID is not configured'));
    }
    
    // Verify Public Key is set
    if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY.includes('YOUR_')) {
        return Promise.reject(new Error('Public Key is not configured'));
    }
    
    // Template parameters - matching your EmailJS template variables:
    // {{name}}, {{title}}, {{message}}, {{time}}
    const purposeText = purpose === 'invest' ? 'Investment' : purpose === 'rent' ? 'Rental' : 'Design';
    const currentTime = new Date().toLocaleString();
    
    const templateParams = {
        name: fullName,  // Matches {{name}} in your template
        title: `${purposeText} Inquiry from ${fullName}`,  // Matches {{title}} in your template (used in subject)
        message: `
Contact Form Details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Purpose: ${purposeText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please respond to this inquiry at your earliest convenience.
        `.trim(),  // Matches {{message}} in your template
        time: currentTime,  // Matches {{time}} in your template
        // Additional variables that might be useful:
        email: email,  // In case you want to add email to template
        phone: phone,  // In case you want to add phone to template
        purpose: purposeText  // In case you want to add purpose separately
    };
    
    // Log configuration for debugging
    console.log('EmailJS Configuration:', {
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID,
        emailjsAvailable: typeof emailjs !== 'undefined'
    });
    
    // Ensure EmailJS is initialized right before sending
    try {
        emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
        console.log('EmailJS initialized with Public Key:', EMAILJS_CONFIG.PUBLIC_KEY);
    } catch (initErr) {
        console.error('Error initializing EmailJS before send:', initErr);
    }
    
    console.log('Sending email with params:', {
        serviceId: EMAILJS_CONFIG.SERVICE_ID,
        templateId: EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams: templateParams
    });
    
    return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    );
}

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset message
        formMessage.className = 'form-message';
        formMessage.style.display = 'none';
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const purpose = document.querySelector('input[name="purpose"]:checked');
        
        // Validation
        let isValid = true;
        let errorMessage = '';
        
        // Check if purpose is selected
        if (!purpose) {
            isValid = false;
            errorMessage = 'Please select whether you want to Invest, Rent, or Design.';
        }
        
        // Validate full name
        if (!fullName) {
            isValid = false;
            errorMessage = 'Please enter your full name.';
        } else if (fullName.length < 2) {
            isValid = false;
            errorMessage = 'Full name must be at least 2 characters long.';
        }
        
        // Validate email
        if (!email) {
            isValid = false;
            errorMessage = 'Please enter your email address.';
        } else if (!isValidEmail(email)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        
        // Validate phone
        if (!phone) {
            isValid = false;
            errorMessage = 'Please enter your phone number.';
        } else if (!isValidPhone(phone)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
        
        // Show error or success message
        if (!isValid) {
            formMessage.className = 'form-message error';
            formMessage.textContent = errorMessage;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Show loading state
            const submitButton = form.querySelector('.submit-button');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sending...</span>';
            
            // Check if EmailJS is configured properly
            if (EMAILJS_CONFIG.SERVICE_ID === "YOUR_SERVICE_ID" || EMAILJS_CONFIG.TEMPLATE_ID === "YOUR_TEMPLATE_ID") {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'EmailJS is not configured. Please set SERVICE_ID and TEMPLATE_ID in script.js';
                formMessage.style.display = 'block';
                
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                console.error('EmailJS Configuration Error: SERVICE_ID and TEMPLATE_ID must be set');
                return;
            }
            
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'EmailJS library is not loaded. Please check your internet connection.';
                formMessage.style.display = 'block';
                
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                
                console.error('EmailJS Error: emailjs is not defined');
                return;
            }
            
            // Debug: Log configuration before sending
            console.log('EmailJS Config:', {
                SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
                TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
                PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY,
                emailjsLoaded: typeof emailjs !== 'undefined'
            });
            
            // Send email using EmailJS
            sendEmail(fullName, email, phone, purpose.value)
                .then((response) => {
                    // Success
                    console.log('EmailJS Success:', response);
                    formMessage.className = 'form-message success';
                    formMessage.textContent = 'Thank you! Your request has been submitted successfully. We will contact you soon.';
                    formMessage.style.display = 'block';
                    
                    // Reset form
                    form.reset();
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                })
                .catch((error) => {
                    // Error - Log full error details
                    console.error('========== EmailJS Error Details ==========');
                    console.error('Full Error Object:', error);
                    console.error('Error Status:', error?.status);
                    console.error('Error Text:', error?.text);
                    console.error('Error Message:', error?.message);
                    console.error('Error Stack:', error?.stack);
                    console.error('Error String:', String(error));
                    console.error('==========================================');
                    
                    formMessage.className = 'form-message error';
                    
                    // Provide more specific error messages based on error type
                    let errorMsg = 'Sorry, there was an error sending your message. ';
                    
                    // Extract error text - try multiple ways
                    const errorText = error?.text || error?.message || String(error) || '';
                    
                    if (error?.status === 400) {
                        if (errorText.includes('Public Key') || errorText.includes('public key')) {
                            errorMsg = 'The Public Key is invalid. Please verify your Public Key in EmailJS dashboard: https://dashboard.emailjs.com/admin/account';
                        } else if (errorText.includes('Service') || errorText.includes('service')) {
                            errorMsg = 'Service ID is invalid. Please check your Service ID in EmailJS dashboard.';
                        } else if (errorText.includes('Template') || errorText.includes('template')) {
                            errorMsg = 'Template ID is invalid. Please check your Template ID in EmailJS dashboard.';
                        } else if (errorText.includes('domain') || errorText.includes('Domain')) {
                            errorMsg = 'Domain not authorized. Please add your domain in EmailJS Account settings.';
                        } else {
                            errorMsg = `Invalid request (400). ${errorText || 'Please check your EmailJS configuration.'}`;
                        }
                    } else if (error?.status === 401) {
                        errorMsg = 'Authentication failed. Please check your EmailJS Public Key.';
                    } else if (error?.status === 404) {
                        errorMsg = 'Template or Service not found. Please verify your Template ID and Service ID in EmailJS dashboard.';
                    } else if (error?.status === 429) {
                        errorMsg = 'Too many requests. Please wait a moment and try again.';
                    } else if (error?.status === 500) {
                        errorMsg = 'EmailJS server error. Please try again later.';
                    } else if (errorText) {
                        errorMsg += errorText;
                    } else if (error?.status) {
                        errorMsg += `Error code: ${error.status}. `;
                    }
                    
                    // Add debugging info
                    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                        errorMsg += ` (Check console for full details)`;
                    } else {
                        errorMsg += ' Please try again or contact us directly.';
                    }
                    
                    formMessage.textContent = errorMsg;
                    formMessage.style.display = 'block';
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                });
        }
    });
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Phone validation function (accepts various formats)
    function isValidPhone(phone) {
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        // Check if phone has at least 10 digits
        return digitsOnly.length >= 10;
    }
    
    // Add real-time validation feedback with animations
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
        // Add focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('input-focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('input-focused');
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                this.style.borderColor = '';
            }
            // Add typing animation
            this.parentElement.classList.add('input-typing');
            setTimeout(() => {
                this.parentElement.classList.remove('input-typing');
            }, 300);
        });
        
        // Add enter key animation
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
        }
        
        if (field.id === 'fullName' && value && value.length < 2) {
            isValid = false;
        }
        
        if (field.type === 'tel' && value && !isValidPhone(value)) {
            isValid = false;
        }
        
        if (!isValid) {
            field.style.borderColor = '#e74c3c';
            field.style.animation = 'shake 0.5s';
        } else {
            field.style.borderColor = '';
            field.style.animation = '';
        }
    }
    
    // Add shake animation for errors
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .input-focused input {
            transform: translateY(-2px);
        }
        .input-typing input {
            transform: scale(1.01);
        }
    `;
    document.head.appendChild(style);
});

// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.property-card, .advantage-card, .about-text, .about-image, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Add smooth hover effects for property cards
document.addEventListener('DOMContentLoaded', function() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});



