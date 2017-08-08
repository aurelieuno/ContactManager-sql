var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var knex = require('../database.js');
var bcrypt = require('bcrypt-nodejs');
//==========================================================================
module.exports = function (passport) {
//Configuration and Settings//Provided by Passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  knex('users').where({id}).first()
  .then((rows) => { done(null, rows[0]); })
  .catch((err) => { done(err, null); })
});

//Strategies//Provided by Passport
//local-sign-up strategy
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',//match the form html name
  passwordField: 'password',
  passReqToCallback: true,
},
function(req, email, password, done) {

    knex('users').where({email }).first()
    .then((rows) => {
      if (rows.length) {
        return done(null, false, req.flash('signupMessage', 'That email is already taken. Log in?'));
      }
      else {
        const password = generateHash(password);
        knex.insert({'email': email, 'password' : password}).into('users')
        .then(function(err) {
          if (err)
            throw err;
          return done(null, rows[0]);
        });
      }
    })
    .catch((err) => {return done(err)})//node error like no database, server exception
}));

//local-login strategy
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
function(req, email, password, done) {
  knex('users').where({email }).first()
  .then((rows) => {
    if (!rows.length)
        return done(null, false, req.flash('loginMessage', 'No user found. Please sign-up?'));
      //If the credentials are not valid (for example, if the password is incorrect),
      //done should be invoked with false instead of a user to indicate an authentication failure.
    if (! validPasword(rows[0].password,password))
        return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      //If the credentials are valid, the verify callback invokes done to supply Passport with
      //the user that authenticated
    return done(null, rows[0]);
  })
  .catch((err) => {return done(err)})//node error like no database, server exception
}));

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
}
}


/*Configure Passport authenticated session persistence.

In order to restore authentication state across HTTP requests, Passport needs
to serialize users into and deserialize users out of the session.  The
typical implementation of this is as simple as supplying the user ID when
serializing, and querying the user record by ID from the database when
deserializing.

Within the passport module itself i.e. ‘config/passport.js’ we need to ‘serialize’
users to the session and ‘deserialize’ them from the session. ‘passport.serializeUser()’
intercepts the ‘request’ object before it is passed to the route handlers and looks
for the user which matches the provided credentials in the dBase, it then appends
that user’s unique ‘id’ from the dBase (‘_id’ in the case of MongoDB) to the request
cookie before passing the modified request object to the route handler.
If any operation needs to be applied against the user who initiated the request,
passport.desrializeUser() is able to reference the actual user object from the
‘session store’ and make it available as ‘req.user’. These 2 pieces of passport
middleware work in conjunction to make persistent sessions possible.

Passport uses what are termed strategies to authenticate requests.
Strategies range from verifying a username and password, delegated authentication using OAuth
 or federated authentication using OpenID.

Before asking Passport to authenticate a request, the strategy (or strategies) used by an application
must be configured.

Strategies, and their configuration, are supplied via the use() function.
For example, the following uses the LocalStrategy for username/password authentication.*/
