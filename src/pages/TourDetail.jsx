// src/pages/TourDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header'
import Footer from '../components/Footer'

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate(); // khởi tạo hook

  const handleGoBack = () => {
    navigate(-1); // quay lại trang trước
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTour(data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Không tìm thấy tour!';
        setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Đang tải thông tin tour…</p>;
  if (errMsg) return <p className="text-center text-danger mt-5">{errMsg}</p>;
  if (!tour) return null;

  return (
    <>
      <Header></Header>
      <div className="container my-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <img
              src={tour.image}
              alt={tour.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
            />
          </div>

          <div className="col-md-6">
            <h2 className="mb-3 text-primary">{tour.title}</h2>
            <p><strong>📍 Địa điểm:</strong> {tour.location}</p>
            <p><strong>💰 Giá:</strong> {tour.price.toLocaleString()}đ</p>
            <p><strong>⭐ Đánh giá:</strong> {tour.rating}/5</p>
            <p className="mt-3"><strong>📝 Mô tả:</strong></p>
            <p>{tour.description || 'Chưa có mô tả.'}</p>
          </div>
        </div>

        {/* Optional: Thêm nút quay lại hoặc đặt tour */}
        <div className="text-center mt-5">
          <button onClick={handleGoBack} className="btn btn-outline-primary me-2">← Quay lại danh sách tour</button>
          <button className="btn btn-success">Đặt tour ngay</button>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default TourDetail;
