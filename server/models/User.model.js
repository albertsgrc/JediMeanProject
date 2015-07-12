var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {

    userSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            match: /^[a-z0-9_-]{3,16}$/
        },
        password: {
            type: String,
            minlength: 2,
            maxlength: 100,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    userSchema.index({ name: 1 }, { unique: true });


    userSchema.pre('update', function(next) {
        this.options.runValidators = true;
        next();
    });

    mongoose.model('User', userSchema);
};