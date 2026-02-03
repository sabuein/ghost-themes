"use strict";

const image = "https://placehold.co/600x400",
  gallery = [
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
    "https://placehold.co/300x200",
  ];

function initializePortfolioWidget() {
  // Sample project data - replace with your actual projects
  const projects = [
    {
      id: 1,
      title: "E-commerce PWA",
      description:
        "A progressive web app for a fashion retailer with offline capabilities and push notifications.",
      status: "completed",
      image,
      tags: ["PWA", "React", "Node.js"],
      link: "#",
      client: "Fashion Brand",
      duration: "3 months",
      year: "2023",
      fullDescription:
        "This e-commerce PWA was built for a leading fashion retailer to enhance their mobile shopping experience. The application features offline browsing capabilities, push notifications for order updates, and a seamless checkout process. The PWA approach resulted in a 35% increase in mobile conversions and a 42% improvement in page load times compared to their previous website.",
      gallery,
    },
    {
      id: 2,
      title: "Real Estate Platform",
      description:
        "A comprehensive web platform for property listings with virtual tours and interactive maps.",
      status: "completed",
      image,
      tags: ["JavaScript", "Google Maps API", "360° Tours"],
      link: "#",
      client: "Property Management Group",
      duration: "5 months",
      year: "2022",
      fullDescription:
        "We developed a feature-rich real estate platform that revolutionized how properties are showcased online. The platform includes interactive maps, virtual 360° tours, and advanced filtering options. The implementation of real-time notifications for new listings matching user preferences resulted in a 28% increase in lead generation for our client.",
      gallery,
    },
    {
      id: 3,
      title: "Health & Fitness App",
      description:
        "A PWA for tracking workouts, nutrition, and health metrics with personalized recommendations.",
      status: "ongoing",
      image,
      tags: ["PWA", "React Native", "Health API"],
      link: "#",
      client: "Wellness Startup",
      duration: "In progress (4 months so far)",
      year: "2023-2024",
      fullDescription:
        "This ongoing project is a comprehensive health and fitness PWA that allows users to track workouts, nutrition, and various health metrics. The app provides personalized recommendations based on user data and goals. Key features include workout plans, meal tracking, progress visualization, and integration with popular fitness wearables.",
      gallery,
    },
    {
      id: 4,
      title: "Educational Platform",
      description:
        "An interactive learning platform with course management, quizzes, and progress tracking.",
      status: "ongoing",
      image,
      tags: ["JavaScript", "WebRTC", "Canvas API"],
      link: "#",
      client: "Educational Institution",
      duration: "In progress (2 months so far)",
      year: "2024",
      fullDescription:
        "We're currently developing an advanced educational platform that facilitates interactive learning experiences. The platform includes course management, interactive quizzes, real-time collaboration tools, and comprehensive progress tracking. The implementation of WebRTC enables live virtual classrooms with video conferencing and screen sharing capabilities.",
      gallery,
    },
    {
      id: 5,
      title: "Restaurant Ordering System",
      description:
        "A digital menu and ordering system with kitchen integration and payment processing.",
      status: "completed",
      image,
      tags: ["PWA", "JavaScript", "Payment API"],
      link: "#",
      client: "Restaurant Chain",
      duration: "4 months",
      year: "2023",
      fullDescription:
        "This restaurant ordering system transformed the dining experience for a popular restaurant chain. The system includes digital menus accessible via QR codes, real-time order tracking, kitchen display integration, and seamless payment processing. The implementation resulted in a 25% reduction in order processing time and a 15% increase in average order value.",
      gallery,
    },
    {
      id: 6,
      title: "Event Management Portal",
      description:
        "A comprehensive platform for event planning, ticketing, and attendee management.",
      status: "completed",
      image,
      tags: ["JavaScript", "QR Code API", "Maps Integration"],
      link: "#",
      client: "Event Management Company",
      duration: "6 months",
      year: "2022",
      fullDescription:
        "We developed a feature-rich event management portal that streamlines the entire event lifecycle. The platform includes tools for event planning, ticketing systems, attendee management, and post-event analytics. The implementation of QR code check-ins and real-time attendee tracking significantly improved the event experience for both organizers and participants.",
      gallery,
    },
  ];

  // Create the widget container
  const widgetContainer = document.getElementById("portfolio-widget");
  if (!widgetContainer) return;

  // Create filter buttons
  const filterContainer = document.createElement("div");
  filterContainer.className = "portfolio-filter";

  const filters = [
    {
      id: "all",
      label: "All Projects",
    },
    {
      id: "ongoing",
      label: "Ongoing",
    },
    {
      id: "completed",
      label: "Completed",
    },
  ];

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.className =
      filter.id === "all" ? "filter-button active" : "filter-button";
    button.textContent = filter.label;
    button.dataset.filter = filter.id;
    button.addEventListener("click", () => {
      // Update active state
      document.querySelectorAll(".filter-button").forEach((btn) => {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      // Filter projects
      filterProjects(filter.id);
    });

    filterContainer.appendChild(button);
  });

  widgetContainer.appendChild(filterContainer);

  // Create projects grid
  const projectsGrid = document.createElement("div");
  projectsGrid.className = "projects-grid";
  widgetContainer.appendChild(projectsGrid);

  // Create modal for project details
  const modal = createModal();
  document.body.appendChild(modal);

  // Initial render of all projects
  renderProjects(projects);

  // Function to filter projects
  function filterProjects(filter) {
    let filteredProjects;

    if (filter === "all") {
      filteredProjects = projects;
    } else {
      filteredProjects = projects.filter(
        (project) => project.status === filter
      );
    }

    renderProjects(filteredProjects);
  }

  // Function to render projects
  function renderProjects(projectsToRender) {
    projectsGrid.innerHTML = "";

    projectsToRender.forEach((project) => {
      const card = document.createElement("div");
      card.className = "project-card";

      const image = document.createElement("img");
      image.className = "project-image";
      image.src = project.image;
      image.alt = project.title;

      const content = document.createElement("div");
      content.className = "project-content";

      const status = document.createElement("span");
      status.className = `project-status status-${project.status}`;
      status.textContent =
        project.status === "ongoing" ? "Ongoing" : "Completed";

      const title = document.createElement("h3");
      title.className = "project-title";
      title.textContent = project.title;

      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent = project.description;

      const tags = document.createElement("div");
      tags.className = "project-tags";

      project.tags.forEach((tag) => {
        const tagElement = document.createElement("span");
        tagElement.className = "project-tag";
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
      });

      const link = document.createElement("a");
      link.className = "project-link";
      link.textContent = "View Details";
      link.href = "#";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(project);
      });

      content.appendChild(status);
      content.appendChild(title);
      content.appendChild(description);
      content.appendChild(tags);
      content.appendChild(link);

      card.appendChild(image);
      card.appendChild(content);

      projectsGrid.appendChild(card);
    });
  }

  // Function to create modal
  function createModal() {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const closeButton = document.createElement("button");
    closeButton.className = "modal-close";
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", closeModal);

    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalBody);
    modalOverlay.appendChild(modalContent);

    // Close modal when clicking outside
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    return modalOverlay;
  }

  // Function to open modal with project details
  function openModal(project) {
    const modalOverlay = document.querySelector(".modal-overlay");
    const modalBody = modalOverlay.querySelector(".modal-body");
    const modalContent = modalOverlay.querySelector(".modal-content");

    // Create modal content
    modalBody.innerHTML = "";

    const image = document.createElement("img");
    image.className = "modal-image";
    image.src = project.image;
    image.alt = project.title;

    const title = document.createElement("h2");
    title.className = "modal-title";
    title.textContent = project.title;

    const description = document.createElement("div");
    description.className = "modal-description";
    description.textContent = project.fullDescription;

    const meta = document.createElement("div");
    meta.className = "modal-meta";

    const metaItems = [
      {
        label: "Client",
        value: project.client,
      },
      {
        label: "Duration",
        value: project.duration,
      },
      {
        label: "Year",
        value: project.year,
      },
      {
        label: "Status",
        value: project.status === "ongoing" ? "Ongoing" : "Completed",
      },
    ];

    metaItems.forEach((item) => {
      const metaItem = document.createElement("div");
      metaItem.className = "modal-meta-item";

      const label = document.createElement("span");
      label.className = "modal-meta-label";
      label.textContent = item.label;

      const value = document.createElement("span");
      value.className = "modal-meta-value";
      value.textContent = item.value;

      metaItem.appendChild(label);
      metaItem.appendChild(value);
      meta.appendChild(metaItem);
    });

    const tags = document.createElement("div");
    tags.className = "project-tags";

    project.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "project-tag";
      tagElement.textContent = tag;
      tags.appendChild(tagElement);
    });

    const gallery = document.createElement("div");
    gallery.className = "modal-gallery";

    if (project.gallery && project.gallery.length > 0) {
      const galleryTitle = document.createElement("h3");
      galleryTitle.textContent = "Project Gallery";
      galleryTitle.style.marginBottom = "1rem";
      galleryTitle.style.marginTop = "1.5rem";
      galleryTitle.style.gridColumn = "1 / -1";
      gallery.appendChild(galleryTitle);

      project.gallery.forEach((img) => {
        const galleryImage = document.createElement("img");
        galleryImage.className = "gallery-image";
        galleryImage.src = img;
        galleryImage.alt = "Project gallery image";
        gallery.appendChild(galleryImage);
      });
    }

    modalContent.insertBefore(image, modalBody);
    modalBody.appendChild(title);
    modalBody.appendChild(description);
    modalBody.appendChild(meta);
    modalBody.appendChild(tags);
    modalBody.appendChild(gallery);

    // Show modal
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Function to close modal
  function closeModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";

    // Remove image from modalContent after transition
    setTimeout(() => {
      const modalImage = modalOverlay.querySelector(".modal-image");
      if (modalImage) {
        modalImage.remove();
      }
    }, 300);
  }
}

export { initializePortfolioWidget as default };
