const User=require('./seeders/User.seeder');
const Photo=require('./seeders/photos.seeder');
const config=require('config');
const mongoose=require('mongoose')
const db=config.get('db');
module.exports.seedersList={Photo,User};

module.exports.connect=async()=>mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })

  module.exports.dropdb = async () => mongoose.connection.db.dropDatabase();