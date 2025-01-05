import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
 } from "react-router";
import { useContext } from "react";
import { globalContext, GlobalContextProvider } from "./context/globalState";
import HomePage from "./pages/Home";
import SignupPage from "./pages/Signup";
import SigninPage from "./pages/Signin";
import CartPage from "./pages/Cart";
import OrdersPage from "./pages/Orders";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <GlobalContextProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SigninPage />} />
          </Routes>
        </Layout>
      </Router>
    </GlobalContextProvider>
  );
}

function ProtectedRoute({ children }) {
  const { globalState } = useContext(globalContext);

  if (globalState.currentUser) {
    return { children }
  } else {
    return <Navigate to="/signin" />
  }
}

export default App;
