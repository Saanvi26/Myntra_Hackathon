import React from "react";
import { useNavigate } from "react-router-dom";

const NavLink = ({ text, showNewTag = false }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    const result = text.replace(/\s+/g, "");
    navigate(`/${result.toLowerCase()}`);
  };

  return (
    <a href="#" className="nav-link" onClick={handleClick}>
      {text}
      {showNewTag && <span className="new-tag">NEW</span>}
    </a>
  );
};

export default NavLink;
