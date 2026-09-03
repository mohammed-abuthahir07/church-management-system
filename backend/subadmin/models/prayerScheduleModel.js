const db = require("../../config/database");

// =====================================================
// VALID DAYS
// =====================================================

const VALID_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


// =====================================================
// CREATE PRAYER SCHEDULE
// =====================================================

const createPrayerSchedule = async (scheduleData) => {
    const {
        branch_id,
        title,
        description,
        day_of_week,
        start_time,
        end_time,
        location
    } = scheduleData;

    const [result] = await db.query(
        `INSERT INTO prayer_schedules
        (
            branch_id,
            title,
            description,
            day_of_week,
            start_time,
            end_time,
            location
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            branch_id,
            title,
            description || null,
            day_of_week,
            start_time,
            end_time,
            location || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL PRAYER SCHEDULES
// =====================================================

const getAllPrayerSchedules = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM prayer_schedules
         WHERE branch_id = ?
         ORDER BY
            FIELD(
                day_of_week,
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ),
            start_time ASC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET TODAY'S PRAYER SCHEDULES
// =====================================================

const getTodayPrayerSchedules = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM prayer_schedules
         WHERE branch_id = ?
           AND day_of_week = DAYNAME(CURDATE())
           AND status = 'ACTIVE'
         ORDER BY start_time ASC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET PRAYER SCHEDULE BY ID
// =====================================================

const getPrayerScheduleById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM prayer_schedules
         WHERE id = ?
           AND branch_id = ?
         LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// =====================================================
// UPDATE PRAYER SCHEDULE
// =====================================================

const updatePrayerSchedule = async (
    id,
    branch_id,
    scheduleData
) => {
    const {
        title,
        description,
        day_of_week,
        start_time,
        end_time,
        location
    } = scheduleData;

    const [result] = await db.query(
        `UPDATE prayer_schedules
         SET
            title = ?,
            description = ?,
            day_of_week = ?,
            start_time = ?,
            end_time = ?,
            location = ?
         WHERE id = ?
           AND branch_id = ?`,
        [
            title,
            description || null,
            day_of_week,
            start_time,
            end_time,
            location || null,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// UPDATE STATUS
// =====================================================

const updatePrayerScheduleStatus = async (
    id,
    branch_id,
    status
) => {
    const [result] = await db.query(
        `UPDATE prayer_schedules
         SET status = ?
         WHERE id = ?
           AND branch_id = ?`,
        [
            status,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// DELETE PRAYER SCHEDULE
// =====================================================

const deletePrayerSchedule = async (
    id,
    branch_id
) => {
    const [result] = await db.query(
        `DELETE FROM prayer_schedules
         WHERE id = ?
           AND branch_id = ?`,
        [
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    VALID_DAYS,
    createPrayerSchedule,
    getAllPrayerSchedules,
    getTodayPrayerSchedules,
    getPrayerScheduleById,
    updatePrayerSchedule,
    updatePrayerScheduleStatus,
    deletePrayerSchedule
};