const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ContentSchema = new Schema({
    title: { type: String, required: true, maxLength: 30 },
    img: { type: String, required: true },
    desc: { type: String, required: true, maxLength: 124 },
})

module.exports = mongoose.model('Content', ContentSchema)