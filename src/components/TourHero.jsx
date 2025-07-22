// src/components/TourHero.jsx
import React from 'react';
import './TourHero.css';

const TourHero = () => {
  return (
    <div className="tour-hero">
      <div className="tour-hero-overlay"></div>
      <div className="tour-hero-content">
        <h1 className="tour-hero-title">Khám Phá Những Tour Du Lịch Hấp Dẫn</h1>
        <p className="tour-hero-subtitle">Lên kế hoạch cho chuyến đi tiếp theo của bạn ngay hôm nay!</p>
      </div>
    </div>
  );
};

export default TourHero;
