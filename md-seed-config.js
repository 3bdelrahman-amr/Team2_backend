
const User = require("./seeders/User.seeder");
const Photo = require("./seeders/photos.seeder");
const Album = require("./seeders/album.seeder");
const Group = require('./seeders/groups.seeder');

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('db');
/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports.seedersList = { User, Photo,Album, Group };
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
