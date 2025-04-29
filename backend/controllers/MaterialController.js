const Material = require('../models/Material');

const uploadMaterial = async (req, res) => {
  try {
    const { title, uploadedBy } = req.body;
    const fileUrl = req.file.path; // local path

    const newMaterial = new Material({
      title,
      fileUrl,
      uploadedBy
    });

    await newMaterial.save();
    res.status(201).json({ message: 'Material uploaded successfully', material: newMaterial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = { uploadMaterial };
