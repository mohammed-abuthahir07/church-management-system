const notificationModel =
    require("../models/notificationModel");

const db =
    require("../../config/database");


// =====================================================
// CREATE NOTIFICATION
// =====================================================

const createNotification = async (req, res) => {

    try {

        const {
            title,
            message,
            type,
            target_type,
            branch_id
        } = req.body;


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

        if (!title || !title.trim()) {

            return res.status(400).json({
                success: false,
                message: "Notification title is required"
            });
        }


        if (!message || !message.trim()) {

            return res.status(400).json({
                success: false,
                message: "Notification message is required"
            });
        }


        // ---------------------------------------------
        // Validate target type
        // ---------------------------------------------

        if (!["ALL", "BRANCH"].includes(target_type)) {

            return res.status(400).json({
                success: false,
                message:
                    "target_type must be ALL or BRANCH"
            });
        }


        // ---------------------------------------------
        // ALL branches
        // ---------------------------------------------

        if (target_type === "ALL") {

            const notificationId =
                await notificationModel.createNotification({

                    title: title.trim(),

                    message: message.trim(),

                    type: type || "GENERAL",

                    target_type: "ALL",

                    branch_id: null
                });


            const notification =
                await notificationModel
                    .getNotificationById(notificationId);


            return res.status(201).json({

                success: true,

                message:
                    "Notification sent to all branches successfully",

                notification
            });
        }


        // ---------------------------------------------
        // Specific branch
        // ---------------------------------------------

        if (target_type === "BRANCH") {

            if (!branch_id) {

                return res.status(400).json({
                    success: false,
                    message:
                        "branch_id is required when target_type is BRANCH"
                });
            }


            // Check branch exists

            const [branches] = await db.query(
                `SELECT
                    id,
                    name,
                    status
                 FROM branches
                 WHERE id = ?
                 LIMIT 1`,
                [branch_id]
            );


            if (!branches.length) {

                return res.status(404).json({
                    success: false,
                    message: "Branch not found"
                });
            }


            // Create notification

            const notificationId =
                await notificationModel.createNotification({

                    title: title.trim(),

                    message: message.trim(),

                    type: type || "GENERAL",

                    target_type: "BRANCH",

                    branch_id
                });


            const notification =
                await notificationModel
                    .getNotificationById(notificationId);


            return res.status(201).json({

                success: true,

                message:
                    "Notification sent to the selected branch successfully",

                notification
            });
        }

    } catch (error) {

        console.error(
            "Create notification error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to create notification"
        });
    }
};


// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

const getAllNotifications = async (req, res) => {

    try {

        const notifications =
            await notificationModel
                .getAllNotifications();


        res.json({

            success: true,

            message:
                "Notifications fetched successfully",

            count: notifications.length,

            notifications
        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch notifications"
        });
    }
};


// =====================================================
// GET NOTIFICATION BY ID
// =====================================================

const getNotificationById = async (req, res) => {

    try {

        const { id } = req.params;


        const notification =
            await notificationModel
                .getNotificationById(id);


        if (!notification) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification not found"
            });
        }


        res.json({

            success: true,

            message:
                "Notification fetched successfully",

            notification
        });

    } catch (error) {

        console.error(
            "Get notification error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch notification"
        });
    }
};


// =====================================================
// UPDATE NOTIFICATION
// =====================================================

const updateNotification = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            message,
            type,
            target_type,
            branch_id,
            status
        } = req.body;


        // Check existing

        const existing =
            await notificationModel
                .getNotificationById(id);


        if (!existing) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification not found"
            });
        }


        // Validation

        if (!title || !title.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Notification title is required"
            });
        }


        if (!message || !message.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Notification message is required"
            });
        }


        if (!["ALL", "BRANCH"].includes(target_type)) {

            return res.status(400).json({

                success: false,

                message:
                    "target_type must be ALL or BRANCH"
            });
        }


        // ---------------------------------------------
        // ALL
        // ---------------------------------------------

        let finalBranchId = null;


        if (target_type === "BRANCH") {

            if (!branch_id) {

                return res.status(400).json({

                    success: false,

                    message:
                        "branch_id is required for BRANCH notification"
                });
            }


            const [branches] = await db.query(
                `SELECT id
                 FROM branches
                 WHERE id = ?
                 LIMIT 1`,
                [branch_id]
            );


            if (!branches.length) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Branch not found"
                });
            }


            finalBranchId = branch_id;
        }


        await notificationModel.updateNotification(
            id,
            {
                title: title.trim(),
                message: message.trim(),
                type: type || "GENERAL",
                target_type,
                branch_id: finalBranchId,
                status: status || "ACTIVE"
            }
        );


        const updatedNotification =
            await notificationModel
                .getNotificationById(id);


        res.json({

            success: true,

            message:
                "Notification updated successfully",

            notification:
                updatedNotification
        });

    } catch (error) {

        console.error(
            "Update notification error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update notification"
        });
    }
};


// =====================================================
// DELETE NOTIFICATION
// =====================================================

const deleteNotification = async (req, res) => {

    try {

        const { id } = req.params;


        const existing =
            await notificationModel
                .getNotificationById(id);


        if (!existing) {

            return res.status(404).json({

                success: false,

                message:
                    "Notification not found"
            });
        }


        await notificationModel
            .deleteNotification(id);


        res.json({

            success: true,

            message:
                "Notification deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete notification error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to delete notification"
        });
    }
};


module.exports = {
    createNotification,
    getAllNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification
};