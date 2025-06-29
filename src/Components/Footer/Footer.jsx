import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa";

import './Footer.css';  

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Travly</h3>
        <p>Explore. Book. Travel.</p>
        <div className="footer-icons">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaGithub /></a>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Travly. All rights reserved.</p>
      </div>
    </footer>
  );
}


