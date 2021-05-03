const jwt=require("jsonwebtoken");
const configure=require("../config/default.json")
const nodemailer=require('nodemailer');
const secret=configure.JWT_KEY;
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
module.exports.authorization=(req,res)=>{
   
    let token=jwt.sign({ id:res.locals.userid },secret,{expiresIn:'24 hours'});
    res.status(200).send({token:token});


}
/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
module.exports.authentication=(req,res,next)=>{


    let token=req.headers['token'];
    if(!token)
      res.status(403).send({message:"no token"});

    jwt.verify(token,secret,(err,decoded)=>{
    
    if(err)
    res.status(500).send({message:"error while trying to decode the token"});

    if(!decoded)
    res.status(401).send({message:"failed to authenticate"});
    res.locals.userid=decoded.id;

    next();
 });


}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.SendVerification=async(req,res)=>{

  let transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: 'dropoidcompany@gmail.com', // generated ethereal user
      pass: 'Dropoid123', // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    },
  });



let token=jwt.sign({email:req.body.Email},secret,{expiresIn:'24 hours'});  

  let option={
    from: 'noreplay@example.com', // sender address
    to: req.body.Email, // list of receivers
    subject: "Mail confirmation", // Subject line
    text: "confirm please your mail", // plain text body
    html: '<a href="'+req.protocol+'://'+req.get('host')+req.originalUrl+'/'+token+'">link of confirmation</a>', // html body
  }
  
  let info =  transporter.sendMail(option,(err,data)=>{
  
  if(err)
  return res.send({message:'failed to sent verification mail please fill with a valid email'});
  else 
  return res.send({message:'email verification has been sent to you'});
  
  });



}