const mongoose = require("mongoose");
const Review = require("./reviews");

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    images: [{
        url: { type: String, required: true },
        filename: { type: String, required: true },
        isPrimary: { type: Boolean, default: false }
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    },
    priceType: {
        type: String,
        enum: ["total", "per_month", "per_year"],
        required: true,
        default: "total"
    },
    propertyType: {
        type: String,
        enum: ["flat", "house", "villa", "farmhouse", "plot", "pg", "hostel", "office", "shop"],
        required: true
    },
    listingType: {
        type: String,
        enum: ["sale", "rent", "lease"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "active", "rejected", "sold", "rented"],
        default: "pending"
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, required: true }, // in Sq. Ft.
    floor: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 0 },
    furnished: {
        type: String,
        enum: ["furnished", "semi", "unfurnished"],
        default: "unfurnished"
    },
    amenities: [{ type: String }],
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: { type: String }
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    contact: {
        phone: { type: String, required: true },
        whatsapp: { type: String },
        showPhone: { type: Boolean, default: true }
    },
    views: { type: Number, default: 0 },
    inquiriesCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    reraNumber: { type: String },
    tags: [{ type: String }],
    postedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

// Indexes
listSchema.index({ "geometry": "2dsphere" });
listSchema.index({ "location.city": 1, status: 1 });
listSchema.index({ price: 1, status: 1 });
listSchema.index({ owner: 1 });
listSchema.index({ isFeatured: -1, postedAt: -1 });
listSchema.index({ title: "text", description: "text", "location.address": "text" });

listSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listSchema);

module.exports = Listing;