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
module.exports.validation=(body)=>{

const schema={
Fname:joi.string().min(1).max(50).required(),
Lname:joi.string().min(1).max(50).required(),
Age:joi.number().integer().min(1).max(200).required(),
Email:joi.string().email().required(),
Password:joi.string().min(1).max(50).required(),
}

return  joi.validate(body,schema);

}

module.exports.UserModel=mongoose.model('User',UserSchema);;