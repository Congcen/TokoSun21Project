const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")

router.get('/cart', catchAsync(async (req, res) => {
    // res.send("COMING SOON")
    throw new ExpressError('COMING SOON', 999)
}))
router.get('/wishlist', catchAsync(async (req, res) => {
    // res.send("COMING SOON")
    throw new ExpressError('COMING SOON', 999)
}))

module.exports = router