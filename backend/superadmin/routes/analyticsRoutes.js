const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");


// =====================================================
// AUTHENTICATION
// =====================================================
router.use(authMiddleware);

// =====================================================
// ONLY SUPER ADMIN
// =====================================================

router.use(roleMiddleware("SUPER_ADMIN"));

// =====================================================
// ANALYTICS APIs
// =====================================================
router.get( "/branches",analyticsController.getBranches);
router.get("/members",analyticsController.getMembers);
router.get( "/pastors", analyticsController.getPastors);
router.get( "/donations", analyticsController.getDonations);
router.get("/funds", analyticsController.getFunds);
router.get("/events", analyticsController.getEvents);
router.get("/notifications", analyticsController.getNotifications);

module.exports = router;