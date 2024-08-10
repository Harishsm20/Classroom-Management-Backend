const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { auth, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Principal)
router.get('/', auth, authorize('Principal', 'Teacher'), getAllUsers);

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
