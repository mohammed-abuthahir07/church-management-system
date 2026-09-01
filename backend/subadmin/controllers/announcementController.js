const announcementModel = require("../models/announcementModel");


// =====================================================
// CREATE ANNOUNCEMENT
// =====================================================
const createAnnouncement = async (req, res) => {
    try {

        // Branch comes from logged-in Sub Admin
        const branch_id = req.user.branch_id;

        const {
            title,
            message,
            announcement_date
        } = req.body;


        // Check branch
        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Announcement title is required"
            });
        }


        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Announcement message is required"
            });
        }


        // Validate date
        if (!announcement_date) {
            return res.status(400).json({
                success: false,
                message: "Announcement date is required"
            });
        }


        const announcementId =
            await announcementModel.createAnnouncement({
                branch_id,
                title: title.trim(),
                message: message.trim(),
                announcement_date
            });


        const announcement =
            await announcementModel.getAnnouncementById(
                announcementId,
                branch_id
            );


        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcement
        });

    } catch (error) {

        console.error(
            "Create announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to create announcement"
        });
    }
};


// =====================================================
// GET ALL ANNOUNCEMENTS
// =====================================================
const getAllAnnouncements = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const announcements =
            await announcementModel.getAllAnnouncements(
                branch_id
            );


        res.json({
            success: true,
            message: "Announcements fetched successfully",
            count: announcements.length,
            announcements
        });

    } catch (error) {

        console.error(
            "Get announcements error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcements"
        });
    }
};


// =====================================================
// GET ACTIVE ANNOUNCEMENTS
// =====================================================
const getActiveAnnouncements = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const announcements =
            await announcementModel.getActiveAnnouncements(
                branch_id
            );


        res.json({
            success: true,
            message: "Active announcements fetched successfully",
            count: announcements.length,
            announcements
        });

    } catch (error) {

        console.error(
            "Get active announcements error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch active announcements"
        });
    }
};


// =====================================================
// GET SINGLE ANNOUNCEMENT
// =====================================================
const getAnnouncementById = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const announcement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        if (!announcement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }


        res.json({
            success: true,
            message: "Announcement fetched successfully",
            announcement
        });

    } catch (error) {

        console.error(
            "Get announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcement"
        });
    }
};


// =====================================================
// UPDATE ANNOUNCEMENT
// =====================================================
const updateAnnouncement = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const {
            title,
            message,
            announcement_date
        } = req.body;


        // Validate title
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Announcement title is required"
            });
        }


        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Announcement message is required"
            });
        }


        // Validate date
        if (!announcement_date) {
            return res.status(400).json({
                success: false,
                message: "Announcement date is required"
            });
        }


        // Check announcement belongs to branch
        const existingAnnouncement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        if (!existingAnnouncement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }


        await announcementModel.updateAnnouncement(
            id,
            branch_id,
            {
                title: title.trim(),
                message: message.trim(),
                announcement_date
            }
        );


        const updatedAnnouncement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: "Announcement updated successfully",
            announcement: updatedAnnouncement
        });

    } catch (error) {

        console.error(
            "Update announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update announcement"
        });
    }
};


// =====================================================
// ACTIVATE / DEACTIVATE ANNOUNCEMENT
// =====================================================
const updateAnnouncementStatus = async (req, res) => {
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


        const existingAnnouncement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        if (!existingAnnouncement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }


        await announcementModel.updateAnnouncementStatus(
            id,
            branch_id,
            status
        );


        const updatedAnnouncement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: `Announcement ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            announcement: updatedAnnouncement
        });

    } catch (error) {

        console.error(
            "Update announcement status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update announcement status"
        });
    }
};


// =====================================================
// DELETE ANNOUNCEMENT
// =====================================================
const deleteAnnouncement = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const existingAnnouncement =
            await announcementModel.getAnnouncementById(
                id,
                branch_id
            );


        if (!existingAnnouncement) {
            return res.status(404).json({
                success: false,
                message: "Announcement not found"
            });
        }


        await announcementModel.deleteAnnouncement(
            id,
            branch_id
        );


        res.json({
            success: true,
            message: "Announcement deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete announcement error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete announcement"
        });
    }
};


module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getActiveAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    updateAnnouncementStatus,
    deleteAnnouncement
};