const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/materials')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload material
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, classCode } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const material = new Material({
      title,
      description,
      filePath: req.file.path,
      teacher: req.user._id,
      classCode
    });

    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get materials by class code
router.get('/class/:classCode', auth, async (req, res) => {
  try {
    const materials = await Material.find({ classCode: req.params.classCode })
      .populate('teacher', 'name')
      .sort('-createdAt');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete material
router.delete('/:id', auth, async (req, res) => {
  try {
    const material = await Material.findOne({ 
      _id: req.params.id,
      teacher: req.user._id 
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    await material.remove();
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 