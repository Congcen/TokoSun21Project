const mongoose = require("mongoose")
// const crypto = require('crypto');
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
// fullname

// username
// password
// role
// cart(customerOnly) [
//  {product.name,product.qty}
//  {product.name,product.qty}
// ]