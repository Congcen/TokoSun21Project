const express = require('express')
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const UserModels = require('../models/userModels');
const msgAdminOnly = "Access Denied! Only an Admin can access this feature"


router.get('/', (req, res) => {
    res.render("contact/index")
})
router.post('/registerAdm', catchAsync(async (req, res) => {
    if (req.session.user_role == 1) {
        const { username, password, email, phone, address, fullname } = req.body.user
        const validateUsername = await UserModels.findOne({ username })
        if (!validateUsername) {
            const hash = await bcrypt.hash(password, 12)
            const newUser = new UserModels({ username, password: hash, fullname, email, phone: `+62${phone}`, address, role: 1 })
            await newUser.save()
            res.render('contact/registerSuccess')
        } else {
            throw new ExpressError('Username already registered', 999)
        }
    }
    throw new ExpressError(msgAdminOnly, 999)

}))

module.exports = router