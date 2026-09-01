const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");


router.use(authMiddleware);
router.use( roleMiddleware("SUB_ADMIN"));

router.get("/member",dashboardController.getMemberDashboard);
router.get( "/pastor", dashboardController.getPastorDashboard);
router.get( "/donation", dashboardController.getDonationDashboard);
router.get( "/event", dashboardController.getEventDashboard);
router.get( "/prayer", dashboardController.getPrayerDashboard);
router.get("/announcement", dashboardController.getAnnouncementDashboard);

module.exports = router;