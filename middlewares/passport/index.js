import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../modules/user.js";
import { createHash, comparePassword } from "../../utils/index.js";

passport.use('login', new LocalStrategy({
},
    async (username, password, done) => {
        const user = await User.findOne({
            $or: [
                { 'username': username.toLowerCase() },
                { 'email': username.toLowerCase() }]
        })

        if (!user) {
            console.log('User Not Found with username ' + username);
            return done(null, false);
        }

        if (!comparePassword(password, user.password)) {
            console.log('Invalid Password');
            return done(null, false);
        }

        return done(null, user);
    }
));

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
    (req, username, password, done) => {


        User.findOne({
            $or: [
                { 'username': username.toLowerCase() },
                { 'email': req.body.email.toLowerCase() }
            ]
        }, (err, user) => {
            if (err) {
                console.log('Error: ' + err);
                return done(err);
            }

            if (user) {
                console.log('User already exists');
                return done(null, false);
            }

            const newUser = {
                username: username.toLowerCase(),
                password: createHash(password),
                email: req.body.email.toLowerCase(),
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }

            User.create(newUser, (err, userWithId) => {
                if (err) {
                    console.log('Error guardando el usuario: ' + err);
                    return done(err);
                }
                console.log('Registro exitoso');
                return done(null, userWithId);
            });

        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, done);
})