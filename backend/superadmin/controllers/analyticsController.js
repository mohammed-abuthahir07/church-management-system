const analyticsModel =
    require("../models/analyticsModel");


// =====================================================
// BRANCH ANALYTICS
// =====================================================

const getBranches = async (req, res) => {
    try {

        const data =
            await analyticsModel.getBranchAnalytics();

        res.json({
            success: true,
            message: "Branch analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Branch analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch branch analytics"
        });
    }
};


// =====================================================
// MEMBER ANALYTICS
// =====================================================

const getMembers = async (req, res) => {
    try {

        const data =
            await analyticsModel.getMemberAnalytics();

        res.json({
            success: true,
            message: "Member analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Member analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch member analytics"
        });
    }
};


// =====================================================
// PASTOR ANALYTICS
// =====================================================

const getPastors = async (req, res) => {
    try {

        const data =
            await analyticsModel.getPastorAnalytics();

        res.json({
            success: true,
            message: "Pastor analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Pastor analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastor analytics"
        });
    }
};


// =====================================================
// DONATION ANALYTICS
// =====================================================

const getDonations = async (req, res) => {
    try {

        const data =
            await analyticsModel.getDonationAnalytics();

        res.json({
            success: true,
            message: "Donation analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Donation analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch donation analytics"
        });
    }
};


// =====================================================
// FUND ANALYTICS
// =====================================================

const getFunds = async (req, res) => {
    try {

        const data =
            await analyticsModel.getFundAnalytics();

        res.json({
            success: true,
            message: "Fund analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Fund analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch fund analytics"
        });
    }
};


// =====================================================
// EVENT ANALYTICS
// =====================================================

const getEvents = async (req, res) => {
    try {

        const data =
            await analyticsModel.getEventAnalytics();

        res.json({
            success: true,
            message: "Event analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Event analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch event analytics"
        });
    }
};


// =====================================================
// PRAYER ANALYTICS
// =====================================================

const getPrayer = async (req, res) => {
    try {

        const data =
            await analyticsModel.getPrayerAnalytics();

        res.json({
            success: true,
            message: "Prayer analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Prayer analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch prayer analytics"
        });
    }
};


// =====================================================
// NOTIFICATION ANALYTICS
// =====================================================

const getNotifications = async (req, res) => {
    try {

        const data =
            await analyticsModel.getNotificationAnalytics();

        res.json({
            success: true,
            message:
                "Notification analytics fetched successfully",
            data
        });

    } catch (error) {

        console.error(
            "Notification analytics error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch notification analytics"
        });
    }
};


module.exports = {
    getBranches,
    getMembers,
    getPastors,
    getDonations,
    getFunds,
    getEvents,
    getPrayer,
    getNotifications
};