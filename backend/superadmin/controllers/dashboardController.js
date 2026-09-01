const dashboardModel = require("../models/dashboardModel");


// =====================================================
// TOTAL BRANCHES
// =====================================================

const getTotalBranches = async (req, res) => {
    try {

        const data =
            await dashboardModel.getTotalBranches();

        res.json({
            success: true,
            message: "Total branches fetched successfully",
            data
        });

    } catch (error) {

        console.error("Total branches error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch total branches"
        });
    }
};


// =====================================================
// TOTAL MEMBERS
// =====================================================

const getTotalMembers = async (req, res) => {
    try {

        const data =
            await dashboardModel.getTotalMembers();

        res.json({
            success: true,
            message: "Member dashboard fetched successfully",
            data
        });

    } catch (error) {

        console.error("Total members error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch members"
        });
    }
};


// =====================================================
// PASTORS
// =====================================================

const getTotalPastors = async (req, res) => {
    try {

        const data =
            await dashboardModel.getTotalPastors();

        res.json({
            success: true,
            message: "Pastor dashboard fetched successfully",
            data
        });

    } catch (error) {

        console.error("Pastor dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastors"
        });
    }
};


// =====================================================
// DONATIONS
// =====================================================

const getDonations = async (req, res) => {
    try {

        const donationData =
            await dashboardModel.getDonations();

        const topDonors =
            await dashboardModel.getTopDonors();

        res.json({
            success: true,
            message: "Donation dashboard fetched successfully",

            data: {
                ...donationData,
                top_donors: topDonors
            }
        });

    } catch (error) {

        console.error("Donation dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch donations"
        });
    }
};


// =====================================================
// EVENTS
// =====================================================

const getEvents = async (req, res) => {
    try {

        const events =
            await dashboardModel.getUpcomingEvents();

        res.json({
            success: true,
            message: "Upcoming events fetched successfully",

            data: {
                total_upcoming: events.length,
                events
            }
        });

    } catch (error) {

        console.error("Events dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch events"
        });
    }
};


// =====================================================
// PRAYER
// =====================================================

const getPrayer = async (req, res) => {
    try {

        const prayerSchedule =
            await dashboardModel.getTodayPrayerSchedule();

        res.json({
            success: true,
            message: "Today's prayer schedules fetched successfully",

            data: {
                total_today: prayerSchedule.length,
                prayer_schedule: prayerSchedule
            }
        });

    } catch (error) {

        console.error("Prayer dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch prayer schedules"
        });
    }
};


// =====================================================
// ANNOUNCEMENTS
// =====================================================

const getAnnouncements = async (req, res) => {
    try {

        const announcements =
            await dashboardModel.getRecentAnnouncements();

        res.json({
            success: true,
            message: "Recent announcements fetched successfully",

            data: {
                total_recent: announcements.length,
                announcements
            }
        });

    } catch (error) {

        console.error(
            "Announcement dashboard error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch announcements"
        });
    }
};


// =====================================================
// BRANCH SUMMARY
// =====================================================

const getBranchSummary = async (req, res) => {
    try {

        const branches =
            await dashboardModel.getBranchSummary();

        res.json({
            success: true,
            message: "Branch summary fetched successfully",

            count: branches.length,

            branches
        });

    } catch (error) {

        console.error(
            "Branch summary error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch branch summary"
        });
    }
};
// =====================================================
// HIGHEST DONATION BRANCH - THIS MONTH
// =====================================================

const getHighestDonationBranchThisMonth = async (req, res) => {
    try {

        const data =
            await dashboardModel
                .getHighestDonationBranchThisMonth();

        res.json({
            success: true,
            message:
                "Highest donation branch for this month fetched successfully",

            data
        });

    } catch (error) {

        console.error(
            "Highest monthly donation branch error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch highest donation branch for this month"
        });
    }
};


// =====================================================
// HIGHEST DONATION BRANCH - THIS YEAR
// =====================================================

const getHighestDonationBranchThisYear = async (req, res) => {
    try {

        const data =
            await dashboardModel
                .getHighestDonationBranchThisYear();

        res.json({
            success: true,
            message:
                "Highest donation branch for this year fetched successfully",

            data
        });

    } catch (error) {

        console.error(
            "Highest yearly donation branch error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to fetch highest donation branch for this year"
        });
    }
};


module.exports = {
    getTotalBranches,
    getTotalMembers,
    getTotalPastors,
    getDonations,
    getEvents,
    getPrayer,
    getAnnouncements,
    getBranchSummary,
    getHighestDonationBranchThisMonth,
    getHighestDonationBranchThisYear
};