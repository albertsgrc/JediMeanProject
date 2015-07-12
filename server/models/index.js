models = ['Agenda.model', 'Contact.model', 'User.model'];

module.exports = function() {
    models.forEach( function(model) { require('./' + model)(); } );
};