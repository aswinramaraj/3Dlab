const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const ClassCode = require('../models/ClassCode');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { uploadMaterial } = require('../controllers/materialController');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/materials');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// Get all materials for a specific class code
router.get('/class/:classCode', auth, async (req, res) => {
    try {
        const materials = await Material.find({ classCode: req.params.classCode })
            .populate('uploadedBy', 'name email');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload a new material
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const material = new Material({
            title: req.body.title,
            description: req.body.description,
            filePath: req.file.path,
            fileName: req.file.originalname,
            classCode: req.body.classCode,
            uploadedBy: req.user.id,
            uploadDate: new Date()
        });

        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a material
router.delete('/:id', auth, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check if the user is the one who uploaded the material
        if (material.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this material' });
        }

        await Material.findByIdAndDelete(req.params.id);
        res.json({ message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a material
router.patch('/:id', auth, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Check if the user is the one who uploaded the material
        if (material.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this material' });
        }

        const updates = {
            title: req.body.title || material.title,
            description: req.body.description || material.description,
        };

        const updatedMaterial = await Material.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json(updatedMaterial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific material
router.get('/:id', auth, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        res.json(material);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Unable to list materials' });
    }
    const fileLinks = files.map(file => ({
      filename: file,
      url: `http://localhost:5000/uploads/${file}`
    }));
    res.json(fileLinks);
  });
});

module.exports = router;
