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
