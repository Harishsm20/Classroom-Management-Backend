const express = require('express');
const { 
    createClassroom, 
    getAllClassrooms, 
    getClassroom, 
    updateClassroom, 
    deleteClassroom, 
    assignTeacher, 
    assignStudent 
} = require('../controllers/classroomController');
const { auth, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/classrooms
// @desc    Create a new classroom
// @access  Private (Principal)
router.post('/', auth, authorize('Principal'), createClassroom);

// @route   GET /api/classrooms
// @desc    Get all classrooms
// @access  Private
router.get('/', auth, getAllClassrooms);

// @route   GET /api/classrooms/:id
// @desc    Get classroom by ID
// @access  Private
router.get('/:id', auth, getClassroom);

// @route   PUT /api/classrooms/:id
// @desc    Update classroom
// @access  Private (Principal)
router.put('/:id', auth, authorize('Principal'), updateClassroom);

// @route   DELETE /api/classrooms/:id
// @desc    Delete classroom
// @access  Private (Principal)
router.delete('/:id', auth, authorize('Principal'), deleteClassroom);

// @route   POST /api/classrooms/assign-teacher
// @desc    Assign a teacher to a classroom
// @access  Private (Principal)
router.post('/assign-teacher', auth, authorize('Principal'), assignTeacher);

// @route   POST /api/classrooms/assign-student
// @desc    Assign a student to a classroom
// @access  Private (Principal)
router.post('/assign-student', auth, authorize('Principal'), assignStudent);

module.exports = router;
