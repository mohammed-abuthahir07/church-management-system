const db = require("../../config/database");

// Create Member
const createMember = async (memberData) => {
    const {
        branch_id,
        name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
        joined_date
    } = memberData;

    const [result] = await db.query(
        `INSERT INTO members
        (
            branch_id,
            name,
            email,
            phone,
            address,
            date_of_birth,
            gender,
            joined_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            branch_id,
            name,
            email || null,
            phone || null,
            address || null,
            date_of_birth || null,
            gender || null,
            joined_date || null
        ]
    );

    return result.insertId;
};


// Get All Members of Branch
const getAllMembers = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM members
         WHERE branch_id = ?
         ORDER BY created_at DESC`,
        [branch_id]
    );

    return rows;
};


// Get Single Member of Branch
const getMemberById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM members
         WHERE id = ?
         AND branch_id = ?
         LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// Update Member
const updateMember = async (id, branch_id, memberData) => {
    const {
        name,
        email,
        phone,
        address,
        date_of_birth,
        gender,
        joined_date
    } = memberData;

    const [result] = await db.query(
        `UPDATE members
         SET
            name = ?,
            email = ?,
            phone = ?,
            address = ?,
            date_of_birth = ?,
            gender = ?,
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
            joined_date || null,
            id,
            branch_id
        ]
    );

    return result;
};


// Activate / Deactivate Member
const updateMemberStatus = async (id, branch_id, status) => {
    const [result] = await db.query(
        `UPDATE members
         SET status = ?
         WHERE id = ?
         AND branch_id = ?`,
        [status, id, branch_id]
    );

    return result;
};


// Delete Member
const deleteMember = async (id, branch_id) => {
    const [result] = await db.query(
        `DELETE FROM members
         WHERE id = ?
         AND branch_id = ?`,
        [id, branch_id]
    );

    return result;
};


module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    updateMemberStatus,
    deleteMember
};