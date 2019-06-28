var mongoose	 = require('mongoose'),
	Comment 	= require('./comment');


var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	created: {type: Date, default: Date.now}
});

var Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;