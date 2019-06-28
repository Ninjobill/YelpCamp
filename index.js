require('dotenv').config();

const express     			= require('express'),
    app 	    			= express(),
    bodyParser  			= require('body-parser'),
    mongoose   				= require('mongoose'),
	Campground 				= require('./models/campground'),
	Comment					= require('./models/comment'),
	seedDB					= require('./seeds'),
	passport 				= require('passport'),
	LocalStrategy			= require('passport-local'),
	passportLocalMongoose	= require('passport-local-mongoose'),
	User					= require('./models/user'),
	methodOverride			= require('method-override'),
	flash					= require('connect-flash');

// Require Routes
const commentRoutes			= require('./routes/comments'),
	campgroundRoutes 		= require('./routes/campgrounds'),
	authRoutes				= require('./routes/auth');

// MongoDB Atlas connection
mongoose.connect('mongodb+srv://ninjobill:Rockstar1!@cluster0-ix8w4.mongodb.net/YelpCamp?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// =======================

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// seedDB(); seed the DB

// Passport Config
app.use(require('express-session')({
	secret: 'Campgrounds Galore',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash messages
app.use(flash());
app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.info = req.flash('info');
	next();
});

// Use Routes
app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('campgrounds/:id/comments', commentRoutes);


// Listening Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});