const express = require('express');
const router = express.Router();
const {auth, authorize} = require('../middleware/authMiddleware')
const timetableController = require('../controllers/timetableController');

// @route   POST /api/timetable
// @desc    Create a new timetable entry
// @access  Private (or Admin if role-based access is implemented)
router.post('/create-timetable', auth, authorize('Teacher'), timetableController.createTimetable);
router.post('/assign-subject', auth , authorize('Teacher'), timetableController.assignSubject)

// @route   GET /api/timetable
// @desc    Get all timetable entries
// @access  Public or Private
router.get('/', timetableController.getAllTimetables);

router.get('/getClassTimetable', auth,timetableController.getTimetableByClassroom);

// @route   GET /api/timetable/:id
// @desc    Get a timetable entry by ID
// @access  Public or Private
router.get('/:id', timetableController.getTimetableById);

// @route   PUT /api/timetable/:id
// @desc    Update a timetable entry by ID
// @access  Private (or Admin if role-based access is implemented)
router.put('/:id', timetableController.updateTimetable);

// @route   DELETE /api/timetable/:id
// @desc    Delete a timetable entry by ID
// @access  Private (or Admin if role-based access is implemented)
router.delete('/:id', timetableController.deleteTimetable);

router.get('/classroom/:id',auth, timetableController.getTimetableFromClassroom);

module.exports = router;
