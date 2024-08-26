import React from 'react';
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail, MdPassword } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();

  // Custom validation to check if the input is either a valid email or username
  const validationSchema = Yup.object({
    identifier: Yup.string()
      .test('identifier', 'Enter a valid email or username', function (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
        return emailRegex.test(value) || usernameRegex.test(value);
      })
      .required('This field is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      identifier: "", // can be either email or username
      password: "",
    },
    validationSchema,
    onSubmit: values => {
      console.log(values);
      // Handle form submission
    },
  });

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-black' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form
          className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col'
          onSubmit={formik.handleSubmit}
        >
          <XSvg className='w-24 lg:hidden fill-black' />
          <h1 className='text-4xl font-extrabold text-accent'>Login</h1>
          <label className='input input-bordered rounded flex items-center gap-2 input-secondary'>
            <MdOutlineMail />
            <input
              type='text'
              className='grow'
              placeholder='Email or Username'
              name='identifier'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.identifier}
            />
          </label>
          {formik.touched.identifier && formik.errors.identifier ? (
            <p className='text-gray-600 text-xs'>{formik.errors.identifier}</p>
          ) : null}

          <label className='input input-bordered rounded flex items-center gap-2 input-secondary'>
            <MdPassword />
            <input
              type='password'
              className='grow'
              placeholder='Password'
              name='password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
          </label>
          {formik.touched.password && formik.errors.password ? (
            <p className='text-gray-600 text-xs'>{formik.errors.password}</p>
          ) : null}

          <button className='btn rounded-full btn-secondary text-white' type='submit'>
            Login
          </button>
          {formik.isSubmitting && <p className='text-accent'>Submitting...</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-info text-sm'>New user? Create an account now</p>
          <button 
            onClick={() => navigate('/register')} 
            className='btn rounded-full btn-secondary text-white btn-outline w-full'
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
