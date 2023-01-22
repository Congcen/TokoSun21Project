const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const ContentModels = require('../models/contentModels');
const ProductModels = require('../models/productModels');
const msgAdminOnly = "Access Denied! Only an Admin can access this feature"

router.get('/', catchAsync(async (req, res) => {
    const getContent = await ContentModels.find({}).sort({ createdAt: -1 }).limit(6)
    const getContentForSlide = await ContentModels.find({}).sort({ createdAt: -1 }).limit(3)
    const getNewestProduct = await ProductModels.find({ productStatus: 1 }).sort({ createdAt: -1 }).limit(4)
    const getFeaturedProduct = await ProductModels.aggregate([
        { $match: { productStatus: 1 } },
        { $sample: { size: 4 } }
    ])
    res.render("home/index", { getContent, getContentForSlide, getNewestProduct, getFeaturedProduct })
}))
router.get('/detail/:id', catchAsync(async (req, res) => {
    const getContent = await ContentModels.findById(req.params.id)
    res.render("home/detail", { getContent })
}))
router.get('/add', (req, res) => {
    if (req.session.user_role == 1) {
        res.render("home/add")
    }
    throw new ExpressError(msgAdminOnly, 999)
})
router.post('/add', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const newContent = new ContentModels(req.body.content)
        await newContent.save()
        res.redirect("/")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.put('/edit/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        await ContentModels.findByIdAndUpdate(id, { ...req.body.content })
        res.redirect(`/detail/${id}`)
    }
    throw new ExpressError(msgAdminOnly, 999)
}))
router.delete('/delete/:id', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { id } = req.params
        await ContentModels.findByIdAndDelete(id)
        res.redirect("/")
    }
    throw new ExpressError(msgAdminOnly, 999)
}))

module.exports = router