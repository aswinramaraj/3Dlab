const config = {
    JWT_SECRET: process.env.JWT_SECRET || '3dlab-secret-key-2024',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/3D-virtual-lab',
    PORT: process.env.PORT || 5000
};

module.exports = config; 