// Translations for different locales
const translations = {
  "en-US": {
    flag: "🇺🇸",
    siteTitle: "Global Insights Blog",
    heroTitle: "Discover Amazing Content From Around The World",
    heroDescription:
      "Explore our curated collection of articles, insights, and stories from around the world. Stay informed with the latest trends, expert opinions, and in-depth analysis across technology, lifestyle, and more. Join thousands of readers who trust us for quality content.",
    ctaButton: "Start Reading Now",
    featuredTitle: "Featured Posts",
    featuredDescription: "Handpicked articles that showcase the best of our content",
    technologyTitle: "Technology & Innovation",
    technologyDescription: "Latest insights on tech trends, innovations, and digital transformation",
    lifestyleTitle: "Lifestyle & Culture",
    lifestyleDescription: "Inspiration for living your best life, from wellness to travel and beyond",
    footerText: "© 2025 Global Insights Blog. All rights reserved.",
    footerTagline: "Your source for quality content worldwide",
    localeLabel: "Language:",
  },
  "de-DE": {
    flag: "🇩🇪",
    siteTitle: "Globaler Einblicke Blog",
    heroTitle: "Entdecken Sie erstaunliche Inhalte aus der ganzen Welt",
    heroDescription:
      "Erkunden Sie unsere kuratierte Sammlung von Artikeln, Einblicken und Geschichten aus der ganzen Welt. Bleiben Sie auf dem Laufenden mit den neuesten Trends, Expertenmeinungen und tiefgehenden Analysen in den Bereichen Technologie, Lebensstil und mehr. Schließen Sie sich Tausenden von Lesern an, die uns für qualitativ hochwertige Inhalte vertrauen.",
    ctaButton: "Jetzt lesen",
    featuredTitle: "Empfohlene Beiträge",
    featuredDescription: "Handverlesene Artikel, die das Beste unserer Inhalte präsentieren",
    technologyTitle: "Technologie & Innovation",
    technologyDescription: "Neueste Einblicke in Tech-Trends, Innovationen und digitale Transformation",
    lifestyleTitle: "Lebensstil & Kultur",
    lifestyleDescription: "Inspiration für Ihr bestes Leben, von Wellness bis Reisen und darüber hinaus",
    footerText: "© 2025 Globaler Einblicke Blog. Alle Rechte vorbehalten.",
    footerTagline: "Ihre Quelle für qualitativ hochwertige Inhalte weltweit",
    localeLabel: "Sprache:",
  },
  "en-DE": {
    flag: "🇩🇪",
    siteTitle: "Global Insights Blog",
    heroTitle: "Discover Amazing Content From Around The World",
    heroDescription:
      "Explore our curated collection of articles, insights, and stories from around the world. Stay informed with the latest trends, expert opinions, and in-depth analysis across technology, lifestyle, and more. Join thousands of readers who trust us for quality content.",
    ctaButton: "Start Reading Now",
    featuredTitle: "Featured Posts",
    featuredDescription: "Handpicked articles that showcase the best of our content",
    technologyTitle: "Technology & Innovation",
    technologyDescription: "Latest insights on tech trends, innovations, and digital transformation",
    lifestyleTitle: "Lifestyle & Culture",
    lifestyleDescription: "Inspiration for living your best life, from wellness to travel and beyond",
    footerText: "© 2025 Global Insights Blog. All rights reserved.",
    footerTagline: "Your source for quality content worldwide",
    localeLabel: "Language:",
  },
  "en-NZ": {
    flag: "🇳🇿",
    siteTitle: "Global Insights Blog",
    heroTitle: "Discover Amazing Content From Around The World",
    heroDescription:
      "Explore our curated collection of articles, insights, and stories from around the world. Stay informed with the latest trends, expert opinions, and in-depth analysis across technology, lifestyle, and more. Join thousands of readers who trust us for quality content.",
    ctaButton: "Start Reading Now",
    featuredTitle: "Featured Posts",
    featuredDescription: "Handpicked articles that showcase the best of our content",
    technologyTitle: "Technology & Innovation",
    technologyDescription: "Latest insights on tech trends, innovations, and digital transformation",
    lifestyleTitle: "Lifestyle & Culture",
    lifestyleDescription: "Inspiration for living your best life, from wellness to travel and beyond",
    footerText: "© 2025 Global Insights Blog. All rights reserved.",
    footerTagline: "Your source for quality content worldwide",
    localeLabel: "Language:",
  },
  "en-AU": {
    flag: "🇦🇺",
    siteTitle: "Global Insights Blog",
    heroTitle: "Discover Amazing Content From Around The World",
    heroDescription:
      "Explore our curated collection of articles, insights, and stories from around the world. Stay informed with the latest trends, expert opinions, and in-depth analysis across technology, lifestyle, and more. Join thousands of readers who trust us for quality content.",
    ctaButton: "Start Reading Now",
    featuredTitle: "Featured Posts",
    featuredDescription: "Handpicked articles that showcase the best of our content",
    technologyTitle: "Technology & Innovation",
    technologyDescription: "Latest insights on tech trends, innovations, and digital transformation",
    lifestyleTitle: "Lifestyle & Culture",
    lifestyleDescription: "Inspiration for living your best life, from wellness to travel and beyond",
    footerText: "© 2025 Global Insights Blog. All rights reserved.",
    footerTagline: "Your source for quality content worldwide",
    localeLabel: "Language:",
  },
}

