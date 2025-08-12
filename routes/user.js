const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderRegister)
    .post(users.register);

router.route('/login')
    .get(storeReturnTo, users.renderLogin)
    .post(
        storeReturnTo,
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        users.login
    );

router.get('/logout', users.logout);


module.exports = router;
