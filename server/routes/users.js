var mongoose = require('mongoose');
var router = require('express').Router();
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../../config');

router.post('/', function(req, res) {
    var user = new User(req.body);

    if (!user.password) res.status(700).send("Password required");
    else {
        bcrypt.hash(user.password, 8, function (err, hash) {
            user.password = hash;
            user.save(function (err, result) {
                if (err) res.status(500).json(err);
                else res.status(200).json(result);
            });
        });
    }
});

router.post('/authenticate', function(req, res) {
    User.findOne({ name: req.body.name }, function(err, result) {
        if (err) res.status(500).send("An error occured during authentication " + err.toString());
        else {
            if (result === null) res.status(600).send("Invalid username");
            else {
                bcrypt.compare(req.body.password, result.password, function(errBcrypt, equalPasswords) {
                    if (errBcrypt) res.status(500).send("An error occured during authentication " + err.toString());
                    else {
                        if (equalPasswords) {
                            res.json({
                                user: result,
                                token: jwt.sign(result, config.JWT_SECRET, { expiresInMinutes: 1440 })
                            });
                        }
                        else res.status(601).send("Invalid password");
                    }
                });
            }
        }
    });
});

router.use(function(req, res) {
    res.status(404).send("Wrong url");
});

module.exports = router;