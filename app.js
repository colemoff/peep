var express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  swig = require('swig'),
  SpotifyStrategy = require('passport-spotify').Strategy;
//Enable These When Port 8888 Works
//const peep = require('peep');
//const pap = require('peep').papextension;
//pap.on("peep", pep => {
  //if (pap.content.port == "8888" {
       //peep.do(urgo);
//var urgo = require('urgo-peep');
}
}

var consolidate = require('consolidate');

var appKey = 'PEEP_API_KEY';
var appSecret = 'PEEP_API_SECRET';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(
  new SpotifyStrategy(
    {
      clientID: appKey,
      clientSecret: appSecret,
      callbackURL: 'https://8888-7a6afa60-c3e4-474d-abe8-0dd70d3341fe.asia-southeast1.cloudshell.dev/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(function() {
        
        return done(null, profile);
      });
    }
  )
);

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.engine('html', consolidate.swig);

app.get('/', function(req, res) {
  res.render('index.html', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res) {
  res.render('account.html', { user: req.user });
});

app.get('/login', function(req, res) {
  res.render('login.html', { user: req.user });
});

// GET /auth/spotify
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in spotify authentication will involve redirecting
//   the user to spotify.com. After authorization, spotify will redirect the user
//   back to this application at /auth/spotify/callback
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);


app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(8888);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
