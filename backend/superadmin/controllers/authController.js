const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authModel = require("../models/authModel");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find Super Admin
        const admin = await authModel.findSuperAdminByEmail(email);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check account status
        if (admin.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: admin.id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        res.json({
            success: true,
            message: "Super Admin login successful",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Super Admin login error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const admin = await authModel.findSuperAdminById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Super Admin not found"
            });
        }

        if (admin.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        res.json({
            success: true,
            message: "Profile fetched successfully",
            user: admin
        });

    } catch (error) {
        console.error("Get Super Admin profile error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { login, getProfile };