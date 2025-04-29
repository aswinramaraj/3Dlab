const express = require('express');
const router = express.Router();
const ClassCode = require('../models/ClassCode');
const Material = require('../models/Material');
const auth = require('../middleware/auth');

// Create a new class code
router.post('/', auth, async (req, res) => {
    try {
        const { code, name } = req.body;
        
        // Check if class code already exists
        const existingCode = await ClassCode.findOne({ code });
        if (existingCode) {
            return res.status(400).json({ message: 'Class code already exists' });
        }

        const classCode = new ClassCode({
            code,
            name,
            teacher: req.user.id
        });

        await classCode.save();
        res.status(201).json(classCode);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all class codes for a teacher
router.get('/', auth, async (req, res) => {
    try {
        const classCodes = await ClassCode.find({ teacher: req.user.id });
        res.json(classCodes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a class code
router.delete('/:id', auth, async (req, res) => {
    try {
        const classCode = await ClassCode.findById(req.params.id);
        
        if (!classCode) {
            return res.status(404).json({ message: 'Class code not found' });
        }

        // Check if the user is the owner of the class code
        if (classCode.teacher.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete associated materials
        await Material.deleteMany({ classCode: req.params.id });
        
        await classCode.remove();
        res.json({ message: 'Class code removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get materials for a specific class code
router.get('/:code/materials', auth, async (req, res) => {
    try {
        const classCode = await ClassCode.findOne({ code: req.params.code });
        
        if (!classCode) {
            return res.status(404).json({ message: 'Class code not found' });
        }

        const materials = await Material.find({ classCode: classCode._id });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 