import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";

const Layout = ({ children, user, setUser }) => {
  return (
    <>
      <Navigation user={user} setUser={setUser} />
      <div style={{ marginTop: "70px", paddingBottom: "60px" }}>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
