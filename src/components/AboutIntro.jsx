// src/components/AboutIntro.jsx
import React from 'react';
import './AboutIntro.css';
import { FaGlobeAsia, FaHandsHelping, FaRegSmile } from 'react-icons/fa';

const AboutIntro = () => {
  return (
    <div className="about-intro py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Chúng tôi là ai?</h2>
          <p className="text-muted mt-3">
            MRYOKOU là nền tảng đặt tour trực tuyến, mang sứ mệnh giúp mọi người khám phá thế giới dễ dàng, an toàn và đầy cảm hứng.
          </p>
        </div>

        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <FaGlobeAsia size={50} className="text-primary mb-3" />
            <h5 className="fw-bold">Sứ mệnh</h5>
            <p className="text-muted">
              Kết nối khách du lịch với những hành trình trải nghiệm đáng nhớ khắp Việt Nam và thế giới.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <FaHandsHelping size={50} className="text-success mb-3" />
            <h5 className="fw-bold">Giá trị</h5>
            <p className="text-muted">
              Tận tâm, minh bạch, đồng hành cùng khách hàng trong từng chặng đường.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <FaRegSmile size={50} className="text-warning mb-3" />
            <h5 className="fw-bold">Tầm nhìn</h5>
            <p className="text-muted">
              Trở thành nền tảng đặt tour đáng tin cậy nhất cho thế hệ trẻ yêu du lịch và trải nghiệm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutIntro;
