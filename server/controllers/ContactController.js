let ContactModel = require('../models/Contact.Model');
class contactController {
    async sendMessage (req,res) {
        try {
            let {name,email,subject,message} = req.body
            if (!name || !email || !subject || !message) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            let contact = await ContactModel.create({name,email,subject,message})
            return res.status(200).json({ message: 'Message sent successfully', contact });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    async getAllMessages (req,res) {
        try {
            let messages = await ContactModel.find().sort({ createdAt: -1 });
            return res.status(200).json({ messages });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }

    async deleteMessage (req,res) {
        try {
            let messageId = req.params.id;
            let message = await ContactModel.findByIdAndDelete(messageId);
            if (!message) return res.status(404).json({ message: 'Message not found' });
            return res.status(200).json({ message: 'Message deleted successfully', message });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }
}

module.exports = new contactController();