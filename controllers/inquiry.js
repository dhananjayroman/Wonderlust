const Inquiry = require("../models/inquiry");
const Listing = require("../models/listing");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

module.exports.createInquiry = asyncHandler(async (req, res) => {
    const { propertyId, message, phone, email } = req.body;

    if (!propertyId || !message || !phone || !email) {
        throw new ApiError(400, "Property ID, message, phone, and email are required fields");
    }

    const listing = await Listing.findById(propertyId);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    // A user cannot send an inquiry to themselves
    if (listing.owner.toString() === req.user._id.toString()) {
        throw new ApiError(400, "You cannot send an inquiry for your own property");
    }

    const newInquiry = new Inquiry({
        property: propertyId,
        buyer: req.user._id,
        seller: listing.owner,
        message,
        phone,
        email
    });

    await newInquiry.save();

    return res
        .status(201)
        .json(new ApiResponse(201, newInquiry, "Inquiry sent successfully"));
});

module.exports.getSentInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({ buyer: req.user._id })
        .populate("property", "title location image price")
        .populate("seller", "username email phone")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, inquiries, "Sent inquiries retrieved successfully"));
});

module.exports.getReceivedInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({ seller: req.user._id })
        .populate("property", "title location image price")
        .populate("buyer", "username email phone")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, inquiries, "Received inquiries retrieved successfully"));
});

module.exports.updateInquiryStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["new", "read", "responded", "closed"].includes(status)) {
        throw new ApiError(400, "Valid status is required");
    }

    const inquiry = await Inquiry.findOne({ _id: id, seller: req.user._id });

    if (!inquiry) {
        throw new ApiError(404, "Inquiry not found or you are not authorized to update it");
    }

    inquiry.status = status;
    await inquiry.save();

    return res
        .status(200)
        .json(new ApiResponse(200, inquiry, "Inquiry status updated successfully"));
});
