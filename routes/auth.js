var express = require('express'),
	router = express.Router(),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment'),
	passport 	= require('passport'),
	User		= require('../models/user'),
	flash		= require('connect-flash');

router.get('/', (req, res) => {
	res.render('landing');
});

// ==================

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res)=>{
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === 'billy444') {
	   newUser.isAdmin = true;
	   }
	User.register(newUser , req.body.password, (err, user) => {
		if(err){
			req.flash('error', err.message);
			return res.render('register');
		}
		passport.authenticate('local')(req, res, () => {
			req.flash('success', 'Welcome to YelpCamp, ' + user.username + '!');
			res.redirect('/campgrounds');
		});
	});
});


router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local',
	{
	successRedirect: '/campgrounds',
	failureRedirect: '/login',
	failureFlash: true,
	successFlash: 'Welcome back to YelpCamp!'
	}), (req, res) =>{
});

router.get('/logout', (req, res) =>{
	req.logout();
	req.flash('success', 'Logged Out Successfully!');
	res.redirect('/campgrounds');
});

module.exports = router;