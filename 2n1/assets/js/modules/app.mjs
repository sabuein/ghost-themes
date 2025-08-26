"use strict";

// Utility functions
const utils = {
  // Debounce function for performance optimization
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function for scroll events
  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments

      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  // Format date for display
  formatDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date))
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
};

class Website {
  constructor() {
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupContactForm()
    this.setupScrollAnimations()
    this.setupMobileMenu()
  }

  // Navigation functionality
  setupNavigation() {

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const offsetTop = target.offsetTop - 20
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }

  // Mobile menu functionality
setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const sidenav = document.getElementById("sidenav")

  if (mobileMenuBtn && sidenav) {
    console.log("Mobile menu elements found") // Debug log

    mobileMenuBtn.addEventListener("click", () => {
      console.log("Menu button clicked") // Debug log

      mobileMenuBtn.classList.toggle("active")
      sidenav.classList.toggle("active")

      // Prevent body scroll when menu is open
      if (sidenav.classList.contains("active")) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    })

    // Close menu when clicking on nav links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          mobileMenuBtn.classList.remove("active")
          sidenav.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        sidenav.classList.contains("active") &&
        !sidenav.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        mobileMenuBtn.classList.remove("active")
        sidenav.classList.remove("active")
        document.body.style.overflow = ""
      }
    })
  } else {
    console.log("Mobile menu elements not found") // Debug log
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidenav.classList.remove("active")
      if (mobileMenuBtn) {
        mobileMenuBtn.classList.remove("active")
      }
      document.body.style.overflow = ""
    }
  })
}

  // Contact form handling
  setupContactForm() {
    const form = document.getElementById("contactForm")

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmission(form)
      })

      // Real-time form validation
      const inputs = form.querySelectorAll("input, select, textarea")
      inputs.forEach((input) => {
        input.addEventListener("blur", () => this.validateField(input))
        input.addEventListener("input", () => this.clearFieldError(input))
      })
    }
  }

  validateField(field) {
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    // Remove existing error styling
    this.clearFieldError(field)

    // Validation rules
    switch (field.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (value && !emailRegex.test(value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        }
        break
      case "text":
        if (field.hasAttribute("required") && value.length < 2) {
          isValid = false
          errorMessage = "This field must be at least 2 characters long"
        }
        break
      default:
        if (field.hasAttribute("required") && !value) {
          isValid = false
          errorMessage = "This field is required"
        }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  showFieldError(field, message) {
    field.classList.add("error")

    // Remove existing error message
    const existingError = field.parentNode.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    // Add error message
    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.textContent = message
    field.parentNode.appendChild(errorDiv)
  }

  clearFieldError(field) {
    field.classList.remove("error")
    const errorMessage = field.parentNode.querySelector(".error-message")
    if (errorMessage) {
      errorMessage.remove()
    }
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate all required fields
    const requiredInputs = form.querySelectorAll("input[required], select[required], textarea[required]");
    let isFormValid = true;

    requiredInputs.forEach((input) => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showNotification("Please correct the errors above", "error");
      return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    try {
      // Simulate API call (replace with actual endpoint)
      // await this.simulateFormSubmission(data);
      form.submit();
      // Success handling
      this.showNotification("Thank you for your message! We'll get back to you soon.", "success");
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showNotification("Sorry, there was an error sending your message. Please try again.", "error");
    } finally {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }
  }

  // Simulate form submission (replace with actual API call)
  simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Log form data (in production, send to your backend)
        console.log("Form submission data:", data);

        // Simulate success (90% success rate for demo)
        if (Math.random() > 0.1) {
          resolve(data);
        } else {
          reject(new Error("Simulated network error"));
        }
      }, 2000);
    })
  }

  showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to DOM and animate in
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000)
  }

  // Scroll animations
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // entry.target.classList.add("fade-in-up")
          observer.unobserve(entry.target)
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
            .focus-card, 
            .portfolio-card, 
            .approach-card, 
            .value-card, 
            .company-detail, 
            .stat-card, 
            .strategy-item, 
            .faq-item,
            .contact-method,
            .criteria-item
        `);

    animateElements.forEach((el) => {
      observer.observe(el);
    });
  }
}

export { utils, Website };