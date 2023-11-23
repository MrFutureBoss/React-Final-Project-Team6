import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Header from "../Home/Header";

const updateUserSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  bio: Yup.string(),
  image: Yup.string().url("Invalid URL format"),
  email: Yup.string().email("Invalid email format"),
  password: Yup.string().min(1, "Password must be at least 1 characters"),
});

const UpdateUser = () => {
  const storedToken = localStorage.getItem("userToken");
  const storedUsername = localStorage.getItem("userName");
  const storedBio = localStorage.getItem("userBio");
  const storedImage = localStorage.getItem("userImg");
  const storedEmail = localStorage.getItem("userEmail");
  const storedPassword = localStorage.getItem("userPassword");

  const initialValues = {
    username: storedUsername || "",
    bio: storedBio || "",
    image: storedImage || "",
    email: storedEmail || "",
    password: storedPassword || "",
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
        Authorization: `Token ${storedToken}`,
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log("User updated successfully:", response.data.user);
      })
      .catch((error) => {
        console.error("An unexpected error occurred:", error.message);
        setErrors({ username: "Failed to update user" });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  
  const clearToken=()=>{
    localStorage.removeItem("userImg");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userBio");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currentPass");
    window.location.reload();
    window.location.href = "/";
    
  }

  return (
    <>
      <Header />
      <div className="container d-flex align-items-center justify-content-center">
        <div className="card p-4" style={{ width: "60%" }}>
          <h2 className="mb-2 text-center">Update User</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={updateUserSchema}
            onSubmit={handleUpdateUser}
          >
            <Form>
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
                  type="text"
                  className="form-control col-12"
                  id="bio"
                  name="bio"
                />
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="text-danger"
                />
              </div>
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
              <button type="submit" className="btn btn-primary float-end">
                Update User
              </button>
            </Form>
          </Formik>
          <button onClick={clearToken}>Log out</button>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
