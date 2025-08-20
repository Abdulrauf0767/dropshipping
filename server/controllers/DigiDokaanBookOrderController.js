let DigiDokanBookOrderModel = require('../models/DigiDokan.BookOrder.Model');
let axios = require('axios');
require('dotenv').config();
class DigiDokanBookOrderController {
    async create (req, res) {
        try {
            let {seller_number,buyer_number,buyer_name,buyer_address,buyer_city,piece,amount,special_instruction,product_name,store_url,business_name,origin,gateway_id,shipper_address,shipper_name,shipper_phone,shipment_type,externel_reference_no,weight,other_product,pickup_id,source} = req.query;
            if (!seller_number || buyer_number || buyer_name || buyer_address || buyer_city || piece || amount || special_instruction || product_name || store_url || business_name || origin || gateway_id || shipper_address || shipper_name || shipper_phone || shipment_type || weight || other_product || pickup_id || source  ) return res.status(400).json({ message: "All fields are required" }); 
                
            let bookOrder = await new DigiDokanBookOrderModel({
                seller_number : process.env.Digi_Dokan_Phone ,
                buyer_number,
                buyer_name,
                buyer_address,
                buyer_city,
                piece,
                amount,
                special_instruction,
                product_name,
                store_url,
                business_name,
                origin,
                gateway_id,
                shipper_address,
                shipper_name,
                shipper_phone,
                shipment_type,
                externel_reference_no,
                weight,
                other_product,
                pickup_id,
                source
            })
            await bookOrder.save();
            return res.status(200).json({ message: "Book order created successfully", bookOrder });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    async getCities (req,res) {
        try {
            let login = await axios.post('https://dev.digidokaan.pk/api/v1/digidokaan/auth/login',{
             phone : process.env.Digi_Dokan_Phone,
             password : process.env.Digi_Dokan_Password,    
            },{
                headers : {
                    'Content-Type': 'application/json',
                }
            })
            let data = await login.data.token;
            console.log(login);
            let refreshToken = await axios.post('https://dev.digidokaan.pk/api/v1/digidokaan/auth/refresh_token',{},{
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data}`
                }
            })
            let token = await refreshToken.data.token;
            
            
            let cities = await axios.post('https://dev.digidokaan.pk/api/v1/digidokaan/cities',{
                shipment_type : 1,
                gateway_id : 3,
                courier_bulk : 1
            },{
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            let pickupId = await axios.post('https://dev.digidokaan.pk/api/v1/digidokaan/get-pickUp-address',{
                params :{
                    source : 'https://dev.digidokaan.pk/api/v1/digidokaan',
                    gateway_id : 3
                }
            },{
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.status(200).json({ 
                message: "Cities fetched successfully", 
                cities: cities.data, 
                pickupId: pickupId.data 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Something went wrong" });
        }
    }

    
}

module.exports = new DigiDokanBookOrderController();