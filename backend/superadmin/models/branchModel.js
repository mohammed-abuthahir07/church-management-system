const db = require("../../config/database");

const createBranch = async (branchData) => {
    const {
        name,
        address,
        phone,
        email
    } = branchData;

    const [result] = await db.query(
        `INSERT INTO branches
        (name, address, phone, email)
        VALUES (?, ?, ?, ?)`,
        [
            name,
            address || null,
            phone || null,
            email || null
        ]
    );

    return result.insertId;
};

const getAllBranches = async () => {
    const [rows] = await db.query(
        `SELECT *
         FROM branches
         ORDER BY created_at DESC`
    );

    return rows;
};

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

const updateBranch = async (id, branchData) => {
    const {
        name,
        address,
        phone,
        email
    } = branchData;

    const [result] = await db.query(
        `UPDATE branches
         SET name = ?,
             address = ?,
             phone = ?,
             email = ?
         WHERE id = ?`,
        [
            name,
            address || null,
            phone || null,
            email || null,
            id
        ]
    );

    return result;
};

const updateBranchStatus = async (id, status) => {
    const [result] = await db.query(
        `UPDATE branches
         SET status = ?
         WHERE id = ?`,
        [status, id]
    );

    return result;
};

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