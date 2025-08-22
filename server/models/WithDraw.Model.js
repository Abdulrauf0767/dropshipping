let mongoose = require('mongoose');

let withdrawSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankNumber : {
        type : String,
        required : true
    },
    bankName : {
        type : String,
        required : true
    },
    bankType : {
        type : String,
        required : true,
        enum : ['JazzCash','MeezanBank','Easypaisa','other']
    },
    amount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ['pending','approved','rejected'],
        default : 'pending'
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
}, { timestamps: true });
let WithdrawModel = mongoose.model('Withdraw', withdrawSchema);
module.exports = WithdrawModel;