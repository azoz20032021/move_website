
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";



export default function Header() {
      const [menuOpen, setMenuOpen] = useState(false);
    return( 
         <div className="app-header">
    <header className="header">
            <IconButton
      onClick={() => setMenuOpen(!menuOpen)}
      color="secondary"
      sx={{
        display: { xs: "block", md: "none" }, 
        position: "absolute",
        top: 1.67,
        left: 10,
        zIndex: 10,
        bgcolor: "white",
        color: "black",
        boxShadow: 1,
        "&:hover": {
          bgcolor: "primary",
          color: "black",
        },
      }}
    >
      {menuOpen ? <CloseIcon /> : <MenuIcon />}
    </IconButton>
    
            <nav className={`menu ${menuOpen ? "open" : ""}`}>
              <Link to="/" className="menu-item">
                Home
              </Link>
              <Link to="/Popular" className="menu-item">
                Popular
              </Link>
              <Link to="/Top" className="menu-item">
                Movies You May Like
              </Link>
            </nav>
            <div className="logo-title">
              <span className="logo" role="img" aria-label="logo">
                🎬
              </span>
              <span className="title-text">Movie App</span>
            </div>
          </header>
          </div>
    )
}