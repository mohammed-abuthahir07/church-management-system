const db = require("../../config/database");

// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (notificationData) => {

    const {
        title,
        message,
        type,
        target_type,
        branch_id
    } = notificationData;

    const [result] = await db.query(
        `INSERT INTO notifications
        (
            title,
            message,
            type,
            target_type,
            branch_id
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            title,
            message,
            type || "GENERAL",
            target_type,
            branch_id || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getAllNotifications = async () => {

    const [rows] = await db.query(
        `SELECT
            n.id,
            n.title,
            n.message,
            n.type,
            n.target_type,
            n.branch_id,
            b.name AS branch_name,
            n.status,
            n.created_at,
            n.updated_at

         FROM notifications n

         LEFT JOIN branches b
            ON n.branch_id = b.id

         ORDER BY n.created_at DESC`
    );

    return rows;
};


// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

const getNotificationById = async (id) => {

    const [rows] = await db.query(
        `SELECT
            n.id,
            n.title,
            n.message,
            n.type,
            n.target_type,
            n.branch_id,
            b.name AS branch_name,
            n.status,
            n.created_at,
            n.updated_at

         FROM notifications n

         LEFT JOIN branches b
            ON n.branch_id = b.id

         WHERE n.id = ?

         LIMIT 1`,
        [id]
    );

    return rows[0];
};


// =====================================================
// UPDATE NOTIFICATION
// =====================================================

const updateNotification = async (id, notificationData) => {

    const {
        title,
        message,
        type,
        target_type,
        branch_id,
        status
    } = notificationData;

    const [result] = await db.query(
        `UPDATE notifications
         SET
            title = ?,
            message = ?,
            type = ?,
            target_type = ?,
            branch_id = ?,
            status = ?

         WHERE id = ?`,
        [
            title,
            message,
            type || "GENERAL",
            target_type,
            branch_id || null,
            status || "ACTIVE",
            id
        ]
    );

    return result;
};


// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (id) => {

    const [result] = await db.query(
        `DELETE FROM notifications
         WHERE id = ?`,
        [id]
    );

    return result;
};


module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
};