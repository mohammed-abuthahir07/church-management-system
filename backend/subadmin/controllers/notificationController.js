const notificationModel =
    require("../models/notificationModel");


// =====================================================
// GET SUB ADMIN NOTIFICATIONS
// =====================================================

const getNotifications = async (req, res) => {
    try {

        // ---------------------------------------------
        // Get branch from logged-in Sub Admin
        // ---------------------------------------------

        const branchId = req.user.branch_id;

        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Sub Admin is not assigned to a branch"
            });
        }


        // ---------------------------------------------
        // Get notifications
        // ---------------------------------------------

        const notifications =
            await notificationModel
                .getNotificationsForBranch(branchId);


        res.json({
            success: true,
            message: "Notifications fetched successfully",
            count: notifications.length,
            notifications
        });

    } catch (error) {

        console.error(
            "Get Sub Admin notifications error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};


// =====================================================
// GET SINGLE NOTIFICATION
// =====================================================

const getNotificationById = async (req, res) => {
    try {

        const { id } = req.params;

        const branchId = req.user.branch_id;


        if (!branchId) {
            return res.status(400).json({
                success: false,
                message: "Sub Admin is not assigned to a branch"
            });
        }


        // ---------------------------------------------
        // Get notification
        // ---------------------------------------------

        const notification =
            await notificationModel
                .getNotificationByIdForBranch(
                    id,
                    branchId
                );


        if (!notification) {
            return res.status(404).json({
                success: false,
                message:
                    "Notification not found or not available for your branch"
            });
        }


        res.json({
            success: true,
            message: "Notification fetched successfully",
            notification
        });

    } catch (error) {

        console.error(
            "Get Sub Admin notification error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch notification"
        });
    }
};


module.exports = {
    getNotifications,
    getNotificationById
};