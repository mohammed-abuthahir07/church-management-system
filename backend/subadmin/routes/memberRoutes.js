const express = require("express");

const router = express.Router();

const memberController = require("../controllers/memberController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");


router.use(authMiddleware);

router.use(roleMiddleware("SUB_ADMIN"));


// ===============================
// MEMBER APIs
// ===============================

// Create Member
router.post("/", memberController.createMember);

// Get All Members
router.get("/", memberController.getAllMembers);

// Get Single Member + Payment History
router.get("/:id", memberController.getMemberById);

// Update Member
router.put("/:id", memberController.updateMember);

// Activate / Deactivate Member
router.patch("/:id/status", memberController.updateMemberStatus);

// Delete Member
router.delete("/:id", memberController.deleteMember);


// ===============================
// PAYMENT APIs
// ===============================

// Add Payment
router.post( "/:id/payments", memberController.addMemberPayment);

// Get Payment History + Monthly/Yearly Summary
router.get( "/:id/payments", memberController.getMemberPayments);


module.exports = router;