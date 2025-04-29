const express = require('express');
const router = express.Router();
const ClassCode = require('../models/ClassCode');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Generate a new class code (Teacher only)
router.post('/generate', auth, async (req, res) => {
    try {
        // Verify user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Only teachers can generate class codes' });
        }

        // Generate a random 6-character code
        const generateUniqueCode = async () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code;
            let isUnique = false;

            while (!isUnique) {
                code = '';
                for (let i = 0; i < 6; i++) {
                    code += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                // Check if code already exists
                const existingCode = await ClassCode.findOne({ code });
                if (!existingCode) {
                    isUnique = true;
                }
            }
            return code;
        };

        const code = await generateUniqueCode();
        const name = req.body.name || 'My Class'; // Optional class name

        const classCode = new ClassCode({
            code,
            name,
            teacher: req.user._id
        });

        await classCode.save();
        res.status(201).json(classCode);
    } catch (error) {
        console.error('Error generating class code:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Join a class using code (Student only)
router.post('/join/:code', auth, async (req, res) => {
    try {
        // Verify user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can join classes' });
        }

        const classCode = await ClassCode.findOne({ code: req.params.code });
        if (!classCode) {
            return res.status(404).json({ message: 'Invalid class code' });
        }

        // Check if student is already in the class
        if (classCode.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already in this class' });
        }

        // Add student to class
        classCode.students.push(req.user._id);
        await classCode.save();

        res.json({ message: 'Successfully joined class', classCode });
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all class codes for a teacher
router.get('/teacher', auth, async (req, res) => {
    try {
        // Verify user is a teacher
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const classCodes = await ClassCode.find({ teacher: req.user._id })
            .populate('students', 'name email'); // Populate student details

        res.json(classCodes);
    } catch (error) {
        console.error('Error fetching class codes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all classes a student has joined
router.get('/student', auth, async (req, res) => {
    try {
        // Verify user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const classes = await ClassCode.find({ students: req.user._id })
            .populate('teacher', 'name email');

        res.json(classes);
    } catch (error) {
        console.error('Error fetching joined classes:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 