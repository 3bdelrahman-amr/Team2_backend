const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');
const emailExisyence=require('email-existence');

const Model=require("../models/user.model");
const config=require('config');
const { cache } = require("joi");
const { use } = require("../routes/v1");
const secret=config.get('JWT_KEY');
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports.register=async(req,res,next)=>{
    let {error}= Model.validateSignup(req.body);
    if(error)
    return res.status(400).send({ message:error.details[0].message});
    const hashpass= bcrypt.hashSync(req.body.password);
    
  
  
// else{ 

//    await Model.UserModel.findOne({Email:req.body.email}).then((err,user)=>{
//      if(user)
//        res.status(422).send({message:'user already exist'});
//       return;
//     });

await Model.UserModel.create({ 
    Fname:req.body.firstName,
    Lname:req.body.lastName,
    UserName:req.body.email.split('@')[0],
    Email:req.body.email,
    Date_joined:Date.now(),
    Age:(req.body.age),
    Password:hashpass
},(err,user)=>{

    if(err){ 
        if(err.keyValue)
        return res.status(422).send({message:'user already exist'});
      return res.status(400).send({message:"bad request, error while trying to insert user in database,"+
                           " make sure you sent the data with the right sntax"});
            // console.log(err);
        }              
      res.locals.userid=user._id;
      next();
}
);

}

///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetUser=async(req,res)=>{
   
   try { 
        const user=await Model.UserModel.findById({_id:res.locals.userid},{Password:0})
     
        if(!user)
        return res.status(404).send({message:'user not found'});

       
        return res.status(200).send(user);



    }
    catch(err){ 
   
        return res.status(400).send({message:'bad request'});


    } 





};
///////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.login=async(req,res,next)=>{
    let {error}= Model.validateLogin(req.body);
    if(error)
    return res.status(404).send({ message:error.details[0].message});

   await Model.UserModel.findOne({Email:req.body.email},(_err,_user)=>{
       if(!_user)
       return res.status(401).send({message:'no user found with this email'});
        if(!_user.isActive)
        return res.status(500).send({message:'you didnt confirm your email yet please confirm it before loging again'});

        if(_user){
            
            bcrypt.compare(req.body.password,_user.Password,(err)=>{

                if(err){
                    return res.status(401).send({message:'wrong password inserted'});
                    
                }
                res.locals.userid=_user._id;
                next();
                return;

            })
            return;
        }
        if(_err){
            res.status(401).send({message:"wrong Email inserted,no user with this mail"});
        }




});


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.VerifyEmail=async(req,res)=>{
    debugger
let token=req.params.token;
await jwt.verify(token,secret,async(err,decoded)=>{

let email=decoded.email;

await Model.UserModel.findOne({Email:email},(err,user)=>{
if(err)
return res.send('<h1>no such a user with this mail</h1>');
else{
    user.isActive=true;
    user.save();
    return res.status(201).send('<h1>user has been confirmed</h1>');

}



});



})




}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.PostFollower=async(req,res)=>{
    
   

    const user=await Model.UserModel.findById({_id:res.locals.userid})
        .catch(err=>{
            
            return res.status(404).send({message:"user not found"}); 
        });
    const people=await Model.UserModel.findById({_id:req.body.peopleid})
        .catch(err=>{
            return res.status(404).send({message:"the user you trying to follow is not found"}); 
        });

    if(user.Following.includes(people._id)){
        return res.status(403).send({message:"already in following list"});
        
    }

    user.Following.push(people._id);
    people.Followers.push(user._id);   
    user.save();
    people.save();
    
    res.status(200).send({message:"added to following list"});


    return;  
    
    


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetFollowers=async(req,res)=>{

    // exclude these attributes from the returning user
    const queryProjection={
        Password:0,
        Group:0,
        Gallery:0,
        __v:0,
        isActive:0,
        About:0,
        views:0,
        PhotoStream:0,
        Date_joined:0,
        Age:0,
        Fav:0,
        BackGround:0,
        albums:0,
        photos:0
       
    };
 
    await Model.UserModel.findById({_id:res.locals.userid},)
    .then(async user=>{
        const followers=[]
        const users=await Model.UserModel.find({_id:user.Followers},queryProjection);
        
        users.forEach(usr=>{
            usr.populate('photos').execPopulate();
            const follow=usr.toObject();
            follow.Followers=follow.Followers.length;
            follow.Following=follow.Following.length;
            if(follow.Photo)
            follow.Photo=follow.Photo.length;
            else
            follow.Photo=0;
            followers.push(follow);
           
           
        });
      
      return  res.status(200).send({FollowersList:followers});
    })
    .catch(err=>{
        
        return res.status(404).send({message:'the user has 0 followers'}); 

    });


}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetFollowing=async(req,res)=>{

    // exclude these attributes from the returning user
    const queryProjection={
        Password:0,
        Group:0,
        Gallery:0,
        __v:0,
        isActive:0,
        About:0,
        views:0,
        PhotoStream:0,
        Date_joined:0,
        Age:0,
        Fav:0,
        BackGround:0,
        albums:0,
        photos:0
       
    };
 
    await Model.UserModel.findById({_id:res.locals.userid},)
    .then(async user=>{
        const followers=[]
        const users=await Model.UserModel.find({_id:user.Following},queryProjection);
        
        users.forEach(usr=>{
            usr.populate('photos').execPopulate();
            const follow=usr.toObject();
            follow.Followers=follow.Followers.length;
            follow.Following=follow.Following.length;
            if(follow.Photo)
            follow.Photo=follow.Photo.length;
            else
            follow.Photo=0;
            followers.push(follow);
           
           
        });
      
      return  res.status(200).send({FollowingList:followers});
    })
    .catch(err=>{
        
        return res.status(404).send({message:'the user has 0 following'}); 
        
    });


}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.UpdateUser=async(req,res)=>{

    if(Object.keys(req.body)==0)
    return res.status(400).send({message:'the body is empty'});
  
    var updates=["Fname","Lname","Password","Avatar","BackGround","Email" ];
  var willBeUpdate=Object.keys(req.body);
  const isvalid=willBeUpdate.every(upd=>updates.includes(upd));

  if(isvalid){ 
  await Model.UserModel.findOneAndUpdate({_id:res.locals.userid},req.body)
  .then(user=>{

  
  
   return res.status(200).send({message:'updated correctly'});
  })
  .catch(err=>{

    return res.status(404).send({message:'user not found'});

  })
  }
  else return res.status(403).send({message:'invalid format'});




}
