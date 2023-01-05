const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ContentSchema = new Schema({
    title: { type: String, required: true },
    img: { type: String, required: true },
    desc: { type: String, required: true },
})

module.exports = mongoose.model('Content', ContentSchema)