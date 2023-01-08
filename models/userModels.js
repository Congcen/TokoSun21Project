const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: Number, required: true },
})

module.exports = mongoose.model('User', UserSchema)