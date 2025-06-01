// Global variables
let currentBookingData = {};
let isMenuOpen = false;

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeFormValidation();
    setMinDate();
});

// Navigation Functions
function initializeNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    hamburger.addEventListener("click", function() {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle("active");
        
        // Animate hamburger
        hamburger.classList.toggle("active");
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            isMenuOpen = false;
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            
            if (targetId.startsWith("#")) {
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector(".navbar").offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: "smooth"
        });
    }
}

// Initialize scroll effects
function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections for animation
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        observer.observe(section);
    });

    // Navbar background on scroll
    window.addEventListener("scroll", function() {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(255, 255, 255, 0.98)";
        } else {
            navbar.style.background = "rgba(255, 255, 255, 0.95)";
        }
    });
}

// Booking Modal Functions
function openBookingModal(packageName, price) {
    const modal = document.getElementById("bookingModal");
    const selectedPackage = document.getElementById("selectedPackage");
    const packagePrice = document.getElementById("packagePrice");
    const basePrice = document.getElementById("basePrice");
    const totalAmount = document.getElementById("totalAmount");
    
    // Store booking data
    currentBookingData = {
        packageName: packageName,
        price: price
    };
    
    // Update modal content
    selectedPackage.textContent = packageName;
    packagePrice.textContent = `₹${price} per person`;
    basePrice.textContent = `₹${price}`;
    totalAmount.textContent = `₹${price}`;
    
    // Reset form
    document.getElementById("bookingForm").reset();
    document.getElementById("travelers").value = 1;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeBookingModal() {
    const modal = document.getElementById("bookingModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

function calculateTotal() {
    const travelers = parseInt(document.getElementById("travelers").value) || 1;
    const basePrice = currentBookingData.price;
    const total = basePrice * travelers;
    
    document.getElementById("travelersCount").textContent = travelers;
    document.getElementById("totalAmount").textContent = `₹${total}`;
}

// Process Booking Form
function processBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const travelers = parseInt(formData.get("travelers"));
    const totalAmount = currentBookingData.price * travelers;
    
    // Validate travel date
    const travelDate = new Date(formData.get("travelDate"));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (travelDate < today) {
        showErrorMessage("Please select a future travel date.", "bookingModal");
        return;
    }
    
    // Store booking details for payment
    currentBookingData.customerName = formData.get("customerName");
    currentBookingData.customerEmail = formData.get("customerEmail");
    currentBookingData.customerPhone = formData.get("customerPhone");
    currentBookingData.travelers = travelers;
    currentBookingData.travelDate = formData.get("travelDate");
    currentBookingData.specialRequests = formData.get("specialRequests");
    currentBookingData.totalAmount = totalAmount;
    
    // Close booking modal and open payment modal
    closeBookingModal();
    openPaymentModal();
}

// Payment Modal Functions
function openPaymentModal() {
    const modal = document.getElementById("paymentModal");
    const paymentPackage = document.getElementById("paymentPackage");
    const paymentTotal = document.getElementById("paymentTotal");
    
    paymentPackage.textContent = currentBookingData.packageName;
    paymentTotal.textContent = `₹${currentBookingData.totalAmount}`;
    
    // Pre-fill cardholder name
    document.getElementById("cardName").value = currentBookingData.customerName;
    
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closePaymentModal() {
    const modal = document.getElementById("paymentModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Process Payment
function processPayment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Validate card number (basic validation)
    const cardNumber = formData.get("cardNumber").replace(/\s/g, "");
    if (cardNumber.length < 16) {
        showErrorMessage("Please enter a valid card number.", "paymentModal");
        return;
    }
    
    // Validate expiry date
    const expiryDate = formData.get("expiryDate");
    if (!isValidExpiryDate(expiryDate)) {
        showErrorMessage("Please enter a valid expiry date.", "paymentModal");
        return;
    }
    
    // Validate CVV
    const cvv = formData.get("cvv");
    if (cvv.length < 3) {
        showErrorMessage("Please enter a valid CVV.", "paymentModal");
        return;
    }
    
    // Simulate payment processing
    showSuccessMessage("Processing payment...", "paymentModal");
    
    setTimeout(() => {
        // Simulate successful payment
        completeBooking();
    }, 2000);
}

function completeBooking() {
    // Close payment modal
    closePaymentModal();
    
    // Show success message
    alert(`Booking Confirmed!\n\nPackage: ${currentBookingData.packageName}\nTotal Amount: ₹${currentBookingData.totalAmount}\nCustomer: ${currentBookingData.customerName}\n\nThank you for choosing Wanderlust Tours! You will receive a confirmation email shortly.`);
    
    // Send confirmation email (simulation)
    sendConfirmationEmail();
    
    // Reset booking data
    currentBookingData = {};
}

// Contact Form Functions
function submitContactForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Basic validation
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    
    if (!name || !email || !message) {
        showErrorMessage("Please fill in all required fields.", "contact");
        return;
    }
    
    if (!isValidEmail(email)) {
        showErrorMessage("Please enter a valid email address.", "contact");
        return;
    }
    
    // Simulate form submission
    showSuccessMessage("Thank you for your message! We will get back to you within 24 hours.", "contact");
    
    // Reset form
    event.target.reset();
    
    // Log inquiry (in real app, this would be sent to server)
    console.log("Contact Form Submission:", {
        name: name,
        email: email,
        phone: formData.get("phone"),
        interest: formData.get("interest"),
        message: message,
        timestamp: new Date().toISOString()
    });
}

// Form Validation Functions
function initializeFormValidation() {
    // Format card number input
    const cardNumberInput = document.getElementById("cardNumber");
    if (cardNumberInput) {
        cardNumberInput.addEventListener("input", function() {
            let value = this.value.replace(/\s/g, "");
            let formattedValue = value.replace(/(.{4})/g, "$1 ");
            this.value = formattedValue.trim();
        });
    }
    
    // Format expiry date input
    const expiryInput = document.getElementById("expiryDate");
    if (expiryInput) {
        expiryInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, "");
            if (value.length >= 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    // CVV input validation
    const cvvInput = document.getElementById("cvv");
    if (cvvInput) {
        cvvInput.addEventListener("input", function() {
            this.value = this.value.replace(/\D/g, "");
        });
    }
}

function setMinDate() {
    const travelDateInput = document.getElementById("travelDate");
    if (travelDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        travelDateInput.min = tomorrow.toISOString().split("T")[0];
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiryDate)) return false;
    
    const [month, year] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        return false;
    }
    
    return true;
}

// Message Display Functions
function showSuccessMessage(message, containerId) {
    const container = document.getElementById(containerId) || document.querySelector(`.₹$containerId}`);
    if (container) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "success-message";
        messageDiv.textContent = message;
        
        // Remove existing messages
        const existingMessages = container.querySelectorAll(".success-message, .error-message");
        existingMessages.forEach(msg => msg.remove());
        
        container.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

function showErrorMessage(message, containerId) {
    const container = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
    if (container) {
        const messageDiv = document.createElement("div");
        messageDiv.className = "error-message";
        messageDiv.textContent = message;
        
        // Remove existing messages
        const existingMessages = container.querySelectorAll(".success-message, .error-message");
        existingMessages.forEach(msg => msg.remove());
        
        container.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Email Simulation Function
function sendConfirmationEmail() {
    // In a real application, this would send an actual email
    console.log("Sending confirmation email to:", currentBookingData.customerEmail);
    console.log("Booking Details:", {
        package: currentBookingData.packageName,
        customer: currentBookingData.customerName,
        travelers: currentBookingData.travelers,
        travelDate: currentBookingData.travelDate,
        totalAmount: currentBookingData.totalAmount,
        bookingId: generateBookingId(),
        timestamp: new Date().toISOString()
    });
}

function generateBookingId() {
    return "WT" + Date.now().toString(36).toUpperCase();
}

// Close modals when clicking outside
window.addEventListener("click", function(event) {
    const bookingModal = document.getElementById("bookingModal");
    const paymentModal = document.getElementById("paymentModal");
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    
    if (event.target === paymentModal) {
        closePaymentModal();
    }
});

// Escape key to close modals
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeBookingModal();
        closePaymentModal();
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = "0.2s";
            entry.target.classList.add("fade-in");
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", function() {
    const animateElements = document.querySelectorAll(".package-card, .destination-card, .testimonial-card");
    animateElements.forEach(el => observer.observe(el));
});

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "none";
    }
}, 10);

window.addEventListener("scroll", optimizedScrollHandler);
