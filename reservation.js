document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const locationSearch = document.getElementById('locationSearch');
    const locationSuggestions = document.getElementById('locationSuggestions');
    const gpsIcon = document.getElementById('gpsIcon');
    const reservationForm = document.getElementById('reservationForm');
    const parkingSlotDetails = document.getElementById('parkingSlotDetails'); // Section for slot owner info
    const ownerName = document.getElementById('ownerName'); // Owner name span
    const ownerPhone = document.getElementById('ownerPhone'); // Owner phone span
    const confirmationMessage = document.getElementById('confirmationMessage'); // Confirmation message section
    const reservationCode = document.getElementById('reservationCode'); // Reservation code span
    const expiryTimer = document.getElementById('expiryTimer'); // Timer display for expiry countdown

    // Receipt Section
    const receiptSection = document.getElementById('receiptSection'); // Receipt section
    const receiptDriverName = document.getElementById('receiptDriverName'); // Driver Name span
    const receiptParkingSlot = document.getElementById('receiptParkingSlot'); // Parking Slot span
    const receiptDate = document.getElementById('receiptDate'); // Date span
    const receiptTime = document.getElementById('receiptTime'); // Time span
    const receiptAmount = document.getElementById('receiptAmount'); // Amount Paid span
    const downloadReceiptButton = document.getElementById('downloadReceipt'); // Download button

    let reservationExpiryInterval; // Timer interval for code expiration

    // Helper to format date to yyyy-mm-dd
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Helper to format time to HH:mm
    function formatTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    // Set minimum date to today
    function setMinDate() {
        const today = new Date();
        dateInput.min = formatDate(today);
    }

    // Update time input to have a minimum of 5 minutes in the future
    function updateMinTime() {
        const selectedDate = new Date(dateInput.value);
        const now = new Date();

        if (formatDate(selectedDate) === formatDate(now)) {
            now.setMinutes(now.getMinutes() + 5); // Add 5 minutes buffer
            timeInput.min = formatTime(now);
        } else {
            timeInput.min = "00:00"; // Reset if not today
        }
    }

    // Validate date and time explicitly
    function validateDateTime() {
        const selectedDate = new Date(dateInput.value);
        const selectedTime = timeInput.value;
        const now = new Date();

        if (selectedDate < new Date(now.toDateString())) {
            alert('Date cannot be in the past.');
            return false;
        }

        if (formatDate(selectedDate) === formatDate(now)) {
            const [hours, minutes] = selectedTime.split(':').map(Number);
            const selectedDateTime = new Date(selectedDate.setHours(hours, minutes));
            if (selectedDateTime < new Date(now.getTime() + 5 * 60 * 1000)) {
                alert('Time must be at least 5 minutes in the future.');
                return false;
            }
        }

        return true;
    }

    // Start the 20-minute expiry timer for the confirmation code
    function startExpiryTimer(expiryTime) {
        if (reservationExpiryInterval) {
            clearInterval(reservationExpiryInterval);
        }

        reservationExpiryInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = expiryTime - now;

            if (timeLeft <= 0) {
                clearInterval(reservationExpiryInterval);
                alert("Your reservation code has expired. Please book again.");
                confirmationMessage.style.display = "none"; // Hide the confirmation message
                reservationCode.textContent = ""; // Clear the displayed code
                expiryTimer.textContent = ""; // Clear the timer display
            } else {
                const minutes = Math.floor(timeLeft / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                expiryTimer.textContent = `Code expires in: ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    // Event: Update min attributes on date/time changes
    dateInput.addEventListener('change', updateMinTime);

    // Set initial values on page load
    setMinDate();
    updateMinTime();

    // Function to fetch parking slots based on current location
    function fetchNearbyParking(latitude, longitude) {
        fetch(`/api/parking?lat=${latitude}&lng=${longitude}`)
            .then(response => response.json())
            .then(data => {
                locationSuggestions.innerHTML = '';
                locationSuggestions.style.display = 'block';

                data.parkingSlots.forEach(slot => {
                    const suggestion = document.createElement('li');
                    suggestion.textContent = slot.name;
                    suggestion.onclick = () => {
                        locationSearch.value = slot.name;
                        locationSuggestions.style.display = 'none';
                        fetchOwnerDetails(slot.id);
                    };
                    locationSuggestions.appendChild(suggestion);
                });
            })
            .catch(error => {
                console.error('Error fetching nearby parking:', error);
                alert('Error fetching nearby parking locations.');
            });
    }

    // Fetch parking slot owner details
    function fetchOwnerDetails(parkingSlotId) {
        fetch(`/api/parking/owner/${parkingSlotId}`)
            .then(response => response.json())
            .then(data => {
                ownerName.textContent = data.ownerName;
                ownerPhone.textContent = data.ownerPhone;
                parkingSlotDetails.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching owner details:', error);
                alert('Error fetching parking slot owner details.');
            });
    }

    // Function to get the current location using Geolocation API
    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchNearbyParking(latitude, longitude);
            }, error => {
                alert('Unable to fetch your location.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Event listener for the GPS icon click
    gpsIcon.addEventListener('click', () => {
        getCurrentLocation();
    });

    // Hide the suggestions list if the user clicks outside the input field
    document.addEventListener('click', (event) => {
        if (!locationSearch.contains(event.target) && !gpsIcon.contains(event.target)) {
            locationSuggestions.style.display = 'none';
        }
    });

    // Form submission handler
    reservationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateDateTime()) return;

        const reservationData = {
            location: locationSearch.value,
            date: dateInput.value,
            time: timeInput.value
        };

        fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        })
            .then(response => response.json())
            .then(data => {
                // Display confirmation message
                confirmationMessage.style.display = 'block';
                reservationCode.textContent = data.confirmationCode;

                // Populate receipt section
                receiptDriverName.textContent = "John Doe"; // Replace with dynamic data if available
                receiptParkingSlot.textContent = locationSearch.value;
                receiptDate.textContent = dateInput.value;
                receiptTime.textContent = timeInput.value;
                receiptAmount.textContent = `$${data.amountPaid || "N/A"}`; // Replace with dynamic data if available

                // Display receipt section
                receiptSection.style.display = 'block';

                // Start the timer for the code expiry
                const reservationDateTime = new Date(`${dateInput.value}T${timeInput.value}`);
                const expiryTime = new Date(reservationDateTime.getTime() + 20 * 60 * 1000);
                startExpiryTimer(expiryTime);
            })
            .catch(error => {
                console.error('Error submitting reservation:', error);
                alert('Error submitting your reservation.');
            });
    });

    // Download receipt functionality
    downloadReceiptButton.addEventListener('click', () => {
        const receiptContent = `
            Reservation Receipt\n
            Driver Name: ${receiptDriverName.textContent}\n
            Parking Slot: ${receiptParkingSlot.textContent}\n
            Date: ${receiptDate.textContent}\n
            Time: ${receiptTime.textContent}\n
            Amount Paid: ${receiptAmount.textContent}\n
        `;

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Reservation_Receipt.txt';
        link.click();
    });
});
