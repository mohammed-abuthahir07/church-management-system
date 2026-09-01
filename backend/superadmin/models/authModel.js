const db = require("../../config/database");

const findSuperAdminByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT id, name, email, password, role, branch_id, status
         FROM users
         WHERE email = ?
         AND role = 'SUPER_ADMIN'
         LIMIT 1`,
        [email]
    );

    return rows[0];
};


const findSuperAdminById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, name, email, role, branch_id, status, created_at, updated_at
         FROM users
         WHERE id = ?
         AND role = 'SUPER_ADMIN'
         LIMIT 1`,
        [id]
    );

    return rows[0];
};

module.exports = {
    findSuperAdminByEmail,
    findSuperAdminById
};