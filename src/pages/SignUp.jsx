// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';

const SignUp = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setLoading(true);

    try {
      // 1) Gọi API đăng ký
      await axios.post(`http://localhost:5000/api/auth/register`, {
        fullname,
        email,
        password,
      });

      // 2) Đăng ký xong 👉 chuyển sang màn Login
      navigate('/login', { replace: true });
      // Nếu muốn tự đăng nhập luôn:
      // const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      // localStorage.setItem('accessToken', data.token);
      // localStorage.setItem('user', JSON.stringify(data.user));
      // navigate('/');
    } catch (err) {
      // Lấy message từ backend (đã xử lý duplicate email …)
      const msg =
        err.response?.data?.message || 'Đăng ký thất bại, thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="auth-container">
        <form className="auth-form shadow-sm" onSubmit={handleSignUp}>
          <h3 className="text-center mb-4">Đăng ký</h3>

          {errMsg && (
            <div className="alert alert-danger py-2" role="alert">
              {errMsg}
            </div>
          )}

          <div className="mb-3">
            <label>Họ và tên</label>
            <input
              type="text"
              required
              className="form-control"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Nhập tên của bạn..."
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="mb-3">
            <label>Mật khẩu</label>
            <input
              type="password"
              required
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký…' : 'Đăng ký'}
          </button>

          <p className="text-center mt-3">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;
