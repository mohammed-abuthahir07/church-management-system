const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Super Admin Login
router.post("/login", authController.login);

// Super Admin Profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("SUPER_ADMIN"),
    authController.getProfile
);

module.exports = router;