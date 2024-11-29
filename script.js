// Greet the user based on the time of day
function displayGreeting() {
    const greetingElement = document.getElementById("greeting");
    const hour = new Date().getHours();
    let greetingMessage = "Welcome to Smart Parking System";

    if (hour < 12) {
        greetingMessage = "Good Morning! Welcome to ParkIt";
    } else if (hour < 18) {
        greetingMessage = "Good Afternoon! Welcome to ParkIt";
    } else {
        greetingMessage = "Good Evening! Welcome to ParkIt";
    }

    greetingElement.textContent = greetingMessage;
}

// Validate the search bar input
function validateSearch(event) {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput === "") {
        event.preventDefault();
        alert("Please enter a location to search for parking.");
    }
}

// Smooth scrolling for in-page links (optional, if you have on-page anchors)
function enableSmoothScrolling() {
    const links = document.querySelectorAll("a[href^='#']");
    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

// Handle Login Form Submission
function handleLoginForm() {
    document.getElementById("loginForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email && password) {
            alert("Login successful (Placeholder: Add backend functionality)");
        } else {
            alert("Please fill in all fields.");
        }
    });
}

// Handle Sign-Up Form Submission
function handleSignUpForm() {
    document.getElementById("signupForm")?.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
        } else if (password !== confirmPassword) {
            alert("Passwords do not match.");
        } else {
            alert("Sign-Up successful (Placeholder: Add backend functionality)");
        }
    });
}

// Get elements for the Contact Modal
const contactIcon = document.getElementById("contactIcon");
const contactModal = document.getElementById("contactModal");
const closeBtn = document.querySelector(".close-btn");

// Show the modal when the icon is clicked
function openModal() {
    contactModal.style.display = "block";
}

// Hide the modal when the close button is clicked
function closeModal() {
    contactModal.style.display = "none";
}

// Close the modal if the user clicks outside it
function closeModalOnOutsideClick(event) {
    if (event.target === contactModal) {
        contactModal.style.display = "none";
    }
}

// Fetch and load the contact modal content dynamically
function loadContactModal() {
    fetch('contact-modal.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);

            // Open modal function
            function openModal() {
                contactModal.style.display = 'block';
            }

            // Add button to trigger the modal
            const contactButton = document.createElement('button');
            contactButton.textContent = 'Contact Us';
            contactButton.addEventListener('click', openModal);
            document.body.appendChild(contactButton);
        })
        .catch(error => console.error('Error loading contact modal:', error));
}

// Attach event listeners after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    displayGreeting(); // Display a dynamic greeting
    document.getElementById("searchForm").addEventListener("submit", validateSearch); // Add search validation
    enableSmoothScrolling(); // Enable smooth scrolling
    handleLoginForm(); // Handle login form submission
    handleSignUpForm(); // Handle sign-up form submission

    // Modal functionality
    contactIcon.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("click", closeModalOnOutsideClick);

    // Load contact modal content
    loadContactModal();
});
