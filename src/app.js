const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const routes = require('./routes/v1')
const { fileParser } = require('express-multipart-file-parser')
const bytes=require('bytes');
const app = express()

// parse json request body
app.use(express.json({ extended: true ,limit:bytes('100 mb')}))


app.use(fileParser({
  rawBodyOptions: {
    limit: '15mb',
  },
  busboyOptions: {
    limits: {
      fields: 2
    }
  },
}))

// parse urlencoded request body
app.use(express.urlencoded({ extended: true ,limit:bytes('100 mb')}))

app.use(mongoSanitize())

// enable cors
app.use(cors())
//app.options('*', cors())

// simple route for testing api is working:
app.get("/api/test", (req, res) => {
    res.json({ message: "Welcome to dropoids backend application V103" });
  });


// v1 api routes
app.use('/api/v1',routes);
// app.listen(3000,(err)=>{
//     console.log("start list");
    
// });


//app.use('/photos',express.static('photos')); // makes the photos folder available for everyone

module.exports = app
