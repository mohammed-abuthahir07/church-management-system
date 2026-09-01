-- =========================================================
-- CHURCH MANAGEMENT SYSTEM - COMPLETE TEST RESET
-- KEEP ONLY SUPER_ADMIN
-- =========================================================

USE church_management;

-- Temporarily disable Safe Update Mode
SET SQL_SAFE_UPDATES = 0;

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- =========================================================
-- DELETE ALL APPLICATION DATA
-- =========================================================

DELETE FROM announcements;

DELETE FROM donations;

DELETE FROM events;

DELETE FROM fund_allocations;

DELETE FROM member_payments;

DELETE FROM members;

DELETE FROM notifications;

DELETE FROM pastors;

DELETE FROM prayer_schedules;

-- =========================================================
-- DELETE ALL BRANCHES
-- =========================================================

DELETE FROM branches;

-- =========================================================
-- DELETE ALL USERS EXCEPT SUPER ADMIN
-- =========================================================

DELETE FROM users
WHERE role <> 'SUPER_ADMIN'
   OR role IS NULL;

COMMIT;

-- =========================================================
-- RESET AUTO INCREMENT
-- =========================================================

ALTER TABLE announcements AUTO_INCREMENT = 1;

ALTER TABLE branches AUTO_INCREMENT = 1;

ALTER TABLE donations AUTO_INCREMENT = 1;

ALTER TABLE events AUTO_INCREMENT = 1;

ALTER TABLE fund_allocations AUTO_INCREMENT = 1;

ALTER TABLE member_payments AUTO_INCREMENT = 1;

ALTER TABLE members AUTO_INCREMENT = 1;

ALTER TABLE notifications AUTO_INCREMENT = 1;

ALTER TABLE pastors AUTO_INCREMENT = 1;

ALTER TABLE prayer_schedules AUTO_INCREMENT = 1;

-- =========================================================
-- RESTORE FOREIGN KEY CHECKING
-- =========================================================

SET FOREIGN_KEY_CHECKS = 1;

-- Restore Safe Update Mode
SET SQL_SAFE_UPDATES = 1;

-- =========================================================
-- VERIFY SUPER ADMIN
-- =========================================================

SELECT
    id,
    name,
    email,
    role,
    branch_id
FROM users
WHERE role = 'SUPER_ADMIN';

-- =========================================================
-- VERIFY ALL DATA IS DELETED
-- =========================================================

SELECT COUNT(*) AS branches_remaining
FROM branches;

SELECT COUNT(*) AS members_remaining
FROM members;

SELECT COUNT(*) AS pastors_remaining
FROM pastors;

SELECT COUNT(*) AS donations_remaining
FROM donations;

SELECT COUNT(*) AS events_remaining
FROM events;

SELECT COUNT(*) AS prayer_schedules_remaining
FROM prayer_schedules;

SELECT COUNT(*) AS announcements_remaining
FROM announcements;

SELECT COUNT(*) AS notifications_remaining
FROM notifications;

SELECT COUNT(*) AS funds_remaining
FROM fund_allocations;

SELECT COUNT(*) AS member_payments_remaining
FROM member_payments;