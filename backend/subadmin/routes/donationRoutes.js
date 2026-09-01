const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// ====================================================
// AUTHENTICATION
// =====================================================
router.use(authMiddleware);
// =====================================================
// ONLY SUB ADMIN
// =====================================================
router.use(roleMiddleware("SUB_ADMIN"));

// =====================================================
// DONATION ROUTES
// =====================================================
// Create Donation
router.post( "/", donationController.createDonation);
// Current Month Total
// Keep before /:id
router.get( "/summary/month", donationController.getCurrentMonthTotal);

// Current Year Total
// Keep before /:id
router.get("/summary/year", donationController.getCurrentYearTotal);

// Member Donation History
// Keep before /:id
router.get("/member/:memberId", donationController.getMemberDonations);

// Get All Donations
router.get( "/", donationController.getAllDonations);

// Get Single Donation
router.get("/:id", donationController.getDonationById);

// Update Donation
router.put("/:id", donationController.updateDonation);

// Activate / Deactivate
router.patch( "/:id/status", donationController.updateDonationStatus);

// Delete Donation
router.delete( "/:id", donationController.deleteDonation);

module.exports = router;