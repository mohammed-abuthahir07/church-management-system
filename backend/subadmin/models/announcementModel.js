const db = require("../../config/database");

// =====================================================
// CREATE ANNOUNCEMENT
// =====================================================
const createAnnouncement = async (announcementData) => {
    const {
        branch_id,
        title,
        message,
        announcement_date
    } = announcementData;

    const [result] = await db.query(
        `INSERT INTO announcements
        (
            branch_id,
            title,
            message,
            announcement_date
        )
        VALUES (?, ?, ?, ?)`,
        [
            branch_id,
            title,
            message,
            announcement_date
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL ANNOUNCEMENTS
// =====================================================
const getAllAnnouncements = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            branch_id,
            title,
            message,
            announcement_date,
            status,
            created_at,
            updated_at
         FROM announcements
         WHERE branch_id = ?
         ORDER BY announcement_date DESC, created_at DESC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET ACTIVE / RECENT ANNOUNCEMENTS
// =====================================================
const getActiveAnnouncements = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            branch_id,
            title,
            message,
            announcement_date,
            status,
            created_at,
            updated_at
         FROM announcements
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         ORDER BY announcement_date DESC, created_at DESC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET SINGLE ANNOUNCEMENT
// =====================================================
const getAnnouncementById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            branch_id,
            title,
            message,
            announcement_date,
            status,
            created_at,
            updated_at
         FROM announcements
         WHERE id = ?
         AND branch_id = ?
         LIMIT 1`,
        [
            id,
            branch_id
        ]
    );

    return rows[0];
};


// =====================================================
// UPDATE ANNOUNCEMENT
// =====================================================
const updateAnnouncement = async (
    id,
    branch_id,
    announcementData
) => {
    const {
        title,
        message,
        announcement_date
    } = announcementData;

    const [result] = await db.query(
        `UPDATE announcements
         SET
            title = ?,
            message = ?,
            announcement_date = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            title,
            message,
            announcement_date,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// UPDATE ANNOUNCEMENT STATUS
// =====================================================
const updateAnnouncementStatus = async (
    id,
    branch_id,
    status
) => {
    const [result] = await db.query(
        `UPDATE announcements
         SET status = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            status,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// DELETE ANNOUNCEMENT
// =====================================================
const deleteAnnouncement = async (
    id,
    branch_id
) => {
    const [result] = await db.query(
        `DELETE FROM announcements
         WHERE id = ?
         AND branch_id = ?`,
        [
            id,
            branch_id
        ]
    );

    return result;
};


module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getActiveAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    updateAnnouncementStatus,
    deleteAnnouncement
};