// Sample blog posts data (replace with your actual filtered data)
const blogPosts = {
  "en-US": {
    featured: [
      {
        id: 1,
        title: "The Complete Guide to Modern Web Development in 2025",
        category: "Tutorial",
        excerpt:
          "Learn the essential skills and tools you need to become a successful web developer. This comprehensive guide covers HTML5, CSS3, JavaScript ES6+, responsive design principles, and modern frameworks. Perfect for beginners and intermediate developers looking to level up their skills.",
        date: "March 15, 2025",
        readTime: "12 min read",
      },
      {
        id: 2,
        title: "Top 15 Design Trends Shaping Digital Experiences",
        category: "Design",
        excerpt:
          "Discover the cutting-edge design trends that are revolutionizing user interfaces and digital experiences. From minimalist aesthetics to bold typography, immersive 3D elements, and AI-powered personalization, explore what's defining modern design in 2025.",
        date: "March 14, 2025",
        readTime: "8 min read",
      },
      {
        id: 3,
        title: "Building Scalable Applications: Architecture Best Practices",
        category: "Development",
        excerpt:
          "Master the art of creating applications that grow seamlessly with your business. Learn about microservices architecture, cloud-native development, containerization with Docker, Kubernetes orchestration, and strategies for handling millions of users without breaking a sweat.",
        date: "March 13, 2025",
        readTime: "15 min read",
      },
      {
        id: 4,
        title: "The Future of Remote Work: Tools and Strategies",
        category: "Business",
        excerpt:
          "Explore how remote work is evolving and what tools are making distributed teams more productive than ever. From collaboration platforms to time management techniques, discover the secrets of successful remote organizations.",
        date: "March 12, 2025",
        readTime: "10 min read",
      },
    ],
    technology: [
      {
        id: 5,
        title: "AI and Machine Learning: A Practical Introduction",
        category: "Technology",
        excerpt:
          "Demystify artificial intelligence and machine learning with this hands-on guide. Learn about neural networks, deep learning frameworks, natural language processing, computer vision, and real-world applications that are transforming industries from healthcare to finance.",
        date: "March 11, 2025",
        readTime: "14 min read",
      },
      {
        id: 6,
        title: "Cloud Computing Explained: AWS, Azure, and Google Cloud",
        category: "Technology",
        excerpt:
          "Navigate the complex world of cloud infrastructure with confidence. Compare the major cloud providers, understand their services, pricing models, and learn how to choose the right platform for your specific needs. Includes practical deployment examples.",
        date: "March 10, 2025",
        readTime: "11 min read",
      },
      {
        id: 7,
        title: "Cybersecurity in 2025: Protecting Your Digital Assets",
        category: "Technology",
        excerpt:
          "Stay ahead of cyber threats with these essential security practices. Learn about zero-trust architecture, multi-factor authentication, encryption standards, vulnerability management, and how to build a security-first culture in your organization.",
        date: "March 9, 2025",
        readTime: "13 min read",
      },
      {
        id: 8,
        title: "The Rise of Quantum Computing: What You Need to Know",
        category: "Technology",
        excerpt:
          "Quantum computing is no longer science fiction. Understand the fundamentals of quantum mechanics, how quantum computers work, their potential applications, and what this means for cryptography, drug discovery, and complex problem-solving.",
        date: "March 8, 2025",
        readTime: "16 min read",
      },
    ],
    lifestyle: [
      {
        id: 9,
        title: "Achieving Work-Life Balance in a Hyper-Connected World",
        category: "Lifestyle",
        excerpt:
          "Discover practical strategies for maintaining harmony between your professional and personal life. Learn about setting boundaries, time-blocking techniques, mindfulness practices, and how to disconnect from work without guilt. Includes insights from productivity experts.",
        date: "March 7, 2025",
        readTime: "9 min read",
      },
      {
        id: 10,
        title: "Nutrition Science: Evidence-Based Eating for Optimal Health",
        category: "Lifestyle",
        excerpt:
          "Cut through the noise of fad diets with science-backed nutrition advice. Understand macronutrients, micronutrients, meal timing, and how to create sustainable eating habits that support your health goals. Includes meal planning templates and recipes.",
        date: "March 6, 2025",
        readTime: "12 min read",
      },
      {
        id: 11,
        title: "Ultimate Travel Guide: 25 Must-Visit Destinations in 2025",
        category: "Lifestyle",
        excerpt:
          "Explore the world's most exciting destinations with our comprehensive travel guide. From hidden gems in Southeast Asia to cultural hotspots in Europe, adventure destinations in South America, and sustainable tourism options. Includes budget tips and itineraries.",
        date: "March 5, 2025",
        readTime: "18 min read",
      },
      {
        id: 12,
        title: "Mindfulness and Meditation: A Beginner's Journey",
        category: "Lifestyle",
        excerpt:
          "Start your mindfulness practice with this accessible guide. Learn different meditation techniques, understand the science behind mindfulness, and discover how just 10 minutes a day can reduce stress, improve focus, and enhance overall well-being.",
        date: "March 4, 2025",
        readTime: "10 min read",
      },
    ],
  },
  "de-DE": {
    featured: [
      {
        id: 1,
        title: "Der vollständige Leitfaden zur modernen Webentwicklung 2025",
        category: "Tutorial",
        excerpt:
          "Lernen Sie die wesentlichen Fähigkeiten und Werkzeuge, die Sie benötigen, um ein erfolgreicher Webentwickler zu werden. Dieser umfassende Leitfaden behandelt HTML5, CSS3, JavaScript ES6+, responsive Design-Prinzipien und moderne Frameworks. Perfekt für Anfänger und fortgeschrittene Entwickler.",
        date: "15. März 2025",
        readTime: "12 Min. Lesezeit",
      },
      {
        id: 2,
        title: "Top 15 Design-Trends, die digitale Erlebnisse prägen",
        category: "Design",
        excerpt:
          "Entdecken Sie die innovativen Design-Trends, die Benutzeroberflächen und digitale Erlebnisse revolutionieren. Von minimalistischer Ästhetik über mutige Typografie bis hin zu immersiven 3D-Elementen und KI-gestützter Personalisierung.",
        date: "14. März 2025",
        readTime: "8 Min. Lesezeit",
      },
      {
        id: 3,
        title: "Skalierbare Anwendungen erstellen: Architektur Best Practices",
        category: "Entwicklung",
        excerpt:
          "Meistern Sie die Kunst, Anwendungen zu erstellen, die nahtlos mit Ihrem Unternehmen wachsen. Lernen Sie über Microservices-Architektur, Cloud-native Entwicklung, Containerisierung mit Docker, Kubernetes-Orchestrierung und Strategien für Millionen von Benutzern.",
        date: "13. März 2025",
        readTime: "15 Min. Lesezeit",
      },
      {
        id: 4,
        title: "Die Zukunft der Remote-Arbeit: Tools und Strategien",
        category: "Business",
        excerpt:
          "Erkunden Sie, wie sich Remote-Arbeit entwickelt und welche Tools verteilte Teams produktiver denn je machen. Von Kollaborationsplattformen bis zu Zeitmanagement-Techniken.",
        date: "12. März 2025",
        readTime: "10 Min. Lesezeit",
      },
    ],
    technology: [
      {
        id: 5,
        title: "KI und maschinelles Lernen: Eine praktische Einführung",
        category: "Technologie",
        excerpt:
          "Entmystifizieren Sie künstliche Intelligenz und maschinelles Lernen mit diesem praktischen Leitfaden. Lernen Sie über neuronale Netze, Deep-Learning-Frameworks, natürliche Sprachverarbeitung und reale Anwendungen.",
        date: "11. März 2025",
        readTime: "14 Min. Lesezeit",
      },
      {
        id: 6,
        title: "Cloud Computing erklärt: AWS, Azure und Google Cloud",
        category: "Technologie",
        excerpt:
          "Navigieren Sie selbstbewusst durch die komplexe Welt der Cloud-Infrastruktur. Vergleichen Sie die großen Cloud-Anbieter, verstehen Sie ihre Dienste und Preismodelle.",
        date: "10. März 2025",
        readTime: "11 Min. Lesezeit",
      },
      {
        id: 7,
        title: "Cybersicherheit 2025: Schutz Ihrer digitalen Assets",
        category: "Technologie",
        excerpt:
          "Bleiben Sie Cyber-Bedrohungen voraus mit diesen wesentlichen Sicherheitspraktiken. Lernen Sie über Zero-Trust-Architektur, Multi-Faktor-Authentifizierung und Verschlüsselungsstandards.",
        date: "9. März 2025",
        readTime: "13 Min. Lesezeit",
      },
      {
        id: 8,
        title: "Der Aufstieg des Quantencomputings: Was Sie wissen müssen",
        category: "Technologie",
        excerpt:
          "Quantencomputing ist keine Science-Fiction mehr. Verstehen Sie die Grundlagen der Quantenmechanik, wie Quantencomputer funktionieren und ihre potenziellen Anwendungen.",
        date: "8. März 2025",
        readTime: "16 Min. Lesezeit",
      },
    ],
    lifestyle: [
      {
        id: 9,
        title: "Work-Life-Balance in einer hypervernetzten Welt erreichen",
        category: "Lebensstil",
        excerpt:
          "Entdecken Sie praktische Strategien zur Aufrechterhaltung der Harmonie zwischen Berufs- und Privatleben. Lernen Sie über Grenzen setzen, Zeitblockierung und Achtsamkeitspraktiken.",
        date: "7. März 2025",
        readTime: "9 Min. Lesezeit",
      },
      {
        id: 10,
        title: "Ernährungswissenschaft: Evidenzbasiertes Essen für optimale Gesundheit",
        category: "Lebensstil",
        excerpt:
          "Durchbrechen Sie den Lärm von Modediäten mit wissenschaftlich fundierter Ernährungsberatung. Verstehen Sie Makronährstoffe, Mikronährstoffe und nachhaltige Essgewohnheiten.",
        date: "6. März 2025",
        readTime: "12 Min. Lesezeit",
      },
      {
        id: 11,
        title: "Ultimativer Reiseführer: 25 Must-Visit-Ziele 2025",
        category: "Lebensstil",
        excerpt:
          "Erkunden Sie die aufregendsten Reiseziele der Welt mit unserem umfassenden Reiseführer. Von versteckten Juwelen in Südostasien bis zu kulturellen Hotspots in Europa.",
        date: "5. März 2025",
        readTime: "18 Min. Lesezeit",
      },
      {
        id: 12,
        title: "Achtsamkeit und Meditation: Die Reise eines Anfängers",
        category: "Lebensstil",
        excerpt:
          "Beginnen Sie Ihre Achtsamkeitspraxis mit diesem zugänglichen Leitfaden. Lernen Sie verschiedene Meditationstechniken und die Wissenschaft hinter Achtsamkeit.",
        date: "4. März 2025",
        readTime: "10 Min. Lesezeit",
      },
    ],
  },
  "en-DE": null,
  "en-NZ": null,
  "en-AU": null,
}

