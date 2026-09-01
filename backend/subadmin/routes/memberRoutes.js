const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");


// All Member APIs require Branch Admin authentication
router.use(authMiddleware);
// Only SUB_ADMIN can access these routes
router.use(roleMiddleware("SUB_ADMIN"));

// Create Member
router.post("/", memberController.createMember);

// Get All Members
router.get("/", memberController.getAllMembers);

// Get Single Member
router.get("/:id", memberController.getMemberById);

// Update Member
router.put("/:id", memberController.updateMember);

// Activate / Deactivate Member
router.patch("/:id/status", memberController.updateMemberStatus);

// Delete Member
router.delete("/:id", memberController.deleteMember);


module.exports = router;