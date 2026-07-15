const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    phone: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["new", "read", "responded", "closed"],
        default: "new"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes
inquirySchema.index({ property: 1 });
inquirySchema.index({ seller: 1, status: 1 });
inquirySchema.index({ buyer: 1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
