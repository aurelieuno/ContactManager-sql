var Contact = require('../models/contact');

var async = require('async');



exports.contact_create_get = function(req, res, next) {
    res.render('layout');
 }

exports.contact_create_getajax = function(req, res, next) {

   Contact.find({},function(err, docs) {
    if (err) { return next(err); }
    //console.log(docs);
    res.send(docs);
  })
 }

exports.contact_create_post = function(req, res, next) {

    var contact = new Contact(
      {  name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
       });

        //Check if contact with same name already exists
        Contact.findOne({ 'name': req.body.name, 'email': req.body.email})
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
    }

exports.contact_delete_post = function(req, res, next) {

  Contact.findOneAndRemove({"name" : req.body.name}, function deleteContact(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
};

exports.contact_update_post = function(req, res, next) {

  Contact.findOneAndUpdate({"_id" : req.body._id},
    {  name: req.body.name,
       email: req.body.email,
       phone: req.body.phone,
       }, function updateContact(err, results) {
    if (err) { return next(err); }
    res.send(results);
  })
};