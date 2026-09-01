const donationModel = require("../models/donationModel");
const db = require("../../config/database");


// =====================================================
// CREATE DONATION
// =====================================================
const createDonation = async (req, res) => {
    try {

        // Branch comes from logged-in Sub Admin
        const branch_id = req.user.branch_id;

        const {
            member_id,
            amount,
            payment_date,
            purpose
        } = req.body;


        // Check branch
        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        // Validate member
        if (!member_id) {
            return res.status(400).json({
                success: false,
                message: "Member is required"
            });
        }


        // Validate amount
        if (
            amount === undefined ||
            amount === null ||
            amount === "" ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid donation amount is required"
            });
        }


        // Validate date
        if (!payment_date) {
            return res.status(400).json({
                success: false,
                message: "Payment date is required"
            });
        }


        // Make sure member belongs to this branch
        const [members] = await db.query(
            `SELECT id
             FROM members
             WHERE id = ?
             AND branch_id = ?
             LIMIT 1`,
            [
                member_id,
                branch_id
            ]
        );


        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Member not found in your branch"
            });
        }


        const donationId =
            await donationModel.createDonation({
                branch_id,
                member_id,
                amount: Number(amount),
                payment_date,
                purpose
            });


        const donation =
            await donationModel.getDonationById(
                donationId,
                branch_id
            );


        res.status(201).json({
            success: true,
            message: "Donation recorded successfully",
            donation
        });

    } catch (error) {

        console.error(
            "Create donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to record donation"
        });
    }
};


// =====================================================
// GET ALL DONATIONS
// =====================================================
const getAllDonations = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        if (!branch_id) {
            return res.status(403).json({
                success: false,
                message: "Branch is not assigned to this account"
            });
        }


        const donations =
            await donationModel.getAllDonations(
                branch_id
            );


        res.json({
            success: true,
            message: "Donations fetched successfully",
            count: donations.length,
            donations
        });

    } catch (error) {

        console.error(
            "Get donations error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch donations"
        });
    }
};


// =====================================================
// GET SINGLE DONATION
// =====================================================
const getDonationById = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const donation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }


        res.json({
            success: true,
            message: "Donation fetched successfully",
            donation
        });

    } catch (error) {

        console.error(
            "Get donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch donation"
        });
    }
};


// =====================================================
// GET MEMBER DONATIONS
// =====================================================
const getMemberDonations = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { memberId } = req.params;


        const donations =
            await donationModel.getMemberDonations(
                memberId,
                branch_id
            );


        res.json({
            success: true,
            message: "Member donations fetched successfully",
            count: donations.length,
            donations
        });

    } catch (error) {

        console.error(
            "Get member donations error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch member donations"
        });
    }
};


// =====================================================
// THIS MONTH TOTAL
// =====================================================
const getCurrentMonthTotal = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        const total =
            await donationModel.getCurrentMonthTotal(
                branch_id
            );


        res.json({
            success: true,
            message: "Current month donation total fetched successfully",
            month: new Date().toISOString().slice(0, 7),
            total: Number(total)
        });

    } catch (error) {

        console.error(
            "Current month donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch current month total"
        });
    }
};


// =====================================================
// THIS YEAR TOTAL
// =====================================================
const getCurrentYearTotal = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;


        const total =
            await donationModel.getCurrentYearTotal(
                branch_id
            );


        res.json({
            success: true,
            message: "Current year donation total fetched successfully",
            year: new Date().getFullYear(),
            total: Number(total)
        });

    } catch (error) {

        console.error(
            "Current year donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch current year total"
        });
    }
};


// =====================================================
// UPDATE DONATION
// =====================================================
const updateDonation = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;

        const {
            member_id,
            amount,
            payment_date,
            purpose
        } = req.body;


        if (!member_id) {
            return res.status(400).json({
                success: false,
                message: "Member is required"
            });
        }


        if (
            amount === undefined ||
            amount === null ||
            amount === "" ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid donation amount is required"
            });
        }


        if (!payment_date) {
            return res.status(400).json({
                success: false,
                message: "Payment date is required"
            });
        }


        // Check member belongs to branch
        const [members] = await db.query(
            `SELECT id
             FROM members
             WHERE id = ?
             AND branch_id = ?
             LIMIT 1`,
            [
                member_id,
                branch_id
            ]
        );


        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Member not found in your branch"
            });
        }


        // Check donation
        const existingDonation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        if (!existingDonation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }


        await donationModel.updateDonation(
            id,
            branch_id,
            {
                member_id,
                amount: Number(amount),
                payment_date,
                purpose
            }
        );


        const updatedDonation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: "Donation updated successfully",
            donation: updatedDonation
        });

    } catch (error) {

        console.error(
            "Update donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update donation"
        });
    }
};


// =====================================================
// ACTIVATE / DEACTIVATE
// =====================================================
const updateDonationStatus = async (req, res) => {
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


        const existingDonation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        if (!existingDonation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }


        await donationModel.updateDonationStatus(
            id,
            branch_id,
            status
        );


        const updatedDonation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        res.json({
            success: true,
            message: `Donation ${
                status === "ACTIVE"
                    ? "activated"
                    : "deactivated"
            } successfully`,
            donation: updatedDonation
        });

    } catch (error) {

        console.error(
            "Update donation status error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update donation status"
        });
    }
};


// =====================================================
// DELETE DONATION
// =====================================================
const deleteDonation = async (req, res) => {
    try {

        const branch_id = req.user.branch_id;
        const { id } = req.params;


        const existingDonation =
            await donationModel.getDonationById(
                id,
                branch_id
            );


        if (!existingDonation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found"
            });
        }


        await donationModel.deleteDonation(
            id,
            branch_id
        );


        res.json({
            success: true,
            message: "Donation deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete donation error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to delete donation"
        });
    }
};


module.exports = {
    createDonation,
    getAllDonations,
    getDonationById,
    getMemberDonations,
    getCurrentMonthTotal,
    getCurrentYearTotal,
    updateDonation,
    updateDonationStatus,
    deleteDonation
};