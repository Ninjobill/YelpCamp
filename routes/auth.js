var express 	= require('express'),
	router 		= express.Router(),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment'),
	passport 	= require('passport'),
	User		= require('../models/user'),
	flash		= require('connect-flash'),
	middlewareObj = require('../middleware');
	

router.get('/', (req, res) => {
	res.render('landing');
});

// ==================

router.get('/register', (req, res) => {
	res.render('register');
});

router.post('/register', (req, res)=>{
	var newUser = new User(
		{
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email
		});
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

// user profiles
router.get('/users/:id', (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if(err) {
			req.flash(error, 'Something went wrong..');
			res.redirect('/campgrounds');
		}
		Campground.find().where('author.id').equals(foundUser._id).exec((err, campgrounds) => {
			if(err) {
				req.flash('error', "something went wrong");
				res.redirect('back');
			}
			res.render('users/show', {user: foundUser, campgrounds: campgrounds});
		});
	});
});

module.exports = router;