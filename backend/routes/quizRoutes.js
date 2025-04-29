const express = require('express');
const router = express.Router();
const { createQuiz, getAllQuizzes, getQuizById } = require('../controllers/quizController');
const { submitQuiz } = require('../controllers/quizController');

// Teacher creates quiz
router.post('/', createQuiz);

// Student views all quizzes
router.get('/', getAllQuizzes);

// Student takes quiz (fetch by ID)
router.get('/:id', getQuizById);

router.post('/submit', submitQuiz);

module.exports = router;
