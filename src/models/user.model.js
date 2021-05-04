<<<<<<< HEAD
const mongoose=require("mongoose");
const joi=require('joi');
const schema=mongoose.Schema;

const UserSchema=new schema(
{ 
Fname:{
    type:String,
    min: 1
    ,required: true
      },
Lname:{
    type:String,
    min: 1
    ,required: true
      },
UserName:{
    type:String,
    min: 1
    ,required: true,
    unique:true,
    dropDups:true
         },
Email:{
    type:String
    , min: 1
    ,required: true,
    unique:true,
    dropDups:true
      },
About:{
       type:String
        , min: 1,
        default: "",        
          },
    
Age:{
    type:Number
    , min: 1
    ,required: true
    },

  Date_joined:  {
    
    type:Date,
    required: true,
     min: '2021-01-1'   ,
     default: Date.now,  
    
    },
    Password:{
      type:String,
      required:true,
       min:1,
      }

   ,photos:[
            { 
             type:schema.Types.ObjectId, 
             ref: 'Photo'
            }
           ] ,

  Num_tags:{ 
            type: Number,
            min: 0   
          },

  views:[{ 
    type: schema.Types.ObjectId,
    ref:'User'   
       }
      ],

  Followers:[
      {  
      type: schema.Types.ObjectId,
      ref: 'User'
      }
           ],

  Following:[
             {  
               type: schema.Types.ObjectId,
               ref: 'User'
             }
           ],         
  Group:[
            {  
              type: schema.Types.ObjectId,
              ref: 'Group'
            }
          ],     
  Album:[
            {  
              type: schema.Types.ObjectId,
              ref: 'Album'
            }
          ],
  Gallery:[
            {  
              type: schema.Types.ObjectId,
              ref: 'Gallery'
            }
          ],         
  Avatar:{
      type: schema.Types.ObjectId,
      ref: 'Photo'
        }, 
  Fav:[  { 
         type:schema.Types.ObjectId, 
         ref: 'Photo'
       }
      ],
  isActive:{
 type:Boolean,
 default:false,
  },                                               

   }
);
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.validateSignup=(body)=>{

const schema={
firstName:joi.string().min(1).max(50).required(),
lastName:joi.string().min(1).max(50).required(),
age:joi.number().integer().min(1).max(200).required(),
email:joi.string().email().required(),
password:joi.string().min(1).max(50).required(),
}

return  joi.validate(body,schema);

}
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.validateLogin=(body)=>{

  const schema={
  email:joi.string().email().required(),
  password:joi.string().min(1).max(50).required(),
  }
  
  return  joi.validate(body,schema);
  
  }
  

module.exports.UserModel=mongoose.model('User',UserSchema);;
=======
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    Fname: {
        type: String,
        min: 1,
        required: true,
    },
    Lname: {
        type: String,
        min: 1,
        required: true,
    },
    username: {
        type: String,
        min: 1,
        required: true,
    },
    email: {
        type: String,
        min: 1,
        required: true,
    },
    about: {
        type: String,
        min: 1,
        required: true,
    },

    age: {
        type: Number,
        min: 1,
        required: true,
    },

    date_joined: {
        type: Date,
        required: true,
        min: '2021-01-1',
    },

    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo',
        },
    ],

    num_tags: {
        type: Number,
        min: 0,
    },

    num_view: {
        type: Number,
        min: 0,
    },

    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    Group: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    Album: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Album',
        },
    ],
    Gallery: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Gallery',
        },
    ],
    Avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
    },
    Fav: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo',
        },
    ],
    Groups: [
        {
            ref: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
            role: {
                type: String,
                default: 'member',
            },
            _id: false,
        },
    ],
})
User = mongoose.model('User', UserSchema)
module.exports = { User, UserSchema }
>>>>>>> 5c7e5aa18b16b63b16718557283c80029a3a0eb3
