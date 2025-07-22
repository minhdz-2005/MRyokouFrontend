// src/components/AboutIntro.jsx
import React from 'react';
import './AboutIntro.css';
import { 
  FaGlobeAsia, 
  FaHandsHelping, 
  FaRegSmile,
  FaMapMarkedAlt,
  FaHeart,
  FaLightbulb
} from 'react-icons/fa';
import { TbBeach, TbMountain, TbBuildingCommunity } from 'react-icons/tb';

const AboutIntro = () => {
  return (
    <section className="about-intro">
      <div className="container">
        {/* Header với hình nền parallax */}
        <div className="intro-header">
          <div className="intro-overlay">
            <h1 className="intro-title">Câu chuyện của MRYOKOU</h1>
            <p className="intro-subtitle">
              Hành trình mang thế giới đến gần bạn hơn
            </p>
          </div>
        </div>

        {/* Giới thiệu công ty */}
        <div className="company-intro">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="intro-image">
                <div className="image-placeholder">
                  <TbBeach className="floating-icon icon-1" />
                  <TbMountain className="floating-icon icon-2" />
                  <TbBuildingCommunity className="floating-icon icon-3" />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="intro-content">
                <h2 className="section-title">
                  <span className="title-highlight">Chúng tôi là ai?</span>
                </h2>
                <p className="intro-text">
                  MRYOKOU là nền tảng đặt tour trực tuyến hàng đầu Việt Nam, ra đời với sứ mệnh
                  cách mạng hóa trải nghiệm du lịch của người Việt trẻ.
                </p>
                <p className="intro-text">
                  Từ năm 2025, chúng tôi đã đồng hành cùng hơn 50.000 khách hàng trong những hành trình
                  đáng nhớ, kết nối mọi người với những trải nghiệm địa phương chân thật nhất.
                </p>
                <div className="stats-container">
                  <div className="stat-item ms-5">
                    <div className="stat-number">50,000+</div>
                    <div className="stat-label">Khách hàng</div>
                  </div>
                  <div className="stat-item ms-5">
                    <div className="stat-number">1,000+</div>
                    <div className="stat-label">Tour du lịch</div>
                  </div>
                  <div className="stat-item ms-5">
                    <div className="stat-number">98%</div>
                    <div className="stat-label">Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các giá trị cốt lõi */}
        <div className="core-values">
          <h2 className="section-title text-center">
            <span className="title-highlight">Giá trị cốt lõi</span>
          </h2>
          <p className="section-subtitle text-center">
            Những điều làm nên khác biệt của MRYOKOU
          </p>

          <div className="values-container">
            <div className="value-card">
              <div className="value-icon">
                <FaGlobeAsia />
              </div>
              <h3 className="value-title">Sứ mệnh</h3>
              <p className="value-description">
                Kết nối khách du lịch với những hành trình trải nghiệm đáng nhớ
                khắp Việt Nam, mang đến góc nhìn chân thực về mỗi điểm đến.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHandsHelping />
              </div>
              <h3 className="value-title">Cam kết</h3>
              <p className="value-description">
                Tận tâm, minh bạch, đồng hành cùng khách hàng trong từng chặng đường.
                Đảm bảo chất lượng dịch vụ tốt nhất với giá cả hợp lý.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaRegSmile />
              </div>
              <h3 className="value-title">Tầm nhìn</h3>
              <p className="value-description">
                Trở thành nền tảng đặt tour đáng tin cậy nhất cho thế hệ trẻ yêu
                du lịch và trải nghiệm, tiên phong trong công nghệ du lịch thông minh.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHeart />
              </div>
              <h3 className="value-title">Văn hóa</h3>
              <p className="value-description">
                Lấy khách hàng làm trung tâm, đề cao tinh thần đổi mới và làm việc
                nhóm. Mỗi thành viên là một đại sứ văn hóa Việt Nam.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaLightbulb />
              </div>
              <h3 className="value-title">Sáng tạo</h3>
              <p className="value-description">
                Không ngừng đổi mới, tạo ra những trải nghiệm du lịch độc đáo,
                khác biệt và phù hợp với xu hướng của thế hệ trẻ.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaMapMarkedAlt />
              </div>
              <h3 className="value-title">Trách nhiệm</h3>
              <p className="value-description">
                Phát triển du lịch bền vững, tôn trọng văn hóa địa phương và
                bảo vệ môi trường tại mỗi điểm đến.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;