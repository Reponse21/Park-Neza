document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const totalBookings = document.getElementById('totalBookings');
    const availableSlots = document.getElementById('availableSlots');
    const totalEarnings = document.getElementById('totalEarnings');
    const slotsTableBody = document.getElementById('slotsTableBody');
    const reservationsTableBody = document.getElementById('reservationsTableBody');
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const notificationsList = document.getElementById('notificationsList');
    const addSlotBtn = document.getElementById('addSlotBtn');
    const accountSettingsForm = document.getElementById('accountSettingsForm');

    // API URLs (update these based on your backend)
    const API_BASE_URL = "/api"; // Base URL for API
    const OVERVIEW_URL = `${API_BASE_URL}/dashboard/overview`;
    const SLOTS_URL = `${API_BASE_URL}/dashboard/slots`;
    const RESERVATIONS_URL = `${API_BASE_URL}/dashboard/reservations`;
    const TRANSACTIONS_URL = `${API_BASE_URL}/dashboard/transactions`;
    const NOTIFICATIONS_URL = `${API_BASE_URL}/dashboard/notifications`;
    const ACCOUNT_SETTINGS_URL = `${API_BASE_URL}/dashboard/account-settings`;

    /**
     * Fetch Overview Data
     */
    function fetchOverview() {
        fetch(OVERVIEW_URL)
            .then(response => response.json())
            .then(data => {
                totalBookings.textContent = data.totalBookings;
                availableSlots.textContent = data.availableSlots;
                totalEarnings.textContent = `$${data.totalEarnings.toFixed(2)}`;
            })
            .catch(error => console.error("Error fetching overview data:", error));
    }

    /**
     * Fetch and Render Parking Slots
     */
    function fetchSlots() {
        fetch(SLOTS_URL)
            .then(response => response.json())
            .then(data => {
                slotsTableBody.innerHTML = '';
                data.slots.forEach(slot => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${slot.name}</td>
                        <td>${slot.status}</td>
                        <td>${slot.location}</td>
                        <td>
                            <button class="btn btn-edit" onclick="editSlot(${slot.id})">Edit</button>
                            <button class="btn btn-delete" onclick="deleteSlot(${slot.id})">Delete</button>
                        </td>
                    `;
                    slotsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching slots:", error));
    }

    /**
     * Fetch and Render Reservations
     */
    function fetchReservations() {
        fetch(RESERVATIONS_URL)
            .then(response => response.json())
            .then(data => {
                reservationsTableBody.innerHTML = '';
                data.reservations.forEach(reservation => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${reservation.driverName}</td>
                        <td>${reservation.slotName}</td>
                        <td>${reservation.date}</td>
                        <td>${reservation.time}</td>
                        <td>$${reservation.payment.toFixed(2)}</td>
                    `;
                    reservationsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching reservations:", error));
    }

    /**
     * Fetch and Render Transactions
     */
    function fetchTransactions() {
        fetch(TRANSACTIONS_URL)
            .then(response => response.json())
            .then(data => {
                transactionsTableBody.innerHTML = '';
                data.transactions.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${transaction.date}</td>
                        <td>$${transaction.amount.toFixed(2)}</td>
                        <td>${transaction.driverName}</td>
                    `;
                    transactionsTableBody.appendChild(row);
                });
            })
            .catch(error => console.error("Error fetching transactions:", error));
    }

    /**
     * Fetch and Render Notifications
     */
    function fetchNotifications() {
        fetch(NOTIFICATIONS_URL)
            .then(response => response.json())
            .then(data => {
                notificationsList.innerHTML = '';
                data.notifications.forEach(notification => {
                    const li = document.createElement('li');
                    li.textContent = notification.message;
                    notificationsList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching notifications:", error));
    }

    /**
     * Handle Add New Slot
     */
    addSlotBtn.addEventListener('click', () => {
        const slotName = prompt("Enter Slot Name:");
        const location = prompt("Enter Slot Location:");
        if (slotName && location) {
            fetch(SLOTS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: slotName, location }),
            })
                .then(response => {
                    if (response.ok) {
                        alert("Slot added successfully!");
                        fetchSlots(); // Refresh the slots table
                    } else {
                        alert("Failed to add slot.");
                    }
                })
                .catch(error => console.error("Error adding slot:", error));
        }
    });

    /**
     * Handle Account Settings Update
     */
    accountSettingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(accountSettingsForm);
        const data = Object.fromEntries(formData.entries());

        fetch(ACCOUNT_SETTINGS_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.ok) {
                    alert("Account settings updated successfully!");
                } else {
                    alert("Failed to update account settings.");
                }
            })
            .catch(error => console.error("Error updating account settings:", error));
    });

    // Fetch Data on Load
    fetchOverview();
    fetchSlots();
    fetchReservations();
    fetchTransactions();
    fetchNotifications();
});

// Utility Functions for Actions (e.g., Edit/Delete Slots)
function editSlot(slotId) {
    const newSlotName = prompt("Enter new slot name:");
    if (newSlotName) {
        fetch(`/api/dashboard/slots/${slotId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newSlotName }),
        })
            .then(response => {
                if (response.ok) {
                    alert("Slot updated successfully!");
                    location.reload(); // Reload the page
                } else {
                    alert("Failed to update slot.");
                }
            })
            .catch(error => console.error("Error editing slot:", error));
    }
}

function deleteSlot(slotId) {
    if (confirm("Are you sure you want to delete this slot?")) {
        fetch(`/api/dashboard/slots/${slotId}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    alert("Slot deleted successfully!");
                    location.reload(); // Reload the page
                } else {
                    alert("Failed to delete slot.");
                }
            })
            .catch(error => console.error("Error deleting slot:", error));
    }
}
