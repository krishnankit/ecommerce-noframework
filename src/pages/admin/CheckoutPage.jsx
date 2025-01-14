import React, { useContext, useState, useEffect } from "react";
import CartSummary from "../../components/CartSummary";
import { globalContext } from "../../context/globalState";
import { doc, getDoc } from "firebase/firestore";
import { fireDB } from "../../../firebaseConfig";
import { Form, FormControl } from "../../components/Form";

function CheckoutPage() {
  const { globalState: { currentUser: { databaseId } },
    displayToast
  } = useContext(globalContext)
  const cartItems = JSON.parse(localStorage.getItem("cart"));
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState({
    houseName: "",
    streetName: "",
    city: "",
    pincode: "",
    state: "",
  });
  const [valid, setValid] = useState(true);

  useEffect(() => {
    const userDocRef = doc(fireDB, "users", databaseId);
    getDoc(userDocRef)
    .then(snapShot => {
      const address = snapShot.data().addresses || [];
      setAddresses(address);
    })
    .catch(error => {
      displayToast({
        message: "Unable to find address",
        type: "error",
      })

      console.log(error);
    })
  }, []);

  function handleChange(e) {
    if (!valid) {
      setValid(true);
    }

    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if (
      !address.houseName ||
      !address.streetName ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      displayToast({
        message: "All fields are required",
        type: "error",
      })
      setValid(false);
    }
  }

  return (
    <div className="sm:flex justify-between gap-10">
      <div className="w-full mb-5 border-b-4 border-secondary">
        <h1 className="text-xl font-primary font-bold">Order Summary</h1>
        <CartSummary cartItems={cartItems} />
      </div>
      <div className="w-full">
        <h1 className="text-xl font-primary font-bold">Add your address</h1>
        {
          addresses.length > 0 &&
          addresses.map(address => {
            return (
              <div>
                <div className="flex justify-between gap-5">
                  <p>{address.houseName}</p>
                  <p>{address.streetName}</p>
                </div>
                <div className="flex justify-between gap-5">
                  <p>{address.city}</p>
                  <p>{address.pincode}</p>
                  <p>{address.state}</p>
                </div>
              </div>
            );
          })
        }
        <form action={handleSubmit}>
          <h3>Dilver to another address?</h3>
          <div className="lg:flex justify-between gap-5">
            <input
              type="text"
              name="houseName"
              id="houseName"
              placeholder="House name..."
              className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
              value={address.houseName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="streetName"
              id="streetName"
              placeholder="Street name..."
              className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
              value={address.streetName}
              onChange={handleChange}
            />
          </div>
          <div className="md:flex justify-between gap-5">
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City..."
              className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
              value={address.city}
              onChange={handleChange}
            />
            <input
              type="text"
              name="state"
              id="state"
              placeholder="State..."
              className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
              value={address.state}
              onChange={handleChange}
            />
            <input
              type="text"
              name="pincode"
              id="pincode"
              placeholder="pincode..."
              className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
              value={address.pincode}
              onChange={handleChange}
            />
          </div>
          {console.log("valid", valid)}
          <button
            className={`px-4 py-2 mt-2 w-full text-primary bg-white border rounded border-primary ${ valid ? "shadow-bottom-right-sm shadow-primary active:translate-x-[2px] active:translate-y-[4px] active:shadow-none" : "text-red border-red" } transition duration-100`}
            disabled={!valid}
          >
            Add this address to profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
