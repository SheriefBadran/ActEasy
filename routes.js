/**
 * Created by sheriefbadran on 1/3/15.
 */

var Activity        = require('./models/activity');

module.exports = function(app, passport) {

  // =====================================
  // ACTIVITIES ROUTES =======================
  // =====================================
  // MONGO DB geospatial query
  app.get('/near-activities', function (req, res) {
    console.log(req.param('lng'));
    return Activity.find({
      loc: {
        $geoWithin: {
          $centerSphere: [
            [16.3577567, 56.6775846], 2/6371]
        }
      }
    }, function(err, activities) {

      return res.send(activities);
    });
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/authenticate', isLoggedIn, function(req, res) {

    //res.render('profile.ejs', {
    //  user : req.user // get the user out of session and pass to template
    //});

    res.send(true);

  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  // =====================================
  // GOOGLE ROUTES =======================
  // =====================================
  // send to google to do the authentication
  // profile gets us their basic information including their name
  // email gets their emails

  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

  // the callback after google has authenticated the user
  app.get('/auth/google/callback', passport.authenticate('google', {

    successRedirect : '/#/activities',
    failureRedirect : '/'
  }));
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  console.log('FALSE');
  // if they aren't redirect them to the home page
  //res.redirect('/');
  res.send(401,"User Not Authenticated");
}