const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const BrandModels = require('../models/brandModels');
const ProductModels = require('../models/productModels');
const UserModels = require('../models/userModels');
const { Error } = require('mongoose');
const msgAdminOnly = "Access Denied! Only an Admin can access this feature"

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const getBrand = await BrandModels.findById(id)
    const getProduct = await ProductModels.find({ productStatus: 1, brandID: id })
    const getProductInactive = await ProductModels.find({ productStatus: 0, brandID: id })
    res.render("product/index", { getBrand, getProduct, getProductInactive })
}))
router.get('/productDetails/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const getProduct = await ProductModels.findOne({ productStatus: 1, _id: id })
    const getBrand = await BrandModels.findById(getProduct.brandID)
    res.render("product/detail", { getProduct, getBrand })
}))
router.get('/productEdit/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        const getProduct = await ProductModels.findById(id)
        const getBrand = await BrandModels.findById(getProduct.brandID)
        res.render("product/edit", { getProduct, getBrand })
    }
    throw new ExpressError(msgAdminOnly, 999)
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
router.put('/addToCart/:id/:prodId', catchAsync(async (req, res) => {
    if (req.session.user_role == 2) {
        const { id, prodId } = req.params
        const product = await ProductModels.findById(prodId)
        await UserModels.findByIdAndUpdate(id, { $push: { cart: { prodId } } })
        // req.flash("success", "Product added successfully!");
        res.redirect(`/brand/${product.brandID}`)
    }
    throw new ExpressError("You need to Login first to make a order", 999)
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