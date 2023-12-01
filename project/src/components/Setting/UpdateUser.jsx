import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Header from "../Home/Header";
import "../Setting/Setting.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

const updateUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  bio: Yup.string(),
  image: Yup.string().url("Invalid URL format"),
  email: Yup.string().email("Invalid email format"),
  password: Yup.string().min(1, "Password must be at least 1 characters"),
});

const UpdateUser = () => {
  const getToken = localStorage.getItem("userToken");
  const getUsername = localStorage.getItem("userName");
  const getBio = localStorage.getItem("userBio");
  const getImage = localStorage.getItem("userImg");
  const getEmail = localStorage.getItem("userEmail");
  const getPassword = localStorage.getItem("userPassword");
  const navigate = useNavigate();

  const clearToken = () => {
    localStorage.removeItem("userImg");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userBio");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentPass");
    window.location.reload();
    window.location.href = "/";
  };

  const initialValues = {
    username: getUsername || "",
    bio: getBio || "",
    image: getImage || "",
    email: getEmail || "",
    password: getPassword || "",
  };

  const handleUpdateUser = (values, { setSubmitting, setErrors }) => {
    const data = {
      user: {
        username: values.username,
        bio: values.bio,
        image: values.image,
        email: values.email,
        password: values.password,
      },
    };
  
    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "https://api.realworld.io/api/user",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${getToken}`,
      },
      data: data,
    };
  
    axios
      .request(config)
      .then((response) => {
        console.log('User updated successfully:', response.data.user);

        toast.success('User updated successfully');

        navigate('/userprofile');
      })
      .catch((error) => {
        console.error('Error response:', error.response);
        setErrors({ username: 'Failed to update user' });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  
  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center" style={{marginBottom:"80px"}}>
        <div className="p-4" style={{ width: "60%" }}>
          <h2 className="mb-2 text-center">Your Settings</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={updateUserSchema}
            onSubmit={handleUpdateUser}
          >
            <Form>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Image URL:
                </label>
                <Field
                  type="text"
                  className="form-control col-12"
                  id="image"
                  name="image"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
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
                <label htmlFor="bio" className="form-label">
                  Bio:
                </label>
                <Field
                  as="textarea"
                  className="form-control col-10"
                  id="bio"
                  name="bio"
                  rows="4"
                />
                <ErrorMessage
                  name="bio"
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
                  placeholder="New Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <button type="submit" className="float-end btn-update">
                Update User
              </button>
            </Form>
          </Formik>
          <hr style={{ margin: "5rem 0 2rem 0" }} />
          <button onClick={clearToken} className="btn-logout">
            Or click here to logout.
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UpdateUser;