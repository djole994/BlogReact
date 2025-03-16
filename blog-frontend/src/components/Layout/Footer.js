import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      © {new Date().getFullYear()} MyBlog. All rights reserved.
    </footer>
  );
};

export default Footer;
