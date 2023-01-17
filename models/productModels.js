const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    productName: { type: String, required: true, maxLength: 124 },
    productPrice: { type: Number, required: true, min: 0, max: 10000000 },
    productImg: { type: String, required: true },
    productDesc: { type: String, required: true, maxLength: 2000 },
    productQty: { type: Number, required: true, min: 0, max: 500 },
    productStatus: { type: Number, required: true, min: 0, max: 1 },
    brandID: { type: String, required: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)