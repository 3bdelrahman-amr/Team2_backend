const { UserModel,validateId } = require('../models/user.model');

exports.getFollowing=async (req, res) => {
    const { error } = validateId({id:req.params.userId});
    if (error) return res.status(400).send(error.details[0].message);

    const users = await UserModel.findById(req.params.userId)
        .populate('Following', 'Fname Lname UserName Avatar photos')
        .select('Following');
    let following = users.Following;
    let result=[];
    console.log(following);
    if (!users) return res.status(404).send('user has no following');
    console.log(users);
    
    try {
        for(fol of following)
        {
           // console.log(fol);
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
            console.log(fol);
            result.push(fol);
        }
        res.status(201).send(result);
        //res.status(201).send(photoCount);
    }
    catch (ex) {
        console.log(ex.message);

    };
}