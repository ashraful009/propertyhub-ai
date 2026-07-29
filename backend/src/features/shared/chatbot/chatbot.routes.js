const express = require('express');
const { streamPropertyChat } = require('./chatbot.controller');

const router = express.Router();

router.post('/property/:id', streamPropertyChat);

module.exports = router;
