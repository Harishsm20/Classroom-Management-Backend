const User = require('../models/user');

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password, role, classroom } = req.body;

    try {
        // Check for existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            email,
            password,
            role,
            classroom: role === 'Student' ? classroom : undefined, // Assign classroom only for students
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
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
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};
