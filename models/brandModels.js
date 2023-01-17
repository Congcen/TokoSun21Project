const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BrandSchema = new Schema({
    brandName: { type: String, required: true, maxLength: 124 },
    brandLogo: { type: String, required: true },
})

module.exports = mongoose.model('Brand', BrandSchema)