var mongoose 	= require('mongoose'),
	Campground 	= require('./models/campground'),
	Comment 	= require('./models/comment');


var data = [
	{
		name: 'clouds rest', 
		image:'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Enim eu turpis egestas pretium. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Morbi tristique senectus et netus et. Hendrerit gravida rutrum quisque non. Enim nec dui nunc mattis enim ut. Quis commodo odio aenean sed adipiscing diam. Eget mauris pharetra et ultrices. Pulvinar elementum integer enim neque volutpat. Varius morbi enim nunc faucibus a. Et netus et malesuada fames ac turpis egestas maecenas pharetra. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Consequat interdum varius sit amet. Lectus proin nibh nisl condimentum id. Convallis a cras semper auctor neque vitae tempus quam. Sed risus pretium quam vulputate dignissim suspendisse in est. Vulputate enim nulla aliquet porttitor lacus luctus.'
	},
	{
		name: 'Pollock Pines', 
		image:'https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1647&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Enim eu turpis egestas pretium. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Morbi tristique senectus et netus et. Hendrerit gravida rutrum quisque non. Enim nec dui nunc mattis enim ut. Quis commodo odio aenean sed adipiscing diam. Eget mauris pharetra et ultrices. Pulvinar elementum integer enim neque volutpat. Varius morbi enim nunc faucibus a. Et netus et malesuada fames ac turpis egestas maecenas pharetra. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Consequat interdum varius sit amet. Lectus proin nibh nisl condimentum id. Convallis a cras semper auctor neque vitae tempus quam. Sed risus pretium quam vulputate dignissim suspendisse in est. Vulputate enim nulla aliquet porttitor lacus luctus.'
	},
	{
		name: 'Beachfront', 
		image:'https://images.unsplash.com/photo-1467357689433-255655dbce4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE2ODQ0fQ&auto=format&fit=crop&w=1656&q=80',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat orci nulla pellentesque dignissim. Enim eu turpis egestas pretium. Ligula ullamcorper malesuada proin libero nunc consequat interdum varius. Morbi tristique senectus et netus et. Hendrerit gravida rutrum quisque non. Enim nec dui nunc mattis enim ut. Quis commodo odio aenean sed adipiscing diam. Eget mauris pharetra et ultrices. Pulvinar elementum integer enim neque volutpat. Varius morbi enim nunc faucibus a. Et netus et malesuada fames ac turpis egestas maecenas pharetra. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis a. Consequat interdum varius sit amet. Lectus proin nibh nisl condimentum id. Convallis a cras semper auctor neque vitae tempus quam. Sed risus pretium quam vulputate dignissim suspendisse in est. Vulputate enim nulla aliquet porttitor lacus luctus.'
	}
];

function seedDB() {
	Campground.remove({}, (err) => {
		if(err){
			console.log(err);
		}
		console.log('removed campgrounds');	
		data.forEach(seed => {
			Campground.create(seed, (err, campground) => {
				if(err){
					console.log(err);
				} else {
					console.log('added a Campground');
					Comment.create(
						{
							text: 'this place is great, but i wish there was internet',
							author: 'homer'
						}, (err, comment) => {
							if(err){
								console.log(err);
							} else{
								campground.comments.push(comment);
								campground.save();
								console.log('created a comment');
							}
						});
				}
			});
		});
	});
}

module.exports = seedDB;