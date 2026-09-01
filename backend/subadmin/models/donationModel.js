const db = require("../../config/database");

// =====================================================
// CREATE DONATION
// =====================================================
const createDonation = async (donationData) => {
    const {
        branch_id,
        member_id,
        amount,
        payment_date,
        purpose
    } = donationData;

    const [result] = await db.query(
        `INSERT INTO donations
        (
            branch_id,
            member_id,
            amount,
            payment_date,
            purpose
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            branch_id,
            member_id,
            amount,
            payment_date,
            purpose || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL DONATIONS FOR BRANCH
// =====================================================
const getAllDonations = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.id,
            d.branch_id,
            d.member_id,
            m.name AS member_name,
            m.email AS member_email,
            m.phone AS member_phone,
            d.amount,
            d.payment_date,
            d.purpose,
            d.status,
            d.created_at,
            d.updated_at
         FROM donations d
         INNER JOIN members m
            ON d.member_id = m.id
         WHERE d.branch_id = ?
         ORDER BY d.payment_date DESC, d.created_at DESC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET SINGLE DONATION
// =====================================================
const getDonationById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.id,
            d.branch_id,
            d.member_id,
            m.name AS member_name,
            m.email AS member_email,
            m.phone AS member_phone,
            d.amount,
            d.payment_date,
            d.purpose,
            d.status,
            d.created_at,
            d.updated_at
         FROM donations d
         INNER JOIN members m
            ON d.member_id = m.id
         WHERE d.id = ?
         AND d.branch_id = ?
         LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// =====================================================
// GET MEMBER DONATIONS
// =====================================================
const getMemberDonations = async (member_id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.id,
            d.member_id,
            m.name AS member_name,
            d.amount,
            d.payment_date,
            d.purpose,
            d.status,
            d.created_at
         FROM donations d
         INNER JOIN members m
            ON d.member_id = m.id
         WHERE d.member_id = ?
         AND d.branch_id = ?
         ORDER BY d.payment_date DESC, d.created_at DESC`,
        [
            member_id,
            branch_id
        ]
    );

    return rows;
};


// =====================================================
// THIS MONTH TOTAL
// =====================================================
const getCurrentMonthTotal = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         AND YEAR(payment_date) = YEAR(CURDATE())
         AND MONTH(payment_date) = MONTH(CURDATE())`,
        [branch_id]
    );

    return rows[0].total;
};


// =====================================================
// THIS YEAR TOTAL
// =====================================================
const getCurrentYearTotal = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         AND YEAR(payment_date) = YEAR(CURDATE())`,
        [branch_id]
    );

    return rows[0].total;
};


// =====================================================
// UPDATE DONATION
// =====================================================
const updateDonation = async (
    id,
    branch_id,
    donationData
) => {
    const {
        member_id,
        amount,
        payment_date,
        purpose
    } = donationData;

    const [result] = await db.query(
        `UPDATE donations
         SET
            member_id = ?,
            amount = ?,
            payment_date = ?,
            purpose = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            member_id,
            amount,
            payment_date,
            purpose || null,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// UPDATE DONATION STATUS
// =====================================================
const updateDonationStatus = async (
    id,
    branch_id,
    status
) => {
    const [result] = await db.query(
        `UPDATE donations
         SET status = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            status,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// DELETE DONATION
// =====================================================
const deleteDonation = async (id, branch_id) => {
    const [result] = await db.query(
        `DELETE FROM donations
         WHERE id = ?
         AND branch_id = ?`,
        [
            id,
            branch_id
        ]
    );

    return result;
};


module.exports = {
    createDonation,
    getAllDonations,
    getDonationById,
    getMemberDonations,
    getCurrentMonthTotal,
    getCurrentYearTotal,
    updateDonation,
    updateDonationStatus,
    deleteDonation
};