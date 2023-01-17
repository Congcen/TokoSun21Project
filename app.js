const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const app = express();
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const path = require('path');

const home = require('./router/home')
const brand = require('./router/brand')
const product = require('./router/product')
const contact = require('./router/contact')
const account = require('./router/account')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
mongoose.set('strictQuery', false);
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'notagoodsecret' }))
app.use(function (req, res, next) {
    res.locals.user_id = req.session.user_id;
    res.locals.user_role = req.session.user_role;
    res.locals.user_fname = req.session.user_fname;
    next();
});

// db connection
async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sun21-db')
        console.log("Mongo Connection Open")
    } catch (err) {
        console.log("Oops.. Connection Error")
    }
} main()

app.use('/', home)
app.use('/brand', brand)
app.use('/brand', product)
app.use('/contact', contact)
app.use('/account', account)

app.get('/whyUs', (req, res) => {
    res.render("whyUs")
})
app.get('/aboutUs', (req, res) => {
    res.render("aboutUs")
})

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found"), 404)
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no.. Error :('
    res.status(statusCode).render('error', { err })
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});