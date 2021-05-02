<<<<<<< HEAD
const mongoose = require('mongoose');
const app = require('./app');
const config = require('config');


let server;
const db=config.get('db');
const port=config.get('PORT');

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
  server = app.listen(port, () => {
    console.log(`Listening to port ${port} `);
  });
}).catch(err => {
  console.log('Error: ', err);
});
=======
const mongoose = require('mongoose')
const app = require('./app')
const config = require('config')
let server
mongoose
    .connect(config.get('db'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        server = app.listen(config.get('PORT'), () => {
            console.log(`Listening to port ${config.get('PORT')}`)
        })
    })
    .catch((err) => {
        console.log('Error: ', err)
    })
>>>>>>> a5235e6969199774c1df0e0cc4fb69191f8cd710
