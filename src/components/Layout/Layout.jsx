import React from "react";
import Navbar from "../Navbar";
import Toast from "../Toast";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Toast />
      <main className="container mx-auto py-4 px-2 font-primary font-medium">
        { children }
      </main>
    </>
  );
}

export default Layout;