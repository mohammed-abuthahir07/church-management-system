const fundModel = require("../models/fundModel");


// =====================================================
// GET FUND SUMMARY
// =====================================================

const getFundSummary = async (req, res) => {

    try {
        // ---------------------------------------------
        // Get branch from logged-in Sub Admin
        // ---------------------------------------------

        const branchId = req.user.branch_id;
        if (!branchId) {
            return res.status(400).json({
                success: false,
                message:
                    "Sub Admin is not assigned to a branch"
            });
        }

        // ---------------------------------------------
        // Get fund summary
        // ---------------------------------------------

        const data =
            await fundModel.getFundSummary(branchId);

        res.json({
            success: true,
            message:
                "Fund summary fetched successfully",
            data
        });
    } catch (error) {
        console.error(
            "Get fund summary error:",
            error
        );
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch fund summary"
        });
    }
};


// =====================================================
// GET FUND HISTORY
// =====================================================

const getFundHistory = async (req, res) => {

    try {

        // ---------------------------------------------
        // Get branch from logged-in Sub Admin
        // ---------------------------------------------
        const branchId = req.user.branch_id;
        if (!branchId) {
            return res.status(400).json({
                success: false,
                message:
                    "Sub Admin is not assigned to a branch"
            });
        }
        // ---------------------------------------------
        // Get history
        // ---------------------------------------------
        const funds =
            await fundModel.getFundHistory(branchId);
        res.json({
            success: true,
            message:
                "Fund history fetched successfully",
            count: funds.length,
            funds
        });

    } catch (error) {
        console.error(
            "Get fund history error:",
            error
        );
        res.status(500).json({
            success: false,
            message:
                "Failed to fetch fund history"
        });
    }
};


module.exports = {
    getFundSummary,
    getFundHistory
};