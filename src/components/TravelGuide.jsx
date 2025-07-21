import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, Plane, Calendar, Compass, AlertCircle, ChevronDown } from 'lucide-react';
import './TravelGuide.css'

const travelGuideData = [
  {
    title: "Chuẩn bị hành lý khi đi du lịch",
    icon: <Plane className="icon-size" />,
    color: "primary",
    points: [
      "Mang quần áo phù hợp với thời tiết và địa hình điểm đến.",
      "Đem theo giấy tờ tùy thân, vé máy bay, booking tour/khách sạn.",
      "Dụng cụ cá nhân cơ bản như kem đánh răng, khăn, sạc dự phòng.",
      "Thuốc cơ bản: cảm, đau bụng, thuốc say xe,..."
    ]
  },
  {
    title: "Lưu ý về thời gian và thời tiết",
    icon: <Calendar className="icon-size" />,
    color: "success",
    points: [
      "Nên xem dự báo thời tiết trước khi đi 3–5 ngày.",
      "Tránh mùa mưa lũ ở miền Trung (thường từ tháng 9–11).",
      "Du lịch biển nên đi từ tháng 4–8 để có thời tiết đẹp."
    ]
  },
  {
    title: "Mẹo tiết kiệm chi phí khi du lịch",
    icon: <DollarSign className="icon-size" />,
    color: "warning",
    points: [
      "Đặt tour và vé máy bay sớm để có giá tốt.",
      "Đi nhóm đông để chia sẻ chi phí xe, phòng, hướng dẫn viên.",
      "Mang theo bình nước cá nhân và đồ ăn nhẹ để tiết kiệm chi tiêu lặt vặt."
    ]
  },
  {
    title: "Du lịch theo tour hay tự túc?",
    icon: <Compass className="icon-size" />,
    color: "info",
    points: [
      "Theo tour phù hợp cho người lớn tuổi, lịch trình có sẵn, ít lo lắng.",
      "Tự túc linh hoạt, thích hợp với người trẻ muốn khám phá.",
      "Có thể kết hợp: đặt tour ngắn ngày ở địa phương trong hành trình tự túc."
    ]
  }
];

const TravelGuide = () => {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <>
      <div className="travel-guide-container py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="hero-icon">
              <MapPin size={40} color="white" />
            </div>
            <h1 className="main-header display-4 mb-4">
              Cẩm Nang Du Lịch
            </h1>
            <p className="lead text-muted col-lg-8 mx-auto">
              Những lời khuyên hữu ích giúp bạn có chuyến du lịch trọn vẹn và đáng nhớ
            </p>
          </div>

          {/* Guide Cards */}
          <div className="row g-4 mb-5">
            {travelGuideData.map((section, index) => (
              <div key={index} className={`col-lg-6 ${expandedCard === index ? 'col-12' : ''}`}>
                <div className="card guide-card h-100">
                  <div 
                    className={`card-header card-header-custom bg-${section.color} text-white p-4`}
                    onClick={() => toggleCard(index)}
                    role="button"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="icon-container me-3">
                          {React.cloneElement(section.icon, { color: "white" })}
                        </div>
                        <h5 className="mb-0 fw-bold">
                          {section.title}
                        </h5>
                      </div>
                      <ChevronDown 
                        className={`chevron-icon ${expandedCard === index ? 'rotated' : ''}`} 
                        size={24} 
                        color="white"
                      />
                    </div>
                  </div>

                  <div className={`card-body card-body-custom ${expandedCard === index ? 'card-body-expanded' : ''} p-4`}>
                    <div className="mb-3">
                      {section.points.map((point, i) => (
                        <div key={i} className="point-item">
                          <span className="text-dark">{point}</span>
                        </div>
                      ))}
                    </div>
                    
                    {expandedCard !== index && (
                      <div className="text-center mt-3">
                        <button 
                          className="btn btn-link btn-sm text-muted p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(index);
                          }}
                        >
                          <small>Xem thêm <ChevronDown size={16} className="ms-1" /></small>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="tips-section p-4 mb-5">
            <div className="d-flex align-items-center mb-4">
              <div className="icon-container me-3" style={{background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)'}}>
                <AlertCircle size={24} color="white" />
              </div>
              <h3 className="mb-0 fw-bold text-warning-emphasis">Lưu ý quan trọng</h3>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-semibold text-warning-emphasis d-flex align-items-center mb-2">
                  <Clock size={16} className="me-2" />
                  Thời gian tốt nhất
                </h6>
                <p className="small text-warning-emphasis mb-0">
                  Mỗi điểm đến có mùa du lịch riêng. Nghiên cứu kỹ trước khi đặt tour để có trải nghiệm tuyệt vời nhất.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-semibold text-warning-emphasis d-flex align-items-center mb-2">
                  <Users size={16} className="me-2" />
                  An toàn và sức khỏe
                </h6>
                <p className="small text-warning-emphasis mb-0">
                  Luôn mua bảo hiểm du lịch và thông báo lịch trình với người thân để đảm bảo an toàn.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section text-white p-5 text-center">
            <h3 className="fw-bold mb-3">Sẵn sàng cho chuyến du lịch tiếp theo?</h3>
            <p className="mb-4 opacity-75">
              Khám phá các tour du lịch hấp dẫn được thiết kế dành riêng cho bạn
            </p>
            <Link to={'/tour'}>
              <button className="cta-button">
                Đặt Tour Ngay
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelGuide;