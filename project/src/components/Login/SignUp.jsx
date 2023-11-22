import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const signUpSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SignUp = () => {
  const handleSignUp = (values) => {
    console.log('Signing up with:', values);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div className="card p-4" style={{ width: '60%' }}>
        <h2 className="mb-4 text-center">Sign Up</h2>
        
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={signUpSchema}
          onSubmit={handleSignUp}
        >
          <Form>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                User Name:
              </label>
              <Field
                type="text"
                className="form-control col-12"
                id="username"
                name="username"
              />
              <ErrorMessage name="username" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <Field
                type="email"
                className="form-control col-12"
                id="email"
                name="email"
              />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <Field
                type="password"
                className="form-control col-12"
                id="password"
                name="password"
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary float-end">
              Sign Up
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;