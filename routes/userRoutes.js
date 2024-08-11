const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, createUser, getUsersByRole } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/users/create
// @desc    Create a user (student/teacher)
// @access  Private (Principal only)
router.post('/create', auth, authorize('Principal'), createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Principal)
router.get('/', auth, authorize('Principal', 'Teacher'), getAllUsers);

router.get('/getUserByRole', getUsersByRole);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, getUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', auth, authorize('Principal'), updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private
router.delete('/:id', auth, authorize('Principal'), deleteUser);

module.exports = router;
