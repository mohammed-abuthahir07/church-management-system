const prayerScheduleModel = require("../models/prayerScheduleModel");


// =====================================================
// CREATE PRAYER SCHEDULE
// =====================================================
const createPrayerSchedule = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;

        const {
            title,
            description,
            prayer_date,
            start_time,
            end_time,
            location
        } = req.body;


        // Check branch
        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        // Required fields
        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prayer schedule title is required"
            });
        }


        if (!prayer_date) {
            return res.status(400).json({
                success: false,
                message: "Prayer date is required"
            });
        }


        if (!start_time) {
            return res.status(400).json({
                success: false,
                message: "Start time is required"
            });
        }


        if (!end_time) {
            return res.status(400).json({
                success: false,
                message: "End time is required"
            });
        }


        // Validate time
        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
            });
        }


        const scheduleId =
            await prayerScheduleModel.createPrayerSchedule({
                branch_id,
                title: title.trim(),
                description,
                prayer_date,
                start_time,
                end_time,
                location
            });


        const schedule =
            await prayerScheduleModel.getPrayerScheduleById(
                scheduleId,
                branch_id
            );


        res.status(201).json({
            success: true,
            message: "Prayer schedule created successfully",
            schedule
        });

    } catch (error) {

        console.error(
            "Create prayer schedule error:",
            error
        );

        res.status(500).json({
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


        res.json({
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

        res.status(500).json({
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


        res.json({
            success: true,
            message: "Today's prayer schedules fetched successfully",
            date: new Date().toISOString().split("T")[0],
            count: schedules.length,
            schedules
        });

    } catch (error) {

        console.error(
            "Get today's prayer schedules error:",
            error
        );

        res.status(500).json({
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


        res.json({
            success: true,
            message: "Prayer schedule fetched successfully",
            schedule
        });

    } catch (error) {

        console.error(
            "Get prayer schedule error:",
            error
        );

        res.status(500).json({
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


        const {
            title,
            description,
            prayer_date,
            start_time,
            end_time,
            location
        } = req.body;


        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prayer schedule title is required"
            });
        }


        if (!prayer_date) {
            return res.status(400).json({
                success: false,
                message: "Prayer date is required"
            });
        }


        if (!start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Start time and end time are required"
            });
        }


        if (start_time >= end_time) {
            return res.status(400).json({
                success: false,
                message: "End time must be after start time"
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


        await prayerScheduleModel.updatePrayerSchedule(
            id,
            branch_id,
            {
                title: title.trim(),
                description,
                prayer_date,
                start_time,
                end_time,
                location
            }
        );


        const updatedSchedule =
            await prayerScheduleModel.getPrayerScheduleById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: "Prayer schedule updated successfully",
            schedule: updatedSchedule
        });

    } catch (error) {

        console.error(
            "Update prayer schedule error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update prayer schedule"
        });
    }
};


// =====================================================
// ACTIVATE / DEACTIVATE
// =====================================================
const updatePrayerScheduleStatus = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;
        const { status } = req.body;


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


        res.json({
            success: true,
            message: `Prayer schedule ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            schedule: updatedSchedule
        });

    } catch (error) {

        console.error(
            "Update prayer schedule status error:",
            error
        );

        res.status(500).json({
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


        res.json({
            success: true,
            message: "Prayer schedule deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete prayer schedule error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete prayer schedule"
        });
    }
};


module.exports = {
    createPrayerSchedule,
    getAllPrayerSchedules,
    getTodayPrayerSchedules,
    getPrayerScheduleById,
    updatePrayerSchedule,
    updatePrayerScheduleStatus,
    deletePrayerSchedule
};