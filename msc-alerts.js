var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);


var alertSchema = new Schema ({
    shortName: String,
    category: String,
    dateCreated: String,
    dateExpired: String,
    targetCountry: String,
    targetRegion: String,
    visibility: [{type: String}],
    content: String
})


// Make schemas available to the application
module.exports = alertSchema;

