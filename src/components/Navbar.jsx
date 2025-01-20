import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { globalContext } from "../context/globalState";
import { capitalize, checkAdmin } from "../helpers";

function Navbar() {
  const { globalState: { currentUser } } = useContext(globalContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const accountBtnRef = useRef();
  const dropdownRef = useRef();

  // Add Eventlistener on body to close dropdown when clicked elsewhere.
  useEffect(() => {
    function closeDropdown(event) {
      if (!accountBtnRef.current) {
        return;
      }

      if (
        dropdownRef.current?.contains(event.target) ||
        accountBtnRef.current?.contains(event.target)
      ) {
        return;
      } else {
        setShowDropdown(false);
        accountBtnRef.current.removeAttribute("open");
      }
    }

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  // Dropdown should be closed when logged out
  // Find better solution to this
  useEffect(() => {
    setShowDropdown(false);
  }, [currentUser]);

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

  function toggleDropdown(event) {
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      event.target.removeAttribute("open");
    } else {
      event.target.setAttribute("open", true);
    }
  }

  return (
    <nav className="bg-primary text-tertiary font-primary border-b-[0.8rem] border-secondary">
      <div className="container relative m-auto flex items-center justify-between py-2">
        <div>
          <Link to="/" className="text-4xl">
            <span className="text-5xl font-extrabold text-secondary">K</span>art
          </Link>
          {
            currentUser &&
            <span className="ml-4 text-white text-xl font-secondary">
              Hello, {capitalize(currentUser.name.split(" ")[0])}
            </span>
          }
        </div>
            <ul className="flex justify-center items-center">
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
                  className="ml-6 px-4 py-2 text-center cursor-pointer group hover:bg-white hover:text-primary transition delay-100 group"
                  onClick={event => toggleDropdown(event)}
                  ref={accountBtnRef}
                >
                  Account
                  <svg
                    className="inline-block ml-2 transition duration-100 group-open:-rotate-180"
                    width="12"
                    height="8"
                    viewBox="0 0 80 50"
                    preserveAspectRatio="none"
                  >
                    <path
                      className="transition duration-100 group-hover:stroke-primary"
                      d="M0 0 L40 50"
                      fill="none"
                      stroke="white"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                    <path
                      className="transition duration-100 group-hover:stroke-primary"
                      d="M40 50 L80 0"
                      fill="none"
                      stroke="white"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                  </svg>
              </li>
              }
            </ul>
            <Dropdown
              show={showDropdown}
              dropdownRef={dropdownRef}
              isAdmin={isAdmin}
            />
      </div>
    </nav>
  )
}

function Navitem({ label, link }) {
  return (
    <li className="ml-6 px-4 py-2 w-30 text-center cursor-pointer bg-white text-primary transition delay-100">
      <Link to={link}>{label}</Link>
    </li>
  );
}

function Dropdown({ show, dropdownRef, isAdmin }) {
  const { logout, displayToast } = useContext(globalContext);
  const navigate = useNavigate();

  return (
    <ul
      className={!show ? "hidden" : "bg-white px-3 py-1 divide-y w-40 absolute right-0 border  top-[80%] text-primary transition delay-100"}
      ref={dropdownRef}
    >
      { !isAdmin &&
        <>
          <li className="px-2 py-2 cursor-pointer delay-100">Profile</li>
          <li className="px-2 py-2 cursor-pointer delay-100">Settings</li>
        </>
      }
      <li
        className="px-2 py-2 cursor-pointer delay-100"
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
    </ul>
  );
}

export default Navbar;
