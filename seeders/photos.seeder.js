const PhotoModel=require('../src/models/photo.model');
const {Seeder}=require('mongoose-data-seed');
const mongoose=require('mongoose')

var id = mongoose.Types.ObjectId('608834536de13632903701b7');

const data=[
    {
        _id:id,
        photoUrl:'https://upload.wikimedia.org/wikipedia/ar/d/d4/Mickey_Mouse.png',
        ownerId:'608834536de13632903701b7'

    },
]

class PhotosSeeder extends Seeder {
    async shouldRun() {
      const count = await PhotoModel.Photo.countDocuments().exec();
  
      return count === 0;
    }
  

    async run() {
      return PhotoModel.Photo.create(data);
    }
  }

module.exports = PhotosSeeder;