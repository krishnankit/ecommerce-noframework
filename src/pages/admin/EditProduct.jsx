import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { Form, FormControl, FieldError } from "../../components/Form";
import { capitalize } from "../../helpers";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import { fireDB } from "../../../firebaseConfig";
import { globalContext } from "../../context/globalState";

function EditProduct() {
  const formFields = ["title", "price", "quantity", "category", "description", "imageURL"];
  const initialFormData = {}
  formFields.forEach(field => {
    initialFormData[field] = ""
  });

  const[formData, setFormData] = useState(initialFormData);

  const { id } = useParams();
  const { displayToast } = useContext(globalContext);
  const [errors, setErrors] = useState({});


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
      const docRef = doc(fireDB, "products", id);
      updateDoc(docRef, {
        ...formData,
        updatedAt: Timestamp.now()
      })
      .then(res => {
        debugger;
        displayToast({
          message: "Producted updated",
          type: "success",
        });
      })
      .catch(error => {
        displayToast({
          message: "Unbale to udpate",
          type: "error",
        })
        console.error(error);
      })
    } else {
      alert("Please check for errrors");
    }
  }

  useEffect(() => {
    const docRef = doc(fireDB, "products", id);
    getDoc(docRef)
    .then(doc => {
      setFormData(doc.data());
    })
    .catch(error => {
      console.eror(error);
      displayToast("Unable to fetch data");
    });
  }, [])

  return (
    <Form onSubmit={handleSubmit} title="Modify Product" submitText={"Update"}>
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
              <label className="mb-2">{capitalize(field)}:</label>
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

export default EditProduct;
