const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

router.get('/', (req, res) => {
    res.render("aboutUs/index")
})
module.exports = router