import React from 'react';
import { Container, Paper } from '@mui/material';
import Header from './Header';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch,useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { createContact } from '../features/ContactFeatures';
const Contact = () => {
  // ✅ Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    subject: Yup.string()
      .min(3, 'Subject must be at least 3 characters')
      .required('Subject is required'),
    message: Yup.string()
      .min(10, 'Message must be at least 10 characters')
      .required('Message is required'),
  });
const dispatch = useDispatch()
  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
    validationSchema,
    onSubmit: async  (values, { resetForm }) => {
      await  dispatch(createContact(values)).unwrap().then((res) => {
         toast.success(res.message)
         resetForm();
      }).catch ((err) => {
        toast.error(err.message)
      });
     
    },
  });

  return (
    <div className="w-full h-full">
      <Container maxWidth="xl">
        <Header />
        <div className="w-full h-screen flex items-center justify-center">
          <Paper
            elevation={1}
            sx={{
              width: '100%',
              p: 4,
              height: 'auto',
              maxWidth: '500px',
            }}
          >
            <h1 className="text-2xl font-bold font-lisuBusa text-center mb-4">
              Contact Us
            </h1>

            {/* ✅ Formik form */}
            <form onSubmit={formik.handleSubmit} className="flex flex-col items-start p-2 gap-y-3 ">
              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mb-2">{formik.errors.name}</p>
              )}

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mb-2">{formik.errors.email}</p>
              )}

              {/* Subject */}
              <input
                type="text"
                name="subject"
                placeholder="Enter your subject"
                className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
                  formik.touched.subject && formik.errors.subject
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                {...formik.getFieldProps('subject')}
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-red-500 text-sm mb-2">{formik.errors.subject}</p>
              )}

              {/* Message */}
              <textarea
                name="message"
                placeholder="Enter your message"
                className={`w-full p-2 border rounded-md mb-1 focus:outline-none focus:ring-2 ${
                  formik.touched.message && formik.errors.message
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                rows={4}
                {...formik.getFieldProps('message')}
              ></textarea>
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-500 text-sm mb-2">{formik.errors.message}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </Paper>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
