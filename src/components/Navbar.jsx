import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { globalContext } from "../context/globalState";
import { capitalize, checkAdmin } from "../helpers";

function Navbar() {
  const { globalState: { currentUser }, logout, displayToast } = useContext(globalContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [mobileNavClassName, setMobileNavClassName] = useState("hidden");
  const navigate = useNavigate();

  // Check if current user is admin
  useEffect(() => {
    if (currentUser) {
      checkAdmin(currentUser.uid)
        .then((res) => {
          setIsAdmin(res);
        })
        .catch((error) => {
          console.error("Error fetching admin status:", error);
        });
    }
  }, [currentUser]);

  // Change nav class name depending on showMobileNav for smaller screens
  useEffect(() => {
    if (showMobileNav) {
      setMobileNavClassName("block");
    } else {
      setMobileNavClassName("hidden");
    }
  }, [showMobileNav]);

  return (
    <nav className="bg-gray-50 text-slate-800 shadow-lg overflow-hidden">
      <div className="container relative m-auto flex items-center justify-between py-2">
        <div>
          <Link to="/" className="text-4xl">
            <span className="text-5xl font-extrabold text-indigo-500">K</span>art
          </Link>
          {
            currentUser &&
            <span className="ml-4 text-xl font-secondary">
              Hello, {capitalize(currentUser.name.split(" ")[0])}
            </span>
          }
        </div>
        <ul className="hidden md:flex md:justify-center md:items-center">
          { isAdmin ?
            <>
              <Navitem label="Products" link="admin/products" />
              <Navitem label="+ Product" link="admin/add-product" />
              <Navitem label="Orders" link="admin/orders" />
            </>
            :
            <>
              <Navitem label="Cart" link="cart" />
              <Navitem label="Orders" link="orders" />
            </>
          }
          { !currentUser ?
            <Navitem label="Sign In" link="signin" />
            :
            <button
              className="ml-6 px-4 py-2 w-30 text-center cursor-pointer hover:underline transition duration-150"
              onClick={() => {
                logout();
                navigate("/");
                displayToast({
                  message: "Logged Out",
                  type: "info",
                });
              }}
            >
              Logout
            </button>
          }
        </ul>
        <button
          className="w-auto h-auto p-1 border rounded border-slate-800 flex justify-center items-center md:hidden cursor-pointer"
          onClick={() => setShowMobileNav(showMobileNav => !showMobileNav)}
        >
        <svg width="2rem" height="2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
          <g id="SVGRepo_iconCarrier">
            <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokeLinecap="round"/>
          </g>
        </svg>
        </button>
      </div>
      <ul className={`z-40 absolute top-0 right-0 h-[100vh] w-[25%] min-h-[10rem] min-w-[10rem] px-4 py-10 bg-gray-50 border ${mobileNavClassName} md:hidden`}>
        <>
          <button
          className="cursor-pointer border-2 border-slate-800 rounded p-2 absolute top-2 right-2"
          onClick={() => setShowMobileNav(showMobileNav => !showMobileNav)}
        >
          <svg
            viewBox="0 0 12 12"
            width="12"
            height="12"
          >
            <line
              x1="0" y1="0"
              x2="12" y2="12"
              stroke="black"
              strokeWidth="2"
            />
            <line
              x1="0" y1="12"
              x2="12" y2="0"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </button>
          { isAdmin ?
            <>
              <Navitem label="Products" link="admin/products" />
              <Navitem label="+ Product" link="admin/add-product" />
              <Navitem label="Orders" link="admin/orders" />
            </>
            :
            <>
              <Navitem label="Cart" link="cart" />
              <Navitem label="Orders" link="orders" />
            </>
          }
          { !currentUser ?
            <Navitem label="Sign In" link="signin" />
            :
            <li
              className="ml-6 px-4 py-2 text-center cursor-pointer hover:underline transition duration-150"
              onClick={() => {
                logout();
                navigate("/");
                displayToast({
                  message: "Logged Out",
                  type: "info",
                });
              }}
            >
              Logout
            </li>
          }
        </>
      </ul>
    </nav>
  )
}

function Navitem({ label, link }) {
  return (
    <li className="ml-6 px-4 py-2 text-center cursor-pointer hover:underline transition duration-150">
      <Link to={link}>{label}</Link>
    </li>
  );
}

export default Navbar;
