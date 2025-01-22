import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { globalContext } from "../context/globalState";
import { capitalize, checkAdmin } from "../helpers";

function Navbar() {
  const { globalState: { currentUser }, logout, displayToast } = useContext(globalContext);
  const [isAdmin, setIsAdmin] = useState(false);
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

  return (
    <nav className="bg-gray-50 text-slate-800 shadow-lg">
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
      </div>
    </nav>
  )
}

function Navitem({ label, link }) {
  return (
    <li className="ml-6 px-4 py-2 w-30 text-center cursor-pointer hover:underline transition duration-150">
      <Link to={link}>{label}</Link>
    </li>
  );
}

export default Navbar;
