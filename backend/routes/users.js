const router = require("express").Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");


// register 

router.post('/register', async(req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //create new user
        const savedUser = await newUser.save();

        // send response success
        res.status(200).json({ msg: "new user created", user: savedUser });


    } catch (error) {
        res.status(500).json({
            msg: "could not add/register the new user",
            error: error,
        });
    }
})



// login a user after verifying credentials
router.post('/login', async(req, res) => {

    try {
        // find user by username first

        const findUser = await User.findOne({
            username: req.body.username,
        });
        if (!findUser) {
            res
                .status(400)
                .json({
                    msg: "could not find the selected user, try another username",
                });
        }

        //validate password
        const validPassword = await bcrypt.compare(req.body.password, findUser.password);

        if (!validPassword) {
            res.status(400).json({
                msg: "Wrong username or password, try another username and password",
            });
        }
        //send successfull response

        res
            .status(200)
            .json({
                msg: "user found with that password",
                _id: findUser._id,
                username: findUser.username,
            });
    } catch (error) {
        res.status(500).json({ msg: "could not login error", error: error });
    }

})


module.exports = router;