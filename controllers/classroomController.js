const Classroom = require('../models/classroom');
const User = require('../models/user');

// Create a new classroom
exports.createClassroom = async (req, res) => {
    const { name, startTime, endTime, days } = req.body;
    
    try {
        const newClassroom = new Classroom({
            name,
            startTime,
            endTime,
            days
        });
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().populate('teacher').populate('students');
        res.json(classrooms);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get a single classroom
exports.getClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id).populate('teacher').populate('students');
        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });
        res.json(classroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Update a classroom
exports.updateClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });
        res.json(classroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Delete a classroom
exports.deleteClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findByIdAndRemove(req.params.id);
        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });
        res.json({ msg: 'Classroom deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Assign a teacher to a classroom
exports.assignTeacher = async (req, res) => {
    const { classroomId, teacherId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });

        classroom.teacher = teacherId;
        await classroom.save();

        res.json(classroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Assign a student to a classroom
exports.assignStudent = async (req, res) => {
    const { classroomId, studentId } = req.body;

    try {
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });

        classroom.students.push(studentId);
        await classroom.save();

        res.json(classroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};
