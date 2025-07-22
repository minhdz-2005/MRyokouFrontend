// src/components/Footer.jsx
import React from 'react';
import './Footer.css';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronRight
} from 'react-icons/fa';
import { TbPlaneDeparture } from 'react-icons/tb';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="row gy-4">

            {/* Brand & Description */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-brand">
                <TbPlaneDeparture className="brand-icon" />
                <span className="brand-name">MRYOKOU</span>
              </div>
              <p className="footer-description">
                Nền tảng đặt tour du lịch tiện lợi, uy tín và giá tốt hàng đầu Việt Nam.
              </p>
              <div className="social-links">
                <a href="#" className="social-link facebook"><FaFacebookF /></a>
                <a href="#" className="social-link instagram"><FaInstagram /></a>
                <a href="#" className="social-link twitter"><FaTwitter /></a>
                <a href="#" className="social-link youtube"><FaYoutube /></a>
              </div>
            </div>

            <div className="col-lg-1 col-md-6"></div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Liên kết nhanh</h5>
              <ul className="footer-links">
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/">Trang chủ</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/tour">Tour du lịch</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/explore">Khám phá</a>
                </li>
                <li>
                  <FaChevronRight className="link-icon" />
                  <a href="/about">Về chúng tôi</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-1 col-md-6"></div>

            {/* Contact Info */}
            <div className="col-lg-5 col-md-6">
              <h5 className="footer-title">Liên hệ</h5>
              <ul className="footer-contact">
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</span>
                </li>
                <li>
                  <FaPhoneAlt className="contact-icon" />
                  <span>0388 108 368</span>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <span>support@mryokou.vn</span>
                </li>
              </ul>

              {/* Newsletter Subscription */}
              <div className="newsletter">
                <h6>Đăng ký nhận tin</h6>
                <p>Nhận ưu đãi và thông tin tour mới nhất</p>
                <form className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Nhập email của bạn" 
                    className="form-control" 
                  />
                  <button type="submit" className="btn-subscribe">
                    Đăng ký
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="copyright">
                &copy; {currentYear} <strong>MRYOKOU</strong>. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;