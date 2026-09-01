const express = require("express");
const router = express.Router();
const fundController = require("../controllers/fundController");
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
// CREATE FUND
// =====================================================

router.post("/", fundController.createFund);

// =====================================================
// GET ALL FUNDS
// =====================================================

router.get("/", fundController.getAllFunds);

// =====================================================
// BRANCH FUND SUMMARY
// =====================================================

router.get("/branch-summary", fundController.getBranchFundSummary);

// =====================================================
// GET FUND BY ID
// =====================================================

router.get("/:id", fundController.getFundById);

// =====================================================
// UPDATE FUND
// =====================================================

router.put("/:id", fundController.updateFund);

// =====================================================
// DELETE FUND
// =====================================================

router.delete("/:id", fundController.deleteFund);


module.exports = router;