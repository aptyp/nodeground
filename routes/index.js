var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// http://mherman.org/blog/2015/01/31/local-authentication-with-passport-and-express-4/#.VminV8oRffA

/*
router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});
*/

router.get('/register', function(req, res) {
    res.render('register', { title: 'Register for Awesome Gallery'});
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user, title: 'Login to Awesome Gallery'});
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;

