const router = require("express").Router();

const Pin = require("../models/Pin");
const Waste = require("../models/Waste");





// CREATE A WASTE

router.post('/', async(req, res) => {
    const { site, name, amount, image } = req.body
    console.log(site)

    try {
        const findPin = await Pin.findOne({
            title: site,
        });
        console.log("found pin is" + findPin.title);

        if (!findPin) {
            res.status(400).json({
                msg: "could not find the title for that waste in our pins",
            });
        }

        const newWaste = new Waste({
            name: req.body.name,
            site: findPin.title,
            image: req.body.image,
            amount: req.body.amount,
            //collected: req.body.collected,
        });

        console.log("new waste is " + newWaste);

        const savedWaste = await newWaste.save()

        res.status(200).json({
            msg: "new waste saved",
            waste: savedWaste
        })
    } catch (error) {
        res.status(500).json({
            msg: "could not add the new waste to database",
            error: error
        })
    }

})

// GET A LIST OF ALL WASTES PER SITE

router.get('/get-waste/:site', async(req, res) => {
    const sitename = req.params.site
    console.log(sitename)
    try {
        const wastes = await Waste.findOne({
            site: sitename
        });

        if (wastes.length === 0) {
            console.log("no wastes" + wastes);
            res.status(500).json({
                msg: "specific waste NOT retrieved",
                success: false
            });
        }
        res.status(200).json({
            msg: "specific waste retrieved",
            wastes: wastes
        });
    } catch (error) {
        res.status(500).json({ msg: "error getting wastes for specific site", error: error });
    }
})

// GETTTING /RETRIEVING ALL WASTES
router.get('/all-wastes', async(req, res) => {
    try {
        const allwastes = await Waste.find()

        res
            .status(200)
            .json({ msg: "all wastes in database retrieved", wastes: allwastes });
    } catch (error) {
        res.status(500).json({ msg: "error getting all wastes in database", error: error });
    }
})
module.exports = router;