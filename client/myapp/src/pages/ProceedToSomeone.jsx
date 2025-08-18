import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCartbyId } from "../features/CartFeatures";
import { addProductFormSomeone } from '../features/ProceedTocheckoutFeature'
import { useFormik } from "formik";
import * as Yup from "yup";

const ProceedToSomeone = () => {
  const { id } = useParams(); // cartId
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);
  const deliveryCharge = 120; // Fixed delivery charge

  // Fetch cart by id
  useEffect(() => {
    dispatch(getCartbyId(id))
      .unwrap()
      .catch((err) => {
        console.error("Cart fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  // Calculate cart total including delivery charge and margin
  const calculateTotal = (margin = 0) => {
    if (!cart?.products) return { subtotal: 0, total: 0 };
    
    const subtotal = cart.products.reduce(
      (acc, item) => acc + item.quantity * (item.product?.price || 0),
      0
    );
    
    const total = subtotal + deliveryCharge + Number(margin);
    return { subtotal, total };
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      country: "Pakistan",
      marginPrice: "",
      paymentMethod: "cashondelivery",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
        .required("Phone is required"),
      address: Yup.string().required("Address is required"),
      city: Yup.string().required("City is required"),
      province: Yup.string().required("Province is required"),
      country: Yup.string().required("Country is required"),
      marginPrice: Yup.number()
        .typeError("Margin price must be a number")
        .min(0, "Margin price cannot be negative")
        .required("Margin price is required"),
      paymentMethod: Yup.string()
        .oneOf(['cashondelivery'], 'Only cash on delivery available')
        .required('Payment method is required'),
    }),
    onSubmit: async (values) => {
      if (!cart || !cart.products || cart.products.length === 0) {
        alert("Cart is empty!");
        return;
      }

      const { total } = calculateTotal(values.marginPrice);

      // Prepare products payload
      const productsPayload = cart.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
        vendor: item.product.userId || item.product.vendor,
      }));

      const orderData = {
        user: cart.user, // The user placing the order
        products: productsPayload,
        vendor: cart.products[0]?.product?.vendor || null, // Main vendor
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        province: values.province,
        country: values.country,
        marginPrice: Number(values.marginPrice),
        price: total, // Total including delivery and margin
        deliveryCharge: deliveryCharge,
        paymentMethod: values.paymentMethod,
      };

      try {
        await dispatch(addProductFormSomeone(orderData)).unwrap();
        alert("Order placed successfully!");
        navigate("/home");
      } catch (error) {
        console.error("Order placement failed:", error);
        alert(error.message || "Something went wrong!");
      }
    },
  });

  // Update total display when margin changes
  useEffect(() => {
    const { total } = calculateTotal(formik.values.marginPrice);
    formik.setFieldValue('price', total, false);
  }, [formik.values.marginPrice]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!cart) return <div className="text-center py-8">No cart found</div>;

  const { subtotal } = calculateTotal(formik.values.marginPrice);

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Proceed to Checkout (For Someone)
      </h2>

      {/* Cart Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
        {cart.products.map((item) => (
          <div key={item._id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.product?.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} × Rs.{item.product?.price.toFixed(2)}
              </p>
            </div>
            <p className="font-medium">
              Rs.{(item.quantity * item.product?.price).toFixed(2)}
            </p>
          </div>
        ))}
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>Rs.{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charge:</span>
            <span>Rs.{deliveryCharge.toFixed(2)}</span>
          </div>
          {formik.values.marginPrice && (
            <div className="flex justify-between">
              <span>Your Margin:</span>
              <span>Rs.{Number(formik.values.marginPrice).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>Rs.{calculateTotal(formik.values.marginPrice).total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Information Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="userName" className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('userName')}
            />
            {formik.touched.userName && formik.errors.userName && (
              <p className="text-red-500 text-sm">{formik.errors.userName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('phone')}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}
          </div>

          {/* Margin Price */}
          <div>
            <label htmlFor="marginPrice" className="block mb-1 font-medium">
              Your Margin (Rs.)
            </label>
            <input
              id="marginPrice"
              name="marginPrice"
              type="number"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('marginPrice')}
            />
            {formik.touched.marginPrice && formik.errors.marginPrice && (
              <p className="text-red-500 text-sm">{formik.errors.marginPrice}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block mb-1 font-medium">
              Country
            </label>
            <select
              id="country"
              name="country"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('country')}
            >
              <option value="Pakistan">Pakistan</option>
            </select>
          </div>

          {/* Province */}
          <div>
            <label htmlFor="province" className="block mb-1 font-medium">
              Province
            </label>
            <select
              id="province"
              name="province"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('province')}
            >
              <option value="">Select Province</option>
              <option value="kpk">KPK</option>
              <option value="punjab">Punjab</option>
              <option value="sindh">Sindh</option>
              <option value="balochistan">Balochistan</option>
            </select>
            {formik.touched.province && formik.errors.province && (
              <p className="text-red-500 text-sm">{formik.errors.province}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block mb-1 font-medium">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('city')}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-500 text-sm">{formik.errors.city}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block mb-1 font-medium">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              className="w-full p-2 border rounded"
              {...formik.getFieldProps('paymentMethod')}
            >
              <option value="cashondelivery">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block mb-1 font-medium">
            Full Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className="w-full p-2 border rounded"
            {...formik.getFieldProps('address')}
          ></textarea>
          {formik.touched.address && formik.errors.address && (
            <p className="text-red-500 text-sm">{formik.errors.address}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mt-4 disabled:opacity-50"
        >
          {formik.isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default ProceedToSomeone;