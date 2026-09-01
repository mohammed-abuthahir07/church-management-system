const db = require("../../config/database");


// =====================================================
// CREATE MEMBER
// =====================================================
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


// =====================================================
// GET ALL MEMBERS
// =====================================================
const getAllMembers = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            m.*,

            COALESCE(
                (
                    SELECT SUM(mp.amount)
                    FROM member_payments mp
                    WHERE mp.member_id = m.id
                    AND mp.branch_id = m.branch_id
                    AND MONTH(mp.payment_date) = MONTH(CURDATE())
                    AND YEAR(mp.payment_date) = YEAR(CURDATE())
                ),
                0
            ) AS this_month_amount,

            COALESCE(
                (
                    SELECT SUM(mp.amount)
                    FROM member_payments mp
                    WHERE mp.member_id = m.id
                    AND mp.branch_id = m.branch_id
                    AND YEAR(mp.payment_date) = YEAR(CURDATE())
                ),
                0
            ) AS this_year_amount

        FROM members m
        WHERE m.branch_id = ?
        ORDER BY m.created_at DESC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET SINGLE MEMBER
// =====================================================
const getMemberById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            m.*,

            COALESCE(
                (
                    SELECT SUM(mp.amount)
                    FROM member_payments mp
                    WHERE mp.member_id = m.id
                    AND mp.branch_id = m.branch_id
                    AND MONTH(mp.payment_date) = MONTH(CURDATE())
                    AND YEAR(mp.payment_date) = YEAR(CURDATE())
                ),
                0
            ) AS this_month_amount,

            COALESCE(
                (
                    SELECT SUM(mp.amount)
                    FROM member_payments mp
                    WHERE mp.member_id = m.id
                    AND mp.branch_id = m.branch_id
                    AND YEAR(mp.payment_date) = YEAR(CURDATE())
                ),
                0
            ) AS this_year_amount

        FROM members m
        WHERE m.id = ?
        AND m.branch_id = ?
        LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// =====================================================
// UPDATE MEMBER
// =====================================================
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


// =====================================================
// UPDATE MEMBER STATUS
// =====================================================
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


// =====================================================
// DELETE MEMBER
// =====================================================
const deleteMember = async (id, branch_id) => {
    const [result] = await db.query(
        `DELETE FROM members
         WHERE id = ?
         AND branch_id = ?`,
        [id, branch_id]
    );

    return result;
};


// =====================================================
// ADD MEMBER PAYMENT
// =====================================================
const addMemberPayment = async (paymentData) => {
    const {
        member_id,
        branch_id,
        amount,
        payment_date,
        notes
    } = paymentData;

    const [result] = await db.query(
        `INSERT INTO member_payments
        (
            member_id,
            branch_id,
            amount,
            payment_date,
            notes
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            member_id,
            branch_id,
            amount,
            payment_date,
            notes || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET MEMBER PAYMENT HISTORY
// =====================================================
const getMemberPayments = async (member_id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            member_id,
            branch_id,
            amount,
            payment_date,
            notes,
            created_at
         FROM member_payments
         WHERE member_id = ?
         AND branch_id = ?
         ORDER BY payment_date DESC, id DESC`,
        [member_id, branch_id]
    );

    return rows;
};


// =====================================================
// GET MEMBER PAYMENT SUMMARY
// =====================================================
const getMemberPaymentSummary = async (member_id, branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(
                SUM(
                    CASE
                        WHEN MONTH(payment_date) = MONTH(CURDATE())
                        AND YEAR(payment_date) = YEAR(CURDATE())
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS this_month_amount,

            COALESCE(
                SUM(
                    CASE
                        WHEN YEAR(payment_date) = YEAR(CURDATE())
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS this_year_amount,

            COALESCE(SUM(amount), 0) AS total_amount

         FROM member_payments
         WHERE member_id = ?
         AND branch_id = ?`,
        [member_id, branch_id]
    );

    return rows[0];
};


module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    updateMemberStatus,
    deleteMember,
    addMemberPayment,
    getMemberPayments,
    getMemberPaymentSummary
};