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


// -----------------------------------------------------
// CREATE
// POST /api/subadmin/prayer-schedules
// -----------------------------------------------------

router.post(
    "/",
    prayerScheduleController.createPrayerSchedule
);


// -----------------------------------------------------
// TODAY
// GET /api/subadmin/prayer-schedules/today
// IMPORTANT: Must be before /:id
// -----------------------------------------------------

router.get(
    "/today",
    prayerScheduleController.getTodayPrayerSchedules
);


// -----------------------------------------------------
// GET ALL
// GET /api/subadmin/prayer-schedules
// -----------------------------------------------------

router.get(
    "/",
    prayerScheduleController.getAllPrayerSchedules
);


// -----------------------------------------------------
// GET SINGLE
// GET /api/subadmin/prayer-schedules/:id
// -----------------------------------------------------

router.get(
    "/:id",
    prayerScheduleController.getPrayerScheduleById
);


// -----------------------------------------------------
// UPDATE
// PUT /api/subadmin/prayer-schedules/:id
// -----------------------------------------------------

router.put(
    "/:id",
    prayerScheduleController.updatePrayerSchedule
);


// -----------------------------------------------------
// ACTIVATE / DEACTIVATE
// PATCH /api/subadmin/prayer-schedules/:id/status
// -----------------------------------------------------

router.patch(
    "/:id/status",
    prayerScheduleController.updatePrayerScheduleStatus
);


// -----------------------------------------------------
// DELETE
// DELETE /api/subadmin/prayer-schedules/:id
// -----------------------------------------------------

router.delete(
    "/:id",
    prayerScheduleController.deletePrayerSchedule
);


module.exports = router;