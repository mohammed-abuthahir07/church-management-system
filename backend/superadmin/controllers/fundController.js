const fundModel = require("../models/fundModel");
const db = require("../../config/database");


// =====================================================
// CREATE FUND ALLOCATION
// =====================================================

const createFund = async (req, res) => {
    try {

        const {
            branch_id,
            amount,
            purpose,
            allocated_date,
            description
        } = req.body;


        // -----------------------------
        // Validation
        // -----------------------------

        if (!branch_id) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required"
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        if (!purpose || !purpose.trim()) {
            return res.status(400).json({
                success: false,
                message: "Purpose is required"
            });
        }

        if (!allocated_date) {
            return res.status(400).json({
                success: false,
                message: "Allocated date is required"
            });
        }


        // -----------------------------
        // Check branch
        // -----------------------------

        const [branches] = await db.query(
            `SELECT id, name, status
             FROM branches
             WHERE id = ?
             LIMIT 1`,
            [branch_id]
        );

        if (!branches.length) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }


        // -----------------------------
        // Create
        // -----------------------------

        const fundId = await fundModel.createFund({
            branch_id,
            amount: Number(amount),
            purpose: purpose.trim(),
            allocated_date,
            description
        });


        // -----------------------------
        // Get created record
        // -----------------------------

        const fund =
            await fundModel.getFundById(fundId);


        res.status(201).json({
            success: true,
            message: "Fund allocated successfully",
            fund
        });

    } catch (error) {

        console.error(
            "Create fund allocation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to allocate fund"
        });
    }
};


// =====================================================
// GET ALL FUND ALLOCATIONS
// =====================================================

const getAllFunds = async (req, res) => {
    try {

        const funds =
            await fundModel.getAllFunds();

        res.json({
            success: true,
            message: "Fund allocations fetched successfully",
            count: funds.length,
            funds
        });

    } catch (error) {

        console.error(
            "Get fund allocations error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fund allocations"
        });
    }
};


// =====================================================
// GET FUND BY ID
// =====================================================

const getFundById = async (req, res) => {
    try {

        const { id } = req.params;

        const fund =
            await fundModel.getFundById(id);

        if (!fund) {
            return res.status(404).json({
                success: false,
                message: "Fund allocation not found"
            });
        }

        res.json({
            success: true,
            message: "Fund allocation fetched successfully",
            fund
        });

    } catch (error) {

        console.error(
            "Get fund allocation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fund allocation"
        });
    }
};


// =====================================================
// UPDATE FUND ALLOCATION
// =====================================================

const updateFund = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            branch_id,
            amount,
            purpose,
            allocated_date,
            description
        } = req.body;


        // -----------------------------
        // Check existing
        // -----------------------------

        const existingFund =
            await fundModel.getFundById(id);

        if (!existingFund) {
            return res.status(404).json({
                success: false,
                message: "Fund allocation not found"
            });
        }


        // -----------------------------
        // Validation
        // -----------------------------

        if (!branch_id) {
            return res.status(400).json({
                success: false,
                message: "Branch ID is required"
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0"
            });
        }

        if (!purpose || !purpose.trim()) {
            return res.status(400).json({
                success: false,
                message: "Purpose is required"
            });
        }

        if (!allocated_date) {
            return res.status(400).json({
                success: false,
                message: "Allocated date is required"
            });
        }


        // -----------------------------
        // Check branch
        // -----------------------------

        const [branches] = await db.query(
            `SELECT id
             FROM branches
             WHERE id = ?
             LIMIT 1`,
            [branch_id]
        );

        if (!branches.length) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }


        // -----------------------------
        // Update
        // -----------------------------

        await fundModel.updateFund(id, {
            branch_id,
            amount: Number(amount),
            purpose: purpose.trim(),
            allocated_date,
            description
        });


        const updatedFund =
            await fundModel.getFundById(id);


        res.json({
            success: true,
            message: "Fund allocation updated successfully",
            fund: updatedFund
        });

    } catch (error) {

        console.error(
            "Update fund allocation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update fund allocation"
        });
    }
};


// =====================================================
// DELETE FUND ALLOCATION
// =====================================================

const deleteFund = async (req, res) => {
    try {

        const { id } = req.params;

        const existingFund =
            await fundModel.getFundById(id);

        if (!existingFund) {
            return res.status(404).json({
                success: false,
                message: "Fund allocation not found"
            });
        }

        await fundModel.deleteFund(id);

        res.json({
            success: true,
            message: "Fund allocation deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete fund allocation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete fund allocation"
        });
    }
};


// =====================================================
// BRANCH FUND SUMMARY
// =====================================================

const getBranchFundSummary = async (req, res) => {
    try {

        const branches =
            await fundModel.getBranchFundSummary();

        res.json({
            success: true,
            message: "Branch fund summary fetched successfully",
            count: branches.length,
            branches
        });

    } catch (error) {

        console.error(
            "Branch fund summary error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch branch fund summary"
        });
    }
};


module.exports = {
    createFund,
    getAllFunds,
    getFundById,
    updateFund,
    deleteFund,
    getBranchFundSummary
};