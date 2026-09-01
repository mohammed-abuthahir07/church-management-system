const bcrypt = require("bcryptjs");
const db = require("./config/database");

const createSuperAdmin = async () => {
    try {
        const name = "Main Church Admin";
        const email = "admin@church.com";
        const password = "Admin@123";

        // Check if Super Admin already exists
        const [existingAdmin] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingAdmin.length > 0) {
            console.log("Super Admin already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Super Admin
        await db.query(
            `INSERT INTO users
            (name, email, password, role, branch_id, status)
            VALUES (?, ?, ?, 'SUPER_ADMIN', NULL, 'ACTIVE')`,
            [name, email, hashedPassword]
        );

        console.log("Super Admin created successfully!");
        console.log("Email: admin@church.com");
        console.log("Password: Admin@123");

        process.exit(0);

    } catch (error) {
        console.error("Failed to create Super Admin:");
        console.error(error.message);

        process.exit(1);
    }
};

createSuperAdmin();