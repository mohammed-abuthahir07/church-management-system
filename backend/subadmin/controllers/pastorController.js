const pastorModel = require("../models/pastorModel");


// =====================================================
// CREATE PASTOR / LEADER
// =====================================================
const createPastor = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const {
            name,
            email,
            phone,
            address,
            date_of_birth,
            gender,
            designation,
            joined_date
        } = req.body;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Pastor / Leader name is required"
            });
        }

        if (!designation || !designation.trim()) {
            return res.status(400).json({
                success: false,
                message: "Designation is required"
            });
        }

        const pastorId = await pastorModel.createPastor({
            branch_id,
            name: name.trim(),
            email,
            phone,
            address,
            date_of_birth,
            gender,
            designation: designation.trim(),
            joined_date
        });

        const pastor = await pastorModel.getPastorById(
            pastorId,
            branch_id
        );

        res.status(201).json({
            success: true,
            message: "Pastor / Leader created successfully",
            pastor
        });

    } catch (error) {
        console.error("Create pastor error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create pastor / leader"
        });
    }
};


// =====================================================
// GET ALL PASTORS / LEADERS
// =====================================================
const getAllPastors = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const pastors = await pastorModel.getAllPastors(branch_id);

        res.json({
            success: true,
            message: "Pastors / Leaders fetched successfully",
            count: pastors.length,
            pastors
        });

    } catch (error) {
        console.error("Get pastors error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastors / leaders"
        });
    }
};


// =====================================================
// GET SINGLE PASTOR / LEADER
// =====================================================
const getPastorById = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const pastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        if (!pastor) {
            return res.status(404).json({
                success: false,
                message: "Pastor / Leader not found"
            });
        }

        res.json({
            success: true,
            message: "Pastor / Leader fetched successfully",
            pastor
        });

    } catch (error) {
        console.error("Get pastor error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch pastor / leader"
        });
    }
};


// =====================================================
// UPDATE PASTOR / LEADER
// =====================================================
const updatePastor = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            address,
            date_of_birth,
            gender,
            designation,
            joined_date
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Pastor / Leader name is required"
            });
        }

        if (!designation || !designation.trim()) {
            return res.status(400).json({
                success: false,
                message: "Designation is required"
            });
        }

        const existingPastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        if (!existingPastor) {
            return res.status(404).json({
                success: false,
                message: "Pastor / Leader not found"
            });
        }

        await pastorModel.updatePastor(id, branch_id, {
            name: name.trim(),
            email,
            phone,
            address,
            date_of_birth,
            gender,
            designation: designation.trim(),
            joined_date
        });

        const updatedPastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        res.json({
            success: true,
            message: "Pastor / Leader updated successfully",
            pastor: updatedPastor
        });

    } catch (error) {
        console.error("Update pastor error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update pastor / leader"
        });
    }
};


// =====================================================
// ACTIVATE / DEACTIVATE PASTOR
// =====================================================
const updatePastorStatus = async (req, res) => {
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

        const existingPastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        if (!existingPastor) {
            return res.status(404).json({
                success: false,
                message: "Pastor / Leader not found"
            });
        }

        await pastorModel.updatePastorStatus(
            id,
            branch_id,
            status
        );

        const updatedPastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        res.json({
            success: true,
            message: `Pastor / Leader ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            pastor: updatedPastor
        });

    } catch (error) {
        console.error("Update pastor status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update pastor / leader status"
        });
    }
};


// =====================================================
// DELETE PASTOR / LEADER
// =====================================================
const deletePastor = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const existingPastor = await pastorModel.getPastorById(
            id,
            branch_id
        );

        if (!existingPastor) {
            return res.status(404).json({
                success: false,
                message: "Pastor / Leader not found"
            });
        }

        await pastorModel.deletePastor(
            id,
            branch_id
        );

        res.json({
            success: true,
            message: "Pastor / Leader deleted successfully"
        });

    } catch (error) {
        console.error("Delete pastor error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete pastor / leader"
        });
    }
};


module.exports = {
    createPastor,
    getAllPastors,
    getPastorById,
    updatePastor,
    updatePastorStatus,
    deletePastor
};