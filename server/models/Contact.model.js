var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    contactSchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            match: /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,20}$/
        },
        surname: {
            type: String,
            required: true,
            trim: true,
            match: /^[^±!@£$%^&*_+§¡€#¢§¶•ªº«\\/<>?:;|=.,]{1,60}$/
        },
        company: {
            type: String,
            trim: true
        },
        telephone: {
            type: String,
            trim: true,
            match: /[0-9]{9}/
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