const db = require("../../config/database");


// Create Branch
const createBranch = async (branchData) => {
    const {
        name,
        address,
        location,
        phone,
        email
    } = branchData;

    const [result] = await db.query(
        `INSERT INTO branches
        (name, address, location, phone, email)
        VALUES (?, ?, ?, ?, ?)`,
        [
            name,
            address || null,
            location || null,
            phone || null,
            email || null
        ]
    );

    return result.insertId;
};


// Get All Branches
const getAllBranches = async () => {
    const [rows] = await db.query(
        `SELECT *
         FROM branches
         ORDER BY created_at DESC`
    );

    return rows;
};


// Get Single Branch
const getBranchById = async (id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM branches
         WHERE id = ?
         LIMIT 1`,
        [id]
    );

    return rows[0];
};


// Update Branch
const updateBranch = async (id, branchData) => {
    const {
        name,
        address,
        location,
        phone,
        email
    } = branchData;

    const [result] = await db.query(
        `UPDATE branches
         SET name = ?,
             address = ?,
             location = ?,
             phone = ?,
             email = ?
         WHERE id = ?`,
        [
            name,
            address || null,
            location || null,
            phone || null,
            email || null,
            id
        ]
    );

    return result;
};


// Activate / Deactivate Branch
const updateBranchStatus = async (id, status) => {
    const [result] = await db.query(
        `UPDATE branches
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );

    return result;
};


// Delete Branch
const deleteBranch = async (id) => {
    const [result] = await db.query(
        `DELETE FROM branches
         WHERE id = ?`,
        [id]
    );

    return result;
};


module.exports = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    updateBranchStatus,
    deleteBranch
};