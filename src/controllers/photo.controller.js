const { Photo, Comment, Tag, validatePhoto, validateComment, validateId } = require('../models/photo.model')
const multer = require('multer');
const { UserModel } = require('../models/user.model');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

var port
if (config.get('HOST_ADDR') === 'localhost')
    port = "localhost:" + config.get('PORT') + "/";
else
    port = "http://dropoids.me/";


var mkdirp = require('mkdirp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dest = './photos/';
        mkdirp.sync(dest);
        cb(null, './photos/'); // This is the destination folder where the photos shall be stored
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); //reaplce allows to change ":" to an accepted character '-'
    }
})

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // the maximum file size is 10 mega
    },
    fileFiler(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please enter a JPG, JPEG, PNG format'))
        }
    }
})


exports.addPhoto = async (req, res) => {
    const _id = res.locals.userid;
    const photo = new Photo({
        ...req.body,
        ownerId: _id,
        photoUrl: port + req.file.path
    })
    const { error } = validatePhoto(req.body);
    if (error) {
        return res.status(400).send({ error: error });
    }
    try {
        req.params.id = photo._id; // this is will be used in tagPeople function
        await photo.save()
        if (!req.body.tagged || req.body.tagged.length === 0)
            return res.status(200).send(photo);
        this.tagPeople(req, res);
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server error" })
    }

}

exports.tagPeople = async (req, res) => {
    const _id = req.params.id; // photo id
    const { error } = validateId({ id: _id });
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        var photo = await Photo.findById({ _id, ownerId: res.locals.userid });
        if (!photo)
            return res.status(400).send({ error: "photo not found" });
        //Validate the passed array of Usernames (if these usernames really do exist)
        if (!req.body.tagged)
            return res.status(400).send("You must add tagged parameter");
        const taggedPeople = req.body.tagged; // array of usernames of tagged people

        for (person of taggedPeople) {
            await UserModel.findOne({ UserName: person }); // if not found it will throw an error

        }

        const photoTags = photo.peopleTags; // array of all the people tags for this photo

        var tag = photoTags.find((tag) => {
            return tag.tagging == res.locals.userid
        }) // this user already tagged other people in this photo

        // if the user didn't tag anyone before in this photo
        if (!tag) {
            tag = new Tag({
                tagging: res.locals.userid,
                tagged: taggedPeople
            })
        }
        else {
            const index = photoTags.indexOf(tag);
            photo.peopleTags.splice(index, 1); // remove the existing tag
            tag.tagged = tag.tagged.concat(taggedPeople) // add on the existing one 
            tag.tagged = [...(new Set(tag.tagged))]; // remove all duplicated of tagged people
        }
        photo.peopleTags.push(tag);
        await photo.save();
        res.status(200).send(photo);

    } catch (error) {
        res.status(500).send({ error: "An error has occured whole finding photo, please check the photo id" });
    }


}

exports.removeTagPeople = async (req, res) => {

    const _id = req.params.id; // photo id

    try {
        var photo = await Photo.findById({ _id, ownerId: res.locals.userid });
        if (!photo)
            return res.status(400).send({ error: "photo not found" });
        //Validate the passed array of Usernames (if these usernames really do exist)
        if (!req.body.tagged)
            return res.status(400).send("You must add tagged parameter");
        const removeTaggedPeople = req.body.tagged; // array of usernames of people to remove
        const photoTags = photo.peopleTags; // array of all the people tags for this photo
        var tag = photoTags.find((tag) => {
            return tag.tagging == res.locals.userid
        }) // this user already tagged other people in this photo
        if (!tag)
            return res.status(400).send({ error: "tag not found" });

        for (person of removeTaggedPeople) {
            if (tag.tagged.includes(person)) // if the passed tagged person to remove is really tagged
                tag.tagged = tag.tagged.filter((element) => element != person) // remove it
        }



        const index = photoTags.indexOf(tag);
        photo.peopleTags.splice(index, 1); // remove the existing tag

        if (tag.tagged.length != 0)
            photo.peopleTags.push(tag);
        await photo.save();
        res.status(200).send(photo);

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "An error has occured whole finding photo, please check the photo id" });
    }


}

