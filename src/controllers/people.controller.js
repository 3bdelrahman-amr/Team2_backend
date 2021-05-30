const { UserModel, validateId } = require('../models/user.model');

exports.getFollowing = async (req, res) => {
    const { error } = validateId({ id: req.params.userId });
    if (error) return res.status(400).send(error.details[0].message);

    const users = await UserModel.findById(req.params.userId)
        .populate('Following', 'Fname Lname UserName Avatar photos')
        .select('Following');
    let following = users.Following;
    let result = [];
    if (!users) return res.status(404).send('user has no following');
    try {
        for (fol of following) {
            await fol.populate('photos').execPopulate();
            const photos = fol.photos;
            let count = 0;
            for (photo of photos) {
                if (photo.privacy === 'public')
                    count++;
            }
            fol = {
                numberOfPublicPhotos: count,
                ...fol._doc
            }
            result.push(fol);
        }
        res.status(201).send(result);
    }
    catch (ex) {
        console.log(ex.message);
    };
}

exports.getfaves = async (req, res) => {

    // const user = await UserModel.find({UserName:req.params.username})
    //     .populate('Fav', 'photoUrl title ownerId comments')
    //     .populate('ownerId','UserName');
    const user = await UserModel.findOne({ UserName: req.params.username })
        .populate('Fav', 'photoUrl title ownerId comments')
        .select('Fav');
    if (!user) return res.status(404).send('user not found');
    else {
        let Faves = [];
        for (fav of user.Fav) {
            userName = await UserModel.findById(fav.ownerId)
                .select('UserName');
            count = fav.comments.length;
            fav = {
                userName: userName.UserName,
                numberOfComments: count,
                ...fav._doc
            }
            delete fav.ownerId;
            delete fav.comments;
            Faves.push(fav);
        }
        console.log(Faves);


        try {
            res.status(201).send(Faves);
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
}
exports.getPhotos = async (req, res) => {
    const { error } = validateId({ id: req.params.userId });
    if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findById(req.params.userId);
    if (!user) return res.status(404).send('user has no following');
    await user.populate('photos').execPopulate();
    const photos = user.photos;
    let Photos = [];
    for (photo of photos) {
        // userName=await UserModel.findById(photo.ownerId)
        // .select('UserName');
        countcomment = photo.comments.length;
        countfavs = photo.Fav.length;
        photo = {
            userName: user.UserName,
            numberOfFavs: countfavs,
            numberOfComments: countcomment,
            ...photo._doc
        }
        delete photo.Fav;
        delete photo.comments;
        delete photo.__v;
        Photos.push(photo);
    }
    console.log(Photos);
    try {
        res.status(201).send(Photos);
    }
    catch (ex) {
        console.log(ex.message);
    };
}


exports.searchUsers = async (req, res) => {

    const users = await UserModel.find({_id:{$ne:res.locals.userid}})
        .or([{ UserName: { $regex: req.params.string, $options: "i" } }, { Fname: { $regex: req.params.string, $options: "i" } }, { Lname: { $regex: req.params.string, $options: "i" } }, { Email: { $regex: req.params.string, $options: "i" } }])
        .populate('Avatar', 'photoUrl -_id')
        .select('Avatar UserName Fname Lname Date_joined Followers');
    if (!users) return res.status(404).send('no users match the required input');
    else {
        let Users = [];
        for (user of users) {
            await user.populate('photos').execPopulate();
            const photos = user.photos;
            let count = 0;
            for (photo of photos) {
                if (photo.privacy === 'public')
                    count++;
            }
            countFollowers = user.Followers.length;
            user = {
                numberOfFollowers: countFollowers,
                numberOfPublicPhotos: count,
                ...user._doc
            }
            if (user.Avatar && user.Avatar.photoUrl) {
                user = {
                    avatarUrl: user.Avatar.photoUrl,
                    ...user
                }
            }
            delete user.Followers;
            delete user.Avatar;
            delete user.__v;
            Users.push(user);
        }
        try {
            res.status(201).send(Users);
        }
        catch (ex) {
            console.log(ex.message);
        }
    }
}