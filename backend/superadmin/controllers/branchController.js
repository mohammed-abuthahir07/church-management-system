const branchModel = require("../models/branchModel");

// Create Branch
const createBranch = async (req, res) => {
    try {
        const {
            name,
            address,
            phone,
            email
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Branch name is required"
            });
        }

        const branchId = await branchModel.createBranch({
            name: name.trim(),
            address,
            phone,
            email
        });

        const branch = await branchModel.getBranchById(branchId);

        res.status(201).json({
            success: true,
            message: "Branch created successfully",
            branch
        });

    } catch (error) {
        console.error("Create branch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create branch"
        });
    }
};


// Get All Branches
const getAllBranches = async (req, res) => {
    try {
        const branches = await branchModel.getAllBranches();

        res.json({
            success: true,
            message: "Branches fetched successfully",
            count: branches.length,
            branches
        });

    } catch (error) {
        console.error("Get branches error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch branches"
        });
    }
};


// Get Single Branch
const getBranchById = async (req, res) => {
    try {
        const { id } = req.params;

        const branch = await branchModel.getBranchById(id);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        res.json({
            success: true,
            message: "Branch fetched successfully",
            branch
        });

    } catch (error) {
        console.error("Get branch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch branch"
        });
    }
};


// Update Branch
const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            address,
            phone,
            email
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Branch name is required"
            });
        }

        const existingBranch = await branchModel.getBranchById(id);

        if (!existingBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        await branchModel.updateBranch(id, {
            name: name.trim(),
            address,
            phone,
            email
        });

        const updatedBranch = await branchModel.getBranchById(id);

        res.json({
            success: true,
            message: "Branch updated successfully",
            branch: updatedBranch
        });

    } catch (error) {
        console.error("Update branch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update branch"
        });
    }
};


// Activate / Deactivate Branch
const updateBranchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be ACTIVE or INACTIVE"
            });
        }

        const existingBranch = await branchModel.getBranchById(id);

        if (!existingBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        await branchModel.updateBranchStatus(id, status);

        const updatedBranch = await branchModel.getBranchById(id);

        res.json({
            success: true,
            message: `Branch ${status === "ACTIVE" ? "activated" : "deactivated"} successfully`,
            branch: updatedBranch
        });

    } catch (error) {
        console.error("Update branch status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update branch status"
        });
    }
};


// Delete Branch
const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const existingBranch = await branchModel.getBranchById(id);

        if (!existingBranch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        await branchModel.deleteBranch(id);

        res.json({
            success: true,
            message: "Branch deleted successfully"
        });

    } catch (error) {
        console.error("Delete branch error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete branch"
        });
    }
};


module.exports = {
    createBranch,
    getAllBranches,
    getBranchById,
    updateBranch,
    updateBranchStatus,
    deleteBranch
};