const Album = require('../models/album.model');
const Photo = require('../models/photo.model');
const User = require('../models/user.model')

const createAlbum = async (req, res) => {
    const user = await User.findById(res.locals.userid);
    const album = new Album({
        ...req.body,
        owner_id: user._id
    });
    album.remove
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
        const albumObject= album.toObject()
        delete albumObject.owner_id;
        delete albumObject.updatedAt;
        delete albumObject.__v;
        res.status(201).send(albumObject);
    } catch (error) {
        res.send(500).send({ error: "An error has occured" })
    }
};

const updateAlbum = async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation || updates.length ==0)
        return res.status(400).send({ error: "Invalid updates" });

    try {
        const album = await Album.findOne({ _id, owner_id: res.locals.userid });
        if(!album)
        {
            return res.status(404).send('Album not found!');
        }
        updates.forEach((update)=>{
            album[update]= req.body[update];
        })
        await album.save();
        res.send({message: 'Album updated successfully'});
    } catch (error) {
        res.status(500).send("An error occured");
    }
}

module.exports = {
    createAlbum,
    updateAlbum
};

