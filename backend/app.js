const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// Routes
const userRoutes = require('./routes/user');
const classCodeRoutes = require('./routes/classCode');
app.use('/api/users', userRoutes);
app.use('/api/class-codes', classCodeRoutes);
app.use('/api/materials', require('./routes/MaterialRoutes'));
// app.use('/api/experiments', require('./routes/experimentRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

module.exports = app;
