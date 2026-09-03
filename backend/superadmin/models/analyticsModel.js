const db = require("../../config/database");
const { getPrayer } = require("../controllers/analyticsController");

// =====================================================
// BRANCH ANALYTICS
// =====================================================

const getBranchAnalytics = async () => {
    const [rows] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            b.status,

            (
                SELECT COUNT(*)
                FROM members m
                WHERE m.branch_id = b.id
            ) AS total_members,

            (
                SELECT COUNT(*)
                FROM pastors p
                WHERE p.branch_id = b.id
            ) AS total_pastors,

            (
                SELECT COALESCE(SUM(d.amount), 0)
                FROM donations d
                WHERE d.branch_id = b.id
            ) AS total_donations,

            (
                SELECT COUNT(*)
                FROM events e
                WHERE e.branch_id = b.id
            ) AS total_events,

            (
                SELECT COUNT(*)
                FROM prayer_schedules ps
                WHERE ps.branch_id = b.id
            ) AS total_prayer_schedules,

            (
                SELECT COUNT(*)
                FROM notifications n
                WHERE n.branch_id = b.id
                  AND n.target_type = 'BRANCH'
            ) AS total_branch_notifications

        FROM branches b
        ORDER BY b.name ASC
    `);

    return rows.map(row => ({
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        status: row.status,
        total_members: Number(row.total_members || 0),
        total_pastors: Number(row.total_pastors || 0),
        total_donations: Number(row.total_donations || 0),
        total_events: Number(row.total_events || 0),
        total_prayer_schedules: Number(row.total_prayer_schedules || 0),
        total_branch_notifications: Number(
            row.total_branch_notifications || 0
        )
    }));
};


// =====================================================
// MEMBER ANALYTICS
// =====================================================

const getMemberAnalytics = async () => {

    const [[total]] = await db.query(`
        SELECT COUNT(*) AS total_members
        FROM members
    `);

    const [[thisMonth]] = await db.query(`
        SELECT COUNT(*) AS new_members_this_month
        FROM members
        WHERE YEAR(joined_date) = YEAR(CURDATE())
          AND MONTH(joined_date) = MONTH(CURDATE())
    `);

    const [[thisYear]] = await db.query(`
        SELECT COUNT(*) AS new_members_this_year
        FROM members
        WHERE YEAR(joined_date) = YEAR(CURDATE())
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COUNT(m.id) AS total_members

        FROM branches b

        LEFT JOIN members m
            ON m.branch_id = b.id

        GROUP BY b.id, b.name

        ORDER BY total_members DESC
    `);

    return {
        total_members: Number(total.total_members || 0),

        new_members_this_month:
            Number(thisMonth.new_members_this_month || 0),

        new_members_this_year:
            Number(thisYear.new_members_this_year || 0),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_members: Number(row.total_members || 0)
        }))
    };
};


// =====================================================
// PASTOR ANALYTICS
// =====================================================

const getPastorAnalytics = async () => {

    const [[total]] = await db.query(`
        SELECT COUNT(*) AS total_pastors
        FROM pastors
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COUNT(p.id) AS total_pastors

        FROM branches b

        LEFT JOIN pastors p
            ON p.branch_id = b.id

        GROUP BY b.id, b.name

        ORDER BY total_pastors DESC
    `);

    return {
        total_pastors: Number(total.total_pastors || 0),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_pastors: Number(row.total_pastors || 0)
        }))
    };
};


// =====================================================
// DONATION ANALYTICS
// =====================================================

const getDonationAnalytics = async () => {

    const [[month]] = await db.query(`
        SELECT COALESCE(SUM(amount), 0) AS donations_this_month
        FROM donations
        WHERE YEAR(payment_date) = YEAR(CURDATE())
          AND MONTH(payment_date) = MONTH(CURDATE())
    `);

    const [[year]] = await db.query(`
        SELECT COALESCE(SUM(amount), 0) AS donations_this_year
        FROM donations
        WHERE YEAR(payment_date) = YEAR(CURDATE())
    `);

    const [[total]] = await db.query(`
        SELECT COALESCE(SUM(amount), 0) AS total_donations
        FROM donations
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(d.amount), 0) AS total_donations

        FROM branches b

        LEFT JOIN donations d
            ON d.branch_id = b.id

        GROUP BY b.id, b.name

        ORDER BY total_donations DESC
    `);

    const [thisMonthByBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(d.amount), 0) AS donations_this_month

        FROM branches b

        LEFT JOIN donations d
            ON d.branch_id = b.id
            AND YEAR(d.payment_date) = YEAR(CURDATE())
            AND MONTH(d.payment_date) = MONTH(CURDATE())

        GROUP BY b.id, b.name

        ORDER BY donations_this_month DESC
    `);

    const [thisYearByBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(d.amount), 0) AS donations_this_year

        FROM branches b

        LEFT JOIN donations d
            ON d.branch_id = b.id
            AND YEAR(d.payment_date) = YEAR(CURDATE())

        GROUP BY b.id, b.name

        ORDER BY donations_this_year DESC
    `);

    return {
        donations_this_month:
            Number(month.donations_this_month || 0),

        donations_this_year:
            Number(year.donations_this_year || 0),

        total_donations:
            Number(total.total_donations || 0),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_donations: Number(row.total_donations || 0)
        })),

        this_month_by_branch: thisMonthByBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            donations_this_month:
                Number(row.donations_this_month || 0)
        })),

        this_year_by_branch: thisYearByBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            donations_this_year:
                Number(row.donations_this_year || 0)
        }))
    };
};


// =====================================================
// FUND ANALYTICS
// =====================================================

const getFundAnalytics = async () => {

    const [[total]] = await db.query(`
        SELECT COALESCE(SUM(amount), 0) AS total_allocated
        FROM fund_allocations
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COALESCE(SUM(f.amount), 0) AS total_allocated

        FROM branches b

        LEFT JOIN fund_allocations f
            ON f.branch_id = b.id

        GROUP BY b.id, b.name

        ORDER BY total_allocated DESC
    `);

    return {
        total_allocated:
            Number(total.total_allocated || 0),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_allocated:
                Number(row.total_allocated || 0)
        }))
    };
};


// =====================================================
// EVENT ANALYTICS
// =====================================================

const getEventAnalytics = async () => {

    const [[total]] = await db.query(`
        SELECT COUNT(*) AS total_events
        FROM events
    `);

    const [[upcoming]] = await db.query(`
        SELECT COUNT(*) AS upcoming_events
        FROM events
        WHERE event_date >= CURDATE()
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COUNT(e.id) AS total_events

        FROM branches b

        LEFT JOIN events e
            ON e.branch_id = b.id

        GROUP BY b.id, b.name

        ORDER BY total_events DESC
    `);

    return {
        total_events:
            Number(total.total_events || 0),

        upcoming_events:
            Number(upcoming.upcoming_events || 0),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_events: Number(row.total_events || 0)
        }))
    };
};

// =====================================================
// NOTIFICATION ANALYTICS
// =====================================================

const getNotificationAnalytics = async () => {

    const [[total]] = await db.query(`
        SELECT COUNT(*) AS total_notifications
        FROM notifications
    `);

    const [[allBranches]] = await db.query(`
        SELECT COUNT(*) AS all_branch_notifications
        FROM notifications
        WHERE target_type = 'ALL'
    `);

    const [[branchSpecific]] = await db.query(`
        SELECT COUNT(*) AS branch_specific_notifications
        FROM notifications
        WHERE target_type = 'BRANCH'
    `);

    const [byBranch] = await db.query(`
        SELECT
            b.id AS branch_id,
            b.name AS branch_name,
            COUNT(n.id) AS total_notifications

        FROM branches b

        LEFT JOIN notifications n
            ON n.branch_id = b.id
            AND n.target_type = 'BRANCH'

        GROUP BY b.id, b.name

        ORDER BY total_notifications DESC
    `);

    return {
        total_notifications:
            Number(total.total_notifications || 0),

        all_branch_notifications:
            Number(allBranches.all_branch_notifications || 0),

        branch_specific_notifications:
            Number(
                branchSpecific.branch_specific_notifications || 0
            ),

        by_branch: byBranch.map(row => ({
            branch_id: row.branch_id,
            branch_name: row.branch_name,
            total_notifications:
                Number(row.total_notifications || 0)
        }))
    };
};


module.exports = {
    getBranchAnalytics,
    getMemberAnalytics,
    getPastorAnalytics,
    getDonationAnalytics,
    getFundAnalytics,
    getEventAnalytics,
    getNotificationAnalytics
};