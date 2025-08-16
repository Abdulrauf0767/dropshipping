let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    userId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'User',
      required : true  
    },
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    discountPrice : {
        type : Number,
    },
    brand : {
        type : String,
    },
    category : {
        type : String,
        required : true,
        enum : ["watch","hoodies","electric","furniture"]
    },
    stock : {
        type : Number,
        required : true
    },
    sizes : {
        type : Array,
    },
    color : {
        type : Array,
    },
    image : {
        type : Array,
        required : true
    },
    tags : {
        type : Array,
        required : true
    },
    isActive : {
        type : Boolean,
        default : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
}, {timestamps : true});

let ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;