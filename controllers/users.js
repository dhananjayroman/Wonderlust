const User = require("../models/user");
const Listing = require("../models/listing");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const smsService = require("../services/sms.service");

module.exports.signUp = asyncHandler(async (req, res, next) => {
    const { username, password, email, phone } = req.body;

    if (!username || !password || !email) {
        throw new ApiError(400, "Username, password and email are required fields");
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new ApiError(409, "User with this email already exists");
    }

    if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            throw new ApiError(409, "User with this phone number already exists");
        }
    }

    const newUser = new User({ username, email, phone });
    const registeredUser = await User.register(newUser, password);

    req.logIn(registeredUser, (err) => {
        if (err) return next(err);
        return res
            .status(201)
            .json(new ApiResponse(201, registeredUser, "User registered and logged in successfully"));
    });
});

module.exports.logIn = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication failed");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Logged in successfully"));
});

module.exports.logOut = asyncHandler(async (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Logged out successfully"));
    });
});

module.exports.getCurrentUser = asyncHandler(async (req, res) => {
    if (req.isAuthenticated()) {
        return res
            .status(200)
            .json(new ApiResponse(200, req.user, "Current authenticated user details retrieved"));
    } else {
        return res
            .status(200)
            .json({ success: false, statusCode: 200, data: null, message: "User is not authenticated" });
    }
});

module.exports.sendOTP = asyncHandler(async (req, res) => {
    const phone = req.body.phone || (req.user && req.user.phone);

    if (!phone) {
        throw new ApiError(400, "Phone number is required");
    }

    // Match 10-digit Indian phone numbers
    if (!/^\d{10}$/.test(phone)) {
        throw new ApiError(400, "Invalid Indian phone number. Must be exactly 10 digits.");
    }

    const response = await smsService.sendOTP(phone);
    return res
        .status(200)
        .json(new ApiResponse(200, response, "Verification OTP code sent successfully"));
});

module.exports.verifyOTP = asyncHandler(async (req, res) => {
    const { phone, otp, code } = req.body;
    const verificationCode = otp || code;
    const targetPhone = phone || (req.user && req.user.phone);

    if (!targetPhone || !verificationCode) {
        throw new ApiError(400, "Phone number and 6-digit OTP code are required fields");
    }

    const isVerified = await smsService.verifyOTP(targetPhone, verificationCode);
    
    if (!isVerified) {
        throw new ApiError(400, "Invalid or expired verification OTP code");
    }

    // If logged in, automatically update phone and isPhoneVerified to true
    if (req.user) {
        const user = await User.findById(req.user._id);
        if (user) {
            user.isPhoneVerified = true;
            if (phone) {
                user.phone = phone;
            }
            await user.save();
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { isPhoneVerified: true }, "Phone number verified successfully"));
});

module.exports.getWishlist = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: {
            path: "owner",
            select: "username email phone"
        }
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user.wishlist, "Wishlist retrieved successfully"));
});

module.exports.addToWishlist = asyncHandler(async (req, res) => {
    const { listingId } = req.body;
    if (!listingId) {
        throw new ApiError(400, "Listing ID is required");
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.wishlist.includes(listingId)) {
        return res
            .status(200)
            .json(new ApiResponse(200, user.wishlist, "Listing already in wishlist"));
    }

    user.wishlist.push(listingId);
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.wishlist, "Listing added to wishlist successfully"));
});

module.exports.removeFromWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Listing ID is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.wishlist = user.wishlist.filter(item => item.toString() !== id.toString());
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user.wishlist, "Listing removed from wishlist successfully"));
});

module.exports.requestSellerStatus = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(401, "Authentication required");
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.isSeller) {
        throw new ApiError(400, "You are already a seller");
    }

    if (user.verificationRequestStatus === 'pending') {
        throw new ApiError(400, "Your request is already pending");
    }

    user.verificationRequestStatus = 'pending';
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Seller verification request submitted successfully"));
});