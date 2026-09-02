const bcrypt = require("bcryptjs");
const subAdminModel = require("../models/subAdminModel");

// Create Branch Admin
const createSubAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            branch_id
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !branch_id) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and branch_id are required"
            });
        }

        // Validate branch ID
        const branchId = Number(branch_id);

        if (!Number.isInteger(branchId) || branchId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid branch_id"
            });
        }

        // Check branch
        const branch = await subAdminModel.findBranchById(branchId);

        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        // Only active branches can receive an admin
        if (branch.status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Cannot assign an admin to an inactive branch"
            });
        }

        // Check whether branch already has an admin
        const existingBranchAdmin =
            await subAdminModel.findAdminByBranchId(branchId);

        if (existingBranchAdmin) {
            return res.status(409).json({
                success: false,
                message: "This branch already has a Branch Admin"
            });
        }

        // Check email
        const existingUser =
            await subAdminModel.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const adminId = await subAdminModel.createSubAdmin({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            branch_id: branchId
        });

        // Get created admin
        const admin = await subAdminModel.getSubAdminById(adminId);

        res.status(201).json({
            success: true,
            message: "Branch Admin created and assigned successfully",
            admin
        });

    } catch (error) {
        console.error("Create Branch Admin error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create Branch Admin"
        });
    }
};


// Get all Branch Admins
const getAllSubAdmins = async (req, res) => {
    try {
        const admins = await subAdminModel.getAllSubAdmins();

        res.json({
            success: true,
            message: "Branch Admins fetched successfully",
            count: admins.length,
            admins
        });
    } catch (error) {
        console.error("Get Branch Admins error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch Branch Admins"
        });
    }
};

// Get Branch Admin
const getSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await subAdminModel.getSubAdminById(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Branch Admin not found"
            });
        }

        res.json({
            success: true,
            message: "Branch Admin fetched successfully",
            admin
        });

    } catch (error) {
        console.error("Get Branch Admin error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch Branch Admin"
        });
    }
};


const updateSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, branch_id } = req.body;

        const existing = await subAdminModel.getSubAdminById(id);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Branch Admin not found"
            });
        }

        if (!name || !email || !branch_id) {
            return res.status(400).json({
                success: false,
                message: "Name, email and branch_id are required"
            });
        }

        const branchId = Number(branch_id);
        if (!Number.isInteger(branchId) || branchId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid branch_id"
            });
        }

        const branch = await subAdminModel.findBranchById(branchId);
        if (!branch) {
            return res.status(404).json({
                success: false,
                message: "Branch not found"
            });
        }

        const existingBranchAdmin = await subAdminModel.findAdminByBranchId(branchId);
        if (existingBranchAdmin && Number(existingBranchAdmin.id) !== Number(id)) {
            return res.status(409).json({
                success: false,
                message: "This branch already has a Branch Admin"
            });
        }

        const emailOwner = await subAdminModel.findUserByEmail(email);
        if (emailOwner && Number(emailOwner.id) !== Number(id)) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await subAdminModel.updateSubAdmin(id, {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            branch_id: branchId
        });

        const admin = await subAdminModel.getSubAdminById(id);

        res.json({
            success: true,
            message: "Branch Admin updated successfully",
            admin
        });
    } catch (error) {
        console.error("Update Branch Admin error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update Branch Admin"
        });
    }
};

const deleteSubAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await subAdminModel.getSubAdminById(id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Branch Admin not found"
            });
        }

        await subAdminModel.deleteSubAdmin(id);

        res.json({
            success: true,
            message: "Branch Admin deleted successfully"
        });
    } catch (error) {
        console.error("Delete Branch Admin error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete Branch Admin"
        });
    }
};

module.exports = {
    createSubAdmin,
    getAllSubAdmins,
    getSubAdmin,
    updateSubAdmin,
    deleteSubAdmin
};