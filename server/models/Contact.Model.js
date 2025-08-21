let mongoose = require('mongoose');

let contactSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    subject : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    }
})
let ContactModel = mongoose.model('Contact', contactSchema);
module.exports = ContactModel;