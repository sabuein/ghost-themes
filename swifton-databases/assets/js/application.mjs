"use strict";

import { initializeCookieContainer } from "./mods/cookies.mjs";

document.addEventListener("DOMContentLoaded", () => {

  initializeCookieContainer();
  
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
  });

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
      const windowHeight = window.innerHeight * 0.85

      if (cardTop < windowHeight) {
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

  // Get all tab triggers and tab contents
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');

  // Add click event listeners to tab triggers
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      // Get the tab ID from the data-tab attribute
      const tabId = this.getAttribute('data-tab');

      // Remove active class from all triggers and contents
      tabTriggers.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to the clicked trigger and corresponding content
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Add hover effect to read more buttons
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('mouseenter', function () {
      const arrow = this.querySelector('i');
      arrow.style.transform = 'translateX(4px)';
    });

    button.addEventListener('mouseleave', function () {
      const arrow = this.querySelector('i');
      arrow.style.transform = 'translateX(0)';
    });
  });

  // Data for capabilities
  const capabilities = [
    {
      icon: "🧾",
      title: "Quotation & Sales Systems",
      description: "Custom-built tools to manage complex quotations, multi-tiered pricing, and sales workflows.",
      usedBy: "",
      features: [
        "Multi-template support",
        "Integrated site survey tools",
        "CRM-like contact management",
        "Document generation & history tracking",
      ],
    },
    {
      icon: "🛠",
      title: "Field Service & Installation Support Tools",
      description: "Software for scheduling, tracking, and supporting installation and service jobs.",
      usedBy: "",
      features: [
        "Engineer service logs (tablet integration)",
        "On-site image libraries",
        "Installation feasibility checklists",
        "Service history tracking",
        "Safety & Compliance (e.g.COSHH Assessments)",
      ],
    },
    {
      icon: "🧑‍💼",
      title: "Workforce & Recruitment Management",
      description:
        "Streamline agency and temp worker management with tools for job processing, CSV uploads, and verification.",
      usedBy: "QS Recruitment",
      features: [
        "CSV job post imports",
        "Identity verification integrations (e.g., YoTi)",
        "Remote desktop support",
        "Messaging and communication modules",
      ],
    },
    {
      icon: "📊",
      title: "Business Intelligence & Reporting Dashboards",
      description: "Integrated BI tools with real-time dashboards for sales, performance tracking, and reporting.",
      usedBy: "",
      features: ["Sales targets & metrics", "Custom reports linked to ERP systems", "Support time tracking"],
    },
    {
      icon: "📦",
      title: "ERP Integration Services",
      description: "Seamless integrations with ERP systems like Sage 200, Opera, and Dynamics.",
      usedBy: "",
      features: ["API development", "Custom reporting layers", "Data sync across finance, sales, and operations"],
    },
    {
      icon: "🌐",
      title: "Legacy System Modernization",
      description: "Turn aging desktop applications into accessible web-based solutions.",
      usedBy: "",
      features: [
        "Full system redevelopments in modern frameworks",
        "Web and mobile responsive access",
        "Secure cloud-based hosting options",
      ],
    },
    {
      icon: "🧩",
      title: "Custom CRM Solutions",
      description:
        "Tailored CRM-style systems with modular functionality to support sales, marketing, and customer service.",
      usedBy: "",
      features: ["Lead and contact tracking", "Marketing data exports", "Document and task workflows"],
    },
  ];

  const accordion = document.getElementById('capabilities-accordion');

  // Only show accordion on mobile
  function updateAccordion() {
    const accordion = document.getElementById("capabilities-accordion")
    const capabilitiesGrid = document.querySelector(".capabilities-grid")

    if (!accordion || !capabilitiesGrid) return

    if (window.innerWidth <= 768) {
      accordion.innerHTML = ""
      capabilities.forEach((capability, index) => {
        const item = document.createElement("div")
        item.className = "accordion-item"

        const header = document.createElement("div")
        header.className = "accordion-header"

        const titleDiv = document.createElement("div")
        titleDiv.className = "accordion-title"

        const icon = document.createElement("span")
        icon.className = "capability-icon"
        icon.textContent = capability.icon

        const title = document.createElement("h3")
        title.textContent = capability.title

        titleDiv.appendChild(icon)
        titleDiv.appendChild(title)

        // Use a better chevron icon
        const chevron = document.createElement("span")
        chevron.className = "accordion-icon"
        chevron.innerHTML = "▼"

        header.appendChild(titleDiv)
        header.appendChild(chevron)

        const content = document.createElement("div")
        content.className = "accordion-content"

        // Add description
        const description = document.createElement("p")
        description.textContent = capability.description
        content.appendChild(description)

        // Add "Used by" if present
        if (capability.usedBy) {
          const usedBy = document.createElement("p")
          usedBy.className = "used-by"

          const usedByText = document.createTextNode("Used by: ")
          const usedByValue = document.createElement("span")
          usedByValue.textContent = capability.usedBy

          usedBy.appendChild(usedByText)
          usedBy.appendChild(usedByValue)
          content.appendChild(usedBy)
        }

        // Add features
        const featuresDiv = document.createElement("div")
        featuresDiv.className = "features"

        const featuresTitle = document.createElement("h4")
        featuresTitle.textContent = "Features:"
        featuresDiv.appendChild(featuresTitle)

        const featuresList = document.createElement("ul")
        capability.features.forEach((feature) => {
          const featureItem = document.createElement("li")
          featureItem.textContent = feature
          featuresList.appendChild(featureItem)
        })

        featuresDiv.appendChild(featuresList)
        content.appendChild(featuresDiv)

        item.appendChild(header)
        item.appendChild(content)
        accordion.appendChild(item)

        // Add smooth animation for accordion toggle
        header.addEventListener("click", function () {
          // Toggle active class on header
          this.classList.toggle("active")

          // Toggle active class on content
          content.classList.toggle("active")

          // Add ripple effect on click
          const ripple = document.createElement("span")
          ripple.className = "ripple"
          ripple.style.left = event.clientX - this.getBoundingClientRect().left + "px"
          ripple.style.top = event.clientY - this.getBoundingClientRect().top + "px"
          this.appendChild(ripple)

          // Remove ripple after animation completes
          setTimeout(() => {
            ripple.remove()
          }, 600)
        })
      })

      // Show accordion, hide grid
      accordion.style.display = "block"
      capabilitiesGrid.style.display = "none"
    } else {
      // Hide accordion, show grid
      accordion.style.display = "none"
      capabilitiesGrid.style.display = "grid"
    }
  }

  // Add this function to animate capability cards on scroll
  function animateCapabilityCards() {
    const cards = document.querySelectorAll(".capability-card")

    cards.forEach((card) => {
      const cardTop = card.getBoundingClientRect().top
      const windowHeight = window.innerHeight * 0.85

      if (cardTop < windowHeight) {
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }
    })
  }

  // Initialize capability card animations
  function initCapabilityCardAnimations() {
    const cards = document.querySelectorAll(".capability-card")
    cards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })

    // Run animation on load and scroll
    animateCapabilityCards()
    window.addEventListener("scroll", animateCapabilityCards)
  }

  // Run animation on load and scroll
  window.addEventListener("load", animateOnScroll);
  window.addEventListener("scroll", animateOnScroll);

  // Initialize capability card animations
  initCapabilityCardAnimations();

  // Initial call
  updateAccordion();

  // Update on resize
  window.addEventListener('resize', updateAccordion);

});