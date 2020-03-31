const mongoose = require('mongoose')


const workoutSchema = new mongoose.Schema({
    weight:{
        type: Number,
        required : true
    },
    reps:{
        type: Number,
        required : true
    }
})

const Workout = mongoose.model('Workout',workoutSchema)

module.exports = Workout

