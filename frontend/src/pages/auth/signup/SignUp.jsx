import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import XSvg from "../../../components/svgs/X";
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUp = () => {
  const navigate = useNavigate()
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    fullName: Yup.string().required('Full name is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      fullName: "",
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
          <h1 className='text-4xl font-extrabold text-accent'>Join today.</h1>
          <label className='input input-bordered rounded flex items-center gap-2 input-secondary'>
            <MdOutlineMail />
            <input
              type='email'
              className='grow'
              placeholder='Email'
              name='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
          </label>
          {formik.touched.email && formik.errors.email ? (
            <p className='text-gray-600 text-xs'>{formik.errors.email}</p>
          ) : null}

          <div className='flex gap-4 flex-wrap'>
            <label className='input input-bordered rounded flex items-center gap-2 flex-1 input-secondary'>
              <FaUser />
              <input
                type='text'
                className='grow'
                placeholder='Username'
                name='username'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
            </label>
            {formik.touched.username && formik.errors.username ? (
              <p className='text-gray-600 text-xs'>{formik.errors.username}</p>
            ) : null}

            <label className='input input-bordered rounded flex items-center gap-2 flex-1 input-secondary'>
              <MdDriveFileRenameOutline />
              <input
                type='text'
                className='grow'
                placeholder='Full Name'
                name='fullName'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
            </label>
            {formik.touched.fullName && formik.errors.fullName ? (
              <p className='text-gray-600 text-xs'>{formik.errors.fullName}</p>
            ) : null}
          </div>

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
            Sign up
          </button>
          {formik.isSubmitting && <p className='text-accent'>Submitting...</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-info text-sm'>Already have an account?</p>
            <button onClick={()=> navigate('/login')} className='btn rounded-full btn-secondary text-white btn-outline w-full'>
              Sign in
            </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
