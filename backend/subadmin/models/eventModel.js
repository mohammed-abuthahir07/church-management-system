const db = require("../../config/database");

// =====================================================
// CREATE EVENT
// =====================================================
const createEvent = async (eventData) => {
    const {
        branch_id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        location
    } = eventData;

    const [result] = await db.query(
        `INSERT INTO events
        (
            branch_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            location
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            branch_id,
            title,
            description || null,
            event_date,
            start_time,
            end_time || null,
            location || null
        ]
    );

    return result.insertId;
};


// =====================================================
// GET ALL EVENTS
// =====================================================
const getAllEvents = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM events
         WHERE branch_id = ?
         ORDER BY event_date ASC, start_time ASC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET UPCOMING EVENTS
// =====================================================
const getUpcomingEvents = async (branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM events
         WHERE branch_id = ?
         AND event_date >= CURDATE()
         AND status = 'ACTIVE'
         ORDER BY event_date ASC, start_time ASC`,
        [branch_id]
    );

    return rows;
};


// =====================================================
// GET SINGLE EVENT
// =====================================================
const getEventById = async (id, branch_id) => {
    const [rows] = await db.query(
        `SELECT *
         FROM events
         WHERE id = ?
         AND branch_id = ?
         LIMIT 1`,
        [id, branch_id]
    );

    return rows[0];
};


// =====================================================
// UPDATE EVENT
// =====================================================
const updateEvent = async (id, branch_id, eventData) => {
    const {
        title,
        description,
        event_date,
        start_time,
        end_time,
        location
    } = eventData;

    const [result] = await db.query(
        `UPDATE events
         SET
            title = ?,
            description = ?,
            event_date = ?,
            start_time = ?,
            end_time = ?,
            location = ?
         WHERE id = ?
         AND branch_id = ?`,
        [
            title,
            description || null,
            event_date,
            start_time,
            end_time || null,
            location || null,
            id,
            branch_id
        ]
    );

    return result;
};


// =====================================================
// UPDATE EVENT STATUS
// =====================================================
const updateEventStatus = async (id, branch_id, status) => {
    const [result] = await db.query(
        `UPDATE events
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
// DELETE EVENT
// =====================================================
const deleteEvent = async (id, branch_id) => {
    const [result] = await db.query(
        `DELETE FROM events
         WHERE id = ?
         AND branch_id = ?`,
        [
            id,
            branch_id
        ]
    );

    return result;
};


module.exports = {
    createEvent,
    getAllEvents,
    getUpcomingEvents,
    getEventById,
    updateEvent,
    updateEventStatus,
    deleteEvent
};