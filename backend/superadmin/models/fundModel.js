const db = require("../../config/database");

// =====================================================
// CREATE FUND ALLOCATION
// =====================================================

const createFund = async (fundData) => {
    const {
        branch_id,
        amount,
        purpose,
        allocated_date,
        description
    } = fundData;

    const [result] = await db.query(
        `INSERT INTO fund_allocations
        (
            branch_id,
            amount,
            purpose,
            allocated_date,
            description
        )
        VALUES (?, ?, ?, ?, ?)`,
        [
            branch_id,
            amount,
            purpose,
            allocated_date,
            description || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL FUND ALLOCATIONS
// =====================================================

const getAllFunds = async () => {
    const [rows] = await db.query(
        `SELECT
            f.id,
            f.branch_id,
            b.name AS branch_name,
            f.amount,
            f.purpose,
            f.allocated_date,
            f.description,
            f.created_at,
            f.updated_at

         FROM fund_allocations f

         INNER JOIN branches b
            ON f.branch_id = b.id

         ORDER BY f.allocated_date DESC, f.id DESC`
    );

    return rows;
};


// =====================================================
// GET FUND BY ID
// =====================================================

const getFundById = async (id) => {
    const [rows] = await db.query(
        `SELECT
            f.id,
            f.branch_id,
            b.name AS branch_name,
            f.amount,
            f.purpose,
            f.allocated_date,
            f.description,
            f.created_at,
            f.updated_at

         FROM fund_allocations f

         INNER JOIN branches b
            ON f.branch_id = b.id

         WHERE f.id = ?

         LIMIT 1`,
        [id]
    );

    return rows[0];
};


// =====================================================
// UPDATE FUND ALLOCATION
// =====================================================

const updateFund = async (id, fundData) => {
    const {
        branch_id,
        amount,
        purpose,
        allocated_date,
        description
    } = fundData;

    const [result] = await db.query(
        `UPDATE fund_allocations
         SET
            branch_id = ?,
            amount = ?,
            purpose = ?,
            allocated_date = ?,
            description = ?

         WHERE id = ?`,
        [
            branch_id,
            amount,
            purpose,
            allocated_date,
            description || null,
            id
        ]
    );

    return result;
};


// =====================================================
// DELETE FUND ALLOCATION
// =====================================================

const deleteFund = async (id) => {
    const [result] = await db.query(
        `DELETE FROM fund_allocations
         WHERE id = ?`,
        [id]
    );

    return result;
};


// =====================================================
// GET BRANCH FUND SUMMARY
// =====================================================

const getBranchFundSummary = async () => {
    const [rows] = await db.query(
        `SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(f.amount), 0) AS total_allocated

         FROM branches b

         LEFT JOIN fund_allocations f
            ON b.id = f.branch_id

         GROUP BY
            b.id,
            b.name

         ORDER BY total_allocated DESC`
    );

    return rows.map(row => ({
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        total_allocated: Number(row.total_allocated || 0)
    }));
};


module.exports = {
    createFund,
    getAllFunds,
    getFundById,
    updateFund,
    deleteFund,
    getBranchFundSummary
};