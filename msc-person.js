// Use the following as request handling functions
// Copy then paste then edit
// Assume an entity named "Person"
// and server.js functions that handle the HTTP requests

// Setup
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Entity schema

var personSchema = new Schema({
    userName: {type: String, unique: true},
    familyName: String,
    givenName: String,
    jobTitle: String,
    dateStarted: String,
    dateTermination: String,
    phoneOffice: String,
    phoneMobile: String,
    phoneDevice: String,
    organization: String,
    supervisor: String,
    locationCountry: String,
    locationLocal: String
});

// Make schema available to the application
module.exports = personSchema;
