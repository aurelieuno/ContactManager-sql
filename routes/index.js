var express = require('express');
var passport = require('passport');
var router = express.Router();
var knex = require('../database.js');
var async = require('async');


//////////////////////Root route////////////////////////////
/* GET request for getting root. */
router.get('/', function(req, res, next) {
    res.render('welcome');
    knex.select('*').from('users')
    .then(function(rows) {
      console.log("home");
      console.log(rows);
    })
    .catch((err) => { console.log(err) })
 })
//////////////////////Authentication Routes////////////////////////////
//needed to protect the '/dashboard' route
function isLoggedIn(req, res, next) {

  console.log(req.isAuthenticated())
  if(req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/dashboard');

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
    console.log("dash.req.user");
    console.log(req.user);
/*    { id: 7,
  email: 'alebec7@gmail.com',
  password: '$2a$08$fhfnVqq76WB2Kgh832ndquQpMuJ8DNwNsfIqDqCPe100KluyjnLqS' }*/
    console.log(req.session.passport);
    console.log(req.session[passport._key].user);

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

    const user = knex.select().table('users')
    const contact = knex('contacts').where({"user_id": req.body.user})

    Promise.all([user,contact])
    .then((values)=> {
      console.log(values[0],values[1])
      res.render('userscontact_list', { title: 'Users List', contact_list: values[1], user_list: values[0] })
    })
    .catch((err)=> console.log(err))

  });



//////////////////////Dashboard Routes////////////////////////////
/* Special GET request for getting/importing the mongoose contact data in the script file. */
router.get('/dashboard/ajax', isLoggedIn, function(req, res, next) {
  console.log("ajax.req.user");
  console.log(req.user);
  knex('contacts').where({"user_id": req.user.id})
  .then((rows)=>{res.send(rows)})
  .catch((err) => { done(err, null); })
 });
///////////////////////////////////////////////////////////////////

/* POST request for creating Contact. */
router.post('/dashboard', isLoggedIn, function(req, res, next) {

  console.log("req.user.id: "+ req.user.id)
  console.log(req.body)

        //Check if contact with same name already exists
        knex("contacts").where({"email" : req.body.email}).first()
        .then((rows)=> {
          if (rows) {
            res.send("Contact already exists")
          }
          else {
            knex.insert({"name" : req.body.name, "email": req.body.email, "phone":req.body.phone, "user_id":req.user.id}).into('contacts')
            .then((rows)=>{res.redirect("/dashboard")})
            .catch((err)=>console.log(err))
          }
        })
        .catch((err)=>console.log(err))
    });


/* POST request for updating Contact. */
router.post('/dashboard/update', isLoggedIn, function(req, res, next) {

  knex('contacts')
  .where({"id" : req.body.id})
  .update({  name: req.body.name,
             email: req.body.email,
             phone: req.body.phone
           })
  .then((rows)=>res.send("ok"))
  .catch((err)=>console.log(err))

});

/* POST request for deleting Contact. */
router.post('/dashboard/delete', isLoggedIn, function(req, res, next) {
  console.log(req.body)

  knex('contacts')
  .where({"id" : req.body.id})
  .del()
  .then((rows)=>res.send(req.body))
});

module.exports = router;






