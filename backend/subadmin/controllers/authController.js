const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authModel = require("../models/authModel");

// Branch Admin Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const admin = await authModel.findSubAdminByEmail(
            email.trim().toLowerCase()
        );

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (admin.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

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

        const token = jwt.sign(
            {
                id: admin.id,
                role: admin.role,
                branch_id: admin.branch_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            success: true,
            message: "Branch Admin login successful",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                branch_id: admin.branch_id
            }
        });

    } catch (error) {
        console.error("Branch Admin login error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Branch Admin Profile
const getProfile = async (req, res) => {
    try {
        const admin = await authModel.findSubAdminById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Branch Admin not found"
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
        console.error("Branch Admin profile error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    login,
    getProfile
};