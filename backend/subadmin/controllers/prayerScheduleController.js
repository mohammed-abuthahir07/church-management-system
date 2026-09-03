const prayerScheduleModel = require("../models/prayerScheduleModel");

const VALID_DAYS = prayerScheduleModel.VALID_DAYS;


// =====================================================
// NORMALIZE DAY
// =====================================================

const normalizeDay = (day) => {
    if (!day || typeof day !== "string") {
        return null;
    }

    const normalized =
        day.trim().charAt(0).toUpperCase() +
        day.trim().slice(1).toLowerCase();

    if (!VALID_DAYS.includes(normalized)) {
        return null;
    }

    return normalized;
};


// =====================================================
// VALIDATE TIME
// =====================================================

const isValidTime = (time) => {
    if (typeof time !== "string") {
        return false;
    }

    return /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time);
};


// =====================================================
// CREATE PRAYER SCHEDULE
// =====================================================

const createPrayerSchedule = async (req, res) => {
    try {

        // NEVER trust branch_id from frontend.
        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const {
            title,
            description,
            day_of_week,
            start_time,
            end_time,
            location
        } = req.body;


        // -----------------------------
        // TITLE
        // -----------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prayer schedule title is required"
            });
        }


        // -----------------------------
        // DAY
        // -----------------------------

        const normalizedDay = normalizeDay(day_of_week);

        if (!normalizedDay) {
            return res.status(400).json({
                success: false,
                message:
                    "Valid day is required: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday"
            });
        }


        // -----------------------------
        // START TIME
        // -----------------------------

        if (!isValidTime(start_time)) {
            return res.status(400).json({
                success: false,
                message: "Valid start time is required"
            });
        }


        // -----------------------------
        // END TIME
        // -----------------------------

        if (!isValidTime(end_time)) {
            return res.status(400).json({
                success: false,
                message: "Valid end time is required"
            });
        }


        // -----------------------------
        // TIME ORDER
        // -----------------------------

        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }


        // -----------------------------
        // CREATE
        // -----------------------------

        const scheduleId =
            await prayerScheduleModel.createPrayerSchedule({
                branch_id,
                title: title.trim(),
                description: description?.trim() || null,
                day_of_week: normalizedDay,
                start_time,
                end_time,
                location: location?.trim() || null
            });


        // -----------------------------
        // GET CREATED RECORD
        // -----------------------------

        const schedule =
            await prayerScheduleModel.getPrayerScheduleById(
                scheduleId,
                branch_id
            );


        return res.status(201).json({
            success: true,
            message: "Prayer schedule created successfully",
            schedule
        });

    } catch (error) {

        console.error(
            "Create prayer schedule error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create prayer schedule"
        });
    }
};


// =====================================================
// GET ALL PRAYER SCHEDULES
// =====================================================

const getAllPrayerSchedules = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const schedules =
            await prayerScheduleModel.getAllPrayerSchedules(
                branch_id
            );


        return res.json({
            success: true,
            message: "Prayer schedules fetched successfully",
            count: schedules.length,
            schedules
        });

    } catch (error) {

        console.error(
            "Get prayer schedules error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch prayer schedules"
        });
    }
};


// =====================================================
// GET TODAY'S PRAYER SCHEDULES
// =====================================================

const getTodayPrayerSchedules = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const schedules =
            await prayerScheduleModel.getTodayPrayerSchedules(
                branch_id
            );


        return res.json({
            success: true,
            message: "Today's prayer schedules fetched successfully",
            day: new Intl.DateTimeFormat("en-US", {
                weekday: "long"
            }).format(new Date()),
            count: schedules.length,
            schedules
        });

    } catch (error) {

        console.error(
            "Get today's prayer schedules error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch today's prayer schedules"
        });
    }
};


// =====================================================
// GET SINGLE PRAYER SCHEDULE
// =====================================================

const getPrayerScheduleById = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const schedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        if (!schedule) {
            return res.status(404).json({
                success: false,
                message: "Prayer schedule not found"
            });
        }


        return res.json({
            success: true,
            message: "Prayer schedule fetched successfully",
            schedule
        });

    } catch (error) {

        console.error(
            "Get prayer schedule error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch prayer schedule"
        });
    }
};


// =====================================================
// UPDATE PRAYER SCHEDULE
// =====================================================

const updatePrayerSchedule = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const {
            title,
            description,
            day_of_week,
            start_time,
            end_time,
            location
        } = req.body;


        // -----------------------------
        // TITLE
        // -----------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prayer schedule title is required"
            });
        }


        // -----------------------------
        // DAY
        // -----------------------------

        const normalizedDay = normalizeDay(day_of_week);

        if (!normalizedDay) {
            return res.status(400).json({
                success: false,
                message: "Valid day of week is required"
            });
        }


        // -----------------------------
        // TIME
        // -----------------------------

        if (!isValidTime(start_time)) {
            return res.status(400).json({
                success: false,
                message: "Valid start time is required"
            });
        }


        if (!isValidTime(end_time)) {
            return res.status(400).json({
                success: false,
                message: "Valid end time is required"
            });
        }


        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }


        // -----------------------------
        // CHECK EXISTING
        // -----------------------------

        const existingSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        if (!existingSchedule) {
            return res.status(404).json({
                success: false,
                message: "Prayer schedule not found"
            });
        }


        // -----------------------------
        // UPDATE
        // -----------------------------

        await prayerScheduleModel.updatePrayerSchedule(
            id,
            branch_id,
            {
                title: title.trim(),
                description: description?.trim() || null,
                day_of_week: normalizedDay,
                start_time,
                end_time,
                location: location?.trim() || null
            }
        );


        // -----------------------------
        // GET UPDATED
        // -----------------------------

        const updatedSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        return res.json({
            success: true,
            message: "Prayer schedule updated successfully",
            schedule: updatedSchedule
        });

    } catch (error) {

        console.error(
            "Update prayer schedule error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update prayer schedule"
        });
    }
};


// =====================================================
// UPDATE STATUS
// =====================================================

const updatePrayerScheduleStatus = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;
        const { status } = req.body;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        if (!["ACTIVE", "INACTIVE"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be ACTIVE or INACTIVE"
            });
        }


        const existingSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        if (!existingSchedule) {
            return res.status(404).json({
                success: false,
                message: "Prayer schedule not found"
            });
        }


        await prayerScheduleModel.updatePrayerScheduleStatus(
            id,
            branch_id,
            status
        );


        const updatedSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        return res.json({
            success: true,
            message:
                status === "ACTIVE"
                    ? "Prayer schedule activated successfully"
                    : "Prayer schedule deactivated successfully",
            schedule: updatedSchedule
        });

    } catch (error) {

        console.error(
            "Update prayer schedule status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update prayer schedule status"
        });
    }
};


// =====================================================
// DELETE PRAYER SCHEDULE
// =====================================================

const deletePrayerSchedule = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const existingSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        if (!existingSchedule) {
            return res.status(404).json({
                success: false,
                message: "Prayer schedule not found"
            });
        }


        await prayerScheduleModel.deletePrayerSchedule(
            id,
            branch_id
        );


        return res.json({
            success: true,
            message: "Prayer schedule deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete prayer schedule error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete prayer schedule"
        });
    }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createPrayerSchedule,
    getAllPrayerSchedules,
    getTodayPrayerSchedules,
    getPrayerScheduleById,
    updatePrayerSchedule,
    updatePrayerScheduleStatus,
    deletePrayerSchedule
};