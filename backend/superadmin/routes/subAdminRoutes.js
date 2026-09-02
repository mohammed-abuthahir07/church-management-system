const express = require("express");
const router = express.Router();
const subAdminController = require("../controllers/subAdminController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Every route in this file is SUPER_ADMIN only
router.use( authMiddleware, roleMiddleware("SUPER_ADMIN"));

// Create Branch Admin + Assign Branch
router.post("/", subAdminController.createSubAdmin);

// Get all Branch Admins
router.get("/", subAdminController.getAllSubAdmins);

// Get Branch Admin
router.get("/:id", subAdminController.getSubAdmin);

// Update Branch Admin
router.put("/:id", subAdminController.updateSubAdmin);

// Delete Branch Admin
router.delete("/:id", subAdminController.deleteSubAdmin);

module.exports = router;