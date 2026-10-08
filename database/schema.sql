-- Commfix database schema, matching the Day 3 design exactly.
-- Run this in phpMyAdmin (or `mysql -u root -p < schema.sql`) against a
-- database named `commfix` (create the database first if it doesn't exist).

CREATE DATABASE IF NOT EXISTS commfix;
USE commfix;

-- Login + role. Applies to both residents and admins.
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('resident', 'admin') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS households (
  household_id INT AUTO_INCREMENT PRIMARY KEY,
  household_name VARCHAR(100),
  address VARCHAR(255)
);

-- Resident-only profile fields. One row per resident user_id.
CREATE TABLE IF NOT EXISTS residents (
  resident_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  household_id INT,
  contact_number VARCHAR(20),
  address VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (household_id) REFERENCES households(household_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS facilities (
  facility_id INT AUTO_INCREMENT PRIMARY KEY,
  facility_name VARCHAR(150) NOT NULL,
  facility_type VARCHAR(50),
  location VARCHAR(255),
  status ENUM('active', 'under_repair', 'decommissioned') DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS damage_reports (
  report_id INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  facility_id INT NOT NULL,
  category VARCHAR(100),
  description TEXT,
  location VARCHAR(255),
  status ENUM('pending', 'under_review', 'verified', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
  severity ENUM('low', 'moderate', 'severe'),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES residents(resident_id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(facility_id)
);

CREATE TABLE IF NOT EXISTS damage_images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  file_hash VARCHAR(64) NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_report_file_hash (report_id, file_hash),
  FOREIGN KEY (report_id) REFERENCES damage_reports(report_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_assessments (
  assessment_id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  damage_type VARCHAR(100),
  severity ENUM('low', 'moderate', 'severe'),
  confidence DECIMAL(5,2),
  analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES damage_reports(report_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  report_id INT,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (report_id) REFERENCES damage_reports(report_id) ON DELETE SET NULL
);

-- Recommended on Day 1/3 so status changes are auditable, not just the
-- current status sitting on damage_reports.
CREATE TABLE IF NOT EXISTS status_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  status ENUM('pending', 'under_review', 'verified', 'in_progress', 'resolved', 'rejected') NOT NULL,
  remarks TEXT,
  changed_by INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES damage_reports(report_id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(user_id) ON DELETE SET NULL
);
