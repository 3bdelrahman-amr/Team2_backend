
const PhotoModel = require("../src/models/album.model");
const { Seeder } = require("mongoose-data-seed");
const mongoose = require("mongoose");

var id = mongoose.Types.ObjectId("608834536de13632903701b7");

const data = [
  {
      ownerId:"60b4692859dd7f45e0c19119",
      title:'hate',
      description:'we are strong',
      photos:["608834536de13632903701b5","608834536de13632903701b4","608834536de13632903701b3"],
    coverPhoto:"608834536de13632903701b6"


  },
];

class AlbumSeeder extends Seeder {
  async shouldRun() {
    const count = await PhotoModel.Album.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return PhotoModel.Album.create(data);
  }
}

module.exports = AlbumSeeder;

