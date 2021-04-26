const express = require('express')
const albumRoute = require('./album.route')
const docsRoute = require('./docs.route')
const favsRoute = require('./favs.route')
const groupsRoute = require('./groups.route')

const router = express.Router()
router.use('/album', albumRoute)
router.use('/favs', favsRoute)
router.use('/docs', docsRoute)
router.use('/group', groupsRoute)

module.exports = router
