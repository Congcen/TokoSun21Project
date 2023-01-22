const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const UserModels = require("../models/userModels")

router.get('/', catchAsync(async (req, res) => {
    const getAdmin = await UserModels.find({ role: 1 })
    const getCustomer = await UserModels.find({ role: 2 })
    res.render("admin/index", { getCustomer, getAdmin })
}))

module.exports = router