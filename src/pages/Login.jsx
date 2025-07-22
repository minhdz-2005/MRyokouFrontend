// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/login`,
        { email, password }
      );

      // Lưu token & thông tin user
      localStorage.setItem('accessToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Lưu thông tin đăng nhập nếu chọn "Ghi nhớ tôi"
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Điều hướng về trang chủ hoặc trang trước đó
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập bằng mạng xã hội
  const handleSocialLogin = () => {
  };

  return (
    <>
      <Header />

      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-hero">
              <h2>Chào mừng trở lại!</h2>
              <p>Đăng nhập để khám phá những hành trình mới và trải nghiệm du lịch tuyệt vời</p>
            </div>
          </div>

          <div className="login-right">
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-header">
                <h3>Đăng nhập</h3>
                <p>Nhập thông tin đăng nhập của bạn</p>
              </div>

              {errMsg && (
                <div className="alert-error">
                  <span>{errMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <div className="input-group">
                  <span className="input-icon">
                    <MdEmail />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
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

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Ghi nhớ tôi</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  'Đăng nhập'
                )}
              </button>

              <div className="social-login">
                <p className="divider">
                  <span>Hoặc đăng nhập bằng</span>
                </p>
                <div className="social-buttons">
                  <button 
                    type="button" 
                    className="social-btn google"
                    onClick={() => handleSocialLogin('google')}
                  >
                    <FaGoogle /> Google
                  </button>
                  <button 
                    type="button" 
                    className="social-btn facebook"
                    onClick={() => handleSocialLogin('facebook')}
                  >
                    <FaFacebookF /> Facebook
                  </button>
                </div>
              </div>

              <p className="signup-link">
                Chưa có tài khoản? <Link to="/signup">Tạo tài khoản mới</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;