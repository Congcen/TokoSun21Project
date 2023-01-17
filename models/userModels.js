const mongoose = require("mongoose")
const Schema = mongoose.Schema
const validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const UserSchema = new Schema({
    fullname: { type: String, required: true, maxLength: 124 },
    username: { type: String, required: true, maxLength: 24, unique: true },
    email: {
        type: String, required: true, maxLength: 50, validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: { type: String, required: true, minLength: 12, maxLength: 14 },
    address: { type: String, required: true, maxLength: 255 },
    password: { type: String, required: true },
    role: { type: Number, required: true, min: 1, max: 2 },
})

module.exports = mongoose.model('User', UserSchema)