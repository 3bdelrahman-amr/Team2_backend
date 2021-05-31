const { Album, validateAlbumId, validateCreateAlbum, validateUpdateAlbum, validatePhotosIds } = require('../models/album.model');
const { Photo } = require('../models/photo.model');
const { UserModel } = require('../models/user.model');

const createAlbum = async (req, res) => {

    // Old validations commented for possible future need
    // const bodyParams = Object.keys(req.body);
    // const AllowedParams = ['title', 'description', 'photos', 'coverPhoto'];
    // const isValidOperation = bodyParams.every((bodyParam) => AllowedParams.includes(bodyParam));
    const { error } = validateCreateAlbum(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    try {

        if (req.body.photos.length != 0) {
            for (photo_id of req.body.photos) {
                const photo = await Photo.findById({ _id: photo_id, ownerId: res.locals.userid });
                if (!photo)
                    return res.status(404).send({ error: "Photo doesn't exist" });
            }
        }
        else {
            throw new Error("Array of photos must not be empty");
        }

        if (req.body.coverPhoto) { // if the cover photo was passed
            if (req.body.photos.length == 0 || !req.body.photos.includes(req.body.coverPhoto)) // and it is not included in the photos array or it is passed and the array of photos is empty
                throw new Error("cover Photo must be a included in photos array");
        } else { // if the cover photo was not passed
            const setOfPhotos = [...(new Set(req.body.photos))];
            req.body = {
                ...req.body,
                photos: setOfPhotos,
                coverPhoto: req.body.photos[0] // the default cover photo is the first photo in the array
            }

        }
        const album = new Album({
            ...req.body,
            ownerId: res.locals.userid
        });
        await album.save();
        res.status(201).send(album);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server error" })
    }
};

const updateAlbum = async (req, res) => {
    const _id = req.params.id;

    // Old validations commented for possible future need
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'coverPhoto'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation || updates.length == 0)
        return res.status(400).send({ error: "Invalid updates" });
    const { error } = validateUpdateAlbum(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { error2 } = validateAlbumId({ id: _id });
    if (error2)
        return res.status(400).send(error2.details[0].message);
    try {
        const album = await Album.findOne({ _id, ownerId: res.locals.userid });
        if (!album) {
            return res.status(404).send({ error: 'Album not found!' });
        }
        updates.forEach((update) => {
            if (update == 'coverPhoto' && !album.photos.includes(req.body[update]))
                throw new Error("cover Photo must be a included in photos array");
            album[update] = req.body[update];
        })
        await album.save();
        res.status(200).send(album);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "An error occured" });
    }
}

const deleteAlbum = async (req, res) => {
    const _id = req.params.id;
    const { error } = validateAlbumId({ id: _id });
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const album = await Album.findOneAndDelete({ _id, ownerId: res.locals.userid });
        if (!album) {
            return res.status(404).send({ error: "Album not found" });
        }
        res.status(200).send({ message: "Album successfully deleted" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

const getAlbumbyId = async (req, res) => {
    const _id = req.params.id;
    const { error } = validateAlbumId({ id: _id });
    if (error)
        return res.status(400).send(error.details[0].message);
    try {
        const album = await Album.findById({ _id, ownerId: res.locals.userid });
        if (!album)
            return res.status(404).send({ error: "Album not found" });
        await album.populate('photos coverPhoto ownerId').execPopulate();
        res.status(200).send(album);
    } catch (error) {
        res.status(500).send({ error: "Album id not sent" });
    }
};

const getUserAlbums = async (req, res) => {
    const user = await UserModel.findById(res.locals.userid);
    try {
        await user.populate('albums').execPopulate();
        const albums = user.albums;
        for (album of albums) {
            await album.populate('photos coverPhoto ownerId').execPopulate();
        }
        res.status(200).send(albums);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server Error" });
    }
}

const getAlbumbyUsername = async (req, res) => {
    try {
        const user = await UserModel.findOne({ UserName: req.params.username });
        if (!user)
            res.status(404).send({ error: "User is not found" });

        res.locals.userid = user._id;
        getUserAlbums(req, res);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Username is not sent correctly" });
    }
}

const addPhotoToAlbum = async (req, res) => {
    try {
        const _id = req.params.id;
        const { error } = validateAlbumId({ id: _id });
        if (error)
            return res.status(400).send(error.details[0].message);
        const { error2 } = validatePhotosIds({ photos: req.body.photos })
        if (error2)
            return res.status(400).send(error2.details[0].message);
        const album = await Album.findById({ _id, ownerId: res.locals.userid });
        if (!album)
            return res.status(404).send({ error: "Not found" });
        const photos = req.body.photos;
        for (photo of photos) // make sure that all hte passed photo really exists
        {
            const find = await Photo.findById({ _id: photo, ownerId: res.locals.userid })
            if(!find)
                throw new Error("Photo not found")
            if (!album.photos.includes(photo)) // if it doesn't already exit in album
            {
                album.photos.push(photo);
            }
        }
        await album.save();
        res.status(200).send(album.photos);

    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal Server error" });
    }
}

const removePhotoFromAlbum = async (req, res) => {
    const _id = req.params.id;
    const { error } = validateAlbumId({ id: _id })
    if (error)
        return res.status(400).send(error.details[0].message);
    const { error2 } = validatePhotosIds({ photos: req.body.photos })
    if (error2)
        return res.status(400).send(error2.details[0].message);
    try {
        const album = await Album.findById({ _id, ownerId: res.locals.userid });
        if (!album)
            return res.status(404).send({ error: "Not found" });
        const photos = req.body.photos;
        for (photo of photos) // make sure that all hte passed photo really exists
        {
            await Photo.findById({ _id: photo, ownerId: res.locals.userid })
            if (album.photos.includes(photo)) // if it doesn't already exit in album
            {
                album.photos = album.photos.filter((element) => {
                    return element != photo
                })
            }
        }

        await album.save();

        if (album.photos.length == 0)
            deleteAlbum(req, res);
        else
            res.status(200).send(album.photos)


    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "an error has occured" })
    }
}

module.exports = {
    createAlbum,
    updateAlbum,
    deleteAlbum,
    getAlbumbyId,
    getUserAlbums,
    getAlbumbyUsername,
    addPhotoToAlbum,
    removePhotoFromAlbum
};

