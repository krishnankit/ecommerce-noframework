import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { auth, fireDB } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { globalContext } from "../context/globalState";

function Signup() {
  const { displayToast } = useContext(globalContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      const newUser = {
        isAdmin: false,
        name: formData.name,
        email: formData.email,
        uid: userCred.user.uid,
        createdAt: Timestamp.now(),
      }

      const userCollectionRef = collection(fireDB, "user");
      addDoc(userCollectionRef, newUser)
      .then(res => {
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
      console.log(errors);
    }
  }

  function handleChange(e) {
    setErrors({
      ...errors,
      [e.target.name]: null
    })
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="flex justify-center align-center">
      <form
        action={handleSubmit}
        noValidate
        className="w-1/3 border border-gray rounded px-6 py-5"
      >
        <h3 className="text-2xl font-bold mb-3 text-center text-primary">Register!</h3>
        <div className="w-full py-2">
          <input
            type="text"
            id="name"
            name="name"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.name ? "border-red" : "border-gray"}`}
            placeholder="Name..."
            value={formData.name}
            onChange={handleChange}
          />
          <span className="text-xs text-red">{errors.name}</span>
        </div>
        <div className="w-full py-2">
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.email ? "border-red" : "border-gray"}`}
            placeholder="Email..."
            value={formData.email}
            onChange={handleChange}
          />
          <span className="text-xs text-red">{errors.email}</span>
        </div>
        <div className="w-full py-2">
          <input
            type="password"
            id="password"
            name="password"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.password ? "border-red" : "border-gray"}`}
            placeholder="Password..."
            value={formData.password}
            onChange={handleChange}
          />
          <span className="text-xs text-red">{errors.password}</span>
        </div>
        <div className="w-full py-2">
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.confirmPassword ? "border-red" : "border-gray"}`}
            placeholder="Confirm Password..."
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span className="text-xs text-red text-left">{errors.confirmPassword}</span>
        </div>
        <p>
          Already registered ? <Link to="/signin" className="text-secondary underline">Sign In</Link>
        </p>
        <button
          type="submit"
          className="block mx-auto mt-2 px-3 py-2 rounded cursor-pointer bg-secondary text-white hover:bg-primary"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;
