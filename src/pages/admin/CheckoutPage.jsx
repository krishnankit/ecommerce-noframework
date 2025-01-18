import React, { useContext, useState, useEffect } from "react";
import { useRazorpay } from "react-razorpay"
import CartSummary from "../../components/CartSummary";
import { globalContext } from "../../context/globalState";
import { doc, getDoc, updateDoc, addDoc, collection, Timestamp } from "firebase/firestore";
import { fireDB } from "../../../firebaseConfig";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { destroyUserCart, formattedAddress } from "../../helpers";

function CheckoutPage() {
  const { globalState: { currentUser },
    displayToast
  } = useContext(globalContext)
  const { items, grandTotal } = JSON.parse(localStorage.getItem("cart"));
  const orderItems = items.map(item => (
    {
      id: item.id,
      orderQuantity: item.cartQuantity,
    }
  ));
  const [addresses, setAddresses] = useState([]);
  let addressData = {
    houseName: "",
    streetName: "",
    city: "",
    pincode: "",
    state: "",
  }
  const [address, setAddress] = useState(addressData);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();

  const { Razorpay } = useRazorpay();

  useEffect(() => {
    const userDocRef = doc(fireDB, "users", currentUser.databaseId);
    getDoc(userDocRef)
    .then(snapShot => {
      const addresses = snapShot.data().addresses || [];
      setAddresses(addresses);
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
    } else {
      const userDocRef = doc(fireDB, "users", currentUser.databaseId);
      updateDoc(userDocRef, "addresses", [...addresses, address])
      .then(() => {
        displayToast({
          message: "Address added successfully",
          type: "info",
        })

        setAddress(addressData);
      })
      .catch(error => {
        displayToast({
          message: "Unable to add address",
          type: "error",
        })

        console.log(error);
      });
    }
  }

  function handlePayment() {
    const options = {
      key: process.env.REACT_APP_RAZOR_PAY_API_KEY,
      amount: parseInt(grandTotal * 100),
      currency: "INR",
      description: "for testing purpose",
      handler: function (response) {
        displayToast({
          message: "Payment Successful",
          type: "success",
        });

        const paymentId = response.razorpay_payment_id;

        const orderInfo = {
          items: orderItems,
          amount: grandTotal,
          address: addresses[selectedAddress],
          email: currentUser.email,
          userId: currentUser.databaseId,
          paymentId,
          createdAt: Timestamp.now(),
        }

        destroyUserCart(currentUser.databaseId);

        try {
          const orderRef = collection(fireDB, 'orders');
          addDoc(orderRef, orderInfo);
          navigate("/orders");
        } catch (error) {
          console.log(error)
          displayToast({
            message: "Unable to to create order",
            type: "error",
          });
          navigate("/");
        }
      },

      theme: {
        color: "#2C74B3"
      }
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }

  return (
    <>
      <div className="sm:flex justify-between gap-10">
        <div className="w-full mb-5 border-b-4 border-secondary">
          <h1 className="text-xl font-primary font-bold">Order Summary</h1>
          <CartSummary cartItems={ items } />
        </div>
        <div className="w-full">
          <h1 className="text-xl font-primary font-bold">Select your address</h1>
          {
            addresses.length > 0 &&
            addresses.map((address, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedAddress(index)}
                  className={`flex justify-between items-center p-2 my-2 cursor-pointer border border-secondary ${selectedAddress === index && "bg-selected"}`}
                >
                  <div>
                    <p>{ formattedAddress(address) }</p>
                    <p>{ `${address.state}.` }</p>
                  </div>
                  {
                    selectedAddress === index &&
                    <svg
                    viewBox="0 0 40 20"
                    width="40"
                    height="20"
                    className="block ml-2"
                  >
                    <path
                      d="M5 5 L10 15"
                      strokeWidth="5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="stroke-secondary"
                    />
                    <path
                      d="M10 15 L30 3"
                      strokeWidth="5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="stroke-secondary"
                    />
                  </svg>
                  }
                </div>
              );
            })
          }
          <form
            action={handleSubmit}
            className="border-2 border-secondary mt-4 p-2 text-center"
          >
            <h3 className="mt-2">Dilver to another address?</h3>
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
                name="pincode"
                id="pincode"
                placeholder="pincode..."
                className="inline-block w-full px-2 py-1 mb-2 outline-none border-b-2 border-secondary"
                value={address.pincode}
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
            </div>
            <button
              className={`px-4 py-2 mt-2 mx-auto text-sm text-secondary bg-white border rounded border-secondary ${ valid ? "shadow-bottom-right-sm shadow-secondary active:translate-x-[2px] active:translate-y-[4px] active:shadow-none" : "text-red border-red" } transition duration-100`}
              disabled={!valid}
            >
              Add address
            </button>
          </form>
        </div>
      </div>
      <div className="flex justify-between">
      <button
        className="text-secondary bg-white py-2 px-4 border border-secondary shadow-bottom-right-md shadow-secondary active:translate-x-[1px] active:translate-y-[2px] active:shadow-bottom-right-sm active:shadow-secondary"
      >
        <FaArrowLeft className="inline mr-2" />
        <Link to="/cart">Back to KART</Link>
      </button>
      <button
        className="text-white bg-secondary py-2 px-4 shadow-bottom-right-md shadow-primary active:translate-x-[1px] active:translate-y-[2px] active:shadow-bottom-right-sm active:shadow-primary"
        onClick={handlePayment}
      >
        Proceed to payment
        <FaArrowRight className="inline ml-2" />
      </button>
      </div>
    </>
  );
}

export default CheckoutPage;
