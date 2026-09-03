const db = require("../../config/database");

// =====================================================
// TOTAL BRANCHES
// =====================================================

const getTotalBranches = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total_branches
         FROM branches`
    );

    return {
        total_branches: Number(rows[0].total_branches || 0)
    };
};


// =====================================================
// TOTAL MEMBERS
// =====================================================

const getTotalMembers = async () => {
    const [rows] = await db.query(
        `SELECT
            COUNT(*) AS total_members,

            SUM(
                CASE
                    WHEN YEAR(joined_date) = YEAR(CURDATE())
                    AND MONTH(joined_date) = MONTH(CURDATE())
                    THEN 1
                    ELSE 0
                END
            ) AS new_this_month,

            SUM(
                CASE
                    WHEN YEAR(joined_date) = YEAR(CURDATE())
                    THEN 1
                    ELSE 0
                END
            ) AS new_this_year

         FROM members`
    );

    return {
        total_members: Number(rows[0].total_members || 0),
        new_this_month: Number(rows[0].new_this_month || 0),
        new_this_year: Number(rows[0].new_this_year || 0)
    };
};


// =====================================================
// TOTAL PASTORS / LEADERS
// =====================================================

const getTotalPastors = async () => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total_pastors
         FROM pastors`
    );

    return {
        total_pastors: Number(rows[0].total_pastors || 0)
    };
};


// =====================================================
// DONATIONS
// =====================================================

const getDonations = async () => {
    const [rows] = await db.query(
        `SELECT

            COALESCE(
                SUM(
                    CASE
                        WHEN YEAR(payment_date) = YEAR(CURDATE())
                        AND MONTH(payment_date) = MONTH(CURDATE())
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS this_month,

            COALESCE(
                SUM(
                    CASE
                        WHEN YEAR(payment_date) = YEAR(CURDATE())
                        THEN amount
                        ELSE 0
                    END
                ),
                0
            ) AS this_year,

            COALESCE(
                SUM(amount),
                0
            ) AS total

         FROM donations

         WHERE status = 'ACTIVE'`
    );

    return {
        this_month: Number(rows[0].this_month || 0),
        this_year: Number(rows[0].this_year || 0),
        total: Number(rows[0].total || 0)
    };
};


// =====================================================
// TOP DONORS - ALL BRANCHES
// =====================================================

const getTopDonors = async () => {
    const [rows] = await db.query(
        `SELECT
            d.member_id,
            m.name AS member_name,
            d.branch_id,
            b.name AS branch_name,
            SUM(d.amount) AS total_donated

         FROM donations d

         INNER JOIN members m
            ON d.member_id = m.id

         INNER JOIN branches b
            ON d.branch_id = b.id

         WHERE d.status = 'ACTIVE'

         GROUP BY
            d.member_id,
            m.name,
            d.branch_id,
            b.name

         ORDER BY total_donated DESC

         LIMIT 10`
    );

    return rows.map(row => ({
        member_id: row.member_id,
        member_name: row.member_name,
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        total_donated: Number(row.total_donated || 0)
    }));
};


// =====================================================
// UPCOMING EVENTS - ALL BRANCHES
// =====================================================

const getUpcomingEvents = async () => {
    const [rows] = await db.query(
        `SELECT
            e.*,
            b.name AS branch_name

         FROM events e

         LEFT JOIN branches b
            ON e.branch_id = b.id

         WHERE e.event_date >= CURDATE()

         ORDER BY e.event_date ASC

         LIMIT 15`
    );

    return rows;
};


// =====================================================
// TODAY'S PRAYER SCHEDULE - ALL BRANCHES
// =====================================================

const getTodayPrayerSchedule = async () => {
    const [rows] = await db.query(
        `SELECT 
            p.*, 
            b.name AS branch_name

         FROM prayer_schedules p

         LEFT JOIN branches b
            ON p.branch_id = b.id

         WHERE p.day_of_week = DAYNAME(CURDATE())
         AND p.status = 'ACTIVE'

         ORDER BY p.start_time ASC`
    );

    return rows;
}


