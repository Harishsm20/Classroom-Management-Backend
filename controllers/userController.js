const User = require('../models/user');
const Classroom = require('../models/classroom'); 

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password, role, classroom } = req.body;

    try {
        let user = new User({
            name,
            email,
            password,
            role,
            classroom: role === 'Student' ? classroom : undefined
        });

        if (role === 'Student' && classroom) {
            const classroomDoc = await Classroom.findOne({ name: classroom });
            if (classroomDoc) {
                classroomDoc.students.push(user._id);
                await classroomDoc.save();
            }
        }

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const role = req.query.role;

        const query = role ? { role } : {};
        const users = await User.find(query);

        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};


// Get a single user
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
    const { role } = req.query;

    try {
        const users = await User.find({ role });
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get students by classroom ID
exports.getStudentsByClassroom = async (req, res) => {
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

        // Extract student IDs from the classroom
        const studentIds = classroom.students.map(student => student._id);

        // Fetch student details from User model
        const students = await User.find({ _id: { $in: studentIds } });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

