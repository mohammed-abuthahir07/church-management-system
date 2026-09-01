const db = require("../../config/database");

// =====================================================
// GET NOTIFICATIONS FOR LOGGED-IN SUB ADMIN
// =====================================================

const getNotificationsForBranch = async (branchId) => {
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
         WHERE
            n.status = 'ACTIVE'
            AND (
                n.target_type = 'ALL'
                OR (
                    n.target_type = 'BRANCH'
                    AND n.branch_id = ?
                )
            )
         ORDER BY n.created_at DESC`,
        [branchId]
    );

    return rows;
};


// =====================================================
// GET SINGLE NOTIFICATION
// Only if it belongs to ALL or this Sub Admin's branch
// =====================================================

const getNotificationByIdForBranch = async (id, branchId) => {
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
         WHERE
            n.id = ?
            AND n.status = 'ACTIVE'
            AND (
                n.target_type = 'ALL'
                OR (
                    n.target_type = 'BRANCH'
                    AND n.branch_id = ?
                )
            )
         LIMIT 1`,
        [id, branchId]
    );

    return rows[0];
};


module.exports = {
    getNotificationsForBranch,
    getNotificationByIdForBranch
};