// =====================================================
// RECENT ANNOUNCEMENTS - ALL BRANCHES
// =====================================================

const getRecentAnnouncements = async () => {
    const [rows] = await db.query(
        `SELECT
            a.*,
            b.name AS branch_name

         FROM announcements a

         LEFT JOIN branches b
            ON a.branch_id = b.id

         ORDER BY a.created_at DESC

         LIMIT 15`
    );

    return rows;
};


// =====================================================
// BRANCH-WISE SUMMARY
// =====================================================

const getBranchSummary = async () => {

    const [rows] = await db.query(
        `SELECT
            b.id AS branch_id,
            b.name AS branch_name,

            (
                SELECT COUNT(*)
                FROM members m
                WHERE m.branch_id = b.id
            ) AS members,

            (
                SELECT COUNT(*)
                FROM pastors p
                WHERE p.branch_id = b.id
            ) AS pastors,

            (
                SELECT COALESCE(SUM(d.amount), 0)
                FROM donations d
                WHERE d.branch_id = b.id
                AND d.status = 'ACTIVE'
            ) AS donations,

            (
                SELECT COUNT(*)
                FROM events e
                WHERE e.branch_id = b.id
                AND e.event_date >= CURDATE()
            ) AS events,

            (
                SELECT COUNT(*)
                FROM prayer_schedules ps
                WHERE ps.branch_id = b.id
                AND ps.status = 'ACTIVE'
            ) AS prayer_schedules,

            (
                SELECT COUNT(*)
                FROM announcements a
                WHERE a.branch_id = b.id
            ) AS announcements

         FROM branches b

         ORDER BY b.id ASC`
    );

    return rows.map(row => ({
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        members: Number(row.members || 0),
        pastors: Number(row.pastors || 0),
        donations: Number(row.donations || 0),
        events: Number(row.events || 0),
        prayer_schedules: Number(row.prayer_schedules || 0),
        announcements: Number(row.announcements || 0)
    }));
};
// =====================================================
// HIGHEST DONATION BRANCH - THIS MONTH
// =====================================================

const getHighestDonationBranchThisMonth = async () => {
    const [rows] = await db.query(
        `SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(d.amount), 0) AS total_donation

         FROM branches b

         LEFT JOIN donations d
            ON d.branch_id = b.id
            AND d.status = 'ACTIVE'
            AND YEAR(d.payment_date) = YEAR(CURDATE())
            AND MONTH(d.payment_date) = MONTH(CURDATE())

         GROUP BY
            b.id,
            b.name

         ORDER BY total_donation DESC

         LIMIT 1`
    );

    if (!rows.length) {
        return null;
    }

    return {
        branch_id: rows[0].branch_id,
        branch_name: rows[0].branch_name,
        total_donation: Number(rows[0].total_donation || 0)
    };
};


// =====================================================
// HIGHEST DONATION BRANCH - THIS YEAR
// =====================================================

const getHighestDonationBranchThisYear = async () => {
    const [rows] = await db.query(
        `SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(d.amount), 0) AS total_donation

         FROM branches b

         LEFT JOIN donations d
            ON d.branch_id = b.id
            AND d.status = 'ACTIVE'
            AND YEAR(d.payment_date) = YEAR(CURDATE())

         GROUP BY
            b.id,
            b.name

         ORDER BY total_donation DESC

         LIMIT 1`
    );

    if (!rows.length) {
        return null;
    }

    return {
        branch_id: rows[0].branch_id,
        branch_name: rows[0].branch_name,
        total_donation: Number(rows[0].total_donation || 0)
    };
};

module.exports = {
    getTotalBranches,
    getTotalMembers,
    getTotalPastors,
    getDonations,
    getTopDonors,
    getUpcomingEvents,
    getTodayPrayerSchedule,
    getRecentAnnouncements,
    getBranchSummary,
    getHighestDonationBranchThisMonth,
    getHighestDonationBranchThisYear
};