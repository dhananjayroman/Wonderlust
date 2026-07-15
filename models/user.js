const mongoose = require("mongoose");
const PassportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        match: /^\d{10}$/
    },
    role: {
        type: String,
        enum: ["buyer", "seller", "admin"],
        default: "buyer"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationRequestStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'rejected'],
        default: 'none'
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    sellerBadge: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        maxlength: 500
    },
    location: {
        type: String
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", userSchema);