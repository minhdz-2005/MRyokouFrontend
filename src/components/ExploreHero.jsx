// src/components/ExploreHero.jsx
import React from 'react';
import './ExploreHero.css';

const ExploreHero = () => {
  return (
    <div className="explore-hero d-flex align-items-center justify-content-center text-white text-center">
      <div className="container">
        <h1 className="display-4 fw-bold">Khám Phá Hành Trình</h1>
        <p className="lead mt-3">
          Những điểm đến truyền cảm hứng, phù hợp với mùa, với cá tính và đam mê du lịch của bạn.
        </p>
      </div>
    </div>
  );
};

export default ExploreHero;
