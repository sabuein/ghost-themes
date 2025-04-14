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

    // Get all tab triggers and tab contents
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const tabContents = document.querySelectorAll('.tab-content');

  // Add click event listeners to tab triggers
  tabTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
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
    button.addEventListener('mouseenter', function() {
      const arrow = this.querySelector('i');
      arrow.style.transform = 'translateX(4px)';
    });
    
    button.addEventListener('mouseleave', function() {
      const arrow = this.querySelector('i');
      arrow.style.transform = 'translateX(0)';
    });
  });

  const capabilities = [
    {
        title: 'Custom Business Applications',
        content: 'Including order processing systems, delivery tracking, inspection tools, quotation management, and dashboard reporting. We work closely with departments like Sales, Operations, and Manufacturing to align the tools with their needs.'
    },
    {
        title: 'Systems Integration',
        content: 'Seamless API integrations with platforms such as Sage 200, order management systems, identity verification tools (e.g., YoTi), and remote desktop environments.'
    },
    {
        title: 'Manufacturing & Engineering Tools',
        content: 'Critical systems including web applications for manufacturing operations, PCB printing workflows, inspection automation, and drawing/data management.'
    },
    {
        title: 'Recruitment & Workforce Solutions',
        content: 'Platforms for managing temporary and agency staff, identity checking, job posting via CSV uploads, and communication via SMS integration.'
    },
    {
        title: 'Legacy System Support & Modernisation',
        content: 'Support for long-standing desktop applications (e.g., 15+ years old), including updates, maintenance, remote access setups, and performance enhancements.'
    },
    {
        title: 'Ongoing Support & Maintenance',
        content: 'Dedicated support arrangements for clients with monthly service models, ensuring continuous system performance and adaptability.'
    }
];

const accordion = document.getElementById('capabilities-accordion');

// Only show accordion on mobile
function updateAccordion() {
    if (window.innerWidth <= 768) {
        accordion.innerHTML = '';
        capabilities.forEach((capability, index) => {
            const item = document.createElement('div');
            item.className = 'accordion-item';
            
            const header = document.createElement('div');
            header.className = 'accordion-header';
            header.innerHTML = `
                <span>${capability.title}</span>
                <span class="accordion-icon">▼</span>
            `;
            
            const content = document.createElement('div');
            content.className = 'accordion-content';
            content.innerHTML = `<p>${capability.content}</p>`;
            
            item.appendChild(header);
            item.appendChild(content);
            accordion.appendChild(item);
            
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                content.classList.toggle('active');
            });
        });
        
        // Show accordion, hide grid
        accordion.style.display = 'block';
        document.querySelector('.capabilities-grid').style.display = 'none';
    } else {
        // Hide accordion, show grid
        accordion.style.display = 'none';
        document.querySelector('.capabilities-grid').style.display = 'grid';
    }
}
  
    // Run animation on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)

    // Initial call
updateAccordion();

// Update on resize
window.addEventListener('resize', updateAccordion);

  })
  