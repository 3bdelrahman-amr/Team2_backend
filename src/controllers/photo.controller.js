const { Photo, Comment, Tag, validatePhoto, validateComment, validateId } = require('../models/photo.model')
const multer = require('multer');
const { UserModel } = require('../models/user.model');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
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
        photoUrl: req.file.path
    })
    // Required validation on the array of tagged people that they really exist in user
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

    try {
        var photo = await Photo.findById({ _id, ownerId: res.locals.userid });
        if (!photo)
            return res.status(400).send({ error: "photo not found" });
        //Validate the passed array of Usernames (if these usernames really do exist)
        if (!req.body.tagged)
            return res.status(400).send("You must add tagged paramter");
        const taggedPeople = req.body.tagged; // array of usernames of tagged people
        taggedPeople.forEach(async (person) => {
            await UserModel.findOne({ UserName: person }); // if not found it will throw an error
        });
        const tag = new Tag({
            tagging: res.locals.userid,
            tagged: taggedPeople
        })
        photo.peopleTags.push(tag);
        await photo.save();
        res.status(200).send(photo);

    } catch (error) {
        res.status(500).send({ error: "An error has occured whole finding photo, please check the photo id" });
    }


}

exports.getUserPhotos = async (req, res) => {

    const user = await UserModel.findById(res.locals.userid);
    try {
        await user.populate('photos').execPopulate();
        res.status(200).send(user.photos);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

exports.getPhotosExplore = async (req,res) =>{
    
}



exports.getComments = async (req, res) => {

    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);

    const photo = await Photo.findById(req.params.photoId)
        .populate('comments.user', 'Fname Lname -_id');
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

    const result = validateId({ id: req.params.photoId });
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
