const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
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
// ANNOUNCEMENT ROUTES
// =====================================================

// Create Announcement
router.post( "/", announcementController.createAnnouncement);
// Active Announcements
// Keep this before /:id
router.get("/active", announcementController.getActiveAnnouncements);

// Get All Announcements
router.get( "/", announcementController.getAllAnnouncements);

// Get Single Announcement
router.get("/:id", announcementController.getAnnouncementById);


// Update Announcement
router.put( "/:id", announcementController.updateAnnouncement);

// Activate / Deactivate
router.patch("/:id/status",announcementController.updateAnnouncementStatus);


// Delete Announcement
router.delete( "/:id", announcementController.deleteAnnouncement);

module.exports = router;