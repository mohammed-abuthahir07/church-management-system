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
// ONLY SUPER ADMIN
// =====================================================

router.use( roleMiddleware("SUPER_ADMIN"));


// =====================================================
// CREATE NOTIFICATION
// =====================================================

router.post( "/", notificationController.createNotification);

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

router.get("/", notificationController.getAllNotifications);

// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

router.get( "/:id", notificationController.getNotificationById);

// =====================================================
// UPDATE NOTIFICATION
// =====================================================
router.put( "/:id", notificationController.updateNotification);

// =====================================================
// DELETE NOTIFICATION
// =====================================================

router.delete("/:id", notificationController.deleteNotification);

module.exports = router;