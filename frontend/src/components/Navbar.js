import React from "react";
import NavLink from "./NavLink";
import "../App.css";
import "./Navbar.css";
import myntraLogo from '../assets/Myntra-logo.png';

function Navbar() {
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

        {/* User Icons */}
        <div className="user-actions">
          <div className="action-item">
            <div className="action-icon">👤</div>
            <span>Profile</span>
          </div>
          <div className="action-item">
            <div className="action-icon">❤️</div>
            <span>Wishlist</span>
          </div>
          <div className="action-item">
            <div className="action-icon">🛍️</div>
            <span>Bag</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
