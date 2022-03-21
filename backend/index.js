const express = require("express");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const cors = require("cors");

//import the routes
const pinRoute = require("./routes/pins");
const userRoute = require('./routes/users')
const wasteRoute = require('./routes/wastes')

const PORT = 8000 || process.env.PORT
const app = express()

dotenv.config()


app.use(express.json())
app.use(cors())


mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("mongodb connected");
    })
    .catch((err) => {
        console.log("connection error" + err);
    });


app.use('/api/pins', pinRoute)
app.use('/api/users', userRoute)
app.use('/api/wastes', wasteRoute)

app.listen(PORT, () => {
    console.log(`backend server is running on ${PORT}`)
})