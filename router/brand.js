const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const BrandModels = require('../models/brandModels');
const msgAdminOnly = "Access Denied! Only an Admin can access this feature"

router.get('/', catchAsync(async (req, res) => {
    const getBrand = await BrandModels.find({})
    res.render("brand/index", { getBrand })
}))
router.get('/add', (req, res) => {
    if (req.session.user_role == 1) {
        res.render("brand/add")
    }
    res.send(msgAdminOnly)
})
router.post('/', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const newBrand = new BrandModels(req.body.brand)
        await newBrand.save()
        res.redirect("/brand")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.put('/brandEdit/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        await BrandModels.findByIdAndUpdate(id, { ...req.body.brand })
        res.redirect("back")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.delete('/brandDelete/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        await BrandModels.findByIdAndDelete(id)
        res.redirect("/brand")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
module.exports = router