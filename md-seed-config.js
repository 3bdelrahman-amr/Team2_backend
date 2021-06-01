<<<<<<< HEAD
const User = require("./seeders/User.seeder");
const Photo = require("./seeders/photos.seeder");
const Album = require("./seeders/album.seeder");
=======
const User = require('./seeders/User.seeder');
const Photo = require('./seeders/photos.seeder');
const Group = require('./seeders/groups.seeder');
>>>>>>> 01d6642d7227b00d04cd70e7fee61dfa59da462e

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('db');
/**
 * Seeders List
 * order is important
 * @type {Object}
 */
<<<<<<< HEAD
module.exports.seedersList = { User, Photo,Album };
=======
module.exports.seedersList = { User, Photo, Group };
>>>>>>> 01d6642d7227b00d04cd70e7fee61dfa59da462e
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
module.exports.connect = async () =>
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
module.exports.dropdb = async () => mongoose.connection.db.dropDatabase();
