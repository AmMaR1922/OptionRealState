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
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY",      // Public Key من EmailJS Account
    SERVICE_ID: "YOUR_SERVICE_ID",      // Service ID من Email Services
    TEMPLATE_ID: "YOUR_TEMPLATE_ID"     // Template ID من Email Templates
};

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }
})();

// Function to send email using EmailJS
function sendEmail(fullName, email, phone, purpose) {
    const templateParams = {
        to_email: "ammar191230@gmail.com",
        from_name: fullName,
        from_email: email,
        phone: phone,
        purpose: purpose === 'invest' ? 'Invest' : 'Rent',
        message: `
New Contact Form Submission from Premium Real Estate:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Purpose: ${purpose === 'invest' ? 'Invest' : 'Rent'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This email was sent from the Premium Real Estate contact form.
        `.trim()
    };
    
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
            
            // Send email using EmailJS
            sendEmail(fullName, email, phone, purpose.value)
                .then(() => {
                    // Success
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
                    formMessage.className = 'form-message error';
                    formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or contact us directly.';
                    formMessage.style.display = 'block';
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                    
                    console.error('EmailJS Error:', error);
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



