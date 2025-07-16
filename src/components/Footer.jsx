// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer py-5 text-white">
      <div className="container">
        <div className="row">

          {/* Logo và mô tả */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning">MRYOKOU</h4>
            <p className="small">
              Nền tảng đặt tour du lịch tiện lợi, uy tín và giá tốt hàng đầu Việt Nam.
            </p>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaYoutube /></a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-semibold">Liên kết nhanh</h5>
            <ul className="list-unstyled small">
              <li><a href="#">Trang chủ</a></li>
              <li><a href="#">Tour nổi bật</a></li>
              <li><a href="#">Về chúng tôi</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-semibold">Liên hệ</h5>
            <ul className="list-unstyled small">
              <li>Email: support@mryokou.vn</li>
              <li>Hotline: 0123 456 789</li>
              <li>Địa chỉ: Hai Chau, Da Nang, Việt Nam</li>
            </ul>
          </div>
        </div>

        <hr className="border-light" />

        <p className="text-center small mb-0">&copy; 2025 MRYOKOU. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
