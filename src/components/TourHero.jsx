// src/components/TourHero.jsx
import React from 'react';
import './TourHero.css';

const TourHero = () => {
  return (
    <div className="tour-hero d-flex align-items-center justify-content-center text-white text-center">
      <div className="overlay"></div>
      <div className="z-1">
        <h1 className="display-5 fw-bold">Khám Phá Những Tour Du Lịch Hấp Dẫn</h1>
        <p className="lead mt-3">Lên kế hoạch cho chuyến đi tiếp theo của bạn ngay hôm nay!</p>
      </div>
    </div>
  );
};

export default TourHero;
