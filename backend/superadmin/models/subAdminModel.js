const db = require("../../config/database");

// Find branch
const findBranchById = async (branchId) => {
    const [rows] = await db.query(
        `SELECT id, name, status
         FROM branches
         WHERE id = ?
         LIMIT 1`,
        [branchId]
    );

    return rows[0];
};

// Check whether branch already has an admin
const findAdminByBranchId = async (branchId) => {
    const [rows] = await db.query(
        `SELECT id, name, email, role, branch_id, status
         FROM users
         WHERE branch_id = ?
         AND role = 'SUB_ADMIN'
         LIMIT 1`,
        [branchId]
    );

    return rows[0];
};

// Check email
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        `SELECT id, email, role
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    return rows[0];
};

// Create Branch Admin
const createSubAdmin = async (adminData) => {
    const {
        name,
        email,
        password,
        branch_id
    } = adminData;

    const [result] = await db.query(
        `INSERT INTO users
        (name, email, password, role, branch_id, status)
        VALUES (?, ?, ?, 'SUB_ADMIN', ?, 'ACTIVE')`,
        [
            name,
            email,
            password,
            branch_id
        ]
    );

    return result.insertId;
};

// Get all branch admins
const getAllSubAdmins = async () => {
    const [rows] = await db.query(
        `SELECT u.id, u.name, u.email, u.role, u.branch_id, u.status,
                u.created_at, u.updated_at,
                b.name AS branch_name
         FROM users u
         LEFT JOIN branches b ON b.id = u.branch_id
         WHERE u.role = 'SUB_ADMIN'
         ORDER BY u.created_at DESC`
    );

    return rows;
};

// Get admin by ID
const getSubAdminById = async (id) => {
    const [rows] = await db.query(
        `SELECT u.id, u.name, u.email, u.role, u.branch_id, u.status,
                u.created_at, u.updated_at,
                b.name AS branch_name
         FROM users u
         LEFT JOIN branches b ON b.id = u.branch_id
         WHERE u.id = ?
         AND u.role = 'SUB_ADMIN'
         LIMIT 1`,
        [id]
    );

    return rows[0];
};

const updateSubAdmin = async (id, adminData) => {
    const { name, email, password, branch_id } = adminData;

    if (password) {
        await db.query(
            `UPDATE users
             SET name = ?, email = ?, password = ?, branch_id = ?
             WHERE id = ? AND role = 'SUB_ADMIN'`,
            [name, email, password, branch_id, id]
        );
        return;
    }

    await db.query(
        `UPDATE users
         SET name = ?, email = ?, branch_id = ?
         WHERE id = ? AND role = 'SUB_ADMIN'`,
        [name, email, branch_id, id]
    );
};

const deleteSubAdmin = async (id) => {
    const [result] = await db.query(
        `DELETE FROM users
         WHERE id = ? AND role = 'SUB_ADMIN'`,
        [id]
    );

    return result.affectedRows;
};

module.exports = {
    findBranchById,
    findAdminByBranchId,
    findUserByEmail,
    createSubAdmin,
    getAllSubAdmins,
    getSubAdminById,
    updateSubAdmin,
    deleteSubAdmin
};