require("dotenv").config();
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes")


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid Token" });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // now once the token has been verified attach tha user to Job Route
        req.user = { userId: decoded.userId, name: decoded.name }
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid Token" });
    }
}

module.exports = auth;