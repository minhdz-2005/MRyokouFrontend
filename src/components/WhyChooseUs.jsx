// src/components/WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';
import { BsGlobe2, BsClockHistory, BsStarFill, BsShieldCheck } from 'react-icons/bs';

const features = [
  {
    icon: <BsGlobe2 size={40} className="text-primary" />,
    title: 'Đa dạng điểm đến',
    description: 'Khám phá hàng trăm địa điểm trên khắp thế giới với giá ưu đãi.',
  },
  {
    icon: <BsClockHistory size={40} className="text-primary" />,
    title: 'Đặt tour nhanh chóng',
    description: 'Chỉ vài bước là bạn đã có thể hoàn tất đặt tour du lịch yêu thích.',
  },
  {
    icon: <BsStarFill size={40} className="text-primary" />,
    title: 'Đánh giá cao',
    description: 'Dịch vụ được hơn 95% khách hàng đánh giá 5 sao hài lòng.',
  },
  {
    icon: <BsShieldCheck size={40} className="text-primary" />,
    title: 'An toàn & đảm bảo',
    description: 'Cam kết hoàn tiền nếu không đúng như mô tả hoặc xảy ra sự cố.',
  },
];

const WhyChooseUs = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">Why Choose Us?</h2>
      <div className="row text-center">
        {features.map((f, index) => (
          <div className="col-md-3 col-sm-6 mb-4" key={index}>
            <div className="feature-box p-4 border rounded h-100 shadow-sm">
              <div className="mb-3">{f.icon}</div>
              <h5 className="fw-semibold">{f.title}</h5>
              <p className="text-muted small">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseUs;
