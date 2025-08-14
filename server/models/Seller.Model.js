let mongoose = require('mongoose');
let sellerSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneNumber :{
        type: Number,
        required: true
    },
    bankNumber : {
        type: String,
        required: true
    }
}, { timestamps: true });
let SellerModel = mongoose.model('Seller', sellerSchema);
module.exports = SellerModel;