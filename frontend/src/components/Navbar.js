import React from "react";
import NavLink from "./NavLink";
import "../App.css";
import "./Navbar.css";
import myntraLogo from '../assets/Myntra-logo.png';

import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const openAuth = (mode) => {
    try { window.dispatchEvent(new CustomEvent("open-auth", { detail: { mode } })); } catch {}
    const ts = Date.now();
    navigate(`/?auth=${mode}&ts=${ts}`);
  };
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <div className="myntra-logo">
            <a href="/">
              <img src={myntraLogo} alt="Myntra Logo" width={80} height={60} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="navigation">
          <NavLink text="MEN" />
          <NavLink text="WOMEN" />
          <NavLink text="KIDS" />
          <NavLink text="HOME" />
          <NavLink text="BEAUTY" />
          <NavLink text="GENZ" />
          <NavLink text="STUDIO" showNewTag={true} />
          <NavLink text="GROUP SHOPPING" />
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for products, brands and more"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          <Link to="/?auth=login" onClick={(e) => { e.preventDefault(); openAuth("login"); }} className="auth-btn login-btn">Login</Link>
          <Link to="/?auth=signup" onClick={(e) => { e.preventDefault(); openAuth("signup"); }} className="auth-btn signup-btn">Sign up</Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
