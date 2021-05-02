const { Photo } = require('../models/photo.model')
const { User } = require('../models/user.model')
const mongoose = require('mongoose')
exports.add_fav = async function (req, res) {
    let user, photo, photoId, userId
    photoId = req.body.photo_id
    userId = res.locals.userid
    photo = await Photo.findById(photoId).exec()
    user = await User.findById(userId).exec()
    if (!photoId) {
        res.status(422).json({ message: 'Missing photo parameter' })
    } else if (!photo) {
        res.status(404).json({ message: 'Photo not found' })
    } else {
        const number = await Photo.find({
            _id: photoId,
            Fav: {
                $elemMatch: { $eq: userId },
            },
        }).exec()
        if (number.length > 0) {
            return res.status(500).json({
                message: 'Photo is already in favorites',
            })
        }
        await Photo.findByIdAndUpdate(photoId, {
            $addToSet: { Fav: userId },
        })
        await User.findByIdAndUpdate(userId, {
            $addToSet: { Fav: photoId },
        })
        res.status(200).json({
            message: 'Photo added to favourites list successfully',
        })
    }
}
exports.remove_fav = async function (req, res) {
    let photo, photoId, userId
    photoId = req.params.photoid
    photo = await Photo.findById(photoId).exec()
    userId = res.locals.userid
    if (!photoId) {
        res.status(422).json({ message: 'Missing photo parameter' })
    } else if (!photo) {
        res.status(404).json({ message: 'Photo not found' })
    } else {
        const number = await Photo.find({
            _id: photoId,
            Fav: {
                $elemMatch: { $eq: userId },
            },
        }).exec()
        if (number.length === 0) {
            return res.status(500).json({
                message: 'Photo not in favourites list',
            })
        }
        await Photo.findByIdAndUpdate(photoId, {
            $pull: { Fav: userId },
        })
        await User.findByIdAndUpdate(userId, {
            $pull: { Fav: photoId },
        })
        res.status(200).json({
            message:
                'Photo deleted from favourites list and removed from likes',
        })
    }
}
