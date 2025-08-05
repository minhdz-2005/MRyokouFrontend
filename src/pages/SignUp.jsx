// src/pages/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      case 1: return { text: t('signup.form.passwordStrength.weak'), class: 'weak' };
      case 2:
      case 3: return { text: t('signup.form.passwordStrength.medium'), class: 'medium' };
      case 4:
      case 5: return { text: t('signup.form.passwordStrength.strong'), class: 'strong' };
      default: return { text: '', class: '' };
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrMsg('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setErrMsg(t('signup.error.passwordMismatch'));
      return;
    }

    // Validate terms agreement
    if (!termsAgreed) {
      setErrMsg(t('signup.error.termsNotAgreed'));
      return;
    }

    // Validate password strength
    if (passwordStrength < 2) {
      setErrMsg(t('signup.error.weakPassword'));
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
      const msg = err.response?.data?.message || t('signup.error.default');
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
                    <span>{t('signup.hero.badge')}</span>
                  </div>
                  
                  <h1 className="hero-title">
                    {t('signup.hero.title')}
                    <span className="title-accent">🌟</span>
                  </h1>
                  
                  <p className="hero-subtitle">
                    {t('signup.hero.subtitle')}
                  </p>

                  <div className="hero-benefits">
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaShieldAlt />
                      </div>
                      <div className="benefit-text">
                        <h6>{t('signup.hero.benefits.security.title')}</h6>
                        <p>{t('signup.hero.benefits.security.subtitle')}</p>
                      </div>
                    </div>
                    
                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <RiVipCrownFill />
                      </div>
                      <div className="benefit-text">
                        <h6>{t('signup.hero.benefits.destinations.title')}</h6>
                        <p>{t('signup.hero.benefits.destinations.subtitle')}</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaHeadset />
                      </div>
                      <div className="benefit-text">
                        <h6>{t('signup.hero.benefits.support.title')}</h6>
                        <p>{t('signup.hero.benefits.support.subtitle')}</p>
                      </div>
                    </div>

                    <div className="benefit-item">
                      <div className="benefit-icon">
                        <FaGift />
                      </div>
                      <div className="benefit-text">
                        <h6>{t('signup.hero.benefits.safety.title')}</h6>
                        <p>{t('signup.hero.benefits.safety.subtitle')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="hero-testimonial">
                    <div className="testimonial-content">
                      <div className="stars">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                      </div>
                      <p>"{t('signup.hero.testimonial.quote')}"</p>
                      <div className="testimonial-author">
                        <strong>{t('signup.hero.testimonial.author.name')}</strong>
                        <span>{t('signup.hero.testimonial.author.title')}</span>
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
                    <h3 className="form-title">{t('signup.form.title')}</h3>
                    <p className="form-subtitle">{t('signup.form.subtitle')}</p>
                  </div>

                  {errMsg && (
                    <div className="alert alert-danger alert-custom fade-in" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {errMsg}
                    </div>
                  )}

                  <div className="form-group mb-3">
                    <label className="form-label">{t('signup.form.fullname.label')}</label>
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
                        placeholder={t('signup.form.fullname.placeholder')}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('signup.form.email.label')}</label>
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
                        placeholder={t('signup.form.email.placeholder')}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('signup.form.password.label')}</label>
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
                        placeholder={t('signup.form.password.placeholder')}
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
                                {t('signup.form.passwordStrength.strongPassword')}
                              </span>
                            ) : (
                              t('signup.form.passwordStrength.passwordHint')
                            )}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">{t('signup.form.confirmPassword.label')}</label>
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
                        placeholder={t('signup.form.confirmPassword.placeholder')}
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
                            {t('signup.form.passwordStrength.passwordMatch')}
                          </small>
                        ) : (
                          <small className="text-danger">
                            {t('signup.form.passwordStrength.passwordMismatch')}
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
                        {t('signup.form.terms.agreement')}{' '}
                        <Link to="/terms" className="terms-link">{t('signup.form.terms.termsOfService')}</Link>
                        {' '}{t('signup.form.terms.and')}{' '}
                        <Link to="/privacy" className="terms-link">{t('signup.form.terms.privacyPolicy')}</Link>
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
                        {t('signup.form.submit.loading')}
                      </>
                    ) : (
                      <>
                        <span>{t('signup.form.submit.default')}</span>
                        <i className="fas fa-rocket ms-2"></i>
                      </>
                    )}
                  </button>

                  <div className="social-signup">
                    <div className="divider-custom">
                      <span>{t('signup.form.social.divider')}</span>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-danger w-100 social-btn google-btn"
                          onClick={() => handleSocialSignup('google')}
                        >
                          <FaGoogle className="me-2" />
                          {t('signup.form.social.google')}
                        </button>
                      </div>
                      <div className="col-6">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary w-100 social-btn facebook-btn"
                          onClick={() => handleSocialSignup('facebook')}
                        >
                          <FaFacebookF className="me-2" />
                          {t('signup.form.social.facebook')}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="login-link text-center mt-4">
                    <p className="mb-0">
                      {t('signup.form.login.text')} 
                      <Link to="/login" className="login-link-text ms-1">
                        {t('signup.form.login.link')}
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