const express = require('express')
const albumRoute = require('./album.route')
const docsRoute = require('./docs.route')
const favsRoute = require('./favs.route')
const groupsRoute = require('./groups.route')
const usersRoute = require('./user.route')
const photosRoute = require('./photos.route')


const router = express.Router()
router.use('/album', albumRoute)
router.use('/favs', favsRoute)
router.use('/docs', docsRoute)
router.use('/group', groupsRoute)
router.use('/photo', photosRoute)

router.use('/user', usersRoute)
router.use('/photo', photosRoute)

module.exports = router
