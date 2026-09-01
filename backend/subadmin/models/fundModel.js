const db = require("../../config/database");

// =====================================================
// GET FUND SUMMARY FOR SUB ADMIN'S BRANCH
// =====================================================

const getFundSummary = async (branchId) => {

    // ---------------------------------------------
    // This Month
    // ---------------------------------------------

    const [[monthResult]] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS this_month
         FROM fund_allocations
         WHERE branch_id = ?
           AND YEAR(created_at) = YEAR(CURDATE())
           AND MONTH(created_at) = MONTH(CURDATE())`,
        [branchId]
    );


    // ---------------------------------------------
    // This Year
    // ---------------------------------------------

    const [[yearResult]] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS this_year
         FROM fund_allocations
         WHERE branch_id = ?
           AND YEAR(created_at) = YEAR(CURDATE())`,
        [branchId]
    );


    // ---------------------------------------------
    // Total
    // ---------------------------------------------

    const [[totalResult]] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM fund_allocations
         WHERE branch_id = ?`,
        [branchId]
    );


    return {
        this_month: Number(monthResult.this_month || 0),
        this_year: Number(yearResult.this_year || 0),
        total: Number(totalResult.total || 0)
    };
};


// =====================================================
// GET FUND ALLOCATION HISTORY
// =====================================================

const getFundHistory = async (branchId) => {

    const [rows] = await db.query(
        `SELECT
            f.id,
            f.branch_id,
            b.name AS branch_name,
            f.amount,
            f.description,
            f.created_at,
            f.updated_at
         FROM fund_allocations f
         LEFT JOIN branches b
            ON f.branch_id = b.id
         WHERE f.branch_id = ?
         ORDER BY f.created_at DESC`,
        [branchId]
    );

    return rows;
};


module.exports = {
    getFundSummary,
    getFundHistory
};