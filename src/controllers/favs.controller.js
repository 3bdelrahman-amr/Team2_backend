const { Fav } = require('../models/favs.model')
exports.add_fav = function (req, res) {
    photoid = req.params.photoid
    const Fav = new Fav({
        User: {},
        Photo: {},
    })
    Fav.save()

    if (isNaN(photoid)) {
        res.status(422).json({ message: 'Missing photo parameter' })
    } else if (false) {
        res.status(404).json({ message: 'Photo not found' })
    } else if (false) {
        res.status(500).json({ message: 'Photo is already in favorites' })
    } else {
        res.status(200).json({
            message: 'Photo added to favourites list successfully',
        })
    }
}
exports.remove_fav = function (req, res) {
    photoid = req.params.photoid
    //token = req.headers
    if (isNaN(photoid)) {
        res.status(422).json({ message: 'Missing photo parameter' })
    } else if (false) {
        res.status(404).json({ message: 'Photo not found' })
    } else {
        res.status(200).json({
            message:
                'Photo deleted from favourites list and removed from likes',
        })
    }
}
