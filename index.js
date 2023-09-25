const express = require('express');
const port = 5000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

// ------ Passport Configuration ------>>
require('./config/passport')(passport);
const passportGoogle = require('./config/passport-google_Oauth2_Strategy');

// -------- DB configuration -------->>
const db = require('./config/key').MongoURI;

// -------- mongoose connection ------->>
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>console.log("Server connected to MongoDB"))
  .catch((err)=> console.log(`Error while connecting to MongoDB : ${err}`));

// -------- Setting up EJS -------->>
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// --------- Bodyparser ---------->>
app.use(express.urlencoded({ extended: false }));

//------------ Express session Configuration ------------>>
app.use(
  session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
  })
);

//------------ Passport Middlewares ------------>>
app.use(passport.initialize());
app.use(passport.session());

// ------------ Connecting flash ------------>>
app.use(flash());

// ------------ Global variables ------------>>
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// ------- Setting up routes ------->>
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

app.listen(port, (err)=> {
  if(err) {
    console.log(`Error starting the server at ${port}: ${err}`);
  }
    console.log(`Server started at port ${port}`);
})