const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
})

module.exports = mongoose.model('User', UserSchema)

// username
// password
// role
// cart(customerOnly) [
//  {product.name,product.qty}
//  {product.name,product.qty}
// ]