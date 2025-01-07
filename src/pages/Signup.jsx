import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth, fireDB } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { globalContext } from "../context/globalState";
import { Form, FormControl, FieldError } from "../components/Form";

function Signup() {
  const navigate = useNavigate();
  const { displayToast, login } = useContext(globalContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    admin: false,
  });

  const [errors, setErrors] = useState({});

  function validate({ name, email, password, confirmPassword }) {
    let errors = {};
    if (!name) {
      errors.name = "Please enter name"
    } else if (name.length > 15) {
      errors.name = "Maximum 15 chars"
    }

    if (!email) {
      errors.email = "Please enter email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email.toLowerCase())) {
      errors.email = "Email not valid"
    }

    if (!password) {
      errors.password = "Please enter password"
    } else if (password.length < 6) {
      errors.password = "Enter minimum 6 chars"
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm password"
    }

    if (password != confirmPassword) {
      errors.confirmPassword = "Does not match password"
    }

    setErrors(errors);

    return Object.keys(errors).length > 0 ? false : true;
  }

  function handleSubmit() {
    if (validate(formData)) {
     createUserWithEmailAndPassword(auth, formData.email, formData.password)
     .then(userCred => {
      console.log("user cred", userCred);
      const newUser = {
        isAdmin: formData.admin,
        name: formData.name,
        email: formData.email,
        uid: userCred.user.uid,
        createdAt: Timestamp.now(),
      }

      const userCollectionRef = collection(fireDB, "users");
      addDoc(userCollectionRef, newUser)
      .then(res => {
        console.log(res);
        login(userCred.user);
        navigate("/");
        displayToast({
          message: "Registered successfully",
          type: "success",
        })
      })
      .catch(error => {
        displayToast({
          message: error.message,
          type: "error",
        })
      });
     })
     .catch(error => {
      displayToast({
        message: error.message,
        type: "error"
      })
     })
    } else {
      displayToast({
        message: "Check Errors",
        type: "error"
      });
    }
  }

  function handleChange(e) {
    setErrors({
      ...errors,
      [e.target.name]: null
    });

    if (e.target.name === "admin") {
      setFormData({
        ...formData,
        admin: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit} title="Register!" submitText="Register">
        <FormControl>
          <input
            type="text"
            id="name"
            name="name"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.name ? "border-red" : "border-gray"}`}
            placeholder="Name..."
            value={formData.name}
            onChange={handleChange}
          />
          <FieldError message={errors.name} />
        </FormControl>
        <FormControl>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.email ? "border-red" : "border-gray"}`}
            placeholder="Email..."
            value={formData.email}
            onChange={handleChange}
          />
          <FieldError message={errors.email} />
        </FormControl>
        <FormControl>
          <input
            type="password"
            id="password"
            name="password"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.password ? "border-red" : "border-gray"}`}
            placeholder="Password..."
            value={formData.password}
            onChange={handleChange}
          />
          <FieldError message={errors.password} />
        </FormControl>
        <FormControl>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.confirmPassword ? "border-red" : "border-gray"}`}
            placeholder="Confirm Password..."
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <FieldError message={errors.confirmPassword} />
        </FormControl>
        <FormControl>
          <input
            type="checkbox"
            name="admin"
            id="admin"
            onChange={handleChange}
          />
          <label htmlFor="admin"><strong> Register as a SELLER {formData.admin}</strong></label>
        </FormControl>
        <p>
          Already registered ? <Link to="/signin" className="text-secondary underline">Sign In</Link>
        </p>
    </Form>
  );
}

export default Signup;
