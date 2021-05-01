const Album = require('../models/album.model');
const Photo = require('../models/photo.model');

const createAlbum = async (req, res) => {
    const user = req.user;
    const album = new Album({
        ...req.body,
        owner_id: user._id
    });
    if (req.body.primary_photo_id) //If There are primary photos that the album was created with (The requester send it as part of the json and not empty)
    {
        req.body.primary_photo_id.forEach(async (photo_id) => {
            const photo = await photo.findById(photo_id);
            photo.albums_ids.push(album._id)
            photo.save();
        });
    }
    try {
        await album.save();
        res.status(201).send(album._id);
    } catch (error) {
        res.send(500).send({ error: "Error Occured in server" })
    }
};

module.exports = {
    createAlbum
};

