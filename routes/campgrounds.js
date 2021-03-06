const express = require('express'),
	router = express.Router(),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment'),
	middlewareObj = require('../middleware'),
	nodeGeocoder = require('node-geocoder');

const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = nodeGeocoder(options);

router.get('/', (req, res) => {
	let noMatch = null;
	if(req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, (err, allCampgrounds) => {
			if(err){
			console.log(err);
			} else {
				if(allCampgrounds.length < 1) {
					noMatch = "No campgrounds match that Search. Please try again!";
				}
				res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user, noMatch: noMatch});
			}
		});
	} else {
		Campground.find({}, (err, allCampgrounds) => {
			if(err){
			console.log(err);
			} else {
				res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user, noMatch: null});
			}
		});
	}
});

//CREATE - add new campground to DB
router.post('/', middlewareObj.isLoggedIn, middlewareObj.isSafe, (req, res) => {
	// get data from form and add to campgrounds array
	const name = req.body.name,
		image = req.body.image,
		description = req.body.description,
		price = req.body.price,
		author = {
			id: req.user._id,
			username: req.user.username
		};
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
			 req.flash('error', 'Invalid address');
			 return res.redirect('back');
	}
		const lat = data[0].latitude,
			  lng = data[0].longitude,
			  location = data[0].formattedAddress;
		const newCampground = {name: name, image: image, description: description, author: author, price: price, location: location, lat: lat, lng: lng};
		// Create a new campground and save to DB
		Campground.create(newCampground, (err, newlyCreated) => {
			if(err) {
				req.flash('error', 'Something went wrong...');
				console.log(err);
			} else {
				req.flash('success', 'New Campground added Successfully!');
				res.redirect('/campgrounds');
			}
		});
	});
});

router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id).populate('comments').exec((err, foundCampground) => {
		if(err) {
		console.log(err);
		} else {
		res.render('campgrounds/show', {campground: foundCampground, req: req});
		}
	});
});

router.get('/:id/edit', middlewareObj.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) =>{
		res.render('campgrounds/edit', {campground: foundCampground});	
	});
});

router.put('/:id', (req, res)=>{
	geocoder.geocode(req.body.location, (err, data) => {
		if (err || !data.length) {
		  req.flash('error', 'Invalid address');
		  return res.redirect('back');
		}
		req.body.campground.lat = data[0].latitude;
		req.body.campground.lng = data[0].longitude;
		req.body.campground.location = data[0].formattedAddress;
		Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
			if(err){
				req.flash('error', 'Something went wrong...');
				res.redirect('back');
			} else {
				req.flash('info', 'Campground Updated!');
				res.redirect('/campgrounds/' + req.params.id);
			}
		});
	});
});

router.delete('/:id', middlewareObj.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) =>{
		if(err){
			req.flash('error', 'Something went wrong...');
			console.log(err);
		}
		Comment.deleteMany( {_id: { $in: campgroundRemoved.comments }}, (err)=>{
			if(err){
				req.flash('error', 'Something went wrong...');
				console.log(err);
			}
			res.redirect('/campgrounds');
		});
	});	
	req.flash('error', 'Campground Deleted!');
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.',\\^$|#\s]/g, "\\$&");
}


module.exports = router;
