import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { globalContext } from "../context/globalState";

function Navbar() {
  const { globalState: { currentUser } } = useContext(globalContext);
  const isAdmin = currentUser?.isAdmin ?? true;
  console.log("nav isadmin", isAdmin);

  const [showDropdown, setShowDropdown] = useState(false);
  const accountBtnRef = useRef();
  const dropdownRef = useRef();

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

  function toggleDropdown(event) {
    setShowDropdown(!showDropdown);
    if (showDropdown) {
      event.target.removeAttribute("open");
    } else {
      event.target.setAttribute("open", true);
    }
  }

  return (
    <nav className="bg-primary text-tertiary font-sans">
      <div className="container relative m-auto flex items-center justify-between py-2">
        <Link to="/" className="text-4xl">
          <span className="text-5xl font-extrabold text-secondary">K</span>art
        </Link>
            <ul className="flex justify-center">
              { isAdmin ?
                <>
                  <Navitem label="Products" link="admin/products" />
                  <Navitem label="Users" link="admin/users" />
                  <Navitem label="Orders" link="admin/orders" />
                </>
                :
                <>
                  <Navitem label="Cart" link="cart" />
                  <Navitem label="Orders" link="orders" />
                </>
              }
              { currentUser ?
                <Navitem label="Sign In" link="signin" />
                :
                <li
                  className="ml-6 px-4 py-2 rounded text-center cursor-pointer transition delay-100 hover:bg-tertiary hover:text-primary group"
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
    <li className="ml-6 px-4 py-2 w-24 rounded text-center cursor-pointer transition delay-100 hover:bg-tertiary hover:text-primary">
      <Link to={link}>{label}</Link>
    </li>
  );
}

function Dropdown({ show, dropdownRef, isAdmin }) {
  console.log("isAdmin", isAdmin);
  const { logout, displayToast } = useContext(globalContext);
  const navigate = useNavigate();

  return (
    <ul
      className={!show ? "hidden" : "bg-white px-3 py-1 divide-y w-40 absolute right-0 border rounded top-[80%] text-primary transition delay-100"}
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
          logout;
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
