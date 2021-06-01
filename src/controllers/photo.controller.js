const {
    Photo,
    Comment,
    validatePhoto,
    validateComment,
    validateId,
  } = require("../models/photo.model");
  const multer = require("multer");
  const { cloudinary } = require("./cloudinary");
  let streamifier = require("streamifier");





  
  exports.AddPhoto = async (req, res) => {
    const _id = res.locals.userid;
    if (!req.files[0]||req.files[0].buffer.length==0)
    return res.status(400).send({ error: "You must add a file" });
  

    var buffer = req.files[0].buffer;
    
    let uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "samples/dropoid",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
  
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
      });
    };
    let result = await uploadFromBuffer(buffer);
   
        const photo = new Photo({
            ...req.body,
            ownerId: _id,
            photoUrl:result.url
        })
  
    const { error } = validatePhoto(req.body);
    if (error) {
      console.log(error.details[0].message);
      return res.status(400).send({ error: "Bad request parameters" });
    }
    try {
      await photo.save()
      return res.status(200).send(photo);
    } catch (error) {
      console.log(error);
  
      res.status(500).send({ error: "Internal Server error" });
    }
  };
  
  exports.getComments = async (req, res) => {
    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);
  
    const photo = await Photo.findById(req.params.photoId).populate(
      "comments.user",
      "Fname Lname -_id"
    );
    if (!photo) return res.status(404).send("Photo not found");
    if (photo.privacy === "private" && res.locals.userid != photo.ownerId)
      return res.status(403).send("Access denied");
  
    try {
      res.status(201).send(photo.comments);
    } catch (ex) {
      console.log(ex.message);
    }
  };
  
  exports.addComment = async (req, res) => {
    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);
  
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).send("Photo not found");
  
    if (photo.privacy === "private" && res.locals.userid != photo.ownerId)
      return res.status(403).send("Access denied");
  
    const result = validateComment(req.body);
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
  
    const comment = new Comment({
      comment: req.body.comment,
      user: res.locals.userid,
    });
    try {
      photo.comments.push(comment);
      await photo.save();
      res.status(201).send("comment added successfully");
    } catch (ex) {
      console.log(ex.message);
    }
  };
  
  exports.deleteComment = async (req, res) => {
    const { error } = validateId({ id: req.params.photoId });
    if (error) return res.status(400).send(error.details[0].message);
  
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).send("photo not found");
  
    if (photo.privacy === "private" && res.locals.userid != photo.ownerId)
      return res.status(403).send("Access denied");
  
    const result = validateId({ id: req.params.photoId });
    if (result.error)
      return res.status(400).send(result.error.details[0].message);
  
    const comment = await photo.comments.id(req.params.commentId);
    if (!comment) return res.status(404).send("Comment not found");
  
    if (
      res.locals.userid != comment.user._id &&
      res.locals.userid != photo.ownerId
    )
      return res
        .status(403)
        .send("Access denied. User not authorized to delete comment");
  
    try {
      comment.remove();
      photo.save();
      res.status(201).send("comment deleted successfully");
    } catch (ex) {
      console.log(ex.message);
    }
  };
  