var express		= require('express'),
	router 		= express.Router(),
	Campground 	= require('../models/campground'),
	Comment		= require('../models/comment'),
	middlewareObj = require('../middleware');


router.get('/new', middlewareObj.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
		console.log(err);
		} else {
	res.render('comments/new', {campground: campground});
		}
	});
});


router.post('/', middlewareObj.isLoggedIn,(req, res)=>{
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			req.flash('error', 'Something went wrong...');
			console.log(err);
		} else {
			Comment.create(req.body.comment, (err, newComment) => {
				if(err){
					req.flash('error', 'Something went wrong...');
					console.log(err);
				} else {
					newComment.author.id = req.user._id;
					newComment.author.username = req.user.username;
					newComment.save();
					campground.comments.push(newComment);
					campground.save();
					req.flash('success', 'Comment Added!');
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) =>{
		if(err){
			req.flash('error', 'Something went wrong...');
			res.redirect('back');
		} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
		}
	});
});

router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
		if(err){
			req.flash('error', 'Something went wrong...');
			res.redirect('back');
		} else {
			req.flash('info', 'Comment Updated!');
			res.redirect('/campgrounds/' + req.params.id);
		}
	});	
});

router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, (err, deletedComment) =>{
		if(err){
			req.flash('error', 'Something went wrong...');
			res.redirect('back');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
	req.flash('error', 'Comment Deleted!');
});


module.exports = router;