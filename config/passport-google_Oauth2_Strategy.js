const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: "797549720048-tpr3jvdsqsdced2nkjrodh7hmcbjqi2r.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqTocallback : true
    },

    async function(req, accessToken, refreshToken, profile, done){
      try{
        const existingUser = await User.findOne({email: profile.emails[0].value});
        if(existingUser) {
          console.log("User already exists");
          return done(null, existingUser);
        }
        const newUser = await User.create({
          name : profile.displayName,
          email: profile.emails[0].value,
          password: crypto.randomBytes(20).toString('hex'),
        });

        if(newUser){
          return done(null, newUser);
        }
      } catch (err) {
        console.log('error in google strategy-passport', err);
        return; 
      }

    }


));

// Serialize the user into the session (only save the user's ID)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

/*         
          User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){console.log('error in google strategy-passport', err); return;}
            console.log(accessToken, refreshToken);
            console.log(profile);

            if (user){
                // if found, set this user as req.user
                return done(null, user);
            }else{
                // if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){console.log('error in creating user google strategy-passport', err); return;}

                    return done(null, user);
                });
            }

        }); 

*/        