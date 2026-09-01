const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/database");
const app = express();
const PORT = process.env.PORT || 5000;
const superAdminAuthRoutes = require("./superadmin/routes/authroutes");
const superAdminBranchRoutes = require("./superadmin/routes/branchRoutes");
const superAdminSubAdminRoutes = require("./superadmin/routes/subAdminRoutes");
const subAdminAuthRoutes = require("./subadmin/routes/authRoutes");
const subAdminMemberRoutes = require("./subadmin/routes/memberRoutes");
const subAdminPastorRoutes = require("./subadmin/routes/pastorRoutes");
const prayerScheduleRoutes = require("./subadmin/routes/prayerScheduleRoutes");
const eventRoutes = require("./subadmin/routes/eventRoutes");
const donationRoutes = require("./subadmin/routes/donationRoutes");
const announcementRoutes = require("./subadmin/routes/announcementRoutes");
const analyticsRoutes = require("./subadmin/routes/analyticsRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Super Admin API'S
app.use("/api/superadmin/auth", superAdminAuthRoutes);
app.use("/api/superadmin/branches", superAdminBranchRoutes);
app.use("/api/superadmin/subadmins", superAdminSubAdminRoutes);


// Sub Admin API'S
app.use("/api/subadmin/auth", subAdminAuthRoutes);
app.use("/api/subadmin/members",subAdminMemberRoutes);
app.use("/api/subadmin/pastors", subAdminPastorRoutes);
app.use("/api/subadmin/prayer-schedules", prayerScheduleRoutes);
app.use("/api/subadmin/events",eventRoutes);
app.use("/api/subadmin/donations", donationRoutes);
app.use("/api/subadmin/announcements", announcementRoutes);
app.use("/api/subadmin/analytics", analyticsRoutes);

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