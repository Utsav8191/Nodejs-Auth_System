const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//------------ Importing user model ------------//
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //------------ User matching ------------>>
            User.findOne({
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Email Id not registered' });
                }

                //------------ Password matching ------------>>
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {                        
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Password incorrect! Please try again.' });
                    }
                });
                // const isPassword = bcrypt.compareSync(password, user.password);
                // if(!isPassword){return done(null, false,{message: 'password incorrect! try again'})};
                // return done(null, user)
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};