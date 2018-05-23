// PACKAGES
const express = require('express'); // node.js framework
const path = require('path'); //  utilities for working with file and directory paths
const cookieParser = require('cookie-parser'); // parses cookies attached to the client request object. 
const logger = require('morgan'); // logs info to the console

const cors = require('cors'); // cross-origin HTTP request (from a different domain, protocol, or port than the one from which the current document originated).
const mongoose = require('mongoose'); // object modeling tool for MongoDb
const session = require('express-session'); //  to store and access user data as they browse the app 
const MongoStore = require('connect-mongo')(session); // stores sessions in the "sessions" collection by default

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// ROUTERS
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

// CALLING THE APP!
const app = express();

// CONNECTING TO THE MONGODB
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,  // keeps connection open
  reconnectTries: Number.MAX_VALUE
});

// APP.USE (Binding app-level middlewares to an instance of the app object)
app.use(cors({
  credentials: true,   // notify clients whether "credentials" (including Cookies and HTTP Authentication data) should be sent with requests.
  origin: [process.env.CLIENT_URL]
}));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day 
  }),
  secret: 'some-string',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // expire date
  }
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', usersRouter);

// ERROR HANDLER
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({ code: 'not-found' });
});

app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response, error 500
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected' });
  }
});

// EXPORT !!!! app 
module.exports = app;