// Use en-US content for English variants
blogPosts["en-DE"] = blogPosts["en-US"]
blogPosts["en-NZ"] = blogPosts["en-US"]
blogPosts["en-AU"] = blogPosts["en-US"]

// Current locale
let currentLocale = "en-US"

// Initialize the app
function initializeTestingPage() {
  // Load saved locale from localStorage
  const savedLocale = localStorage.getItem("locale")
  if (savedLocale && translations[savedLocale]) {
    currentLocale = savedLocale
  }

  // Set up locale selector
  const localeSelect = document.getElementById("locale-select")
  localeSelect.value = currentLocale
  localeSelect.addEventListener("change", handleLocaleChange)

  // Set up CTA button
  const ctaButton = document.getElementById("cta-button")
  ctaButton.addEventListener("click", handleCTAClick)

  // Render initial content
  updateContent()
}

// Handle locale change
function handleLocaleChange(event) {
  currentLocale = event.target.value
  localStorage.setItem("locale", currentLocale)
  updateContent()
}

// Update all content based on current locale
function updateContent() {
  const t = translations[currentLocale]

  // Update text content
  document.getElementById("site-title").textContent = `${t.flag} ${t.siteTitle}`
  document.getElementById("hero-title").textContent = t.heroTitle
  document.getElementById("hero-description").textContent = t.heroDescription
  document.getElementById("cta-button").textContent = t.ctaButton
  document.getElementById("featured-title").textContent = t.featuredTitle
  document.getElementById("featured-description").textContent = t.featuredDescription
  document.getElementById("technology-title").textContent = t.technologyTitle
  document.getElementById("technology-description").textContent = t.technologyDescription
  document.getElementById("lifestyle-title").textContent = t.lifestyleTitle
  document.getElementById("lifestyle-description").textContent = t.lifestyleDescription
  document.getElementById("footer-text").textContent = t.footerText
  document.getElementById("footer-tagline").textContent = t.footerTagline
  document.getElementById("locale-label").textContent = t.localeLabel

  // Update HTML lang attribute
  document.documentElement.lang = currentLocale

  // Render blog posts
  renderPosts("featured-posts", blogPosts[currentLocale].featured)
  renderPosts("technology-posts", blogPosts[currentLocale].technology)
  renderPosts("lifestyle-posts", blogPosts[currentLocale].lifestyle)
}

// Render blog posts
function renderPosts(containerId, posts) {
  const container = document.getElementById(containerId)
  container.innerHTML = ""

  posts.forEach((post) => {
    const postCard = createPostCard(post)
    container.appendChild(postCard)
  })
}

// Create a post card element
function createPostCard(post) {
  const card = document.createElement("div")
  card.className = "post-card"
  card.innerHTML = `
        <div class="post-image"></div>
        <div class="post-content">
            <span class="post-category">${post.category}</span>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-excerpt">${post.excerpt}</p>
            ${post.date ? `<div class="post-meta">${post.date} • ${post.readTime}</div>` : ""}
        </div>
    `

  card.addEventListener("click", () => handlePostClick(post))

  return card
}

// Handle post click
function handlePostClick(post) {
  console.log("Post clicked:", post)
  // Add your navigation logic here
  // For example: window.location.href = `/post/${post.id}`;
}

// Handle CTA button click
function handleCTAClick() {
  console.log("CTA button clicked")
  // Add your CTA logic here
  alert("CTA button clicked! Add your custom action here.")
}

export { initializeTestingPage as default };
