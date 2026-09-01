const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
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
// DASHBOARD APIs
// =====================================================

// Total branches
router.get("/total-branches", dashboardController.getTotalBranches);
// Total members
router.get( "/total-members", dashboardController.getTotalMembers);

// Pastors / Leaders
router.get( "/pastors", dashboardController.getTotalPastors);

// Donations
router.get("/donations", dashboardController.getDonations);

router.get( "/donations/highest-this-month", dashboardController.getHighestDonationBranchThisMonth);

router.get("/donations/highest-this-year", dashboardController.getHighestDonationBranchThisYear);

// Upcoming events
router.get( "/events", dashboardController.getEvents);

// Today's prayer schedules
router.get( "/prayer", dashboardController.getPrayer);

// Recent announcements
router.get("/announcements",dashboardController.getAnnouncements);

// Branch-wise complete summary
router.get( "/branch-summary", dashboardController.getBranchSummary);

module.exports = router;