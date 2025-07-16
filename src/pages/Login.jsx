// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
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

      // lưu token & thông tin user
      localStorage.setItem('accessToken', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // điều hướng về trang chủ
      navigate('/');
    } catch (err) {
      // lấy message từ backend (nếu có), hoặc mặc định
      const msg =
        err.response?.data?.message || 'Đăng nhập thất bại, thử lại sau!';
      setErrMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="auth-container">
        <form className="auth-form shadow-sm" onSubmit={handleLogin}>
          <h3 className="text-center mb-4">Đăng nhập</h3>

          {errMsg && (
            <div className="alert alert-danger py-2" role="alert">
              {errMsg}
            </div>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              required
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
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
              placeholder="Nhập mật khẩu"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className="text-center mt-3">
            Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Login;
