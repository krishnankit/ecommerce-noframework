import React from "react";
import Navbar from "../Navbar";
import Toast from "../Toast";
import Footer from "../Footer";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Toast />
      <main className="container mx-auto py-4 px-2 font-primary font-medium">
        { children }
      </main>
      <Footer />
    </>
  );
}

export default Layout;