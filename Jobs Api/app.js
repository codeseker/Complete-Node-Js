require("dotenv").config();
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


const authRoute = require("./Routes/auth");
const authorizationUser = require("./Middleware/authentication");
const jobRoute = require("./Routes/jobs");
const connectDB = require("./db/connect");


app.set('trust-proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authorizationUser, jobRoute);

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log("Server started...");
        })
    } catch (error) {
        console.log(error);
    }
}

start();