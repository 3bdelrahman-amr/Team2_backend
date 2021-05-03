const {Photo,Comment ,validatePhoto, validateComment,validateId}=require('../models/photo.model')


exports.getComments= async (req, res) => {

    const { error } = validateId({id:req.params.photoId});
    if (error) return res.status(400).send(error.details[0].message);

    const photo= await Photo.findById(req.params.photoId)
        .populate('comments.user','Fname Lname -_id');
    if (!photo) return res.status(404).send('Photo not found');
    if(photo.privacy==='private' && res.locals.userid.id!=photo.ownerId) 
        return res.status(403).send('Access denied');
    
    try {
        res.status(201).send(photo.comments);
    }
    catch (ex) {
        console.log(ex.message);

    };
}

exports.addComment = async (req, res) => {

    const { error } = validateId({id:req.params.photoId});
    if (error) return res.status(400).send(error.details[0].message);

    const photo= await Photo.findById(req.params.photoId);
    if (!photo) return res.status(400).send('Photo not found');
    
    if(photo.privacy==='private' && res.locals.userid.id!=photo.ownerId) 
        return res.status(403).send('Access denied');
    
     const result = validateComment(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    const comment = new Comment({ 
        comment: req.body.comment ,
        user: res.locals.userid.id
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
