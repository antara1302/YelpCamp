if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();

}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
// const Campground = require('./models/campground');
// const Review = require('./models/review');
const camgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require('connect-mongo') (session);
//const dbUrl= process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//connecting to mongoDb


mongoose.connect(dbUrl);
//mongoose.connect(dbUrl);
const db = mongoose.connection;

db.once('open', () => {
    console.log('Connected to MongoDB!');
});
db.on('error', (err) => {
    console.log('Connection error:', err);
});

//setting up view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());




//middleware for parsing request body:
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//setting up session
const secret = process.env.SECRET || 'thisshouldbe a secret!';
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//setting up flash messages
app.use(flash());

//setting up passport authentication:
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//user flash messages in response locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//routes:
app.use('/campgrounds', camgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


//home route
app.get('/', (req, res) => {
    res.render('home');
})



//middlewares handling errors:
// //non-reachable route
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//handles all errors for now
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oops! Something went wrong"
    res.status(statusCode).render('errors', { err });
})


//starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})