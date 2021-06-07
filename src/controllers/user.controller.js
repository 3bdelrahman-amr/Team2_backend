const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailExisyence = require("email-existence");

const Model = require("../models/user.model");
const config = require("config");
//const { cache } = require("joi");
////const { use } = require("../routes/v1");
const secret = config.get("JWT_KEY");
const PhotoModel = require("../models/photo.model");
const { object } = require("joi");
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.register = async (req, res, next) => {
  let { error } = Model.validateSignup(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  const hashpass = bcrypt.hashSync(req.body.password);

  await Model.UserModel.create(
    {
      Fname: req.body.firstName,
      Lname: req.body.lastName,
      UserName: req.body.email.split("@")[0],
      Email: req.body.email,
      Date_joined: Date.now(),
      Age: req.body.age,
      Password: hashpass,
    },
    (err, user) => {
      if (err) {
        if (err.keyValue)
          return res.status(422).send({ message: "user already exist" });
        return res.status(400).send({
          message:
            "bad request, error while trying to insert user in database," +
            " make sure you sent the data with the right sntax",
        });
        // console.log(err);
      }
      res.locals.userid = user._id;
      next();
    }
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.GetUser = async (req, res) => {
  try {
    const user = await Model.UserModel.findById(
      { _id: res.locals.userid },
      { Password: 0, _V: 0 }
    );


    if (!user) return res.status(404).send({ message: "user not found" });

    const UsrWithPhotos = await user.populate("photos").execPopulate();

    const avatar = await PhotoModel.Photo.findById({ _id: user.Avatar });
    const background = await PhotoModel.Photo.findById({
      _id: user.BackGround,
    });

    const usr = UsrWithPhotos.toObject();
    usr.Avatar = avatar.photoUrl;
    usr.BackGround = background.photoUrl;
    if (!UsrWithPhotos.photos) usr.Photo = 0;
    usr.Photo = UsrWithPhotos.photos.length;

    return res.status(200).send(usr);
  } catch (err) {
    return res.status(400).send({ message: "bad request" });
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.login = async (req, res, next) => {
  let { error } = Model.validateLogin(req.body);
  if (error) return res.status(404).send({ message: error.details[0].message });

  await Model.UserModel.findOne({ Email: req.body.email }, (_err, _user) => {
    if (!_user)
      return res.status(401).send({ message: "no user found with this email" });
    if (!_user.isActive)
      return res.status(500).send({
        message:
          "you didnt confirm your email yet please confirm it before loging again",
      });

    const hashpass = bcrypt.compare(
      req.body.password,
      _user.Password,
      (err, ismatch) => {
        if (!ismatch) {
          return res.status(401).send({ message: "wrong password inserted" });
        }
        res.locals.userid = _user._id;
        next();
      }
    );

    if (_err) {
      res
        .status(401)
        .send({ message: "wrong Email inserted,no user with this mail" });
    }
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.VerifyEmail = async (req, res) => {
  debugger;
  let token = req.params.token;
  await jwt.verify(token, secret, async (err, decoded) => {
    let email = decoded.email;

    await Model.UserModel.findOne({ Email: email }, (err, user) => {
      if (err) return res.send("<h1>no such a user with this mail</h1>");
      else {
        user.isActive = true;
        user.save();
        return res.status(201).send("<h1>user has been confirmed</h1>");
      }
    });
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.PostFollower = async (req, res) => {
  const user = await Model.UserModel.findById({ _id: res.locals.userid }).catch(
    (err) => {
      return res.status(404).send({ message: "user not found" });
    }
  );
  const people = await Model.UserModel.findById({
    _id: req.body.peopleid,
  }).catch((err) => {
    return res
      .status(404)
      .send({ message: "the user you trying to follow is not found" });
  });

  if (user.Following.includes(people._id)) {
    return res.status(403).send({ message: "already in following list" });
  }

  user.Following.push(people._id);
  people.Followers.push(user._id);
  user.save();
  people.save();

  res.status(200).send({ message: "added to following list" });

  return;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetFollowers = async (req, res) => {
  // exclude these attributes from the returning user
  const queryProjection = {
    Password: 0,
    Group: 0,
    Gallery: 0,
    __v: 0,
    isActive: 0,
    About: 0,
    views: 0,
    PhotoStream: 0,
    Date_joined: 0,
    Age: 0,
    Fav: 0,
    BackGround: 0,
    albums: 0,
    photos: 0,
  };

  await Model.UserModel.findById({ _id: res.locals.userid })
    .then(async (user) => {
      const followers = [];
      const users = await Model.UserModel.find(
        { _id: user.Followers },
        queryProjection
      );

      for (var i = 0; i < users.length; i++) {
        var user = await users[i].populate("photos").execPopulate();

        const follow = user.toObject();
        const avatar = await PhotoModel.Photo.findById(follow.Avatar);
        follow.Avatar = avatar.photoUrl;
        follow.Followers = follow.Followers.length;
        follow.Following = follow.Following.length;
        if (user.photos.length) follow.Photo = user.photos.length;
        else follow.Photo = 0;
        followers.push(follow);
      }

      return res.status(200).send({ FollowersList: followers });
    })
    .catch((err) => {
      return res.status(404).send({ message: "the user has 0 followers" });
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetFollowing = async (req, res) => {
  // exclude these attributes from the returning user
  const queryProjection = {
    Password: 0,
    Group: 0,
    Gallery: 0,
    __v: 0,
    isActive: 0,
    About: 0,
    views: 0,
    PhotoStream: 0,
    Date_joined: 0,
    Age: 0,
    Fav: 0,
    BackGround: 0,
    albums: 0,
    photos: 0,
  };

  await Model.UserModel.findById({ _id: res.locals.userid })
    .then(async (user) => {
      const followers = [];
      const users = await Model.UserModel.find(
        { _id: user.Following },
        queryProjection
      );

      for (var i = 0; i < users.length; i++) {
        var user = await users[i].populate("photos").execPopulate();

        const follow = user.toObject();
        const avatar = await PhotoModel.Photo.findById(follow.Avatar);
        follow.Avatar = avatar.photoUrl;
        follow.Followers = follow.Followers.length;
        follow.Following = follow.Following.length;
        if (user.photos.length) follow.Photo = user.photos.length;
        else follow.Photo = 0;
        followers.push(follow);
      }

      return res.status(200).send({ FollowingList: followers });
    })
    .catch((err) => {
      return res.status(404).send({ message: "the user has 0 following" });
    });
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.UpdateUser = async (req, res) => {
  if (Object.keys(req.body) == 0)
    return res.status(400).send({ message: "the body is empty" });

  var updates = [
    "Fname",
    "Lname",
    "Password",
    "Avatar",
    "BackGround",
    "Email",
    "About",
  ];
  var about = ["Description", "Hometown", "Occupation", "CurrentCity"];
  var willBeUpdate = Object.keys(req.body);
  var isvalid = 0;
  willBeUpdate.forEach((upd) => {
    if (updates.includes(upd)) isvalid++;
  });
  var keys;
  if (req.body.About) keys = Object.keys(req.body.About);
  var msg = "";
  if (req.body.Avatar && !mongoose.Types.ObjectId.isValid(req.body.Avatar)) {
    delete req.body.Avatar;
    msg += "invalid Avatar id \n";
    isvalid--;
  } else if (
    req.body.Avatar &&
    mongoose.Types.ObjectId.isValid(req.body.Avatar)
  ) {
    const photo = await PhotoModel.Photo.findById({ _id: req.body.Avatar });
    if (!photo) {
      delete req.body.Avatar;
      isvalid--;
      msg += "no photo(Avatar)with this id";
    }
  }

  if (
    req.body.BackGround &&
    !mongoose.Types.ObjectId.isValid(eq.body.BackGround)
  ) {
    delete req.body.BackGround;
    msg += "invalid BackGround id \\n";
    isvalid--;
  } else if (
    req.body.BackGround &&
    mongoose.Types.ObjectId.isValid(eq.body.BackGround)
  ) {
    const photo = await PhotoModel.Photo.findById({ _id: req.body.BackGround });
    if (!photo) {
      delete req.body.BackGround;
      isvalid--;
      msg += "no photo(Avatar)with this id";
    }
  }

  if (req.body.About && keys.length != 0) {
    if (!keys.every((ab) => about.includes(ab))) {
      delete req.body.About;
      isvalid--;
      msg += " invalid About Data \\n";
    } else {
      const user = await Model.UserModel.findById({ _id: res.locals.userid });
      var userabout = user.About.toObject();
      keys.forEach((key) => {
        userabout[key] = req.body.About[key];
      });

      req.body.About = userabout;
    }
  }

  if (req.body.Password) {
    req.body.Password = bcrypt.hashSync(req.body.Password);
  }

  if (isvalid) {
    await Model.UserModel.findOneAndUpdate({ _id: res.locals.userid }, req.body)
      .then((user) => {
        return res.status(200).send({ message: "updated correctly" });
      })
      .catch((err) => {
        console.log(err);

        return res.status(404).send({ message: "user not found" });
      });
  } else return res.status(403).send({ message: "invalid format \\n" + msg });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.UserPhotos = async (req, res) => {
  await Model.UserModel.findById({ _id: res.locals.userid })
    .then(async (user) => {
      var photos = [];
      await user
        .populate("photos")
        .execPopulate()
        .then(async (UserWithPhoto) => {
          for (var i = 0; i < UserWithPhoto.photos.length; i++) {
            var photo = await PhotoModel.Photo.findById(
              UserWithPhoto.photos[i]
            );
            photos.push(photo);
          }
          res.status(200).send({  photos });

        })
        .catch((err) => {
          res
            .status(404)
            .send({ message: "can't find photo(s) for the given user" });
        });
    })
    .catch((err) => {
      res.status(404).send({ message: "can't find the given user" });
    });
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.About = async (req, res) => {
  const queryProjection = {
    Password: 0,
    Group: 0,
    Gallery: 0,
    __v: 0,
    isActive: 0,

    views: 0,
    PhotoStream: 0,
    Date_joined: 0,
    Age: 0,
    Fav: 0,
    BackGround: 0,
    albums: 0,
    photos: 0,
    Avatar: 0,
    Fname: 0,
    Lname: 0,
    Email: 0,
    UserName: 0,
    Followers: 0,
    Following: 0,
    _id: 0,
  };

  await Model.UserModel.findById({ _id: res.locals.userid }, queryProjection)
    .then((user) => {
      if (!user) return res.status(404).send({ message: "user not found" });

      return res.status(200).send(user);
    })

    .catch((err) => {
      return res
        .status(400)
        .send({ message: "invalid format caused an error" });
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.Unfollow = async (req, res) => {
  await Model.UserModel.findById({ _id: res.locals.userid })
    .then(async (user) => {
      if (!req.params.peopleid)
        return res
          .status(403)
          .send({ message: "syntax error people id is missed" });

      await Model.UserModel.findById({ _id: req.params.peopleid })
        .then(async (people) => {
          var valid = await user.Following.includes(people._id);
          if (valid) {
            await user.Following.pull(people._id);
            await people.Followers.pull(user._id);
            await user.save();
            await people.save();
            return res
              .status(200)
              .send({ message: "removed from following list successful" });
          } else
            return res
              .status(404)
              .send({ message: "not found in the following list" });

        })
        .catch((err) => {
          return res.status(404).send({ message: "user(people) not found " });
        });
    })
    .catch((err) => {
      return res.status(404).send({ message: "user not found " });
    });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetFav = async (req, res) => {
  const LoginUser = await Model.UserModel.findById(res.locals.userid);

  try {
    var FavPhotos = new Array();
    var Fav;
    for (var i = 0; i < LoginUser.Fav.length; i++) {
      Fav = await PhotoModel.Photo.findById(LoginUser.Fav[i]);
      if (Fav) {
        var fa = Fav.toObject();
        var Owner = await Model.UserModel.findById(Fav.ownerId);
        fa.Username = Owner.UserName;
        fa.comments = Fav.comments.length;
        fa.Favs = Fav.Fav.length;

        fa.Name = Owner.Fname + " " + Owner.Lname;
        FavPhotos.push(fa);
      }
    }
    res.status(200).send(FavPhotos);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "internal server error,please try again" });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.Album = async (req, res) => {
    const user = await Model.UserModel.findById(res.locals.userid);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.Explore = async (req, res) => {
    try{ 
  var photos = await PhotoModel.Photo.find({});

  var PhotosArray = [];
  for (var i = 0; i < photos.length; i++) {
    if (photos[i].Fav.length == 0) continue;
    let photojs = photos[i].toObject();
    const owner = await Model.UserModel.findById({ _id: photos[i].ownerId });
    photojs.ownerName =
      (owner.Fname == null ? "" : owner.Fname) +
      " " +
      (owner.Lname == null ? "" : owner.Lname);
    photojs.ownerUsername = owner.UserName;
    const avatar = await PhotoModel.Photo.findById(owner.Avatar);
    photojs.Avatar = avatar.photoUrl;

    photojs.comment = [];

    // process comments
    var js = photos[i].comments.toObject();
    for (var j = 0; j < js.length; j++) {
      
      const user = photos[i].comments[j].user;
      var comentowner = await Model.UserModel.findById({ _id: user });
      comentowner = comentowner.toObject();
      let commentjs = {};
      commentjs.comment=photos[i].comments[j]
      commentjs.ownerusername = comentowner.UserName;
      var commentavatarowner = await PhotoModel.Photo.findById({
        _id: comentowner.Avatar,
      });
      commentjs.avatar = commentavatarowner.photoUrl;
      photojs.comment.push(commentjs);
    }
    delete photojs.comments;

    photojs.fav = [];
    // process fav
    for (var j = 0; j < photos[i].Fav.length; j++) {
      var like = await Model.UserModel.findById(
        { _id: photos[i].Fav[j] },
        { password: 0, isActive: 0, Folowing: 0, Followers: 0 }
      );
      await like.populate("photos").execPopulate();
      let likejs = {};
      like = like.toObject();
      if (like.photos) likejs.num_photos = like.photos.length;
      else likejs.num_photos = 0;
      likejs.id=like._id;
      likejs.username = like.UserName;
      likejs.num_following = like.Following.length;
      let likeavatar = await PhotoModel.Photo.findById({ _id: like.Avatar });
      likejs.avatar = likeavatar.photoUrl;
      photojs.fav.push(likejs);
    }
    delete photojs.Fav;
    PhotosArray.push(photojs);
  }

  res.status(200).send(PhotosArray);
}
catch(err){

    res.status(500).send({message:'no photos to  send for explore'});
}
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.UpdateAbout=async(req,res)=>{
    if(!req.body)
    return res.status(400).send({message:'req body is empty'});
    var about = ["Description", "Hometown", "Occupation", "CurrentCity"];
    var update=Object.keys(req.body);
    var valid=update.every(up=>about.includes(up));
    
    if(!valid)
    return res.status(403).send({message:'req body is'});

          const user = await Model.UserModel.findById({ _id: res.locals.userid });
          
          update.forEach((key) => {
            user.About[key] = req.body[key];
          });

          //user.About=userabout;
          await user.save();
          res.status(200).send({message:'updated successfully'});




}
