const Album = require('../models/album.model');
const Photo = require('../models/photo.model');
const User = require('../models/user.model');

const createAlbum = async (req, res) => {
    const bodyParams = Object.keys(req.body);
    const AllowedParams = ['title', 'description', 'photos'];
    const isValidOperation = bodyParams.every((bodyParam) => AllowedParams.includes(bodyParam));
    if (!isValidOperation || bodyParams.length == 0)
        return res.status(400).send({ error: "Bad request" });
    try {
        if (req.body.photos) //If There are primary photos that the album was created with (The requester send it as part of the json and not empty)
        {
            if (req.body.photos.length != 0)
                req.body.photos.forEach(async (photo_id) => await Photo.findById(photo_id));
        }
        const album = new Album({
            ...req.body,
            owner_id: res.locals.userid
        });

        await album.save();
        const albumObject = album.toObject()
        delete albumObject.owner_id;
        delete albumObject.updatedAt;
        delete albumObject.__v;
        res.status(201).send(albumObject);
    } catch (error) {
        res.status(500).send({ error: "An error has occured" })
    }
};

const updateAlbum = async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation || updates.length == 0)
        return res.status(400).send({ error: "Invalid updates" });

    try {
        const album = await Album.findOne({ _id, owner_id: res.locals.userid });
        if (!album) {
            return res.status(404).send({ error: 'Album not found!' });
        }
        updates.forEach((update) => {
            album[update] = req.body[update];
        })
        await album.save();
        res.send({ message: 'Album updated successfully' });
    } catch (error) {
        res.status(500).send({ error: "An error occured" });
    }
}

const deleteAlbum = async (req, res) => {
    debugger;
    const _id = req.params.id;
    try {
        const album = await Album.findOneAndDelete({ _id, owner_id: res.locals.userid });
        if (!album) {
            return res.status(404).send({ error: "Album not found" });
        }
        // const photos = await album.populate('photos').execPopulate();

        // Array.prototype.forEach.call(photos,(photo) => {
        //     photo.albums_ids.filter((album) => {
        //         return album != _id;
        //     })// This function removes the album_id from the array of album_ids for all the photos that are in that album
        // })
        res.status(200).send({ message: "Album successfully deleted" });
    }
    catch (error) {
        res.status(500).send({ error: "An error has occured" });
        // res.status(500).send({ error: "An error has occured" });
    }

};

const getAlbumbyId = async (req, res) => {
    const _id = req.params.id;
    try {
        const album = await Album.findById({ _id, owner_id: res.locals.userid });
        if (!album)
            return res.status(404).send({ error: "Album not found" });
        await album.populate('photos').execPopulate();
        const albumObject = album.toObject();
        delete albumObject.owner_id;
        delete albumObject.__v;
        res.status(200).send(albumObject);
    } catch (error) {
        res.status(500).send({ error: "Album id not sent" });
    }
};

const getUserAlbums = async (req, res) => {
    const user = await User.findById(res.locals.userid);
    try {
        await user.populate('albums').execPopulate();
        const albums = user.albums;
        var albumsObj= [];
        Array.prototype.forEach.call(albums,(album)=>{
            const albumObj= album.toObject();
            delete albumObj.owner_id
            delete albumObj.__v
            albumsObj.push(albumObj);
        })
        res.status(200).send(albumsObj);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server Error" });
    }
}

const getAlbumbyUsername = async (req,res) => {

}

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumbyId,
    getUserAlbums
};

