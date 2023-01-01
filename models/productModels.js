const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productImg: { type: String, required: true },
    productDesc: { type: String, required: true },
    productQty: { type: Number, required: true },
    productStatus: { type: Number, required: true },
    brandID: { type: String, required: true },
})

module.exports = mongoose.model('Product', ProductSchema)