let mongoose = require('mongoose');
let vendorSchema = new mongoose.Schema({
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeLogo:{
        type: String,
        required: true
    },
    storeName :{
        type: String,
        required: true
    },
    storeDescription:{
        type: String,
        required: true
    },
    phoneNumber :{
        type: Number,
        required: true
    },
    CNIC :{
        type: Number,
        required: true
    },
    cnicFrontImage :{
        type: String,
        required: true
    },
    cnicBackImage :{
        type: String,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    city :{
        type: String,
        required: true
    },
    transactionImage :{
        type: String,
        required: true
    },
    postalCode :{
        type: Number,
        required: true
    },
    accountNumber :{
        type: String,
        required: true
    },
    country :{
        type: String,
        required: true
    },
    websiteURL :{
        type: String,
    },
    status : {
      type : String,
      required : true,
      enum : ['pending','approved','rejected'], 
      default : 'pending' 
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    isBlocked : {
        type: Boolean,
        default: false
    }

},{timestamps: true});
let VendorModel = mongoose.model('Vendor', vendorSchema);
module.exports = VendorModel;