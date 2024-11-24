-- Create the 'Users' table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255),
    role ENUM('admin', 'user') NOT NULL
);

-- Create the 'Parking_Spaces' table
CREATE TABLE Parking_Spaces (
    parking_id INT PRIMARY KEY AUTO_INCREMENT,
    location VARCHAR(100),
    space_number INT,
    availability_status ENUM('available', 'occupied', 'reserved'),
    sensor_id INT,
    FOREIGN KEY (sensor_id) REFERENCES Sensors(sensor_id)
);

-- Create the 'Reservations' table
CREATE TABLE Reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    parking_id INT,
    start_time DATETIME,
    end_time DATETIME,
    total_price DECIMAL(10, 2),
    reservation_status ENUM('active', 'completed', 'canceled'),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (parking_id) REFERENCES Parking_Spaces(parking_id)
);

-- Create the 'Payments' table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    reservation_id INT,
    amount DECIMAL(10, 2),
    payment_date DATETIME,
    payment_method ENUM('m-pesa', 'credit_card', 'debit_card', 'cash'),
    transaction_status ENUM('pending', 'successful', 'failed'),
    FOREIGN KEY (reservation_id) REFERENCES Reservations(reservation_id)
);
