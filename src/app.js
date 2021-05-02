const express = require('express')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const httpStatus = require('http-status')
const routes = require('./routes/v1')

const app = express()

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

app.use(mongoSanitize())

// enable cors
app.use(cors())
app.options('*', cors())

// v1 api routes
<<<<<<< HEAD
app.use('/api/v1',routes);
// app.listen(3000,(err)=>{
//     console.log("start list");
    
// });
=======
app.use('/api/v1', routes)
>>>>>>> a5235e6969199774c1df0e0cc4fb69191f8cd710

module.exports = app