//This one is implemeted as part of user model
exports.getUserPhotos = async (req, res) => {
    const user = await UserModel.findById(res.locals.userid);
    try {
        await user.populate('photos').execPopulate();
        console.log(user.photos);
        res.status(200).send(user.photos);
    } catch (error) {
        consolelog(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

exports.getPhotosHome = async (req, res) => {
    try {
        const user = await UserModel.findById(res.locals.userid); // array of ids of the people that the authenticated user is following
        const following = user.Following;
        var homePhotos = [];
        for (person of following) {
            const friend = await UserModel.findById(person);
            await friend.populate('photos').execPopulate();
            const photos = friend.photos;
            homePhotos = homePhotos.concat(photos);

        };
        return res.status(200).send(homePhotos);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

exports.getPhotosExplore = async (req, res) => {
    try {
        var photos = [];
        const allPhotos = await Photo.find();
        for (photo of allPhotos) {
            if (photo.Fav.length === 2 && photo.privacy === 'public') {
                await photo.populate('ownerId comments.user Fav ownerId.Avatar comments.user.Avatar Fav.Avatar ').execPopulate();
                var arrNumfollowing = [];
                var arrNumPhotos = [];
                var i = 0;
                for (fav of photo.Fav) {
                    await fav.populate('photos').execPopulate();
                    arrNumfollowing[i] = fav.Following.length;
                    arrNumPhotos[i] = fav.photos.length;
                    i++;
                }
                var result = photo.toObject();

                //remove unwanted fields from ownerId
                result.ownerId = (({ _id, Fname, Lname, UserName, Avatar, Email }) => ({ _id, Lname, Fname, UserName, Avatar, Email }))(fav);

                //remove unwanted fields in comments user
                for (comment of result.comments) {
                    comment.user = (({ _id, Fname, Lname, UserName, Avatar, Email }) => ({ _id, Lname, Fname, UserName, Avatar, Email }))(comment.user);
                }

                //remove people tags and __v from the result
                delete result.peopleTags
                delete result.__v

                // add numPhotos and numFollowing to Fav
                i = 0
                for (fav of result.Fav) {
                    fav = (({ Fname, Lname, UserName, Avatar }) => ({ Fname, Lname, UserName, Avatar }))(fav);
                    fav.numPhotos = arrNumPhotos[i];
                    fav.numFollowing = arrNumfollowing[i];
                    result.Fav[i] = { ...fav }
                    i++
                }
                photos.push(result);
            }
        }
        res.status(200).send(photos);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

exports.addTag = async (req, res) => {
    try {
        for (element of req.body.photos) {
            const photo = await Photo.findById({ _id: element });
            if (!photo)
                return res.status(404).send({ error: "photo not found" });
            if (!photo.tags.includes(req.body.tag)) {
                console.log(photo.tags)
                photo.tags.push(req.body.tag);
                await photo.save();
            }
        }
        res.status(200).send({ message: "Tag added successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

exports.removeTag = async (req, res) => {
    try {
        const photo = await Photo.findById({ _id: req.params.id });
        if (!photo)
            return res.status(404).send({ error: "Not found" });
        photo.tags = photo.tags.filter((tag) => tag != req.body.tag);
        await photo.save();
        res.status(200).send({ error: "Tag removed successfully" });
    } catch (error) {
        res.status(500).send({ error: "Internal server error" });
    }
}



exports.getComments = async (req, res) => {

    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);

    const photo = await Photo.findById(req.params.photoId)
        .populate('comments.user', 'Fname Lname _id');
    if (!photo) return res.status(404).send('Photo not found');
    if (photo.privacy === 'private' && res.locals.userid != photo.ownerId)
        return res.status(403).send('Access denied');

    try {
        res.status(201).send(photo.comments);
    }
    catch (ex) {
        console.log(ex.message);

    };
}

exports.addComment = async (req, res) => {

    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);

    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).send('Photo not found');

    if (photo.privacy === 'private' && res.locals.userid != photo.ownerId)
        return res.status(403).send('Access denied');

    const result = validateComment(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const comment = new Comment({
        comment: req.body.comment,
        user: res.locals.userid
    });
    try {
        photo.comments.push(comment);
        await photo.save();
        res.status(201).send('comment added successfully');
    }
    catch (ex) {
        console.log(ex.message);

    };
};


exports.deleteComment = async (req, res) => {

    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);

    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).send('photo not found');

    if (photo.privacy === 'private' && res.locals.userid != photo.ownerId)
        return res.status(403).send('Access denied');

    const result = validateId({ id: req.params.commentId });
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const comment = await photo.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send('Comment not found');

    if (res.locals.userid != comment.user._id && res.locals.userid != photo.ownerId)
        return res.status(403).send('Access denied. User not authorized to delete comment');

    try {
        comment.remove();
        photo.save();
        res.status(201).send('comment deleted successfully');
    }
    catch (ex) {
        console.log(ex.message);
    };
};

exports.deletePhoto = async (req, res) => {



    const photodeleted = await Photo.findById(req.body.photos[0]);
    if (!photodeleted)
        return res.status(404).send({ error: "photo not found" });
    if (res.locals.userid != photodeleted.ownerId)
        return res.status(403).send('Access denied');

    try {
        req.body.photos.forEach(async function (photo) {
            await Photo.findByIdAndRemove(photo);
        })
        res.status(201).send('photo deleted successfully');
    }
    catch (ex) {
        console.log(ex.message);
    };
};

exports.updatePhoto = async (req, res) => {
    let photoUpdated = await Photo.findById(req.body.photos[0]);
    if (!photoUpdated) return res.status(404).send({ error: "photo not found" });
    if (res.locals.userid != photoUpdated.ownerId)
        return res.status(403).send('Access denied');

    const { error } = validatePhoto({ title: req.body.title, description: req.body.description, privacy: req.body.privacy });
    if (error) return res.status(400).send(error.details[0].message);
    try {
        req.body.photos.forEach(async function (photo) {
            photoUpdated = await Photo.findById(photo);
            if (!photoUpdated)
                return res.status(404).send({ error: "photo not found" });
            photoUpdated.set({
                title: req.body.title,
                description: req.body.description,
                privacy: req.body.privacy
            });
            await photoUpdated.save();
        })
        res.status(201).send('photo updated successfully');
    }
    catch (ex) {
        console.log(ex.message);
    };
};


module.exports.GetPhototitle = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required()
    });

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const photos = await Photo.find({ title: req.params.title, privacy: 'public' })

    const allPhotos = await Photo.find({});
    console.log(req.params.title);

    for (photo of allPhotos) {
        console.log(photo.tags);
        if (photo.tags.includes(req.params.title) && !photos.includes(photo))
            photos.push(photo)
    }
    try {
        if (photos.length == 0) {
            return res.status(404).send({ message: "Image not found" });
        }
        res.status(200).send(photos);
    } catch (error) {
        res.status(500).send({ message: "internal server error" });
    }
}