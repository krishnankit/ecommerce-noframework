import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { globalContext } from "../context/globalState";

function Signin() {
  const { displayToast, login, globalState: { currentUser } } = useContext(globalContext);
  const navigate = useNavigate();

  if (currentUser) {
    navigate("/");
    displayToast({
      message: "Already Signed In",
      type: "info",
    })
  }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function validate({ email, password }) {
    let errors = {};

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

    setErrors(errors);

    return Object.keys(errors).length > 0 ? false : true;
  }

  function handleSubmit() {
    if (validate(formData)) {
     signInWithEmailAndPassword(auth, formData.email, formData.password)
     .then(userCred => {
      login(userCred.user);
      navigate("/");
      displayToast({
        message: "Signed In successfully",
        type: "success",
      });
     })
     .catch(error => {
      displayToast({
        message: error.message,
        type: "error",
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
        <h3 className="text-2xl font-bold mb-3 text-center text-primary">Sign In!</h3>
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
        <p>
          New User ? <Link to="/signup" className="text-secondary underline">Sign Up</Link>
        </p>
        <button
          type="submit"
          className="block mx-auto mt-2 px-3 py-2 rounded cursor-pointer bg-secondary text-white hover:bg-primary"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default Signin;
