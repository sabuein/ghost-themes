// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
    
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Testimonial slider
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(index) {
    // Hide all slides
    testimonialSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show the current slide and activate corresponding dot
    testimonialSlides[index].classList.add('active');
    dots[index].classList.add('active');
    
    // Update current slide index
    currentSlide = index;
}

// Initialize dots click event
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Previous button click event
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) {
            newIndex = testimonialSlides.length - 1;
        }
        showSlide(newIndex);
    });
}

// Next button click event
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        let newIndex = currentSlide + 1;
        if (newIndex >= testimonialSlides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    });
}

// Auto-rotate testimonials every 5 seconds
setInterval(() => {
    let newIndex = currentSlide + 1;
    if (newIndex >= testimonialSlides.length) {
        newIndex = 0;
    }
    showSlide(newIndex);
}, 5000);