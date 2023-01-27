const User = require("../Models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    //const { name, email, password } = req.body;

    // password is hashing here
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(password, salt);
    // const tempUser = { name, email, password: hashPassword }
    const user = await User.create({ ...req.body })
    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '45d' });
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
}
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide email and password properly" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '45d' });
    res.status(StatusCodes.OK).json({ user: { name: user.name, msg: "Congratulations you have been successfully logged in" }, token })
}

module.exports = {
    login, register
}