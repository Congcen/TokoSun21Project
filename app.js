const express = require('express')
const mongoose = require('mongoose')
const app = express();
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const catchAsync = require("./utils/catchAsync")
const path = require('path');

// MODELS
const BrandModels = require('./models/brandModels');
const ProductModels = require('./models/productModels');
const UserModels = require('./models/userModels');
const ContentModels = require('./models/contentModels');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
mongoose.set('strictQuery', false);
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// db connection
async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sun21-db')
        console.log("Mongo Connection Open")
    } catch (err) {
        console.log("Oops.. Connection Error")
    }
} main()

// home
app.get('/', catchAsync(async (req, res) => {
    const getContent = await ContentModels.find({})
    res.render("home/index", { getContent })
}))
app.get('/addContent', (req, res) => {
    res.render("home/add")
})
app.post('/addContent', catchAsync(async (req, res) => {
    const newContent = new ContentModels(req.body.content)
    await newContent.save()
    res.redirect("/")
}))
app.get('/detail/:id', catchAsync(async (req, res) => {
    const getContent = await ContentModels.findById(req.params.id)
    res.render("home/detail", { getContent })
}))

app.get('/whyUs', (req, res) => {
    res.render("whyUs")
})
app.get('/aboutUs', (req, res) => {
    res.render("aboutUs")
})
// brand
app.get('/brand', catchAsync(async (req, res) => {
    const getBrand = await BrandModels.find({})
    res.render("brand/index", { getBrand })
}))
app.get('/brand/add', (req, res) => {
    res.render("brand/add")
})
app.post('/brand', catchAsync(async (req, res) => {
    const newBrand = new BrandModels(req.body.brand)
    await newBrand.save()
    res.redirect("/brand")
}))
app.put('/brand/brandEdit/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await BrandModels.findByIdAndUpdate(id, { ...req.body.brand })
    res.redirect("back")
}))
app.delete('/brand/brandDelete/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await BrandModels.findByIdAndDelete(id)
    res.redirect("/brand")
}))
// product
app.get('/brand/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const getBrand = await BrandModels.findById(id)
    const getProduct = await ProductModels.find({ productStatus: 1, brandID: id })
    const getProductInactive = await ProductModels.find({ productStatus: 0, brandID: id })
    res.render("product/index", { getBrand, getProduct, getProductInactive })
}))
app.get('/brand/productEdit/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const getProduct = await ProductModels.findById(id)
    const getBrand = await BrandModels.findById(getProduct.brandID)
    res.render("product/edit", { getProduct, getBrand })
}))
app.post('/brand/productAdd/:id', catchAsync(async (req, res) => {
    const newProduct = new ProductModels(req.body.product)
    await newProduct.save()
    res.redirect("back")
}))
app.put('/brand/productEdit/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const updatedProduct = await ProductModels.findByIdAndUpdate(id, { ...req.body.product })
    res.redirect(`/brand/${updatedProduct.brandID}`)
}))
app.delete('/brand/productDelete/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const deletedProduct = await ProductModels.findById(id)
    await ProductModels.findByIdAndDelete(id)
    res.redirect(`/brand/${deletedProduct.brandID}`)
}))

app.get('/contact', (req, res) => {
    res.render("contact")
})
// Account
app.get('/register', (req, res) => {
    res.render("account/register")
})
app.post('/register', catchAsync(async (req, res) => {
    const newUser = new UserModels(req.body.user)
    await newUser.save()
    res.render("account/registerSuccess")
}))

app.use((err, req, res, next) => {
    res.send("PAGE NOT FOUND!")
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
