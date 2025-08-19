import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createOrder, createOrderForSomeone } from '../features/BuyNowForMeFeatures'; // adjust path if needed
import { useParams } from 'react-router-dom';

const BuyNowForSomeone = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // URL param 'id'
  const [productPrice, setProductPrice] = useState(0);
  const deliveryCharge = 120;

  // Fetch product data by id from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/product/getbyid/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        if (data && data.product) {
          setProductPrice(data.product.price);
          formik.setFieldValue('price', data.product.price);
          formik.setFieldValue('total', data.product.price + deliveryCharge);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const validationSchema = Yup.object({
    userName: Yup.string().required('Name is required'),
    marginPrice: Yup.number()
      .min(0, 'Margin price cannot be negative')
      .required('Margin price is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{7,15}$/, 'Phone number must be digits only, 7 to 15 chars')
      .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    province: Yup.string()
      .oneOf(['kpk', 'punjab', 'sindh', 'balochistan'], 'Select a valid province')
      .required('Province is required'),
    postalCode: Yup.string().required('Postal code is required'),
    productColor: Yup.string().required('Product color is required'),
    productSize: Yup.string(),
    paymentMethod: Yup.string()
      .oneOf(['cashondelivery'], 'Choose a valid payment method')
      .required('Payment method is required'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      marginPrice: "",
      phone: '',
      price: productPrice,
      address: '',
      city: '',
      country: 'Pakistan',
      province: '',
      postalCode: '',
      productColor: '',
      productSize: '',
      quantity: 1,
      paymentMethod: '',
      deliveryCharge,
      total: productPrice + deliveryCharge,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values,{resetForm}) => {
      const orderData = {
        ...values,
        productId: id, // Important fix: send productId with the value from URL param 'id'
      };
      dispatch(createOrderForSomeone(orderData));
      resetForm();
    },
  });

  // Update price and total if productPrice changes
  useEffect(() => {
    formik.setFieldValue('price', productPrice);
    formik.setFieldValue('total', productPrice + deliveryCharge);
  }, [productPrice]);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-10">
      <div className="md:w-[500px] w-full h-auto p-6 bg-white rounded-md shadow-md">
        <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-y-3">

          {/* Name */}
          <label htmlFor="userName">Name</label>
          <input
            id="userName"
            name="userName"
            type="text"
            placeholder="Enter Your Name"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.userName && formik.errors.userName && (
            <div className="text-red-500">{formik.errors.userName}</div>
          )}

          {/* Email */}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Your Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500">{formik.errors.email}</div>
          )}

          {/* Phone */}
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            placeholder="Enter Your Phone Number without spaces"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.phone && formik.errors.phone && (
            <div className="text-red-500">{formik.errors.phone}</div>
          )}
          
          {/* Price (disabled) */}
          <label htmlFor="marginPrice"> Margin Price</label>
          <input
            id="marginPrice"
            name="marginPrice"
            type="number"
            value={formik.values.marginPrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder='Enter Margin Price'
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
           {formik.touched.marginPrice && formik.errors.marginPrice && (
            <div className="text-red-500">{formik.errors.marginPrice}</div>
          )}


          {/* Price (disabled) */}
          <label htmlFor="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            value={formik.values.price}
            disabled
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Address */}
          <label htmlFor="address">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Enter Your Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500">{formik.errors.address}</div>
          )}

          {/* City */}
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="Enter Your City"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.city && formik.errors.city && (
            <div className="text-red-500">{formik.errors.city}</div>
          )}

          {/* Country (disabled) */}
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            type="text"
            value={formik.values.country}
            disabled
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Province */}
          <label htmlFor="province">Province</label>
          <select
            id="province"
            name="province"
            value={formik.values.province}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          >
            <option value="" disabled>
              Choose Your Province
            </option>
            <option value="kpk">KPK</option>
            <option value="punjab">Punjab</option>
            <option value="sindh">Sindh</option>
            <option value="balochistan">Balochistan</option>
          </select>
          {formik.touched.province && formik.errors.province && (
            <div className="text-red-500">{formik.errors.province}</div>
          )}

          {/* Postal Code */}
          <label htmlFor="postalCode">Postal Code</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            placeholder="Enter Your Postal Code"
            value={formik.values.postalCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.postalCode && formik.errors.postalCode && (
            <div className="text-red-500">{formik.errors.postalCode}</div>
          )}

          {/* Product Color */}
          <label htmlFor="productColor">Product Color</label>
          <input
            id="productColor"
            name="productColor"
            type="text"
            placeholder="Enter Product Color"
            value={formik.values.productColor}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />
          {formik.touched.productColor && formik.errors.productColor && (
            <div className="text-red-500">{formik.errors.productColor}</div>
          )}

          {/* Product Size */}
          <label htmlFor="productSize">Product Size (optional)</label>
          <input
            id="productSize"
            name="productSize"
            type="text"
            placeholder="Enter Product Size"
            value={formik.values.productSize}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Quantity (disabled) */}
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            value={formik.values.quantity}
            disabled
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Payment Method */}
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          >
            <option value="" disabled>
              Choose Your Payment Method
            </option>
            <option value="cashondelivery">Cash On Delivery</option>
          </select>
          {formik.touched.paymentMethod && formik.errors.paymentMethod && (
            <div className="text-red-500">{formik.errors.paymentMethod}</div>
          )}

          {/* Delivery Charge (disabled) */}
          <label htmlFor="deliveryCharge">Delivery Charge</label>
          <input
            id="deliveryCharge"
            name="deliveryCharge"
            type="number"
            value={formik.values.deliveryCharge}
            disabled
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Total (disabled) */}
          <label htmlFor="total">Total</label>
          <input
            id="total"
            name="total"
            type="number"
            value={formik.values.total}
            disabled
            className="w-full h-10 p-2 border-2 border-gray-400 rounded-md"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            disabled={formik.isSubmitting}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyNowForSomeone;
