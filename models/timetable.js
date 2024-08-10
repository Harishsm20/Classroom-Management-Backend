const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // assuming teacher's details are stored in User model
        required: true
    },
    classroom: {
        type: String,
        required: true
    }
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;
