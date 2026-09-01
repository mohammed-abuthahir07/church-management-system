const express = require("express");
const router = express.Router();
const eventController =require("../controllers/eventController");
const authMiddleware =require("../../middleware/authMiddleware");
const roleMiddleware =require("../../middleware/roleMiddleware");

// =====================================================
// AUTHENTICATION
// =====================================================
router.use(authMiddleware);
// =====================================================
// ONLY SUB ADMIN
// =====================================================
router.use(roleMiddleware("SUB_ADMIN"));
// =====================================================
// EVENT ROUTES
// =====================================================

// Create Event
router.post("/", eventController.createEvent);

// Upcoming Events
// Keep this BEFORE /:id
router.get("/upcoming",eventController.getUpcomingEvents);

// Get All Events
router.get("/", eventController.getAllEvents);

// Get Single Event
router.get("/:id",eventController.getEventById);

// Update Event
router.put( "/:id", eventController.updateEvent);

// Activate / Deactivate
router.patch("/:id/status", eventController.updateEventStatus);

// Delete Event
router.delete( "/:id",eventController.deleteEvent);


module.exports = router;