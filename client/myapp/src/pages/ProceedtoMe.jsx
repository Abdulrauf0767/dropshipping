import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getCartbyId } from '../features/CartFeatures'
import { addProductForme } from '../features/ProceedTocheckoutFeature'
import { useParams } from 'react-router-dom'

const ProceedtoMe = () => {
  const dispatch = useDispatch()
  const { id } = useParams() // cartId from URL
  const { cart } = useSelector((state) => state.cart)

  const deliveryCharge = 120
  const [cartTotal, setCartTotal] = useState(0)

  // ✅ Fetch cart
  useEffect(() => {
    if (id) dispatch(getCartbyId(id))
  }, [id, dispatch])

  // ✅ Calculate cart total
  useEffect(() => {
    if (cart?.products) {
      const total = cart.products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      setCartTotal(total)
      formik.setFieldValue('price', total + deliveryCharge)
    }
  }, [cart])

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    userName: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{7,15}$/, 'Phone must be 7-15 digits')
      .required('Phone is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    province: Yup.string()
      .oneOf(['kpk', 'punjab', 'sindh', 'balochistan'], 'Select valid province')
      .required('Province is required'),
    country: Yup.string().required('Country is required'),
  })

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      country: 'Pakistan',
      price: 0,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (!cart?.products) return

      const orderData = {
        user: cart.user?._id, // from populated user
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        province: values.province,
        country: values.country,
        price: cartTotal + deliveryCharge,
        products: cart.products.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
        vendor: cart.products[0]?.product?.user || cart.products[0]?.product?.vendor, // ✅ FIXED vendor
      }

      dispatch(addProductForme(orderData))
      resetForm()
    },
  })

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 p-10">
      <div className="md:w-[600px] w-full p-6 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Proceed to Checkout</h2>

        {/* ✅ Cart Summary */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Your Cart</h3>
          {cart?.products?.map((item) => (
            <div key={item._id} className="flex justify-between border-b py-2">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity} × Rs {item.product.price}
                </p>
              </div>
              <p className="font-semibold">
                Rs {item.product.price * item.quantity}
              </p>
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <span>Delivery Charge</span>
            <span>Rs {deliveryCharge}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span>Rs {cartTotal + deliveryCharge}</span>
          </div>
        </div>

        {/* ✅ Checkout Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-3">
          {['userName','email','phone','address','city'].map((field)=>(
            <div key={field}>
              <input
                type={field==='email'?'email':'text'}
                name={field}
                placeholder={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-2 rounded w-full"
              />
              {formik.touched[field] && formik.errors[field] && (
                <div className="text-red-500">{formik.errors[field]}</div>
              )}
            </div>
          ))}

          <select
            name="province"
            value={formik.values.province}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border p-2 rounded"
          >
            <option value="">Select Province</option>
            <option value="kpk">KPK</option>
            <option value="punjab">Punjab</option>
            <option value="sindh">Sindh</option>
            <option value="balochistan">Balochistan</option>
          </select>
          {formik.touched.province && formik.errors.province && (
            <div className="text-red-500">{formik.errors.province}</div>
          )}

          <input
            type="text"
            name="country"
            value={formik.values.country}
            disabled
            className="border p-2 rounded bg-gray-100"
          />

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProceedtoMe
