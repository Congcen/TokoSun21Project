const mongoose = require("mongoose")
// const crypto = require('crypto');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String },
    password: { type: String, required: true },
    role: { type: Number, required: true },
})

module.exports = mongoose.model('User', UserSchema)

// username
// password
// role
// cart(customerOnly) [
//  {product.name,product.qty}
//  {product.name,product.qty}
// ]