const express = require('express')
const mongoose = require('mongoose')
const app = express();
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const path = require('path');

// MODELS
const BrandModels = require('./models/brandModels');
const ProductModels = require('./models/productModels');
const brandModels = require('./models/brandModels');

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

app.get('/', (req, res) => {
    res.render("home")
})
app.get('/whyUs', (req, res) => {
    res.render("whyUs")
})
app.get('/aboutUs', (req, res) => {
    res.render("aboutUs")
})
// brand
app.get('/brand', async (req, res) => {
    const getBrand = await BrandModels.find({})
    res.render("brand/index", { getBrand })
})
app.get('/brand/add', (req, res) => {
    res.render("brand/add")
})
app.post('/brand', async (req, res) => {
    const newBrand = new BrandModels(req.body.brand)
    await newBrand.save()
    res.redirect("/brand")
})
app.put('/brand/brandEdit/:id', async (req, res) => {
    const { id } = req.params
    await brandModels.findByIdAndUpdate(id, { ...req.body.brand })
    res.redirect("back")
})
app.delete('/brand/brandDelete/:id', async (req, res) => {
    const { id } = req.params
    await brandModels.findByIdAndDelete(id)
    res.redirect("/brand")
})
// product
app.get('/brand/:id', async (req, res) => {
    const { id } = req.params
    const getBrand = await BrandModels.findById(id)
    const getProduct = await ProductModels.find({ productStatus: 1, brandID: id })
    const getProductInactive = await ProductModels.find({ productStatus: 0, brandID: id })
    res.render("product/index", { getBrand, getProduct, getProductInactive })
})
app.post('/brand/productAdd/:id', async (req, res) => {
    const newProduct = new ProductModels(req.body.product)
    await newProduct.save()
    res.redirect("back")
})
app.get('/contact', (req, res) => {
    res.render("contact")
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});