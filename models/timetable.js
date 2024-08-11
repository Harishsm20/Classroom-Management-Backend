const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    subject: {
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
    day: {
        type: String,
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


const Timetable = mongoose.model('timetable', TimetableSchema);
module.exports = Timetable;