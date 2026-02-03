"use strict";

/**
 * Careers Widget
 * A standalone widget for displaying job listings and handling applications
 */

function initializeCareersWidget() {

  const jobListings = [
    {
      id: "fe-dev-01",
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      description:
        "We're looking for an experienced Frontend Developer to join our team and help build beautiful, responsive web applications.",
      requirements: [
        "5+ years of experience with modern JavaScript frameworks (React, Vue, Angular)",
        "Strong understanding of HTML5, CSS3, and responsive design",
        "Experience with state management solutions",
        "Knowledge of modern build tools and workflows",
      ],
      tags: ["JavaScript", "React", "TypeScript", "CSS3", "HTML5"],
    },
    {
      id: "be-dev-02",
      title: "Backend Developer",
      location: "Remote",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      description:
        "Join our backend team to develop scalable APIs and services that power our web and mobile applications.",
      requirements: [
        "3+ years of experience with Node.js or similar backend technologies",
        "Experience with RESTful APIs and GraphQL",
        "Knowledge of database design and optimization",
        "Understanding of cloud services (AWS, Azure, GCP)",
      ],
      tags: ["Node.js", "Express", "MongoDB", "GraphQL", "AWS"],
    },
    {
      id: "ux-des-03",
      title: "UX/UI Designer",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$85,000 - $110,000",
      description: "Help us create intuitive and engaging user experiences for our clients' digital products.",
      requirements: [
        "3+ years of experience in UX/UI design for web and mobile applications",
        "Proficiency with design tools like Figma, Sketch, or Adobe XD",
        "Understanding of user research and testing methodologies",
        "Ability to create wireframes, prototypes, and high-fidelity designs",
      ],
      tags: ["UI Design", "UX Research", "Figma", "Prototyping", "Design Systems"],
    },
  ]

  // Always include an open application option
  const openApplication = {
    id: "open-app",
    title: "Open Application",
    location: "Remote",
    type: "Full-time / Contract",
    salary: "Competitive",
    description:
      "Don't see a role that fits your skills? We're always looking for talented individuals to join our team. Submit your application and we'll reach out if there's a match.",
    requirements: [
      "Passion for technology and innovation",
      "Strong problem-solving skills",
      "Excellent communication abilities",
      "Willingness to learn and grow",
    ],
    tags: ["Open Role", "Multiple Positions"],
  }

  // Add open application to job listings
  const allJobListings = [...jobListings, openApplication];

  // Get dialog element
  const dialog = document.getElementById("application-dialog")
  const dialogClose = document.getElementById("dialog-close")
  const cancelBtn = document.getElementById("cancel-application")
  const applyButtons = document.querySelectorAll(".apply-btn")
  const jobTitleElement = document.getElementById("dialog-job-title")
  const jobIdInput = document.getElementById("job-id-input")
  const applicationForm = document.getElementById("application-form")
  const submitBtn = document.getElementById("submit-application")

  // File upload handling
  const resumeInput = document.getElementById("resume")
  const resumeFileName = document.getElementById("resume-file-name")
  const resumeFileList = document.getElementById("resume-file-list")

  const additionalDocsInput = document.getElementById("additional-docs")
  const additionalDocsFileList = document.getElementById("additional-docs-file-list")

  // Handle resume file selection
  resumeInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      resumeFileName.textContent = file.name
      displayFileInList(file, resumeFileList, true)
    }
  })

  // Handle additional documents file selection
  additionalDocsInput.addEventListener("change", (e) => {
    const files = e.target.files
    if (files.length > 0) {
      additionalDocsFileList.innerHTML = ""
      for (let i = 0; i < files.length; i++) {
        displayFileInList(files[i], additionalDocsFileList)
      }
    }
  });

  // Display file in list
  function displayFileInList(file, container, isSingleFile = false) {
    const fileItem = document.createElement("div")
    fileItem.className = "file-item"

    const fileName = document.createElement("span")
    fileName.className = "file-item-name"
    fileName.textContent = file.name

    const fileSize = document.createElement("span")
    fileSize.className = "file-item-size"
    fileSize.textContent = formatFileSize(file.size)

    const removeButton = document.createElement("button")
    removeButton.className = "file-item-remove"
    removeButton.innerHTML = "&times;"
    removeButton.setAttribute("aria-label", "Remove file")
    removeButton.addEventListener("click", () => {
      fileItem.remove()
      if (isSingleFile) {
        resumeInput.value = ""
        resumeFileName.textContent = "Upload your resume"
      } else {
        // For multiple files, we can't easily remove just one file
        // So we'll need to handle this differently in a real implementation
        // This is just a UI demonstration
      }
    })

    fileItem.appendChild(fileName)
    fileItem.appendChild(fileSize)
    fileItem.appendChild(removeButton)

    container.appendChild(fileItem)
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Open dialog when apply button is clicked
  applyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const jobId = this.getAttribute("data-job-id")
      const job = allJobListings.find((job) => job.id === jobId)

      if (job) {
        jobTitleElement.textContent = `Apply for ${job.title}`;
        jobIdInput.value = jobId;

        // Reset form
        applicationForm.reset();
        resumeFileName.textContent = "Upload your resume";
        resumeFileList.innerHTML = "";
        additionalDocsFileList.innerHTML = "";

        // Clear validation errors
        document.querySelectorAll(".form-error").forEach((el) => {
          el.textContent = "";
        });

        // Show dialog
        dialog.showModal();
      }
    })
  });

  // Close dialog
  function closeDialog() {
    dialog.close();
  }

  dialogClose.addEventListener("click", closeDialog)
  cancelBtn.addEventListener("click", closeDialog)

  // Close dialog when clicking on backdrop
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog()
    }
  })

  // Form validation
  function validateForm() {
    let isValid = true
    const requiredFields = [
      { id: "first-name", errorId: "first-name-error", message: "First name is required" },
      { id: "last-name", errorId: "last-name-error", message: "Last name is required" },
      { id: "email", errorId: "email-error", message: "Email address is required" },
      { id: "experience", errorId: "experience-error", message: "Please select your experience level" },
      {
        id: "cover-letter",
        errorId: "cover-letter-error",
        message: "Please tell us why you are interested in this position",
      },
      { id: "resume", errorId: "resume-error", message: "Resume is required" },
    ]

    // Clear previous errors
    document.querySelectorAll(".form-error").forEach((el) => {
      el.textContent = ""
    })

    // Check required fields
    requiredFields.forEach((field) => {
      const input = document.getElementById(field.id)
      const errorElement = document.getElementById(field.errorId)

      if (!input.value) {
        errorElement.textContent = field.message
        isValid = false
      }
    })

    // Validate email format
    const emailInput = document.getElementById("email")
    const emailError = document.getElementById("email-error")
    if (emailInput.value && !isValidEmail(emailInput.value)) {
      emailError.textContent = "Please enter a valid email address"
      isValid = false
    }

    return isValid
  }

  // Email validation
  function isValidEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Handle form submission
  submitBtn.addEventListener("click", () => {
    if (validateForm()) {
      // In a real implementation, you would send the form data to your server here
      // For this demo, we'll just show a success message

      // Create success message
      const successMessage = document.createElement("div")
      successMessage.className = "form-success"
      successMessage.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Your application has been submitted successfully! We'll be in touch soon.</span>
        `

      // Clear form and show success message
      dialog.querySelector(".dialog-body").innerHTML = ""
      dialog.querySelector(".dialog-body").appendChild(successMessage)

      // Change footer buttons
      dialog.querySelector(".dialog-footer").innerHTML = `
          <button class="btn btn-primary" id="close-success">Close</button>
        `

      // Add event listener to close button
      document.getElementById("close-success").addEventListener("click", closeDialog)
    }
  })

  // Check for dark mode preference
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
  if (prefersDarkMode) {
    document.documentElement.setAttribute("data-theme", "dark")
  }

  // Add animation to sections as they come into view
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll(".careers-section").forEach((section) => {
    observer.observe(section)
  })
}

export { initializeCareersWidget as default };