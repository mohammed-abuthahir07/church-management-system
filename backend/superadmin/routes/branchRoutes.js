const express = require("express");

const router = express.Router();

const branchController = require("../controllers/branchController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// All Branch APIs require Super Admin authentication
router.use(
    authMiddleware,
    roleMiddleware("SUPER_ADMIN")
);

// Create Branch
router.post("/", branchController.createBranch);

// Get All Branches
router.get("/", branchController.getAllBranches);

// Get Single Branch
router.get("/:id", branchController.getBranchById);

// Update Branch
router.put("/:id", branchController.updateBranch);

// Activate / Deactivate
router.patch("/:id/status", branchController.updateBranchStatus);

// Delete Branch
router.delete("/:id", branchController.deleteBranch);

module.exports = router;