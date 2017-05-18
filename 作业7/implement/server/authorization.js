const Account = require('./models/account');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
    (id, password, done) => {
        Account.login({id, password}).then(
            user => done(null, user), 
            info => done(null, false, { message: info }));
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;