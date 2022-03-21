const mongoose = require("mongoose");

const PinSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true, // so that it is unique for every waste
    },
    desc: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },

}, { timestamps: true });

module.exports = mongoose.model("Pin", PinSchema);