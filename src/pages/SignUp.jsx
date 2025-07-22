// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { RiShieldUserFill } from 'react-icons/ri';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrMsg('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    // Validate terms agreement
    if (!termsAgreed) {
      setErrMsg('Vui lòng đồng ý với điều khoản dịch vụ');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`http://localhost:5000/api/auth/register`, {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password
      });

      // Redirect to login with success state
      navigate('/login', { 
        state: { 
          signupSuccess: true,
          registeredEmail: formData.email 
        },
        replace: true 
      });

    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = () => {    
  };

  return (
    <>
      <Header />

      <div className="signup-container">
        <div className="signup-wrapper">
          <div className="signup-left">
            <div className="signup-hero">
              <h2>Bắt đầu hành trình mới!</h2>
              <p>Đăng ký để mở khóa thế giới du lịch với những ưu đãi đặc biệt dành riêng cho bạn</p>
              <div className="signup-benefits">
                <div className="benefit-item">
                  <RiShieldUserFill className="benefit-icon" />
                  <span>Tài khoản bảo mật cao</span>
                </div>
                <div className="benefit-item">
                  <RiShieldUserFill className="benefit-icon" />
                  <span>Ưu đãi thành viên</span>
                </div>
                <div className="benefit-item">
                  <RiShieldUserFill className="benefit-icon" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="signup-right">
            <form className="signup-form" onSubmit={handleSignUp}>
              <div className="form-header">
                <h3>Tạo tài khoản</h3>
                <p>Điền thông tin để bắt đầu trải nghiệm</p>
              </div>

              {errMsg && (
                <div className="alert-error">
                  <span>{errMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label>Họ và tên</label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="fullname"
                    required
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nhập họ tên đầy đủ"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="password-strength">
                  <div 
                    className={`strength-bar ${formData.password.length > 0 ? 'active' : ''} 
                    ${formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak'}`}
                  ></div>
                  <span className="strength-text">
                    {formData.password.length >= 8 ? 'Mạnh' : 
                     formData.password.length >= 6 ? 'Trung bình' : 
                     formData.password.length > 0 ? 'Yếu' : ''}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <div className="input-group">
                  <span className="input-icon">
                    <FaLock />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="terms-agreement">
                  <input
                    type="checkbox"
                    id="termsAgreed"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                  />
                  <label htmlFor="termsAgreed">
                    Tôi đồng ý với <Link to="/#">Điều khoản dịch vụ</Link> và <Link to="/#">Chính sách bảo mật</Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="signup-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  'Đăng ký ngay'
                )}
              </button>

              <div className="social-signup">
                <p className="divider">
                  <span>Hoặc đăng ký bằng</span>
                </p>
                <div className="social-buttons">
                  <button 
                    type="button" 
                    className="social-btn google"
                    onClick={() => handleSocialSignup('google')}
                  >
                    <FaGoogle /> Google
                  </button>
                  <button 
                    type="button" 
                    className="social-btn facebook"
                    onClick={() => handleSocialSignup('facebook')}
                  >
                    <FaFacebookF /> Facebook
                  </button>
                </div>
              </div>

              <p className="login-link">
                Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;