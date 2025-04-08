document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".mobile-menu-toggle")
    const navLinks = document.querySelector(".nav-links")
  
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active")
  
        // Toggle animation for hamburger icon
        const spans = menuToggle.querySelectorAll("span")
        spans.forEach((span) => span.classList.toggle("active"))
      })
    }
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      if (navLinks && navLinks.classList.contains("active") && !event.target.closest("nav")) {
        navLinks.classList.remove("active")
  
        const spans = menuToggle.querySelectorAll("span")
        spans.forEach((span) => span.classList.remove("active"))
      }
    })
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
  
          // Close mobile menu after clicking a link
          if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active")
  
            const spans = menuToggle.querySelectorAll("span")
            spans.forEach((span) => span.classList.remove("active"))
          }
        }
      })
    })
  
    // Add active class to nav links based on current page
    const currentPage = window.location.pathname.split("/").pop()
    const navLinkElements = document.querySelectorAll(".nav-links a")
  
    navLinkElements.forEach((link) => {
      const linkPage = link.getAttribute("href")
      if (currentPage === linkPage || (currentPage === "" && linkPage === "index.html")) {
        link.classList.add("active")
      } else {
        link.classList.remove("active")
      }
    })
  
    // Simple animation for cards on scroll
    const animateOnScroll = () => {
      const cards = document.querySelectorAll(".card, .industry-item")
  
      cards.forEach((card) => {
        const cardTop = card.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (cardTop < windowHeight * 0.8) {
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }
      })
    }
  
    // Initialize card animations
    const cards = document.querySelectorAll(".card, .industry-item")
    cards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  })
  