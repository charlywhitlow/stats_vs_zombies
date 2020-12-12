const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

// status
router.get('/status', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
});

// signup
router.post('/signup', asyncMiddleware( async (req, res, next) => {
    const { username, email, password } = req.body;
    await UserModel.create({ 
        username, email, password 
    });
    res.status(200).json({ 'status': 'ok' });
}));
module.exports = router;
