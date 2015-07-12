var router = require('express').Router();
var config = require('../../config');
var express_jwt = require('express-jwt');
var mongoose = require('mongoose');
var Contact = mongoose.model('Contact');
var Agenda = mongoose.model('Agenda');
var crud = require('./helpers/crud');

router.use('/', express_jwt({ secret: config.JWT_SECRET }));

function onDelete(contact_id, res, result) {
    Agenda.update( { contacts: contact_id }, { $pull: { 'contacts': contact_id } }, function(err, resultAgenda) {
        if (err) res.status(500).json(err);
        else res.status(200).json(result);
    });
}

crud.complete(router, Contact, 'user', onDelete);

router.use(function(req, res) {
    res.status(404).send("Wrong url");
});

module.exports = router;