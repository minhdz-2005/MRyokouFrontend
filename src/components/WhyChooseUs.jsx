// src/components/WhyChooseUs.jsx
import React from 'react';
import './WhyChooseUs.css';
import { 
  BsGlobe2, 
  BsClockHistory, 
  BsStarFill, 
  BsShieldCheck,
  BsPeopleFill,
  BsCashCoin,
  BsHeartFill,
  BsAwardFill
} from 'react-icons/bs';
import { GiModernCity, GiIsland } from 'react-icons/gi';
import { FaUmbrellaBeach, FaMountain } from 'react-icons/fa';

const features = [
  {
    icon: <BsGlobe2 />,
    title: 'Đa dạng điểm đến',
    description: 'Hơn 1,200 tour du lịch khắp Việt Nam và quốc tế với giá ưu đãi đặc biệt.',
    stat: '1,200+',
    destinations: [
      <GiModernCity key="city" />,
      <FaUmbrellaBeach key="beach" />,
      <FaMountain key="mountain" />,
      <GiIsland key="island" />
    ]
  },
  {
    icon: <BsClockHistory />,
    title: 'Đặt tour nhanh chóng',
    description: 'Quy trình đặt tour chỉ trong 3 phút với tỷ lệ xác nhận tức thì 99%.',
    stat: '3 phút'
  },
  {
    icon: <BsStarFill />,
    title: 'Đánh giá cao',
    description: 'Được hơn 50,000 khách hàng tin tưởng với tỷ lệ hài lòng 98%.',
    stat: '98%',
    rating: 5
  },
  {
    icon: <BsShieldCheck />,
    title: 'Bảo đảm an toàn',
    description: 'Chính sách hoàn tiền 100% nếu không đúng cam kết hoặc có sự cố phát sinh.',
    stat: '100%'
  },
  {
    icon: <BsPeopleFill />,
    title: 'Hướng dẫn viên chuyên nghiệp',
    description: 'Đội ngũ hướng dẫn viên nhiệt tình, giàu kinh nghiệm và am hiểu địa phương.',
    stat: '200+'
  },
  {
    icon: <BsCashCoin />,
    title: 'Giá cả cạnh tranh',
    description: 'Cam kết giá tốt nhất thị trường với nhiều chương trình khuyến mãi quanh năm.',
    stat: 'Tốt nhất'
  },
  {
    icon: <BsHeartFill />,
    title: 'Dịch vụ tận tâm',
    description: 'Hỗ trợ 24/7 trong suốt hành trình du lịch của bạn.',
    stat: '24/7'
  },
  {
    icon: <BsAwardFill />,
    title: 'Giải thưởng uy tín',
    description: 'Đạt giải "Nền tảng du lịch trực tuyến tốt nhất 2024" do khách hàng bình chọn.',
    stat: 'Top 1'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            <span>Tại sao chọn</span> MTRAVEL?
          </h2>
          <p className="section-subtitle">
            Những lý do khiến chúng tôi trở thành lựa chọn hàng đầu của du khách
          </p>
          <div className="divider">
            <div className="divider-line"></div>
            <div className="divider-icon">
              <BsStarFill />
            </div>
            <div className="divider-line"></div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className={`feature-card ${feature.highlight ? 'highlight-card' : ''}`} 
              key={index}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              
              {feature.stat && (
                <div className="feature-stat">
                  {feature.stat}
                </div>
              )}
              
              {feature.rating && (
                <div className="feature-rating">
                  {[...Array(feature.rating)].map((_, i) => (
                    <BsStarFill key={i} />
                  ))}
                </div>
              )}
              
              {feature.destinations && (
                <div className="feature-destinations">
                  {feature.destinations.map((icon, i) => (
                    <span key={i}>{icon}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="customer-testimonial">
          <div className="testimonial-content">
            <blockquote>
              "MTRAVEL đã mang đến cho gia đình tôi những chuyến đi tuyệt vời nhất. 
              Dịch vụ chuyên nghiệp từ khâu tư vấn đến khi kết thúc tour. 
              Chắc chắn sẽ tiếp tục đồng hành cùng MTRAVEL trong những hành trình tiếp theo!"
            </blockquote>
            <div className="customer-info">
              <div className="customer-avatar">
                <img src="../src/images/banner.jpg" alt="Khách hàng" />
              </div>
              <div className="customer-details">
                <h4>Nguyễn Đức Minh</h4>
                <p>Khách hàng thân thiết</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;