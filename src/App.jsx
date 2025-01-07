import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
 } from "react-router";
import { useContext, useState, useEffect } from "react";
import { globalContext, GlobalContextProvider } from "./context/globalState";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";
import ProductsPageAdmin from "./pages/admin/Products";
import AddProductPageAdmin from "./pages/admin/AddProduct";
import OrdersPageAdmin from "./pages/admin/Orders";
import { checkAdmin } from "./helpers";

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={
              <UserProtectedRoute>
                <CartPage />
              </UserProtectedRoute>
            } />
            <Route path="/orders" element={
              <UserProtectedRoute>
                <OrdersPage />
              </UserProtectedRoute>
            } />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/admin">
              <Route path="products" element={
                <AdminProtectedRoute>
                  <ProductsPageAdmin />
                </AdminProtectedRoute>
              } />
              <Route path="add-product" element={
                <AdminProtectedRoute>
                  <AddProductPageAdmin />
                </AdminProtectedRoute>
              } />
              <Route path="orders" element={
                <AdminProtectedRoute>
                  <OrdersPageAdmin />
                </AdminProtectedRoute>
              } />
            </Route>
          </Routes>
        </Layout>
      </Router>
    </GlobalContextProvider>
  );
}

function UserProtectedRoute({ children }) {
  const { globalState: { currentUser } } = useContext(globalContext);

  if (currentUser) {
    return { children }
  } else {
    return <Navigate to="/signin" />
  }
}

function AdminProtectedRoute({ children }) {
  const {
    globalState: { currentUser },
    displayToast,
  } = useContext(globalContext);

  const [isAdmin, setIsAdmin] = useState(null); // `null` indicates loading state

  useEffect(() => {
    if (currentUser) {
      checkAdmin(currentUser.uid)
        .then(isAdmin => {
          setIsAdmin(isAdmin);
        })
        .catch(error => {
          setIsAdmin(false); // Deny access on error
          displayToast({
            message: error.message,
            type: "error",
          });
        });
    } else {
      setIsAdmin(false); // Deny access if no user is logged in
    }
  }, [currentUser, displayToast]);

  if (isAdmin === null) {
    // Show a loading indicator while checking admin status
    return <div>Loading...</div>;
  }

  if (!currentUser || !isAdmin) {
    // Redirect if not logged in or not an admin
    return <Navigate to="/signin" />;
  }

  // Render children if the user is an admin
  return children;
}

export default App;
