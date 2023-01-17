const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const UserModels = require('../models/userModels');
const bcrypt = require("bcrypt")

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params
    const sessionId = req.session.user_id
    if (sessionId == id) {
        const getUser = await UserModels.findById(id)
        res.render("account/detail", { getUser })
    }
    throw new ExpressError('Account not found', 999);
}))
router.get('/register', (req, res) => {
    res.render("account/register")
})
router.post('/register', catchAsync(async (req, res) => {
    const { username, password, email, phone, address, fullname } = req.body.user
    const validateUsername = await UserModels.findOne({ username })
    if (!validateUsername) {
        const hash = await bcrypt.hash(password, 12)
        const newUser = new UserModels({ username, password: hash, fullname, email, phone: `+62${phone}`, address, role: 2 })
        const userData = await newUser.save()
        req.session.user_id = userData._id
        req.session.user_role = 2
        req.session.user_fname = userData.fullname
        res.redirect(`/account/${userData._id}`)
    } else {
        throw new ExpressError('Username already registered', 999)
    }
}))
router.post('/login', catchAsync(async (req, res) => {
    const { username, password } = req.body.user
    const user = await UserModels.findOne({ username })
    const validPassword = await bcrypt.compare(password, user.password)
    if (validPassword) {
        req.session.user_id = user._id
        req.session.user_role = user.role
        req.session.user_fname = user.fullname
        res.redirect(`/account/${user._id}`)
    } else {
        throw new ExpressError('Invalid Username or Password', 999)
    }
}))
router.post('/logout', catchAsync(async (req, res) => {
    req.session.destroy()
    res.redirect("/")
}))

module.exports = router