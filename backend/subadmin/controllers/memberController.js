const memberModel = require("../models/memberModel");


// Create Member
const createMember = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        const {
            name,
            email,
            phone,
            address,
            date_of_birth,
            gender,
            joined_date
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Member name is required"
            });
        }

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const memberId = await memberModel.createMember({
            branch_id,
            name: name.trim(),
            email,
            phone,
            address,
            date_of_birth,
            gender,
            joined_date
        });

        const member = await memberModel.getMemberById(
            memberId,
            branch_id
        );

        res.status(201).json({
            success: true,
            message: "Member created successfully",
            member
        });

    } catch (error) {
        console.error("Create member error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create member"
        });
    }
};


// Get All Members
const getAllMembers = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;

        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }

        const members = await memberModel.getAllMembers(branch_id);

        res.json({
            success: true,
            message: "Members fetched successfully",
            count: members.length,
            members
        });

    } catch (error) {
        console.error("Get members error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch members"
        });
    }
};


// Get Single Member
const getMemberById = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const member = await memberModel.getMemberById(
            id,
            branch_id
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        res.json({
            success: true,
            message: "Member fetched successfully",
            member
        });

    } catch (error) {
        console.error("Get member error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch member"
        });
    }
};


// Update Member
const updateMember = async (req, res) => {
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
            joined_date
        } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Member name is required"
            });
        }

        const existingMember = await memberModel.getMemberById(
            id,
            branch_id
        );

        if (!existingMember) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        await memberModel.updateMember(id, branch_id, {
            name: name.trim(),
            email,
            phone,
            address,
            date_of_birth,
            gender,
            joined_date
        });

        const updatedMember = await memberModel.getMemberById(
            id,
            branch_id
        );

        res.json({
            success: true,
            message: "Member updated successfully",
            member: updatedMember
        });

    } catch (error) {
        console.error("Update member error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update member"
        });
    }
};


// Activate / Deactivate Member
const updateMemberStatus = async (req, res) => {
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

        const existingMember = await memberModel.getMemberById(
            id,
            branch_id
        );

        if (!existingMember) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        await memberModel.updateMemberStatus(
            id,
            branch_id,
            status
        );

        const updatedMember = await memberModel.getMemberById(
            id,
            branch_id
        );

        res.json({
            success: true,
            message: `Member ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            member: updatedMember
        });

    } catch (error) {
        console.error("Update member status error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update member status"
        });
    }
};


// Delete Member
const deleteMember = async (req, res) => {
    try {
        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const existingMember = await memberModel.getMemberById(
            id,
            branch_id
        );

        if (!existingMember) {
            return res.status(404).json({
                success: false,
                message: "Member not found"
            });
        }

        await memberModel.deleteMember(id, branch_id);

        res.json({
            success: true,
            message: "Member deleted successfully"
        });

    } catch (error) {
        console.error("Delete member error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete member"
        });
    }
};


module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    updateMemberStatus,
    deleteMember
};