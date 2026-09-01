const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const app = express();
const PORT = process.env.PORT || 5000;
const superAdminAuthRoutes = require("./superadmin/routes/authroutes");

// Middleware
app.use(cors());
app.use(express.json());


// Super Admin API'S
app.use("/api/superadmin/auth", superAdminAuthRoutes);
app.use("api/superadmin/profile", superAdminAuthRoutes);

// Start server and test MySQL connection
const startServer = async () => {
    try {
        // Test MySQL connection
        const connection = await db.getConnection();
        console.log("MySQL connected successfully!");
        connection.release();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("MySQL connection failed!");
        console.error(error.message);

        process.exit(1);
    }
};

startServer();