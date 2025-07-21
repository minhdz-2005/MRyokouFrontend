// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { TbPlaneDeparture } from 'react-icons/tb';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { MdOutlineTravelExplore } from 'react-icons/md';
import { BiLogIn, BiUserPlus } from 'react-icons/bi';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  /* ───────────────── 1. Xử lý cuộn trang ───────────────── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ───────────────── 2. Lấy user từ localStorage ───────────────── */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setCurrentUser(JSON.parse(stored));
  }, []);

  /* ───────────────── 3. Đăng xuất ───────────────── */
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setShowDropdown(false);
    navigate('/');
  };

  /* ───────────────── 4. Toggle dropdown user ───────────────── */
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light fixed-top ${
        scrolled ? 'scrolled' : ''
      }`}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <TbPlaneDeparture className="brand-icon" />
          <span className="brand-text">MRYOKOU</span>
          <span className="brand-tagline">Travel & Explore</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 me-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <span className="nav-link-content">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tour">
                <span className="nav-link-content">Tours</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore">
                <MdOutlineTravelExplore className="nav-icon" />
                <span className="nav-link-content">Explore</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                <span className="nav-link-content">About</span>
              </Link>
            </li>
          </ul>

          {/* ───────────── 5. Điều kiện hiển thị nút ───────────── */}
          {!currentUser ? (
            <div className="d-flex auth-buttons">
              <Link to="/login" className="btn btn-outline-primary me-2 login-btn">
                <BiLogIn className="btn-icon" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn btn-primary signup-btn">
                <BiUserPlus className="btn-icon" />
                <span>Sign up</span>
              </Link>
            </div>
          ) : (
            <div className="user-menu position-relative">
              <div 
                className="d-flex align-items-center user-info"
                onClick={toggleDropdown}
              >
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="User avatar" 
                    className="user-avatar rounded-circle"
                  />
                ) : (
                  <FaUserCircle className="user-avatar" size={28} />
                )}
                <span className="user-name ms-2">{currentUser.fullname}</span>
                <FaChevronDown className={`dropdown-arrow ms-1 ${showDropdown ? 'rotate' : ''}`} />
              </div>
              
              {showDropdown && (
                <div className="user-dropdown shadow">
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/bookings" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    My Bookings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;