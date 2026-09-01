const analyticsModel = require("../models/analyticsModel");


// =====================================================
// TOTAL MEMBERS
// =====================================================

const getTotalMembers = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getTotalMembers(branch_id);

        res.json({
            success: true,
            branch_id,
            total_members: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch total members"
        });
    }
};


// =====================================================
// NEW MEMBERS THIS MONTH
// =====================================================

const getNewMembersThisMonth = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getNewMembersThisMonth(branch_id);

        res.json({
            success: true,
            branch_id,
            new_members_this_month: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly members"
        });
    }
};


// =====================================================
// NEW MEMBERS THIS YEAR
// =====================================================

const getNewMembersThisYear = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getNewMembersThisYear(branch_id);

        res.json({
            success: true,
            branch_id,
            new_members_this_year: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch yearly members"
        });
    }
};


// =====================================================
// MEMBER GENDER
// =====================================================

const getMemberGender = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getMemberGenderDistribution(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch member gender analytics"
        });
    }
};


// =====================================================
// PASTORS
// =====================================================

const getPastors = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getTotalPastors(branch_id);

        res.json({
            success: true,
            branch_id,
            total_pastors: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastors"
        });
    }
};


const getPastorStatus = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getPastorStatusDistribution(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastor status"
        });
    }
};


// =====================================================
// DONATIONS
// =====================================================

const getDonationsMonth = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getDonationsThisMonth(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            this_month: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly donations"
        });
    }
};


const getDonationsYear = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getDonationsThisYear(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            this_year: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch yearly donations"
        });
    }
};


const getDonationsTotal = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getTotalDonations(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            total_donations: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch total donations"
        });
    }
};


const getDonationsMonthly = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getDonationsByMonth(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly donation chart"
        });
    }
};


const getDonationsPurpose = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getDonationsByPurpose(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donation purposes"
        });
    }
};


const getTopDonors = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getTopDonors(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch top donors"
        });
    }
};


const getCurrentMonthTopDonors = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getCurrentMonthTopDonors(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch monthly top donors"
        });
    }
};


// =====================================================
// EVENTS
// =====================================================

const getEvents = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getTotalEvents(branch_id);

        res.json({
            success: true,
            branch_id,
            total_events: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
};


const getUpcomingEvents = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getUpcomingEvents(branch_id);

        res.json({
            success: true,
            branch_id,
            upcoming_events: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming events"
        });
    }
};


const getEventsMonthly = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getEventsByMonth(branch_id);

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch event analytics"
        });
    }
};


// =====================================================
// PRAYER SCHEDULE
// =====================================================

const getPrayerSchedule = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getPrayerSchedule(branch_id);

        res.json({
            success: true,
            branch_id,
            prayer_schedule: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch prayer schedule"
        });
    }
};


const getTodayPrayerSchedule = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getTodayPrayerSchedule(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            today: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch today's prayer schedule"
        });
    }
};


// =====================================================
// ANNOUNCEMENTS
// =====================================================

const getAnnouncements = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const total =
            await analyticsModel.getTotalAnnouncements(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            total_announcements: total
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcements"
        });
    }
};


const getAnnouncementStatus = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const data =
            await analyticsModel.getAnnouncementStatusDistribution(
                branch_id
            );

        res.json({
            success: true,
            branch_id,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcement status"
        });
    }
};


module.exports = {
    getTotalMembers,
    getNewMembersThisMonth,
    getNewMembersThisYear,
    getMemberGender,

    getPastors,
    getPastorStatus,

    getDonationsMonth,
    getDonationsYear,
    getDonationsTotal,
    getDonationsMonthly,
    getDonationsPurpose,
    getTopDonors,
    getCurrentMonthTopDonors,

    getEvents,
    getUpcomingEvents,
    getEventsMonthly,

    getPrayerSchedule,
    getTodayPrayerSchedule,

    getAnnouncements,
    getAnnouncementStatus
};