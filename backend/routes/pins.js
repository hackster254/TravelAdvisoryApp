const router = require('express').Router()

const Pin = require('../models/Pin')


// CREATE A PIN

router.post('/', async(req, res) => {
    const newPin = new Pin(req.body)

    try {
        const savedPin = await newPin.save()

        res.status(200).json({
            msg: "new pin saved",
            pin: savedPin
        })

    } catch (error) {
        res.status(500).json({
            msg: "could not add the new pin",
            error: error
        })

    }
})

// GET ALL PINS
router.get("/", async(req, res) => {
    try {
        const pins = await Pin.find();
        res.status(200).json({ msg: "All pins retrieved", pins: pins });
    } catch (error) {
        res.status(500).json({ msg: "error getting pins", error: error });
    }
});

module.exports = router