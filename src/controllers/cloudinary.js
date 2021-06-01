const cloudinary=require('cloudinary').v2;
cloudinary.config({
    cloud_name:'dropoids',
    api_key:189777569242485,
    api_secret:'zZwpbUm1VEbDSt85CigmxNPsm1o'
})
module.exports={cloudinary};