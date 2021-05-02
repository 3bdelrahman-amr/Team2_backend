const express = require('express');
const albumRoute = require('./album.route');
const docsRoute = require('./docs.route');
const favsRoute = require('./favs.route');
const groupsRoute = require('./groups.route');
const userRoute=require("./user.route");
const galleryRoute=require("./galleries");


const router = express.Router();
router.use('/album', albumRoute);
router.use('/favs', favsRoute);
router.use('/docs', docsRoute);
router.use('/group', groupsRoute);
router.use('/user', userRoute);

module.exports = router;
