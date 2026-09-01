const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");

// Branch Admin Login
router.post("/login", authController.login);

// Branch Admin Profile
router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("SUB_ADMIN"),
    authController.getProfile
);

module.exports = router;