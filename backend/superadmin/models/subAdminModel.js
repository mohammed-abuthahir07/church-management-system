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

// Get admin by ID
const getSubAdminById = async (id) => {
    const [rows] = await db.query(
        `SELECT id, name, email, role, branch_id, status,
                created_at, updated_at
         FROM users
         WHERE id = ?
         AND role = 'SUB_ADMIN'
         LIMIT 1`,
        [id]
    );

    return rows[0];
};

module.exports = {
    findBranchById,
    findAdminByBranchId,
    findUserByEmail,
    createSubAdmin,
    getSubAdminById
};