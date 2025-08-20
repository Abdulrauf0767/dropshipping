let mongoose = require('mongoose');

let digiDokaanBookOrderSchema = new mongoose.Schema({
    seller_number : {
        type : Number,
        required : true
    },
    buyer_number :{
        type : Number,
        required : true
    },
    buyer_name :{
        type : String,
        required : true
    },
    buyer_address :{
        type : String,
        required : true
    },
    buyer_city :{
        type : Number,
        required : true
    },
    piece : {
        type : Number,
        required : true
    },
    amount :{
        type : Number,
        required : true
    },
    special_instruction :{
        type : String,
        required : true
    },
    product_name :{
        type : String,
        required : true
    },
    store_url :{
        type : String,
        required : true
    },
    business_name :{
        type : String,
        required : true
    },
    origin :{
        type : String,
        required : true
    },
    gateway_id :{
        type : Number,
        required : true
    },
    shipper_address :{
        type : String,
        required : true
    },
    shipper_name:{
        type : String,
        required : true
    },
    shipper_phone : {
        type : Number,
        required : true
    },
    shipment_type :{
        type : Number,
        required : true,
        enum : [1,2,3],
        default : 1
    },
    external_reference_no:{
        type : Number,
    },
    weight :{
        type : Number,
        required : true
    },
    other_product:{
        type : Boolean,
        default : true
    },
    pickup_id :{
        type : Number,
        required : true
    },
    source : {
        type : String,
        required : true,
        default : 'HM MART CENTER'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
},{timestamps : true});

let DigiDokanBookOrderModel = mongoose.model('DigiDokanBookOrder', digiDokaanBookOrderSchema);
module.exports = DigiDokanBookOrderModel;