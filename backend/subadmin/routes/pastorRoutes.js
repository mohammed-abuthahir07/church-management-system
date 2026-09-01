const express = require("express");
const router = express.Router();
const pastorController = require("../controllers/pastorController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");


// Authentication required
router.use(authMiddleware);

// Only Branch Admin
router.use(roleMiddleware("SUB_ADMIN"));


// Create Pastor / Leader
router.post("/", pastorController.createPastor);

// Get All Pastors / Leaders
router.get("/", pastorController.getAllPastors);

// Get Single Pastor / Leader
router.get("/:id", pastorController.getPastorById);

// Update Pastor / Leader
router.put("/:id", pastorController.updatePastor);

// Activate / Deactivate
router.patch("/:id/status", pastorController.updatePastorStatus);

// Delete
router.delete("/:id", pastorController.deletePastor);


module.exports = router;