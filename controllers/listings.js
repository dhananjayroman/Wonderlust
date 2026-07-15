const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MY_ACCESS_TOKEN = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

module.exports.index = asyncHandler(async (req, res) => {
    const listings = await Listing.find().populate("owner", "username email phone avatar");
    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Properties list retrieved successfully"));
});

module.exports.createNewPost = asyncHandler(async (req, res, next) => {
    const data = req.body.listing || req.body;
    const { 
        title, 
        description, 
        price, 
        priceType, 
        propertyType, 
        listingType, 
        bedrooms, 
        bathrooms, 
        area, 
        floor, 
        totalFloors, 
        furnished, 
        amenities, 
        location,
        contact,
        reraNumber
    } = data;

    // Build query for geocoding
    let searchQuery = "";
    if (typeof location === "object") {
        searchQuery = `${location.address || ""}, ${location.city || ""}, ${location.state || ""} ${location.pincode || ""}`;
    } else {
        searchQuery = location || "";
    }

    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] }; // Default: New Delhi coordinates
    if (searchQuery.trim() !== "") {
        try {
            const geoResponse = await geocodingClient.forwardGeocode({
                query: searchQuery,
                limit: 1
            }).send();
            if (geoResponse.body.features && geoResponse.body.features.length > 0) {
                geometry = geoResponse.body.features[0].geometry;
            }
        } catch (err) {
            console.error("Geocoding failed, using fallback coordinates:", err.message);
        }
    }

    // Capture files or single upload
    let uploadImages = [];
    if (req.files && req.files.length > 0) {
        uploadImages = req.files.map((file, idx) => ({
            url: file.path,
            filename: file.filename,
            isPrimary: idx === 0
        }));
    } else if (req.file) {
        uploadImages = [{
            url: req.file.path,
            filename: req.file.filename,
            isPrimary: true
        }];
    }

    // Set fallback default image if none uploaded
    if (uploadImages.length === 0) {
        uploadImages = [{
            url: "https://res.cloudinary.com/placeholder-property.jpg",
            filename: "wonderlust/placeholder",
            isPrimary: true
        }];
    }

    // Structure location object
    const structuredLocation = typeof location === "object" ? {
        address: location.address || "",
        city: location.city || "",
        state: location.state || "",
        pincode: location.pincode || "",
        landmark: location.landmark || ""
    } : {
        address: location || "",
        city: location || "Delhi",
        state: "Delhi",
        pincode: "110001",
        landmark: ""
    };

    const structuredContact = typeof contact === "object" ? {
        phone: contact.phone || req.user.phone || "9876543210",
        whatsapp: contact.whatsapp || contact.phone || req.user.phone || "9876543210",
        showPhone: contact.showPhone !== false
    } : {
        phone: req.user.phone || "9876543210",
        whatsapp: req.user.phone || "9876543210",
        showPhone: true
    };

    const newListing = new Listing({
        title,
        description,
        price,
        priceType: priceType || "total",
        propertyType: propertyType || "flat",
        listingType: listingType || "sale",
        bedrooms: bedrooms || 0,
        bathrooms: bathrooms || 0,
        area: area || 1000,
        floor: floor || 0,
        totalFloors: totalFloors || 0,
        furnished: furnished || "unfurnished",
        amenities: amenities || [],
        images: uploadImages,
        location: structuredLocation,
        geometry,
        owner: req.user._id,
        contact: structuredContact,
        reraNumber,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Default 90 days expiry
    });

    await newListing.save();
    return res
        .status(201)
        .json(new ApiResponse(201, newListing, "Property listed successfully and pending admin approval"));
});

module.exports.showListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", select: "username email avatar" } })
        .populate("owner", "username email phone avatar isSeller sellerBadge");

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    // Increment views safely
    listing.views += 1;
    await listing.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, listing, "Property details retrieved successfully"));
});

module.exports.editListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body.listing || req.body;
    
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    // Perform updates
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) {
            listing[key] = data[key];
        }
    });

    // Handle new uploads if any
    if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
            url: file.path,
            filename: file.filename,
            isPrimary: false
        }));
        listing.images = [...listing.images, ...newImages];
    } else if (req.file) {
        listing.images = [{
            url: req.file.path,
            filename: req.file.filename,
            isPrimary: true
        }];
    }

    // If listing was rejected, resubmitting edits moves it back to pending
    if (listing.status === "rejected") {
        listing.status = "pending";
    }
    listing.updatedAt = Date.now();

    await listing.save();
    return res
        .status(200)
        .json(new ApiResponse(200, listing, "Property listing updated successfully"));
});

module.exports.searchFuntionality = asyncHandler(async (req, res) => {
    const { q, city, propertyType, listingType, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = { status: "active" };

    if (q && q.trim() !== "") {
        filter.$text = { $search: q };
    }

    if (city) {
        filter["location.city"] = { $regex: city, $options: "i" };
    }

    if (propertyType) {
        filter.propertyType = propertyType;
    }

    if (listingType) {
        filter.listingType = listingType;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skipIndex = (page - 1) * limit;
    const listings = await Listing.find(filter)
        .populate("owner", "username email phone avatar")
        .sort({ isFeatured: -1, postedAt: -1 })
        .limit(Number(limit))
        .skip(Number(skipIndex));

    const totalDocs = await Listing.countDocuments(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            docs: listings,
            totalDocs,
            limit: Number(limit),
            page: Number(page),
            totalPages: Math.ceil(totalDocs / limit)
        }, "Properties search retrieved successfully"));
});

module.exports.deleteListing = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ApiError(404, "Listing not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Listing deleted successfully"));
});