const Timetable = require('../models/timetable');

// Create a new timetable entry
exports.createTimetable = async (req, res) => {
    const { day, startTime, endTime, subject, classroom } = req.body;
    const teacher = req.user.id; 

    try {
        if (!day || !startTime || !endTime || !subject || !teacher || !classroom) {
            console.log("Missing");
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        const newTimetable = new Timetable({
            day,
            startTime,
            endTime,
            subject,
            teacher,
            classroom
        });

        await newTimetable.save();
        res.status(201).json(newTimetable);
    } catch (error) {
        console.error('Error creating timetable:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};




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
