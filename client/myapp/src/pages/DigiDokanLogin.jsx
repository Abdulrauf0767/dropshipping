// DigiDokanLogin.jsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Paper } from '@mui/material'
import { getCities } from '../features/DigiDokanFeatures'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const DigiDokanLogin = () => {
  const dispatch = useDispatch()
  const { cities, loading, error } = useSelector((state) => state.digi)

  useEffect(() => {
    dispatch(getCities())
  }, [dispatch])

  // Overnight cities list
  const cityList = Array.isArray(cities?.cities?.data?.Overnight)
    ? cities.cities.data.Overnight
    : []

  // Yup Validation Schema
  const validationSchema = Yup.object({
    buyer_number: Yup.string()
      .matches(/^\+92\d{10}$/, 'Number must start with +92 and have 12 digits total')
      .required('Buyer number is required'),
    buyer_name: Yup.string().required('Buyer name is required'),
    buyer_address: Yup.string().required('Buyer address is required'),
    buyer_city: Yup.string().required('Please select a city'),
    piece: Yup.number().required('Piece is required').min(1, 'Minimum 1 piece'),
    amount: Yup.number().required('Amount is required').min(1, 'Enter valid amount'),
    special_instruction: Yup.string(),
    product_name: Yup.string().required('Product name is required'),
    store_url: Yup.string().url('Invalid URL').required('Store URL is required'),
    business_name: Yup.string().required('Business name is required'),
    origin: Yup.string().required('Origin is required'),
    shipper_address: Yup.string().required('Shipper address is required'),
    shipper_name: Yup.string().required('Shipper name is required'),
    shipper_phone: Yup.string()
      .matches(/^\d+$/, 'Only digits allowed')
      .required('Shipper phone is required'),
    shipment_type: Yup.string().required('Select shipment type'),
    external_reference_no: Yup.string().required('Reference number required'),
    weight: Yup.number().required('Weight is required'),
    pickup_id: Yup.number().required('Pickup ID is required')
  })

  // Formik
  const formik = useFormik({
    initialValues: {
      buyer_number: '+92',
      buyer_name: '',
      buyer_address: '',
      buyer_city: '',
      piece: '',
      amount: '',
      special_instruction: '',
      product_name: '',
      store_url: '',
      business_name: '',
      origin: '',
      gateway_id: 3,
      shipper_address: '',
      shipper_name: '',
      shipper_phone: '',
      shipment_type: '',
      external_reference_no: '',
      weight: '',
      pickup_id: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form Submitted:', values)
    }
  })

  // Prevent spaces in number inputs
  const handleNumberInput = (e) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <Container
        maxWidth='xl'
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 3,
            maxWidth: 500,
            height: '100%'
          }}
        >
          <form
            className='w-full h-full flex flex-col items-start gap-y-3'
            onSubmit={formik.handleSubmit}
          >
            <label htmlFor='buyer_number'>Buyer Number</label>
            <input
              type='text'
              name='buyer_number'
              id='buyer_number'
              placeholder='+92xxxxxxxxxx'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('buyer_number')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.buyer_number && formik.errors.buyer_number && (
              <div className='text-red-500 text-sm'>{formik.errors.buyer_number}</div>
            )}

            <label htmlFor='buyer_name'>Buyer Name</label>
            <input
              type='text'
              name='buyer_name'
              id='buyer_name'
              placeholder='Buyer Name'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('buyer_name')}
            />
            {formik.touched.buyer_name && formik.errors.buyer_name && (
              <div className='text-red-500 text-sm'>{formik.errors.buyer_name}</div>
            )}

            <label htmlFor='buyer_address'>Buyer Address</label>
            <input
              type='text'
              name='buyer_address'
              id='buyer_address'
              placeholder='Buyer Address'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('buyer_address')}
            />
            {formik.touched.buyer_address && formik.errors.buyer_address && (
              <div className='text-red-500 text-sm'>{formik.errors.buyer_address}</div>
            )}

            <label htmlFor='buyer_city'>Buyer City</label>
            <select
              className='w-full p-2 border border-gray-300 rounded-md'
              name='buyer_city'
              id='buyer_city'
              {...formik.getFieldProps('buyer_city')}
            >
              <option value='' defaultValue>
                Choose city
              </option>
              {cityList.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.city_name}
                </option>
              ))}
            </select>
            {formik.touched.buyer_city && formik.errors.buyer_city && (
              <div className='text-red-500 text-sm'>{formik.errors.buyer_city}</div>
            )}

            <label htmlFor='piece'>Piece</label>
            <input
              type='number'
              name='piece'
              id='piece'
              placeholder='1'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('piece')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.piece && formik.errors.piece && (
              <div className='text-red-500 text-sm'>{formik.errors.piece}</div>
            )}

            <label htmlFor='amount'>Amount</label>
            <input
              type='number'
              name='amount'
              id='amount'
              placeholder='enter amount in numbers'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('amount')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className='text-red-500 text-sm'>{formik.errors.amount}</div>
            )}

            <label htmlFor='special_instruction'>Special Instruction</label>
            <input
              type='text'
              name='special_instruction'
              id='special_instruction'
              placeholder='Special Instruction'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('special_instruction')}
            />

            <label htmlFor='product_name'>Product Name</label>
            <input
              type='text'
              name='product_name'
              id='product_name'
              placeholder='Product Name'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('product_name')}
            />
            {formik.touched.product_name && formik.errors.product_name && (
              <div className='text-red-500 text-sm'>{formik.errors.product_name}</div>
            )}

            <label htmlFor='store_url'>Store URL</label>
            <input
              type='text'
              name='store_url'
              id='store_url'
              placeholder='Store URL'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('store_url')}
            />
            {formik.touched.store_url && formik.errors.store_url && (
              <div className='text-red-500 text-sm'>{formik.errors.store_url}</div>
            )}

            <label htmlFor='business_name'>Business Name</label>
            <input
              type='text'
              name='business_name'
              id='business_name'
              placeholder='Business Name'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('business_name')}
            />
            {formik.touched.business_name && formik.errors.business_name && (
              <div className='text-red-500 text-sm'>{formik.errors.business_name}</div>
            )}

            <label htmlFor='origin'>Origin</label>
            <input
              type='text'
              name='origin'
              id='origin'
              placeholder='i.e Multan'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('origin')}
            />
            {formik.touched.origin && formik.errors.origin && (
              <div className='text-red-500 text-sm'>{formik.errors.origin}</div>
            )}

            <label htmlFor='gateway_id'>Gateway id</label>
            <input
              type='number'
              name='gateway_id'
              id='gateway_id'
              value={formik.values.gateway_id}
              readOnly
              className='w-full p-2 border border-gray-300 rounded-md'
            />

            <label htmlFor='shipper_address'>Shipper Address</label>
            <input
              type='text'
              name='shipper_address'
              id='shipper_address'
              placeholder='Shipper Address'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('shipper_address')}
            />
            {formik.touched.shipper_address && formik.errors.shipper_address && (
              <div className='text-red-500 text-sm'>{formik.errors.shipper_address}</div>
            )}

            <label htmlFor='shipper_name'>Shipper Name</label>
            <input
              type='text'
              name='shipper_name'
              id='shipper_name'
              placeholder='Shipper Name'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('shipper_name')}
            />
            {formik.touched.shipper_name && formik.errors.shipper_name && (
              <div className='text-red-500 text-sm'>{formik.errors.shipper_name}</div>
            )}

            <label htmlFor='shipper_phone'>Shipper Phone</label>
            <input
              type='number'
              name='shipper_phone'
              id='shipper_phone'
              placeholder='Shipper Phone'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('shipper_phone')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.shipper_phone && formik.errors.shipper_phone && (
              <div className='text-red-500 text-sm'>{formik.errors.shipper_phone}</div>
            )}

            <label htmlFor='shipment_type'>Shipment Type</label>
            <select
              name='shipment_type'
              id='shipment_type'
              {...formik.getFieldProps('shipment_type')}
            >
              <option value=''>Select Shipment Type</option>
              <option value='1'>1 for overnight</option>
              <option value='2'>2 for detain</option>
              <option value='3'>3 for overland</option>
            </select>
            {formik.touched.shipment_type && formik.errors.shipment_type && (
              <div className='text-red-500 text-sm'>{formik.errors.shipment_type}</div>
            )}

            <label htmlFor='external_reference_no'>External Reference Number</label>
            <input
              type='number'
              name='external_reference_no'
              id='external_reference_no'
              placeholder='External Reference Number'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('external_reference_no')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.external_reference_no && formik.errors.external_reference_no && (
              <div className='text-red-500 text-sm'>
                {formik.errors.external_reference_no}
              </div>
            )}

            <label htmlFor='weight'>Weight</label>
            <input
              type='number'
              name='weight'
              id='weight'
              placeholder='Weight'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('weight')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.weight && formik.errors.weight && (
              <div className='text-red-500 text-sm'>{formik.errors.weight}</div>
            )}

            <label htmlFor='pickup_id'>Pickup Id</label>
            <input
              type='number'
              name='pickup_id'
              id='pickup_id'
              placeholder='Pickup Id'
              className='w-full p-2 border border-gray-300 rounded-md'
              {...formik.getFieldProps('pickup_id')}
              onKeyDown={handleNumberInput}
            />
            {formik.touched.pickup_id && formik.errors.pickup_id && (
              <div className='text-red-500 text-sm'>{formik.errors.pickup_id}</div>
            )}

            <button
              type='submit'
              className='w-full p-2 bg-blue-500 text-white rounded-md'
            >
              Book Order
            </button>
          </form>
        </Paper>
      </Container>
    </div>
  )
}

export default DigiDokanLogin
