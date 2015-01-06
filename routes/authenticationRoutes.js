/**
 * Created by sheriefbadran on 1/5/15.
 */
module.exports = function(app, passport) {

  // =====================================
  // AUTHENTICATE SECTION ================
  // =====================================
  // This must be protected, user has to be logged in to visit
  // We use route middleware to verify with the isLoggedIn function
  app.get('/authenticate', isLoggedIn, function(req, res) {

    // Respond with user.
    res.send(req.user);

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
  // profile gets us basic user information including user name
  // email gets user email
  // TODO: Check for other google scopes.

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
  // if not, return status 401.
  //res.redirect('/');
  res.send(401,"User Not Authenticated");
}