const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// =====================================================
// AUTH
// =====================================================

router.use(authMiddleware);

// =====================================================
// ONLY SUB ADMIN
// =====================================================
router.use( roleMiddleware("SUB_ADMIN"));

// =====================================================
// MEMBERS
// =====================================================

router.get("/total-members", analyticsController.getTotalMembers);
router.get( "/new-members/month", analyticsController.getNewMembersThisMonth);
router.get( "/new-members/year", analyticsController.getNewMembersThisYear);
router.get( "/member-gender", analyticsController.getMemberGender);

// =====================================================
// PASTORS
// =====================================================

router.get("/pastors", analyticsController.getPastors);
router.get( "/pastors/status", analyticsController.getPastorStatus);

// =====================================================
// DONATIONS
// =====================================================

router.get("/donations/month", analyticsController.getDonationsMonth);
router.get("/donations/year", analyticsController.getDonationsYear);
router.get("/donations/total",analyticsController.getDonationsTotal);
router.get("/donations/monthly", analyticsController.getDonationsMonthly);
router.get("/donations/purpose", analyticsController.getDonationsPurpose);
router.get("/donations/top-donors", analyticsController.getTopDonors);
router.get("/donations/top-donors/month", analyticsController.getCurrentMonthTopDonors);

// =====================================================
// EVENTS
// =====================================================

router.get("/events", analyticsController.getEvents);
router.get( "/events/upcoming", analyticsController.getUpcomingEvents);
router.get("/events/monthly",analyticsController.getEventsMonthly);
// =====================================================
// PRAYER SCHEDULE
// =====================================================

router.get("/prayer-schedule", analyticsController.getPrayerSchedule);
router.get("/prayer-schedule/today",analyticsController.getTodayPrayerSchedule);

// =====================================================
// ANNOUNCEMENTS
// =====================================================

router.get("/announcements", analyticsController.getAnnouncements);
router.get( "/announcements/status", analyticsController.getAnnouncementStatus);

module.exports = router;