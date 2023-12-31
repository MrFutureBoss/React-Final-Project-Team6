import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../Home/Header";
import axios from "axios";
import "../Login/Login.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignUp = () => {
  const handleSignUp = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("https://api.realworld.io/api/users", {
        user: values,
      });
      if (response.status !== 422) {
        toast.success("Signup successful!");
      } else {
        toast.error("Signup failed!");
      }
    } catch (error) {
      console.error(error);
      console.clear();

      if (error.response && error.response.data && error.response.data.errors) {
        const emailError = error.response.data.errors.email;
        if (emailError && emailError.includes("has already been taken")) {
          toast.error("Email address is already taken");
        }
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center">
        <div className="card p-4" style={{ width: "60%" }}>
          <h2 className="mb-2 text-center">Sign Up</h2>
          <Link to="/login" className="mb-4 text-center sign-up-link">
            Already have an account
          </Link>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={SignUpSchema}
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
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-danger"
                />
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
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
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
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="float-end custom-button">
                Sign Up
              </button>
            </Form>
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignUp;