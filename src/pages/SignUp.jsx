// src/pages/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaGoogle, 
  FaFacebookF,
  FaPlane,
  FaMapMarkerAlt,
  FaHeart,
  FaShieldAlt,
  FaGift,
  FaHeadset,
  FaCheckCircle,
  FaStar
} from 'react-icons/fa';
import { MdTravelExplore, MdVerifiedUser } from 'react-icons/md';
import { BiWorld, BiSupport } from 'react-icons/bi';
import { RiVipCrownFill } from 'react-icons/ri';
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
  const [isVisible, setIsVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Animation khi component mount
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Tính toán độ mạnh mật khẩu
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (password.length >= 8) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      return strength;
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return { text: 'Yếu', class: 'weak' };
      case 2:
      case 3: return { text: 'Trung bình', class: 'medium' };
      case 4:
      case 5: return { text: 'Mạnh', class: 'strong' };
      default: return { text: '', class: '' };
    }
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

    // Validate password strength
    if (passwordStrength < 2) {
      setErrMsg('Mật khẩu quá yếu. Vui lòng tạo mật khẩu mạnh hơn');
      return;
    }

    setLoading(true);

    try {
      // Bước 1: Đăng ký user với role mặc định là 'user'
      const registerResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
        role: 'user' // Mặc định role là user
      });

      // Bước 2: Tạo account cho user vừa đăng ký
      if (registerResponse.data && registerResponse.data.user) {
        const userId = registerResponse.data.user._id || registerResponse.data.user.id;
        
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/accounts`, {
          userID: userId,
          avatar: '', // Để trống, user có thể cập nhật sau
          description: '', // Để trống, user có thể cập nhật sau
          country: '', // Để trống, user có thể cập nhật sau
          phoneNumber: '' // Để trống, user có thể cập nhật sau
        });
      }

      // Success animation trước khi điều hướng
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            signupSuccess: true,
            registeredEmail: formData.email 
          },
          replace: true 
        });
      }, 1000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Đăng ký bằng ${provider}`);
    // Implement social signup logic here
  };

  return (
    <>
      <Header />

      <div className="signup-container">
        {/* Background decorations */}
        <div className="bg-decoration">
          <div className="floating-icon icon-1"><FaPlane /></div>
          <div className="floating-icon icon-2"><FaMapMarkerAlt /></div>
          <div className="floating-icon icon-3"><BiWorld /></div>
          <div className="floating-icon icon-4"><MdTravelExplore /></div>
          <div className="floating-icon icon-5"><FaHeart /></div>
          <div className="floating-icon icon-6"><FaStar /></div>
        </div>

        <div className={`signup-wrapper ${isVisible ? 'fade-in' : ''} border border-0`}>
          <div className="row align-items-center">
            {/* Left Side - Hero Section */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="signup-hero">
                <div className="hero-content">
                  <div className="hero-badge">
                    <MdTravelExplore className="me-2" />
                    <span>Tham gia MRYOKOU</span>
                  </div>
                  
                  <h1 className="hero-title">
                    Bắt đầu hành trình mới!
                    <span className="title-accent">🌟</span>
                  </h1>
                  
                  <p className="hero-subtitle">
                    Đăng ký để mở khóa thế giới du lịch với những trải nghiệm tuyệt vời
                  </p>

                  <div className="hero-benefits">
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaShieldAlt />
                      </div>
                      <div className="benefit-text">
                        <h6>Bảo mật tuyệt đối</h6>
                        <p>Thông tin được mã hóa an toàn</p>
                      </div>
                    </div>
                    
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <RiVipCrownFill />
                      </div>
                      <div className="benefit-text">
                        <h6>Đa dạng điểm đến</h6>
                        <p>Hơn 1,200 tour du lịch khắp Việt Nam</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaHeadset />
                      </div>
                      <div className="benefit-text">
                        <h6>Hỗ trợ 24/7</h6>
                        <p>Tư vấn miễn phí mọi lúc</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaGift />
                      </div>
                      <div className="benefit-text">
                        <h6>Bảo đảm an toàn</h6>
                        <p>Chính sách hoàn tiền 100% nếu không đúng cam kết hoặc có sự cố phát sinh.</p>
                      </div>
                    </div>
                  </div>

                  <div className="hero-testimonial">
                    <div className="testimonial-content">
                      <div className="stars">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <p>"Dịch vụ tuyệt vời! Đã có những chuyến đi đáng nhớ nhất đời"</p>
                      <div className="testimonial-author">
                        <strong>Nguyễn Đức Minh</strong>
                        <span>Thành viên VIP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="col-lg-6">
              <div className="signup-form-wrapper">
                <form className="signup-form" onSubmit={handleSignUp}>
                  <div className="form-header text-center mb-4">
                    <div className="form-logo mb-3">
                      <div className="logo-circle">
                        <MdVerifiedUser size={24} />
                      </div>
                    </div>
                    <h3 className="form-title">Tạo tài khoản mới</h3>
                    <p className="form-subtitle">Điền thông tin để bắt đầu khám phá</p>
                  </div>

                  {errMsg && (
                    <div className="alert alert-danger alert-custom fade-in" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {errMsg}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label">Họ và tên</label>
                    <div className="input-group-custom">
                      <span className="input-icon">
                        <FaUser />
                      </span>
                      <input
                        type="text"
                        name="fullname"
                        className="form-control form-control-custom"
                        required
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group-custom">
                      <span className="input-icon">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-custom"
                        required
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        className="form-control form-control-custom"
                        required
                        minLength="6"
                        value={formData.password}
                        onChange={handleChange}
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
                    {formData.password && (
                      <div className="password-strength mt-2">
                        <div className="strength-bar-container">
                          <div 
                            className={`strength-bar ${getPasswordStrengthText().class}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-1">
                          <span className={`strength-text ${getPasswordStrengthText().class}`}>
                            {getPasswordStrengthText().text}
                          </span>
                          <small className="text-muted">
                            {passwordStrength >= 3 ? (
                              <span className="text-success">
                                <FaCheckCircle className="me-1" />
                                Mật khẩu mạnh
                              </span>
                            ) : (
                              'Sử dụng chữ hoa, số và ký tự đặc biệt'
                            )}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <div className="input-group-custom">
                      <span className="input-icon">
                        <FaLock />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className={`form-control form-control-custom ${
                          formData.confirmPassword && formData.password !== formData.confirmPassword 
                            ? 'is-invalid' 
                            : formData.confirmPassword && formData.password === formData.confirmPassword 
                            ? 'is-valid' 
                            : ''
                        }`}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <div className="mt-1">
                        {formData.password === formData.confirmPassword ? (
                          <small className="text-success">
                            <FaCheckCircle className="me-1" />
                            Mật khẩu khớp
                          </small>
                        ) : (
                          <small className="text-danger">
                            Mật khẩu không khớp
                          </small>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <div className="form-check custom-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="termsAgreed"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="termsAgreed">
                        Tôi đồng ý với{' '}
                        <Link to="/terms" className="terms-link">Điều khoản dịch vụ</Link>
                        {' '}và{' '}
                        <Link to="/privacy" className="terms-link">Chính sách bảo mật</Link>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-success btn-signup w-100 mb-4 ${loading ? 'loading' : ''}`}
                    disabled={loading || !termsAgreed}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      <>
                        <span>Đăng ký ngay</span>
                        <i className="fas fa-rocket ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="social-signup">
                    <div className="divider-custom">
                      <span>Hoặc đăng ký bằng</span>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger w-100 social-btn google-btn"
                          onClick={() => handleSocialSignup('google')}
                        >
                          <FaGoogle className="me-2" />
                          Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary w-100 social-btn facebook-btn"
                          onClick={() => handleSocialSignup('facebook')}
                        >
                          <FaFacebookF className="me-2" />
                          Facebook
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="login-link text-center mt-4">
                    <p className="mb-0">
                      Đã có tài khoản? 
                      <Link to="/login" className="login-link-text ms-1">
                        Đăng nhập ngay
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

export default SignUp;