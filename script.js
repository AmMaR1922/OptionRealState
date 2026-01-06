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
    PUBLIC_KEY: "uyaKio4T7vNuVoj1w",   // Already set in HTML, using same value
    SERVICE_ID: "service_j1rjw37",      // Replace with your Service ID from Email Services
    TEMPLATE_ID: "template_s1ldd07"     // Replace with your Template ID from Email Templates
};

// Initialize EmailJS (already initialized in HTML, but ensure it's ready)
(function() {
    // Wait for EmailJS to be loaded
    const initEmailJS = () => emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
    
    if (typeof emailjs !== 'undefined') {
        initEmailJS();
    } else {
        // If EmailJS isn't loaded yet, wait for it
        window.addEventListener('load', function() {
            if (typeof emailjs !== 'undefined') {
                initEmailJS();
            }
        });
    }
})();

// Function to send email using EmailJS
function sendEmail(fullName, email, phone, purpose) {
    // Template parameters - matching your EmailJS template variables:
    // {{name}}, {{title}}, {{message}}, {{time}}
    const purposeText = purpose === 'invest' ? 'Investment' : 'Rental';
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
    
    // Ensure EmailJS is initialized before sending
    if (typeof emailjs === 'undefined') {
        return Promise.reject(new Error('EmailJS library is not loaded'));
    }
    
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
            errorMessage = 'Please select whether you want to Invest or Rent.';
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
                    // Error
                    console.error('EmailJS Error:', error);
                    formMessage.className = 'form-message error';
                    
                    // Provide more specific error messages
                    let errorMsg = 'Sorry, there was an error sending your message. ';
                    if (error.text) {
                        errorMsg += error.text;
                    } else if (error.status) {
                        errorMsg += `Error code: ${error.status}. `;
                    }
                    errorMsg += 'Please try again or contact us directly.';
                    
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



