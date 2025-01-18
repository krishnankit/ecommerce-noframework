import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { globalContext } from "../context/globalState";
import { Form, FormControl, FieldError } from "../components/Form";
import { checkAdmin, getUserIdAndName } from "../helpers";

function Signin() {
  const {
    displayToast,
    login,
    globalState: { currentUser }
  } = useContext(globalContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
      displayToast({
        message: "Already Signed In",
        type: "info"
      })
    }
  }, []);

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

  async function handleSubmit() {
    if (validate(formData)) {
      try {
        signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then(async userCred => {
          const { name, databaseId } = await getUserIdAndName(userCred.user.uid);
          login({
            name,
            databaseId,
            uid: userCred.user.uid,
            email: userCred.user.email,
          });
          checkAdmin(userCred.user.uid)
          .then(isAdmin => {
            if (isAdmin) navigate("/admin/products");
            else navigate("/");
            displayToast({
              message: "Signed In successfully",
              type: "success",
            });
          })
          .catch(error => {
            displayToast({
              message: "Unable to authorize admin",
              type: "error",
            });
            console.log(error);
            navigate("/");
          })
        })
        .catch(error => {
          displayToast({
            message: error.message,
            type: "error",
          })
        })
      } catch (error) {
        displayToast({
          message: "OOPS! Something went wrong",
          type: "error"
        });
        console.error(error);
      }
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
    })
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Form onSubmit={handleSubmit} title="Sign In!" submitText="Sign In">
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
          autoComplete="true"
          className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errors.password ? "border-red" : "border-gray"}`}
          placeholder="Password..."
          value={formData.password}
          onChange={handleChange}
        />
        <FieldError message={errors.password} />
      </FormControl>
      <p>
        New User ? <Link to="/signup" className="text-secondary underline">Sign Up</Link>
      </p>
    </Form>
  );
}

export default Signin;
