const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const UserModel = require('../models/userModel');

const router = express.Router();

// status
router.get('/status', (req, res, next) => {
  res.status(200);
  res.json({ 'status': 'ok' });
});

// check-username
router.post('/check-username', asyncMiddleware( async (req, res, next) => {
    const { username } = req.body;
    const user = await UserModel.findOne({ username });
    if (!user) {
        res.status(200).json({ 'status': 'ok' });        
    }else{
        res.status(401).json({ 'message': 'username taken' });
    }
}));

// signup
router.post('/signup', asyncMiddleware( async (req, res, next) => {
    const { username, email, password } = req.body;
    await UserModel.create({ 
        username, email, password 
    });
    res.status(200).json({ 'status': 'ok' });
}));

// login
router.post('/login', asyncMiddleware(async (req, res, next) => {
    const { username, password } = req.body;

    // check username and email
    let user = await UserModel.findOne({ username : username });
    if (!user) {
        user = await UserModel.findOne({ email : username });
    }
    if (!user) {
      res.status(401).json({ 'message': 'User not found' });
      return;
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).json({ 'message': 'Incorrect password' });
      return;
    }
    res.status(200).json({ 
        'status': 'ok',
        'user' : {
            'username' : user.username,
            'zone' : user.zone,
            'level' : user.level,
            'health' : user.health,
            'score' : user.score,
            'gold' : user.gold
        }
    });
}));
module.exports = router;
