-- Day 11 fix: the Day 3 damage_reports table never had a category column,
-- even though it's been treated as essential since Day 5's UI and Day 6's
-- admin filters. This adds it without touching any existing data.
--
-- Run this once in phpMyAdmin's SQL tab (select the `commfix` database
-- first, or this script selects it for you below).

USE commfix;

ALTER TABLE damage_reports
  ADD COLUMN category VARCHAR(100) AFTER facility_id;

-- The facilities table was created by schema.sql but never seeded --
-- nothing could actually be reported against until now. These match the
-- facility names the frontend has used since Day 5's mock data, so the
-- resident-facing dropdown doesn't need to change at all.
INSERT INTO facilities (facility_name, facility_type, location, status) VALUES
  ('Minuyan Proper Road', 'Road', 'Minuyan Proper', 'active'),
  ('Barangay Covered Court', 'Public Facility', 'Barangay Hall Complex', 'active'),
  ('Main Drainage Line', 'Drainage', 'Purok 3', 'under_repair'),
  ('Purok 5 Streetlight', 'Streetlight', 'Purok 5', 'active');
