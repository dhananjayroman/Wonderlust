const User = require("../models/user");
const Listing = require("../models/listing");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// ─── Dashboard Stats ───
module.exports.getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalListings, pendingListings, pendingSellerRequests] = await Promise.all([
        User.countDocuments(),
        Listing.countDocuments(),
        Listing.countDocuments({ status: "pending" }),
        User.countDocuments({ verificationRequestStatus: "pending" })
    ]);

    return res.status(200).json(new ApiResponse(200, {
        totalUsers,
        totalListings,
        pendingListings,
        pendingSellerRequests
    }, "Dashboard stats retrieved"));
});

// ─── Users ───
module.exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("-salt -hash")
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, "All users retrieved"));
});

// ─── Pending Listings ───
module.exports.getPendingListings = asyncHandler(async (req, res) => {
    const listings = await Listing.find({ status: "pending" })
        .populate("owner", "username email phone isSeller sellerBadge")
        .sort({ postedAt: -1 });
    return res.status(200).json(new ApiResponse(200, listings, "Pending listings retrieved"));
});

// ─── All Listings (for admin view) ───
module.exports.getAllListingsAdmin = asyncHandler(async (req, res) => {
    const listings = await Listing.find()
        .populate("owner", "username email phone isSeller sellerBadge")
        .sort({ postedAt: -1 });
    return res.status(200).json(new ApiResponse(200, listings, "All listings retrieved"));
});

// ─── Moderate Listing ───
module.exports.moderateListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
        throw new ApiError(400, "Action must be 'approve' or 'reject'");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    listing.status = action === "approve" ? "active" : "rejected";
    listing.updatedAt = Date.now();
    await listing.save();

    return res.status(200).json(new ApiResponse(200, listing, `Listing ${action}d successfully`));
});

// ─── Pending Seller Requests ───
module.exports.getPendingSellerRequests = asyncHandler(async (req, res) => {
    const users = await User.find({ verificationRequestStatus: "pending" })
        .select("-salt -hash")
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, "Pending seller requests retrieved"));
});

// ─── Moderate Seller Request ───
module.exports.moderateSellerRequest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    if (!["approve", "reject"].includes(action)) {
        throw new ApiError(400, "Action must be 'approve' or 'reject'");
    }

    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (action === "approve") {
        user.isSeller = true;
        user.sellerBadge = true;
        user.verificationRequestStatus = "approved";
    } else {
        user.isSeller = false;
        user.sellerBadge = false;
        user.verificationRequestStatus = "rejected";
    }

    await user.save();
    return res.status(200).json(new ApiResponse(200, user, `Seller request ${action}d successfully`));
});
