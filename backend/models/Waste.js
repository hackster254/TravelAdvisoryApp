const mongoose = require("mongoose");

const WasteSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    image: {
        type: String
    },
    // every waste belongs to a pin so it has a title which is unique for every pin
    site: {
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number
    }
    /*,
    collected: {
        type: Boolean,
        default: false
    }
    */

}, { timestamps: true })

module.exports = mongoose.model("Waste", WasteSchema)