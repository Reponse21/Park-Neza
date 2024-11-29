document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Set minimum time to current time + 5 minutes
    function updateMinTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5); // Add 5 minutes
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeInput.min = `${hours}:${minutes}`;
    }

    // Update time input minimum on page load and when date changes
    updateMinTime();
    dateInput.addEventListener('change', updateMinTime);
});

// Fetch Reservations from Backend
const fetchReservations = async () => {
    try {
        // Replace with your backend API endpoint
        const response = await fetch("http://your-backend-api.com/reservations");

        if (!response.ok) {
            throw new Error("Failed to fetch reservations.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return null; // Return null if there's an error
    }
};

// Render Reservations on the page
const renderReservations = async () => {
    const reservations = await fetchReservations();

    const activeTable = document.getElementById("activeReservations");
    const pastTable = document.getElementById("pastReservations");
    const errorMessage = document.getElementById("errorMessage");
    const errorMessagePast = document.getElementById("errorMessagePast");

    if (!reservations) {
        errorMessage.style.display = "block";
        errorMessagePast.style.display = "none"; // Hide past reservation error
        return;
    }

    const now = new Date();
    const activeReservations = reservations.filter((res) => new Date(res.date) >= now);
    const pastReservations = reservations.filter((res) => new Date(res.date) < now);

    const renderTable = (data, table) => {
        table.innerHTML = "";

        if (data.length === 0) {
            table.innerHTML = `<tr><td colspan="4">No reservations available.</td></tr>`;
        } else {
            data.forEach((res) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${res.location}</td>
                    <td>${res.date}</td>
                    <td>${res.time}</td>
                    <td>${res.status}</td>
                `;
                table.appendChild(row);
            });
        }
    };

    renderTable(activeReservations, activeTable);
    renderTable(pastReservations, pastTable);

    // Add filters for past reservations
    addSearchAndDateFilter(pastReservations, renderTable, pastTable);
};

// Add filters for location and date
const addSearchAndDateFilter = (pastReservations, renderTable, pastTable) => {
    const searchInput = document.getElementById("searchLocation");
    const datePicker = document.getElementById("filterDate");

    // Search by Location
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = pastReservations.filter((res) =>
            res.location.toLowerCase().includes(searchTerm)
        );
        renderTable(filtered, pastTable);
    });

    // Filter by Date
    datePicker.addEventListener("change", () => {
        const selectedDate = new Date(datePicker.value);
        const filtered = pastReservations.filter(
            (res) => new Date(res.date).toDateString() === selectedDate.toDateString()
        );
        renderTable(filtered, pastTable);
    });
};

// Initialize the reservations on page load
document.addEventListener("DOMContentLoaded", renderReservations);
