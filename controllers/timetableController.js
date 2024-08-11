const Timetable = require('../models/timetable');
const Classroom = require('../models/classroom');
const User = require('../models/user');
// Create a new timetable entry
exports.createTimetable = async (req, res) => {
    console.log(`req.user: ${req.user}`);
    const { subject, startTime, endTime, day } = req.body;
    try {
        const user = req.user;
        const classroom = await Classroom.findById(user.classroom);
        console.log(`Classroom: ${classroom}`);
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }

        // Check if the user is assigned as a teacher to this classroom
        if (user.role === 'Teacher' && user.classroom.toString() !== classroom._id.toString()) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Create timetable
        const newTimetable = new Timetable({
            subject,
            startTime,
            endTime,
            day,
            classroom: user.classroom
        });

        await newTimetable.save();
        res.json(newTimetable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.assignSubject = async (req, res) =>{
    const { subject, teacherId, classroomId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }

        const teacher = await User.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ msg: 'Teacher not found' });
        }

        // Create or update timetable with the subject and teacher assignment
        const timetable = await Timetable.findOneAndUpdate(
            { subject, classroom: classroomId },
            { teacher: teacherId },
            { new: true, upsert: true }  // Create if not exists
        );

        res.json(timetable);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

// Get all timetable entries
exports.getAllTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find().populate('teacher', 'name'); // Optionally populate teacher info
        res.json(timetables);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Get a single timetable entry by ID
exports.getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id).populate('teacher', 'name');

        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }

        res.json(timetable);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Update a timetable entry by ID
exports.updateTimetable = async (req, res) => {
    const { day, startTime, endTime, subject, teacher, classroom } = req.body;

    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }

        timetable.day = day || timetable.day;
        timetable.startTime = startTime || timetable.startTime;
        timetable.endTime = endTime || timetable.endTime;
        timetable.subject = subject || timetable.subject;
        timetable.teacher = teacher || timetable.teacher;
        timetable.classroom = classroom || timetable.classroom;

        await timetable.save();
        res.json(timetable);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

// Delete a timetable entry by ID
exports.deleteTimetable = async (req, res) => {
    try {
        const timetable = await Timetable.findById(req.params.id);

        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }

        await timetable.remove();
        res.json({ msg: 'Timetable removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
