let NotificationModel = require('../models/Notification.Model');

class notificationController {
    async getNotifications(req, res) {
        try {
            const notification = await NotificationModel.find({ user: req.user._id }).populate('product');
            return res.status(200).json({ notification, message: 'Notifications fetched successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }

    async markAsRead (req,res) {
        try {
            let notificationId = req.params.id;
            let notification = await NotificationModel.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            notification.isRead = true;
            await notification.save();
            return res.status(200).json({ message: 'Notification marked as read successfully', notification });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }
}

module.exports = new notificationController();