const Timetable = require('../models/timetable');
const Classroom = require('../models/classroom');
const User = require('../models/user');

// Create a new timetable entry
exports.createTimetable = async (req, res) => {
    console.log(`req.body: ${JSON.stringify(req.body, null, 2)}`);
    const { subject, startTime, endTime, day, classroomId } = req.body;
    try {
        const user = req.user;
        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }

        if (user.role === 'Teacher' && user._id.toString() !== classroom.teacher?.toString()) {
            return res.status(403).json({ msg: 'Unauthorized: You are not the assigned teacher for this classroom' });
        }

        const newTimetable = new Timetable({
            subject,
            startTime,
            endTime,
            day,
            classroom: classroom._id,
            teacher: user._id
        });

        // Attempt to save the new timetable
        await newTimetable.save();
        console.log('Timetable created successfully:', newTimetable);
        res.json(newTimetable);

    } catch (err) {
        console.error('Error creating timetable:', err.message);
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

// Get timetable by classroom ID
exports.getTimetableByClassroom = async (req, res) => {
    try {
        const { classroom } = req.query;

        // Find timetables associated with the classroom ID
        const timetable = await Timetable.find({ classroom });

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found for this classroom' });
        }

        res.json(timetable);
    } catch (error) {
        console.error('Error fetching timetable:', error);
        res.status(500).json({ message: 'Server error' });
    }
};