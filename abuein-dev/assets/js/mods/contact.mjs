"use strict";

import { showNotification } from "./notifier.mjs";
// import config from "../config.mjs";

let apiKey;
const apiUrl = "https://formsubmit.co/ajax/salaheddin@abuein.dev";

const getFormSubmitAPIKey = async () => {
    // curl -X GET https://formsubmit.co/api/get-apikey/salaheddin@abuein.dev
    const get = "https://formsubmit.co/api/get-apikey/salaheddin@abuein.dev";
    return get;
};

const getFormSubmitSubmissions = async () => {
    // curl -X GET https://formsubmit.co/api/get-submissions/<apikey>
    const response = await fetch(`https://formsubmit.co/api/get-submissions/${apiKey}`);
    const data = await response.json();

    /*
    {
        "success": true,
        "submissions": [{
            "form_url": "https://formsubmit.co/support",
            "form_data": {
                "name": "Devro LABS",
                "email": "hello@devrolabs.com",
                "message": "hello! there"
            },
            "submitted_at": {
                "date": "2019-07-17 16:37:42.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            }
        }, {
            "form_url": "https://devrolabs.com/contact",
            "form_data": {
                "name": "FormSubmit",
                "email": "support@formsubmit.co",
                "message": "hello! there"
            },
            "submitted_at": {
                "date": "2019-07-17 16:37:35.000000",
                "timezone_type": 3,
                "timezone": "UTC"
            }
        }]
    }
    */

    if (!!data.success) {
        console.log(data.submissions);
        return data.submissions;
    }
};

const formSubmissionWithAJAX = async (body) => {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body)
        };
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error.message);
    }
};

// Validation functions
const validators = {
    name: (value) => {
        if (!value.trim() || value.length < 2) {
            return "Name must be at least 2 characters"
        }
        return ""
    },

    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
        if (!value.trim() || !emailRegex.test(value)) {
            return "Please enter a valid email address"
        }
        return ""
    },

    subject: (value) => {
        if (!value.trim() || value.length < 3) {
            return "Subject must be at least 3 characters"
        }
        return ""
    },

    message: (value) => {
        if (!value.trim() || value.length < 10) {
            return "Message must be at least 10 characters"
        }
        return ""
    },
};

// Validate a single field
const validateField = (field, value) => {
    const errorElement = document.getElementById(`${field}-error`)
    const inputElement = document.getElementById(field)

    const errorMessage = validators[field](value)

    if (errorMessage) {
        errorElement.textContent = errorMessage
        inputElement.classList.add("error")
        return false
    } else {
        errorElement.textContent = ""
        inputElement.classList.remove("error")
        return true
    }
};

// Validate all fields
const validateForm = () => {
    const isNameValid = validateField("name", nameInput.value)
    const isEmailValid = validateField("email", emailInput.value)
    const isSubjectValid = validateField("subject", subjectInput.value)
    const isMessageValid = validateField("message", messageInput.value)

    return isNameValid && isEmailValid && isSubjectValid && isMessageValid
};

// Contact form submission
const initializeContactForm = async () => {
    try {
        const contactForm = document.getElementById("contact-form");
        if (contactForm) {
            contactForm.addEventListener("submit", async (event) => {
                event.preventDefault();

                // Show loading state

                // Get form data
                const name = document.getElementById("name").value;
                const email = document.getElementById("email").value;
                const subject = document.getElementById("subject").value;
                const message = document.getElementById("message").value;

                // In a real application, you would send this data to your server
                console.log("Form submitted:", { name, email, subject, message });
                const body = { name, email, subject, message };

                if (contactForm.method === "post") {
                    const output = await formSubmissionWithAJAX(body);
                    if (!!output.success) {
                        // Show success message
                        showNotification(output.message);
                        console.log("Your message has been sent successfully! We'll get back to you soon.");
                        // Reset form
                        contactForm.reset();
                        await getFormSubmitSubmissions();
                    }
                } else {
                    showNotification("Trying to submit the form manually shortly...", "info");
                    setTimeout(() => {
                        // Now manually submit the form to trigger default behavior
                        contactForm.submit();
                    }, 3000); 
                }
            });
        }
    } catch (error) {
        console.error("There was an error sending your message. Please try again.");
        // Show error message
        showNotification(output.message, "error");
        return null;
    }
};

export { initializeContactForm as default };