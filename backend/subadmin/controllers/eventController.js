const eventModel = require("../models/eventModel");


// =====================================================
// CREATE EVENT
// =====================================================
const createEvent = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            location
        } = req.body;


        // Check branch
        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        // Required title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Event title is required"
            });
        }


        // Required date
        if (!event_date) {
            return res.status(400).json({
                success: false,
                message: "Event date is required"
            });
        }


        // Required start time
        if (!start_time) {
            return res.status(400).json({
                success: false,
                message: "Start time is required"
            });
        }


        // Validate end time if provided
        if (end_time && start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }


        const eventId = await eventModel.createEvent({
            branch_id,
            title: title.trim(),
            description,
            event_date,
            start_time,
            end_time,
            location
        });


        const event = await eventModel.getEventById(
            eventId,
            branch_id
        );


        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (error) {

        console.error("Create event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create event"
        });
    }
};


// =====================================================
// GET ALL EVENTS
// =====================================================
const getAllEvents = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const events = await eventModel.getAllEvents(
            branch_id
        );


        res.json({
            success: true,
            message: "Events fetched successfully",
            count: events.length,
            events
        });

    } catch (error) {

        console.error("Get events error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
};


// =====================================================
// GET UPCOMING EVENTS
// =====================================================
const getUpcomingEvents = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const events = await eventModel.getUpcomingEvents(
            branch_id
        );


        res.json({
            success: true,
            message: "Upcoming events fetched successfully",
            count: events.length,
            events
        });

    } catch (error) {

        console.error(
            "Get upcoming events error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming events"
        });
    }
};


// =====================================================
// GET SINGLE EVENT
// =====================================================
const getEventById = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const event = await eventModel.getEventById(
            id,
            branch_id
        );


        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }


        res.json({
            success: true,
            message: "Event fetched successfully",
            event
        });

    } catch (error) {

        console.error("Get event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch event"
        });
    }
};


// =====================================================
// UPDATE EVENT
// =====================================================
const updateEvent = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            location
        } = req.body;


        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Event title is required"
            });
        }


        if (!event_date) {
            return res.status(400).json({
                success: false,
                message: "Event date is required"
            });
        }


        if (!start_time) {
            return res.status(400).json({
                success: false,
                message: "Start time is required"
            });
        }


        if (end_time && start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }


        const existingEvent = await eventModel.getEventById(
            id,
            branch_id
        );


        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }


        await eventModel.updateEvent(
            id,
            branch_id,
            {
                title: title.trim(),
                description,
                event_date,
                start_time,
                end_time,
                location
            }
        );


        const updatedEvent =
            await eventModel.getEventById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        });

    } catch (error) {

        console.error("Update event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update event"
        });
    }
};


// =====================================================
// ACTIVATE / DEACTIVATE EVENT
// =====================================================
const updateEventStatus = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;
        const { status } = req.body;


        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be ACTIVE or INACTIVE"
            });
        }


        const existingEvent = await eventModel.getEventById(
            id,
            branch_id
        );


        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }


        await eventModel.updateEventStatus(
            id,
            branch_id,
            status
        );


        const updatedEvent =
            await eventModel.getEventById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: `Event ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            event: updatedEvent
        });

    } catch (error) {

        console.error(
            "Update event status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update event status"
        });
    }
};


// =====================================================
// DELETE EVENT
// =====================================================
const deleteEvent = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const existingEvent = await eventModel.getEventById(
            id,
            branch_id
        );


        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }


        await eventModel.deleteEvent(
            id,
            branch_id
        );


        res.json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {

        console.error("Delete event error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete event"
        });
    }
};


module.exports = {
    createEvent,
    getAllEvents,
    getUpcomingEvents,
    getEventById,
    updateEvent,
    updateEventStatus,
    deleteEvent
};