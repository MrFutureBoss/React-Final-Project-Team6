import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Header from "../Home/Header";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const signInSchema = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const navigate = useNavigate();

  const handleSignIn = (values, { setSubmitting, setErrors }) => {
    const data = {
      user: {
        email: values.email,
        password: values.password,
      },
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.realworld.io/api/users/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        const username = response.data.user.username;
        localStorage.setItem("userName", username);
        const token = response.data.user.token;
        localStorage.setItem("userToken", token);
        const image = response.data.user.image;
        localStorage.setItem("userImg", image);
        const bio = response.data.user.bio;
        localStorage.setItem("userBio", bio);
        const email = response.data.user.email;
        localStorage.setItem("userEmail", email);
        const password = values.password;
        localStorage.setItem("currentPass", password);
        navigate("/");
      })
      .catch((error) => {
        if (error.response) {
          setErrors({
            email: "Invalid email",
            password: "Invalid password",
          });
        } else {
          console.error("An unexpected error occurred:", error.message);
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSignIn();
    }
  };
  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center">
        <div className="card p-4" style={{ width: "60%" }}>
          <h2 className="mb-2 text-center">Sign In</h2>
          <Link to="/register" className="mb-4 text-center sign-up-link">
            Need an account?
          </Link>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={signInSchema}
            onSubmit={handleSignIn}
            onKeyDown={handleKeyDown}
          >
            <Form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <Field
                  type="text"
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
                Sign In
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

export default SignIn;
