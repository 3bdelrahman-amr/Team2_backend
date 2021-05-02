const express = require('express')
const albumRoute = require('./album.route')
const docsRoute = require('./docs.route')
const favsRoute = require('./favs.route')
const groupsRoute = require('./groups.route')
const userRoute= require('./user.route');

const router = express.Router()
router.use('/favs', favsRoute)
router.use('/docs', docsRoute)
router.use('/group', groupsRoute)
router.use(albumRoute);
router.use(userRoute);

module.exports = router
