let mongoose = require('mongoose');

let buynowForMeSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Product',
            required : true
        }
    ],
    vendor :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    marginPrice : {
        type : Number,
    },
    address :{
        type : String,
        required : true
    },
    city : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    province : {
        type : String,
        required : true,
        enum :['kpk','punjab','sindh','balochistan']
    },
    postalCode : {
        type : Number,
        required : true
    },
    productColor :{
        type : String,
        required : true
    },
    productSize : {
        type : String,
    },
    quantity : {
        type : Number,
        required : true
    },
    paymentMethod : {
        type : String,
        required : true,
        enum : ['cashondelivery']
    },
    deliveryCharge : {
        type : Number,
        required : true,
    },
    total : {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        required : true,
        enum : ['pending','processing','shipped','delivered'],
        default : 'pending'
    },
    paymentStatus : {
        type : String,
        required : true,
        enum : ['pending','paid'],
        default : 'pending'
    }
})

let BuyNowForMeModel = mongoose.model('BuyNowForMe', buynowForMeSchema);
module.exports = BuyNowForMeModel;