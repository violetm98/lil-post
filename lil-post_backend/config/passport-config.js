
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/users.model');



passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email })
        .select('password username profileImgURL')

        .exec(
            (err, user) => {
                if (err) {
                    return done(err);
                } else if (!user) {
                    return done(null, false, { message: 'Email does not exist' });
                } else if (!user.verifyPassword(password)) {
                    return done(null, false, { message: 'Incorrect email or password' });
                } else {
                    //console.log(user)
                    return done(null, user);
                }

            })
})


)

