const { UserModel,validateId } = require('../models/user.model');
const {Photo} =require('../models/photo.model');
const mongoose = require('mongoose');
exports.getFollowing=async (req, res) => {
    const { error } = validateId({id:req.params.userId});

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


module.exports.GetPeopleByUserName_ID_Email = async(req,res)=>{
    
    if(!mongoose.Types.ObjectId.isValid(req.params.title))
    {
        let user = await UserModel.findOne({UserName:req.params.title},{Password:0,isActive : 0});
        
        if(!user)
        {
            user = await  UserModel.findOne({Email:req.params.title},{Password:0,isActive : 0});
        }
  
        if(!user) return res.status(404).send({message:'user not found'});
  
        try {
            let USER = user.toObject();
            const avatarurl = await Photo.findById(user.Avatar);
            const backgroundurl = await Photo.findById(user.BackGround);
            USER.BackGround = backgroundurl.photoUrl;
            USER.Avatar = avatarurl.photoUrl;
            USER.Follow = false;
            const loginuser = await  UserModel.findById(res.locals.userid);
            if(loginuser.Following.includes(USER._id))
                USER.Follow = true;
            res.status(200).send(USER);
        } catch (error) {
            console.log(error);
            return res.status(500).send({message:'internal server error'});
        }
    }
    else
    {
        const userByid = await UserModel.findById({_id:req.params.title},{Password:0,isActive : 0});
        if(!userByid) return res.status(404).send({message:'user not found'});
  
        try {
  
            let USER = userByid.toObject();
            const avatarurl = await Photo.findById(userByid.Avatar);
            const backgroundurl = await Photo.findById(userByid.BackGround);
            USER.BackGround = backgroundurl.photoUrl;
            USER.Avatar = avatarurl.photoUrl;
  
            
            USER.Follow = false;
            const loginuser = await UserModel.findById(res.locals.userid);
            if(loginuser.Following.includes(USER._id))
                USER.Follow = true;
            res.status(200).send(USER);
        } catch (error) {
            console.log(error);
            return res.status(500).send({message:'internal server error'});
        }
    }
};

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

    const users = await UserModel.find({ _id: { $ne: res.locals.userid } })
        .or([{ UserName: { $regex: req.params.string, $options: "i" } }, { Fname: { $regex: req.params.string, $options: "i" } }, { Lname: { $regex: req.params.string, $options: "i" } }, { Email: { $regex: req.params.string, $options: "i" } }])
        .populate('Avatar', 'photoUrl -_id')
        .select('Avatar UserName Fname Lname Date_joined Followers');
    if (!users) return res.status(404).send('no users match the required input');
    else {
        let Users = [];
        
        for (user of users) {
            let followed = false;
            index=user.Followers.indexOf(res.locals.userid);
            console.log(index);
            if (index != -1 ) 
                followed = true;
            await user.populate('photos').execPopulate();
            const photos = user.photos;
            let count = 0;
            for (photo of photos) {
                if (photo.privacy === 'public')
                    count++;
            }
            countFollowers = user.Followers.length;
            user = {
                isFollowed:followed,
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