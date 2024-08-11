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
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classroom: {
        type: String,
        required: true
    }
});

module.exports = Timetable = mongoose.model('timetable', TimetableSchema);
