document.getElementById("contactForm")?.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name && email && message) {
        alert("Thank you for reaching out! We will get back to you soon.");
        // Placeholder: Here, you can send data to the backend when ready.
        document.getElementById("contactForm").reset();
    } else {
        alert("Please fill in all fields.");
    }
});
