// src/components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { TbPlaneDeparture } from 'react-icons/tb';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  /* ───────────────── 1. Xử lý cuộn trang (giữ nguyên) ───────────────── */
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
    navigate('/'); // về trang Home
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light shadow-sm fixed-top ${
        scrolled ? 'scrolled' : ''
      }`}
    >
      <div className="container">
        <Link className="navbar-brand" to="/">
          <TbPlaneDeparture /> MRYOKOU
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
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tour">
                Tour
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/explore">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
          </ul>

          {/* ───────────── 4. Điều kiện hiển thị nút ───────────── */}
          {!currentUser ? (
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {/* Avatar tạm là icon; sau này thay = ảnh user.avatar */}
              <FaUserCircle size={28} />
              <span className="fw-semibold">{currentUser.fullname}</span>
              <button
                className="btn btn-outline-danger btn-sm ms-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
