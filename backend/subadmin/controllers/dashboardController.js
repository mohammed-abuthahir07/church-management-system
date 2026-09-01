const dashboardModel = require("../models/dashboardModel");


// =====================================================
// MEMBER DASHBOARD
// =====================================================

const getMemberDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const data =
            await dashboardModel.getMemberDashboard(
                branch_id
            );

        res.json({
            success: true,
            message: "Member dashboard fetched successfully",
            branch_id,
            member: data
        });

    } catch (error) {

        console.error(
            "Member dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch member dashboard"
        });
    }
};


// =====================================================
// PASTOR DASHBOARD
// =====================================================

const getPastorDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const data =
            await dashboardModel.getPastorDashboard(
                branch_id
            );

        res.json({
            success: true,
            message: "Pastor dashboard fetched successfully",
            branch_id,
            pastor: data
        });

    } catch (error) {

        console.error(
            "Pastor dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastor dashboard"
        });
    }
};


// =====================================================
// DONATION DASHBOARD
// =====================================================

const getDonationDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const donationData =
            await dashboardModel.getDonationDashboard(
                branch_id
            );

        const topDonor =
            await dashboardModel.getTopDonor(
                branch_id
            );

        res.json({
            success: true,
            message: "Donation dashboard fetched successfully",
            branch_id,

            donation: {
                ...donationData,
                top_donor: topDonor
            }
        });

    } catch (error) {

        console.error(
            "Donation dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch donation dashboard"
        });
    }
};


// =====================================================
// EVENT DASHBOARD
// =====================================================

const getEventDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const events =
            await dashboardModel.getUpcomingEvents(
                branch_id
            );

        res.json({
            success: true,
            message: "Event dashboard fetched successfully",
            branch_id,

            events: {
                upcoming: events
            }
        });

    } catch (error) {

        console.error(
            "Event dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch event dashboard"
        });
    }
};


// =====================================================
// PRAYER DASHBOARD
// =====================================================

const getPrayerDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const prayerSchedule =
            await dashboardModel.getTodayPrayerSchedule(
                branch_id
            );

        res.json({
            success: true,
            message: "Prayer dashboard fetched successfully",
            branch_id,

            prayer_schedule: {
                today: prayerSchedule
            }
        });

    } catch (error) {

        console.error(
            "Prayer dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch prayer dashboard"
        });
    }
};


// =====================================================
// ANNOUNCEMENT DASHBOARD
// =====================================================

const getAnnouncementDashboard = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const announcements =
            await dashboardModel.getRecentAnnouncements(
                branch_id
            );

        res.json({
            success: true,
            message: "Announcement dashboard fetched successfully",
            branch_id,

            announcements: {
                recent: announcements
            }
        });

    } catch (error) {

        console.error(
            "Announcement dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcement dashboard"
        });
    }
};


module.exports = {
    getMemberDashboard,
    getPastorDashboard,
    getDonationDashboard,
    getEventDashboard,
    getPrayerDashboard,
    getAnnouncementDashboard
};