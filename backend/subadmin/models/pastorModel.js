const db = require("../../config/database");


// =====================================================
// CREATE PASTOR / LEADER
// =====================================================
const createPastor = async (pastorData) => {
    const {
        branch_id,
        name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
        designation,
        joined_date
    } = pastorData;

    const [result] = await db.query(
        `INSERT INTO pastors
        (
            branch_id,
            name,
            email,
            phone,
            address,
            date_of_birth,
            gender,
            designation,
            joined_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            branch_id,
            name,
            email || null,
            phone || null,
            address || null,
            date_of_birth || null,
            gender || null,
            designation,
            joined_date || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL PASTORS / LEADERS
// =====================================================
const getAllPastors = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM pastors
         WHERE branch_id = ?
         ORDER BY created_at DESC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET SINGLE PASTOR / LEADER
// =====================================================
const getPastorById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM pastors
         WHERE id = ?
         AND branch_id = ?
         LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// =====================================================
// UPDATE PASTOR / LEADER
// =====================================================
const updatePastor = async (id, branch_id, pastorData) => {
    const {
        name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
        designation,
        joined_date
    } = pastorData;

    const [result] = await db.query(
        `UPDATE pastors
         SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?,
            date_of_birth = ?,
            gender = ?,
            designation = ?,
            joined_date = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            name,
            email || null,
            phone || null,
            address || null,
            date_of_birth || null,
            gender || null,
            designation,
            joined_date || null,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// UPDATE PASTOR / LEADER STATUS
// =====================================================
const updatePastorStatus = async (id, branch_id, status) => {
    const [result] = await db.query(
        `UPDATE pastors
         SET status = ?
         WHERE id = ?
         AND branch_id = ?`,
        [status, id, branch_id]
    );

    return result;
};


// =====================================================
// DELETE PASTOR / LEADER
// =====================================================
const deletePastor = async (id, branch_id) => {
    const [result] = await db.query(
        `DELETE FROM pastors
         WHERE id = ?
         AND branch_id = ?`,
        [id, branch_id]
    );

    return result;
};


module.exports = {
    createPastor,
    getAllPastors,
    getPastorById,
    updatePastor,
    updatePastorStatus,
    deletePastor
};