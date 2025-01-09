import React, { useContext, useState } from "react";
import { collection, Timestamp, addDoc } from "firebase/firestore";
import { Form, FormControl, FieldError } from "../../components/Form";
import { capitalize } from "../../helpers";
import { fireDB } from "../../../firebaseConfig";
import { useNavigate } from "react-router";
import { globalContext } from "../../context/globalState";

function AddProduct() {
  const { displayToast, globalState: { currentUser } } = useContext(globalContext);
  const navigate = useNavigate();

  const formFields = ["title", "price", "quantity", "category", "description", "imageURL"];
  const initialFormData = {}
  formFields.forEach(field => {
    initialFormData[field] = ""
  });

  const [errors, setErrors] = useState({});
  const[formData, setFormData] = useState(initialFormData);

  function handleChange(e) {
    setErrors({
      ...errors,
      [e.target.name]: null,
    });

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function validate(formData) {
    let errors = {}
    for (let field in formData) {
      if (!formData[field]) {
        errors[field]= `${capitalize(field)} is required`;
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit() {
    if (validate(formData)) {
      const newProduct = {
        ...formData,
        sellerId: currentUser.uid,
        createdAt: Timestamp.now(),
      }
      console.log(newProduct);
      const docRef = collection(fireDB, "products");
      addDoc(docRef, newProduct)
      .then(res => {
        navigate("/admin/all-products");
        displayToast({
          message: "Producted created!",
          type: "success",
        });
      })
      .catch(error => {
        displayToast({
          message: "Unable to create product!",
          type: "error",
        });
        console.error(error);
      });
    } else {
      alert("Please check for errrors");
    }
  }

  return (
    <Form onSubmit={handleSubmit} title="Create new Product" submitText={"Create"}>
      {
        formFields.map(field => {
          let type = "text";
          if (["price", "quantity"].includes(field)) {
            type = "number"
          } else if (field === "description") {
            type = "textarea"
          }

          return (
            <FormControl key={field}>
              <ControlledInput
                key={field}
                type={type}
                name={field}
                initialValue={formData[field]}
                errorMsg={errors[field]}
                onChange={handleChange}
                placeholder={`${capitalize(field)}...`}
              />
            </FormControl>
          );
        })
      }
    </Form>
  );
}

function ControlledInput({
  type,
  name,
  initialValue,
  errorMsg,
  onChange,
  placeholder
}) {
  return (
    <>
      <input
        type={type}
        id={name}
        name={name}
        className={`w-full py-1 px-2 text-sm border-2 rounded outline-none ${errorMsg ? "border-red" : "border-gray"}`}
        placeholder={placeholder}
        value={initialValue}
        onChange={onChange}
      />
      <FieldError message={errorMsg} />
    </>
  );
}

export default AddProduct;
