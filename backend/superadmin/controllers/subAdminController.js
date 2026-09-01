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


module.exports = {
    createSubAdmin,
    getSubAdmin
};