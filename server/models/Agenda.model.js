var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    agendaSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true
        },
        contacts: [ { type: Schema.Types.ObjectId, ref: 'Contact' } ],
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    agendaSchema.index({ name: 1, user: 1 }, { unique: true });

    agendaSchema.pre('update', function(next) {
        this.options.runValidators = true;
        next();
    });

    mongoose.model('Agenda', agendaSchema);
};