const db = require("../../config/database");

// =====================================================
// MEMBERS
// =====================================================

const getTotalMembers = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM members
         WHERE branch_id = ?`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getNewMembersThisMonth = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM members
         WHERE branch_id = ?
         AND YEAR(joined_date) = YEAR(CURDATE())
         AND MONTH(joined_date) = MONTH(CURDATE())`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getNewMembersThisYear = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM members
         WHERE branch_id = ?
         AND YEAR(joined_date) = YEAR(CURDATE())`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getMemberGenderDistribution = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            gender,
            COUNT(*) AS total
         FROM members
         WHERE branch_id = ?
         GROUP BY gender`,
        [branch_id]
    );

    return rows.map(row => ({
        gender: row.gender,
        total: Number(row.total)
    }));
};


// =====================================================
// PASTORS
// =====================================================

const getTotalPastors = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM pastors
         WHERE branch_id = ?`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getPastorStatusDistribution = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            status,
            COUNT(*) AS total
         FROM pastors
         WHERE branch_id = ?
         GROUP BY status`,
        [branch_id]
    );

    return rows.map(row => ({
        status: row.status,
        total: Number(row.total)
    }));
};


// =====================================================
// DONATIONS
// =====================================================

const getDonationsThisMonth = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         AND YEAR(payment_date) = YEAR(CURDATE())
         AND MONTH(payment_date) = MONTH(CURDATE())`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getDonationsThisYear = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         AND YEAR(payment_date) = YEAR(CURDATE())`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getTotalDonations = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getDonationsByMonth = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            MONTH(payment_date) AS month_number,
            MONTHNAME(payment_date) AS month,
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         AND YEAR(payment_date) = YEAR(CURDATE())
         GROUP BY
            MONTH(payment_date),
            MONTHNAME(payment_date)
         ORDER BY MONTH(payment_date)`,
        [branch_id]
    );

    return rows.map(row => ({
        month_number: Number(row.month_number),
        month: row.month,
        total: Number(row.total)
    }));
};


const getDonationsByPurpose = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COALESCE(purpose, 'Other') AS purpose,
            COALESCE(SUM(amount), 0) AS total
         FROM donations
         WHERE branch_id = ?
         AND status = 'ACTIVE'
         GROUP BY purpose
         ORDER BY total DESC`,
        [branch_id]
    );

    return rows.map(row => ({
        purpose: row.purpose,
        total: Number(row.total)
    }));
};


const getTopDonors = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.member_id,
            m.name AS member_name,
            COALESCE(SUM(d.amount), 0) AS total_donated
         FROM donations d
         INNER JOIN members m
            ON d.member_id = m.id
         WHERE d.branch_id = ?
         AND m.branch_id = ?
         AND d.status = 'ACTIVE'
         GROUP BY
            d.member_id,
            m.name
         ORDER BY total_donated DESC
         LIMIT 10`,
        [branch_id, branch_id]
    );

    return rows.map((row, index) => ({
        rank: index + 1,
        member_id: row.member_id,
        member_name: row.member_name,
        total_donated: Number(row.total_donated)
    }));
};


const getCurrentMonthTopDonors = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.member_id,
            m.name AS member_name,
            COALESCE(SUM(d.amount), 0) AS total_donated
         FROM donations d
         INNER JOIN members m
            ON d.member_id = m.id
         WHERE d.branch_id = ?
         AND m.branch_id = ?
         AND d.status = 'ACTIVE'
         AND YEAR(d.payment_date) = YEAR(CURDATE())
         AND MONTH(d.payment_date) = MONTH(CURDATE())
         GROUP BY
            d.member_id,
            m.name
         ORDER BY total_donated DESC
         LIMIT 10`,
        [branch_id, branch_id]
    );

    return rows.map((row, index) => ({
        rank: index + 1,
        member_id: row.member_id,
        member_name: row.member_name,
        total_donated: Number(row.total_donated)
    }));
};


// =====================================================
// EVENTS
// =====================================================

const getTotalEvents = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM events
         WHERE branch_id = ?`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getUpcomingEvents = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM events
         WHERE branch_id = ?
         AND event_date >= CURDATE()`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getEventsByMonth = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            MONTH(event_date) AS month_number,
            MONTHNAME(event_date) AS month,
            COUNT(*) AS total
         FROM events
         WHERE branch_id = ?
         AND YEAR(event_date) = YEAR(CURDATE())
         GROUP BY
            MONTH(event_date),
            MONTHNAME(event_date)
         ORDER BY MONTH(event_date)`,
        [branch_id]
    );

    return rows.map(row => ({
        month_number: Number(row.month_number),
        month: row.month,
        total: Number(row.total)
    }));
};


// =====================================================
// PRAYER SCHEDULE
// =====================================================

const getPrayerSchedule = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            branch_id,
            title,
            description,
            prayer_date,
            start_time,
            end_time,
            location,
            status,
            created_at,
            updated_at
         FROM prayer_schedules
         WHERE branch_id = ?
         ORDER BY prayer_date ASC, start_time ASC`,
        [branch_id]
    );

    return rows;
};


const getTodayPrayerSchedule = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            id,
            branch_id,
            title,
            description,
            prayer_date,
            start_time,
            end_time,
            location,
            status,
            created_at,
            updated_at
         FROM prayer_schedules
         WHERE branch_id = ?
         AND prayer_date = CURDATE()
         AND status = 'ACTIVE'
         ORDER BY start_time ASC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// ANNOUNCEMENTS
// =====================================================

const getTotalAnnouncements = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total
         FROM announcements
         WHERE branch_id = ?`,
        [branch_id]
    );

    return Number(rows[0].total);
};


const getAnnouncementStatusDistribution = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            status,
            COUNT(*) AS total
         FROM announcements
         WHERE branch_id = ?
         GROUP BY status`,
        [branch_id]
    );

    return rows.map(row => ({
        status: row.status,
        total: Number(row.total)
    }));
};


module.exports = {
    getTotalMembers,
    getNewMembersThisMonth,
    getNewMembersThisYear,
    getMemberGenderDistribution,

    getTotalPastors,
    getPastorStatusDistribution,

    getDonationsThisMonth,
    getDonationsThisYear,
    getTotalDonations,
    getDonationsByMonth,
    getDonationsByPurpose,
    getTopDonors,
    getCurrentMonthTopDonors,

    getTotalEvents,
    getUpcomingEvents,
    getEventsByMonth,

    getPrayerSchedule,
    getTodayPrayerSchedule,

    getTotalAnnouncements,
    getAnnouncementStatusDistribution
};