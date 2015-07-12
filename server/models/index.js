models = [];

module.exports = function() {
    models.forEach( function(model) { require(model)(); } );
};