const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure only 2 participants are allowed
chatSchema.path("participants").validate(function (value) {
    return value.length === 2;
}, "A chat conversation must have exactly two participants.");

// Prevent duplicate chats for a single property between the same participants
chatSchema.index({ participants: 1, property: 1 }, { unique: true });
chatSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
