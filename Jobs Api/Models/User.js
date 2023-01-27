const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please provide a name"],
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        require: [true, "Please provide a email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, "Pleas provide a password"],
        minlength: 6,
    }
})

// now here we wil hash our password to avoid the code redundancy
UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10);

    // this.password means password in current file so we are hashing the password during the creation of user 
    this.password = await bcrypt.hash(this.password, salt);
})


UserSchema.methods.comparePassword = async function (candidatePassword)
{
    const isMatch = bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);