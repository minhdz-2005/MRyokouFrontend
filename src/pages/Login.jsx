// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaPlane, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';
import { MdEmail, MdTravelExplore } from 'react-icons/md';
import { BiWorld } from 'react-icons/bi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    // Animation khi component mount
    setIsVisible(true);
    
    // Kiểm tra email đã lưu
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        { email, password }
      );

      // Lưu token
      localStorage.setItem('accessToken', res.data.token);

      // Lấy thông tin account từ API riêng
      let accountData = null;
      try {
        const accountRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/accounts/by-user/${res.data.user._id || res.data.user.id}`,
          {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          }
        );
        accountData = accountRes.data;
      } catch (accountErr) {
        console.log('Không thể lấy thông tin account:', accountErr);
        // Vẫn tiếp tục đăng nhập dù không lấy được account
      }

      // Sử dụng context để login
      login(res.data.user, accountData);

      // Lưu thông tin đăng nhập nếu chọn "Ghi nhớ tôi"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Success animation trước khi điều hướng
      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng mạng xã hội
  const handleSocialLogin = (provider) => {
    console.log(`Đăng nhập bằng ${provider}`);
    // Implement social login logic here
  };

  return (
    <>
      <Header />

      <div className="login-container">
        {/* Background decorations */}
        <div className="bg-decoration">
          <div className="floating-icon icon-1"><FaPlane /></div>
          <div className="floating-icon icon-2"><FaMapMarkerAlt /></div>
          <div className="floating-icon icon-3"><BiWorld /></div>
          <div className="floating-icon icon-4"><MdTravelExplore /></div>
          <div className="floating-icon icon-5"><FaHeart /></div>
        </div>

        <div className={`login-wrapper ${isVisible ? 'fade-in' : ''}`}>
          <div className="row h-100 align-items-center">
            {/* Left Side - Hero Section */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="login-hero">
                <div className="hero-content">
                  <div className="hero-badge">
                    <MdTravelExplore className="me-2" />
                    <span>MRYOKOU</span>
                  </div>
                  
                  <h1 className="hero-title">
                    Chào mừng trở lại!
                    <span className="title-accent">✈️</span>
                  </h1>
                  
                  <p className="hero-subtitle">
                    Đăng nhập để khám phá những điểm đến tuyệt vời và tạo nên 
                    những kỷ niệm không thể nào quên cùng chúng tôi
                  </p>

                  <div className="hero-features">
                    <div className="feature-item">
                      <div className="feature-icon">
                        <FaMapMarkerAlt />
                      </div>
                      <div className="feature-text">
                        <h6>1000+ Điểm đến</h6>
                        <p>Khám phá thế giới</p>
                      </div>
                    </div>
                    
                    <div className="feature-item">
                      <div className="feature-icon">
                        <FaHeart />
                      </div>
                      <div className="feature-text">
                        <h6>Trải nghiệm đáng nhớ</h6>
                        <p>Kỷ niệm trọn đời</p>
                      </div>
                    </div>
                  </div>

                  <div className="hero-stats">
                    <div className="stat-item">
                      <h4>50k+</h4>
                      <p>Khách hàng hài lòng</p>
                    </div>
                    <div className="stat-item">
                      <h4>4.9★</h4>
                      <p>Đánh giá trung bình</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="col-lg-6">
              <div className="login-form-wrapper">
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="form-header text-center mb-4">
                    <div className="form-logo mb-3">
                      <div className="logo-circle">
                        <MdTravelExplore size={24} />
                      </div>
                    </div>
                    <h3 className="form-title">Đăng nhập tài khoản</h3>
                    <p className="form-subtitle">Nhập thông tin để tiếp tục hành trình</p>
                  </div>

                  {errMsg && (
                    <div className="alert alert-danger alert-custom fade-in" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {errMsg}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group-custom">
                      <span className="input-icon">
                        <MdEmail />
                      </span>
                      <input
                        type="email"
                        className="form-control form-control-custom"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <div className="input-group-custom">
                      <span className="input-icon">
                        <FaLock />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-custom"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-options d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check custom-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Ghi nhớ tôi
                      </label>
                    </div>
                    <Link to="/forgot-password" className="forgot-password-link">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-primary btn-login w-100 mb-4 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <span>Đăng nhập</span>
                        <i className="fas fa-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="social-login">
                    <div className="divider-custom">
                      <span>Hoặc đăng nhập bằng</span>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger w-100 social-btn google-btn"
                          onClick={() => handleSocialLogin('google')}
                        >
                          <FaGoogle className="me-2" />
                          Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary w-100 social-btn facebook-btn"
                          onClick={() => handleSocialLogin('facebook')}
                        >
                          <FaFacebookF className="me-2" />
                          Facebook
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="signup-link text-center mt-4">
                    <p className="mb-0">
                      Chưa có tài khoản? 
                      <Link to="/signup" className="signup-link-text ms-1">
                        Tạo tài khoản mới
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;