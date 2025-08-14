let mongoose = require('mongoose');

let notificationSchema = new mongoose.Schema({
    user :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    product :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    message : {
        type : String,
        required : true
    },
    notificationType : {
        type : String,
        required : true,
        enum : ['alert','order','pormotion']
    },
    isRead : {
        type : Boolean,
        default : false
    },
    link :{
        type : String
    }
    
})

let NotificationModel = mongoose.model('Notification', notificationSchema);
module.exports = NotificationModel;