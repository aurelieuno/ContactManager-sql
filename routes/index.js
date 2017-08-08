var express = require('express');
var passport = require('passport');
var router = express.Router();
var knex = require('../database.js');
var async = require('async');


//////////////////////Root route////////////////////////////
/* GET request for getting root. */
router.get('/', function(req, res, next) {
    res.render('welcome');
 })
//////////////////////Authentication Routes////////////////////////////
//needed to protect the '/dashboard' route
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}


router.get('/login', function(req, res, next) {
  res.render('login.pug', { message: req.flash('loginMessage') });//messages defined in passport.js
});

router.get('/signup', function(req, res) {
  res.render('signup.pug', { message: req.flash('signupMessage') });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/dashboard',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

///////////////////////////////////////////////////////////////////////
router.get('/dashboard', isLoggedIn, function(req, res, next) {
    console.log("req.user: "+req.user);
    console.log(req.session);

    if(req.session.page_views){
     req.session.page_views++;
    }else{
       req.session.page_views = 1;
    }

    knex('contacts').where({"user_id": req.user.id})
    .then((rows) => {
    console.log(rows);
    res.render('dashboard', {contact : rows, email :req.user.email, pagenb : req.session.page_views});
  })
    .catch((err) => { done(err, null); });
});
/////////////////////////////////////////////////////////////////////////
router.get('/viewuser', isLoggedIn, function(req, res, next) {

    knex('users').orderBy('email', 'desc')
    .then((rows) => {
      res.render('users_list', { title: 'Users List', user_list: rows });
    })
    .catch((err) => { done(err, null); })
});

router.post('/viewcontact', isLoggedIn, function(req, res, next) {

    async.parallel({
    contact: knex('contacts').where({"user_id": req.body.user}),
    user: knex.select().table('users')
  }, function(err, results) {
    if (err) { return next(err); }
    //Successful, so render
    res.render('userscontact_list', { title: 'Users List', contact_list: results.contact, user_list: results.user });
  });

});

//////////////////////Dashboard Routes////////////////////////////
/* Special GET request for getting/importing the mongoose contact data in the script file. */
router.get('/dashboard/ajax', isLoggedIn, function(req, res, next) {
  knex('contacts').where({"user_id": req.user.id})
  .then((rows)=>{res.send(rows)})
  .catch((err) => { done(err, null); })
 });
///////////////////////////////////////////////////////////////////

/* POST request for creating Contact. */
router.post('/dashboard', isLoggedIn, function(req, res, next) {

  console.log("req.user.id: "+ req.user.id)

    var contact = new Contact(
      {  name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         usernameid: req.user._id,//The contact have the userid field to find them later on
       });

        //Check if contact with same name already exists
        Contact.findOne({"_id" : req.body._id})
            .exec( function(err, found_contact) {
                 console.log('found_contact: ' + found_contact);
                 if (err) { return next(err); }

                 if (found_contact) {
                     //Genre exists, redirect to its detail page
                     res.send("Contact already exists")
                 }
                 else {
                     contact.save(function (err, contact) {
                       if (err) { return next(err); }
                       console.log(contact);

                       res.redirect("/dashboard");
                     });
                 }
             });
    });


/* POST request for updating Contact. */
router.post('/dashboard/update', isLoggedIn, function(req, res, next) {

  Contact.findOneAndUpdate({"_id" : req.body._id},
    {  name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       }, function updateContact(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
});

/* POST request for deleting Contact. */
router.post('/dashboard/delete', isLoggedIn, function(req, res, next) {

  Contact.findOneAndRemove({"_id" : req.body._id}, function deleteContact(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
});

module.exports = router;






/* POST request for creating Contact.
router.post('/dashboard', contact_controller.contact_create_post);

 POST request for updating Contact.
router.post('/update', contact_controller.contact_update_post);

 POST request for deleting Contact.
router.post('/delete', contact_controller.contact_delete_post);*/



/*POST /login 302 261.446 ms - 64
{ _id: 59484bbc890ff911e039e4dc,
  password: '$2a$08$XIXaB.T6uhUadonc4feyP.kY141RBH2MTR9oltZ3bfUuVTELyOy3a'
  email: 'alebec@gmail.com',
  __v: 0 }*/


/*req.user: { _id: 594922bb3945681ce48b5e54,
  password: '$2a$08$0OdGKwIUVyciPL7pJZiv9eVkLxgDAooVVqvhFEaXGyC8Ca5GjxiRe',
  email: 'alebec@gmail.com',
  __v: 0 }
Session {
  cookie:
   { path: '/',
     _expires: null,
     originalMaxAge: null,
     httpOnly: true },
  flash: {},
  passport: { user: '594922bb3945681ce48b5e54' } }*/









/*[ { _id: 594922ce3945681ce48b5e55,
    name: 'Maria Ghuio',
    email: 'mg@gmail.com',
    phone: '5041236547',
    usernameid: '594922bb3945681ce48b5e54',
    __v: 0 },
  { _id: 594922ed3945681ce48b5e56,
    name: 'Thomas Dupont',
    email: 'td@gmail.com',
    phone: '5041236547',
    usernameid: '594922bb3945681ce48b5e54',
    __v: 0 },
  { _id: 5949230d3945681ce48b5e57,
    name: 'Liliane Rewer',
    email: 'lr@gmail.com',
    phone: '5041236547',
    usernameid: '594922bb3945681ce48b5e54',
    __v: 0 },
  { _id: 594925041abb921cecc17784,
    name: 'Catty',
    email: 'ct@gmail.com',
    phone: '5144569874',
    usernameid: '594924e31abb921cecc17783',
    __v: 0 },
  { _id: 594925131abb921cecc17785,
    name: 'Barry',
    email: 'be@gmail.com',
    phone: '5041234569',
    usernameid: '594924e31abb921cecc17783',
    __v: 0 },
  { _id: 594925201abb921cecc17786,
    name: 'Marta',
    email: 'bn@gmail.com',
    phone: '5041236547',
    usernameid: '594924e31abb921cecc17783',
    __v: 0 } ]*/