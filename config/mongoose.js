
const mongoose = require('mongoose')

// connect to the database
mongoose.connect('mongodb://localhost/fitness_app_db')

const db = mongoose.connection

db.on('error', console.error.bind(console , 'error connecting to db'))

// up and running then print the message
db.once('open',()=>{
    console.log('Successfully connected to the database')
})

