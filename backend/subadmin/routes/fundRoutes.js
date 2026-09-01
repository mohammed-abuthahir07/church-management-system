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
// ONLY SUB ADMIN
// =====================================================

router.use( roleMiddleware("SUB_ADMIN"));


// =====================================================
// FUND SUMMARY
// =====================================================

router.get( "/", fundController.getFundSummary);

// =====================================================
// FUND HISTORY
// =====================================================
router.get("/history",fundController.getFundHistory);

module.exports = router;