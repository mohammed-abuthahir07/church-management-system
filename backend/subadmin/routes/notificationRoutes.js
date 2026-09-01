const express = require("express");

const router = express.Router();

const notificationController = require("../controllers/notificationController");

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
// GET ALL AVAILABLE NOTIFICATIONS
// =====================================================

router.get("/",notificationController.getNotifications);

// =====================================================
// GET SINGLE NOTIFICATION
// =====================================================

router.get( "/:id", notificationController.getNotificationById);

module.exports = router;