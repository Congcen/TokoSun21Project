const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const BrandModels = require('../models/brandModels');
const ProductModels = require('../models/productModels');
const { route } = require('./home');
const msgAdminOnly = "Access Denied! Only an Admin can access this feature"

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const getBrand = await BrandModels.findById(id)
    const getProduct = await ProductModels.find({ productStatus: 1, brandID: id })
    const getProductInactive = await ProductModels.find({ productStatus: 0, brandID: id })
    res.render("product/index", { getBrand, getProduct, getProductInactive })
}))
router.get('/productEdit/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        const getProduct = await ProductModels.findById(id)
        const getBrand = await BrandModels.findById(getProduct.brandID)
        res.render("product/edit", { getProduct, getBrand })
    }
    res.send(msgAdminOnly)
}))
router.post('/productAdd/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const newProduct = new ProductModels(req.body.product)
        await newProduct.save()
        res.redirect("back")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.put('/productEdit/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        const updatedProduct = await ProductModels.findByIdAndUpdate(id, { ...req.body.product })
        res.redirect(`/brand/${updatedProduct.brandID}`)
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.delete('/productDelete/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        const deletedProduct = await ProductModels.findById(id)
        await ProductModels.findByIdAndDelete(id)
        res.redirect(`/brand/${deletedProduct.brandID}`)
    }
    throw new ExpressError(msgAdminOnly, 999)
}))

module.exports = router