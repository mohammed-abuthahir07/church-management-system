const db = require("../../config/database");

// =====================================================
// MEMBER DASHBOARD
// =====================================================

const getMemberDashboard = async (branch_id) => {
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
            ) AS new_members_this_month,
            SUM(
                CASE
                    WHEN YEAR(joined_date) = YEAR(CURDATE())
                    THEN 1
                    ELSE 0
                END
            ) AS new_members_this_year
         FROM members
         WHERE branch_id = ?`,
        [branch_id]
    );

    return {
        total_members: Number(rows[0].total_members || 0),
        new_members_this_month: Number(
            rows[0].new_members_this_month || 0
        ),
        new_members_this_year: Number(
            rows[0].new_members_this_year || 0
        )
    };
};


// =====================================================
// PASTOR DASHBOARD
// =====================================================

const getPastorDashboard = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            COUNT(*) AS total_pastors
         FROM pastors
         WHERE branch_id = ?`,
        [branch_id]
    );

    return {
        total_pastors: Number(rows[0].total_pastors || 0)
    };
};


// =====================================================
// DONATION DASHBOARD
// =====================================================

const getDonationDashboard = async (branch_id) => {
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
                ), 0
            ) AS this_month,

            COALESCE(
                SUM(
                    CASE
                        WHEN YEAR(payment_date) = YEAR(CURDATE())
                        THEN amount
                        ELSE 0
                    END
                ), 0
            ) AS this_year,

            COALESCE(SUM(amount), 0) AS total_donations

         FROM donations

         WHERE branch_id = ?
         AND status = 'ACTIVE'`,
        [branch_id]
    );

    return {
        this_month: Number(rows[0].this_month || 0),
        this_year: Number(rows[0].this_year || 0),
        total_donations: Number(
            rows[0].total_donations || 0
        )
    };
};


// =====================================================
// TOP DONOR
// =====================================================

const getTopDonor = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT
            d.member_id,
            m.name AS member_name,
            SUM(d.amount) AS total_donated

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

         LIMIT 1`,
        [branch_id, branch_id]
    );

    if (!rows.length) {
        return null;
    }

    return {
        member_id: rows[0].member_id,
        member_name: rows[0].member_name,
        total_donated: Number(rows[0].total_donated)
    };
};


// =====================================================
// UPCOMING EVENTS
// =====================================================

const getUpcomingEvents = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM events
         WHERE branch_id = ?
         AND event_date >= CURDATE()
         ORDER BY event_date ASC
         LIMIT 5`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// PRAYER SCHEDULE
// =====================================================

const getTodayPrayerSchedule = async (branch_id) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            branch_id,
            title,
            description,
            day_of_week,
            start_time,
            end_time,
            location,
            status
        FROM prayer_schedules
        WHERE branch_id = ?
          AND day_of_week = DAYNAME(CURDATE())
          AND status = 'ACTIVE'
        ORDER BY start_time ASC
        `,
        [branch_id]
    );

    return rows;
};


// =====================================================
// RECENT ANNOUNCEMENTS
// =====================================================

const getRecentAnnouncements = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM announcements
         WHERE branch_id = ?
         ORDER BY created_at DESC
         LIMIT 5`,
        [branch_id]
    );

    return rows;
};


module.exports = {
    getMemberDashboard,
    getPastorDashboard,
    getDonationDashboard,
    getTopDonor,
    getUpcomingEvents,
    getTodayPrayerSchedule,
    getRecentAnnouncements
};