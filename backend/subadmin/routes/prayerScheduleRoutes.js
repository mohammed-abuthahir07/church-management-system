const express = require("express");
const router = express.Router();
const prayerScheduleController = require("../controllers/prayerScheduleController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================
router.use(authMiddleware);
// =====================================================
// ONLY SUB ADMIN
// =====================================================
router.use(roleMiddleware("SUB_ADMIN"));

// =====================================================
// PRAYER SCHEDULE ROUTES
// =====================================================

// Create
router.post( "/", prayerScheduleController.createPrayerSchedule);

// Get Today's Schedule
// IMPORTANT: Keep this BEFORE /:id
router.get( "/today", prayerScheduleController.getTodayPrayerSchedules);
// Get All
router.get( "/", prayerScheduleController.getAllPrayerSchedules);
// Get Single
router.get( "/:id", prayerScheduleController.getPrayerScheduleById);
// Update
router.put("/:id", prayerScheduleController.updatePrayerSchedule);
// Activate / Deactivate
router.patch( "/:id/status", prayerScheduleController.updatePrayerScheduleStatus);
// Delete
router.delete( "/:id", prayerScheduleController.deletePrayerSchedule);

module.exports = router;