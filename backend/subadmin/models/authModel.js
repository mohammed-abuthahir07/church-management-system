const db = require("../../config/database");

const findSubAdminByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT
            id,
            name,
            email,
            password,
            role,
            branch_id,
            status
         FROM users
         WHERE email = ?
         AND role = 'SUB_ADMIN'
         LIMIT 1`,
        [email]
    );

    return rows[0];
};

const findSubAdminById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            u.id,
            u.name,
            u.email,
            u.role,
            u.branch_id,
            u.status,
            u.created_at,
            u.updated_at,
            b.name AS branch_name,
            b.address AS branch_address,
            b.location AS branch_location,
            b.phone AS branch_phone,
            b.email AS branch_email,
            b.status AS branch_status
         FROM users u
         LEFT JOIN branches b
            ON u.branch_id = b.id
         WHERE u.id = ?
         AND u.role = 'SUB_ADMIN'
         LIMIT 1`,
        [id]
    );

    return rows[0];
};

module.exports = {
    findSubAdminByEmail,
    findSubAdminById
};