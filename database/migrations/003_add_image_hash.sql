-- Day 12 completion: lets the backend recognise the SAME photo being
-- attached to the SAME report twice (e.g. a retry after a dropped
-- connection) and refuse it, instead of creating duplicate records.
--
-- file_hash is a SHA-256 fingerprint of the file's contents. The unique
-- index also protects against two identical uploads arriving at the same
-- instant. Existing rows get NULL, which the index allows.
--
-- Run once in phpMyAdmin's SQL tab.

USE commfix;

ALTER TABLE damage_images
  ADD COLUMN file_hash VARCHAR(64) NULL AFTER image_path,
  ADD UNIQUE KEY uq_report_file_hash (report_id, file_hash);
