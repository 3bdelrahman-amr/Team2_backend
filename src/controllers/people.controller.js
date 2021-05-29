const { UserModel,validateId } = require('../models/user.model');

exports.getFollowing=async (req, res) => {
    const { error } = validateId({id:req.params.userId});
    if (error) return res.status(400).send(error.details[0].message);

    const users = await UserModel.findById(req.params.userId)
        .populate('Following', 'Fname Lname UserName Avatar photos')
        .select('Following');
    let following = users.Following;
    let result=[];
    if (!users) return res.status(404).send('user has no following');
    try {
        for(fol of following)
        {
            await fol.populate('photos').execPopulate();
            const photos=fol.photos;
            let count=0;
            for(photo of photos)
            {
                if(photo.privacy ==='public')
                count++;
            }
            fol={
                numberOfPublicPhotos:count,
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

exports.getfaves=async (req, res) => {

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
            userName=await UserModel.findById(fav.ownerId)
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