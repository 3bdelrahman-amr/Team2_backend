const mongoose = require('mongoose');
const app = require('./app');
const config = require('config');
const { util } = require('config');


let server;
const db = config.get('db');
const port = config.get('PORT');

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  server = app.listen(port, () => {
    console.log(`Listening to port ${port}\n  `);
    console.log('NODE_ENV=',config.util.getEnv('NODE_ENV'));
    console.log("db",db)
    
  });
}).catch(err => {
  console.log('Error: ', err);
});
