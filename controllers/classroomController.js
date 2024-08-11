const Classroom = require('../models/classroom');
const User = require('../models/user');

exports.createClassroom = async (req, res) => {
    const { name, startTime, endTime, teacher } = req.body;
    
    try {
        const newClassroom = new Classroom({
            name,
            startTime,
            endTime,
            teacher
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
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get a single classroom
exports.getClassroom = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('teacher')
            .populate('students');

        if (!classroom) return res.status(404).json({ msg: 'Classroom not found' });

        // Check if the logged-in teacher is assigned to this classroom
        console.log(`req.user.id : ${req.user.id}`);
        const loggedInTeacherId = req.user.id; // Accessing user ID from req.user
        if (classroom.teacher._id.toString() !== loggedInTeacherId) {
            return res.status(403).json({ msg: 'Unauthorized access' });
        }

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

        // Check if the teacher is already assigned
        if (classroom.teacher) return res.status(400).json({ msg: 'Teacher already assigned' });

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

        // Check if the student is already in the classroom
        if (classroom.students.includes(studentId)) return res.status(400).json({ msg: 'Student already assigned' });

        classroom.students.push(studentId);
        await classroom.save();

        res.json(classroom);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.getClassroomByTeacherId = async (req, res) => {
    try {
        const teacherId = req.params.teacherId;

        // Find the classroom where the teacher is assigned
        const classroom = await Classroom.findOne({ teacher: teacherId }).populate('students');
                
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found for this teacher' });
        }

        res.json(classroom);
    } catch (error) {
        console.error('Error fetching classroom by teacher ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByClassroom = async (req, res) => {
    console.log("Reached getStudentsByClassroom method");
    try {
        const classroomId = req.query.classroom;
        if (!classroomId) {
            console.log('No classroom ID provided');
            return res.status(400).json({ error: 'Classroom ID is required' });
        }

        // Fetch classroom and populate students field
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            console.log('Classroom not found:', classroomId);
            return res.status(404).json({ error: 'Classroom not found' });
        }

        // console.log('Classroom found:', classroom);

        // Extract student IDs from the classroom
        const studentIds = classroom.students.map(student => student._id);

        // Fetch student details from User model
        const students = await User.find({ _id: { $in: studentIds } });

        console.log('Students found:', students);

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getStudentClassroom = async (req, res) =>{
    try {
        const studentId = req.params.id;
        const classroom = await Classroom.findOne({ students: studentId });
        if (!classroom) {
            return res.status(404).json({ msg: 'Classroom not found' });
        }
        res.json(classroom);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}
