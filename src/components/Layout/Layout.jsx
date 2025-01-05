import React from "react";
import Navbar from "../Navbar";
import Toast from "../Toast";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Toast message="This is a new component" type="info" />
      <main className="container mx-auto py-4">
        { children }
      </main>
    </>
  );
}

export default Layout;
