var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    contactSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            match: /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,30}$/
        },
        surname: {
            type: String,
            required: true,
            trim: true,
            match: /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,60}$/
        },
        company: {
            type: String,
            minlength: 1,
            maxlength: 100,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            match: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        },
        telephone: {
            type: String,
            trim: true,
            match: /^([0-9]{9})$/
        },
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

    contactSchema.index({ name: 1, surname: 1, user: 1 }, { unique: true });

    contactSchema.pre('update', function(next) {
        this.options.runValidators = true;
        next();
    });

    mongoose.model('Contact', contactSchema);
};