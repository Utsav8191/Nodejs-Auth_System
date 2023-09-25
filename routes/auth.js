const express= require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport-google_Oauth2_Strategy');
// ------ Import Controller ------- //
const authController = require('../controllers/authController');


// ------- render signUp route ------- //
router.get('/signUp', (req, res)=> res.render('register'));

// ------- Create new account POST req ------- //
router.post('/signUp', authController.create)

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateAccount);

// ------- Render Login route -------->>
router.get('/login', (req, res)=> res.render('login'));

// ------- Login POST route ------->>
router.post('/login', authController.login);

//------------ Forgot Password Route ------------>>
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Forgot Password Handle ------------>>
router.post('/forgot', authController.forgotPassword);

// ---------- Password reset redirection from email link ------>>
router.get('/forgot/:token',authController.resetFromEmailLink);

// -------- render reset -------->>
router.get('/reset/:id', (req, res)=> {res.render('reset', { id: req.params.id })});

// -------- reset redirection -------->>
router.post('/reset/:id', authController.resetPassword);

//------------ Logout GET route ------------>>
router.get('/logout', authController.logout);

// ------ Google authentication ------>>
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

// ------ Callback URI ------>>
router.get('/google/callback', passport.authenticate('google',
                      {successRedirect: '/dashboard',
                       failureRedirect: '/auth/login',failureFlash: true}));
module.exports = router;