// src/components/AboutHero.jsx
import React from 'react';
import './AboutHero.css';

const AboutHero = () => {
  return (
    <div className="about-hero d-flex align-items-center justify-content-center text-white text-center">
      <div className="container">
        <h1 className="display-4 fw-bold">Về Chúng Tôi</h1>
        <p className="lead mt-3">
          MRYOKOU đồng hành cùng bạn trên mọi hành trình khám phá thế giới với dịch vụ chất lượng, an toàn và tận tâm.
        </p>
      </div>
    </div>
  );
};

export default AboutHero;
