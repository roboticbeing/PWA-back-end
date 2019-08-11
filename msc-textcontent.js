var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);


var textContentSchema = new Schema ({
    slug: {type: String, unique: true},
    language: String,
    timestamp: String,
    visibility: [{type: String}], //empty for anonymous, rwx permissions
    content: String //as HTML
})


// Make schemas available to the application
module.exports = textContentSchema;

