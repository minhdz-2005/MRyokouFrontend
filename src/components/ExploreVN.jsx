import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Mountain, Waves, TreePine, Camera, ChevronDown, Star, Clock, Users } from 'lucide-react';
import './ExploreVN.css'

const ExploreVietnam = () => {
  const [region, setRegion] = useState('north');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState({
    north: [],
    central: [],
    south: [],
  });

  // Mock data for demonstration (replace with your API)
  

  const regions = {
    north: {
      name: 'Miền Bắc',
      icon: <Mountain className="icon-size" />,
      color: 'primary',
      description: 'Vùng đất của những ngọn núi hùng vĩ'
    },
    central: {
      name: 'Miền Trung',
      icon: <TreePine className="icon-size" />,
      color: 'success', 
      description: 'Cái nôi văn hóa và lịch sử Việt Nam'
    },
    south: {
      name: 'Miền Nam',
      icon: <Waves className="icon-size" />,
      color: 'info',
      description: 'Đồng bằng sông Cửu Long phì nhiêu'
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/explore');
        const data = res.data;

        const grouped = {
          north: [],
          central: [],
          south: [],
        };

        data.forEach((item) => {
          if (grouped[item.region]) {
            grouped[item.region].push(item);
          }
        });

        setLocationData(grouped);
      } catch (err) {
        console.error('Lỗi khi fetch explore data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <>      
      <div className="explore-container py-5">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="hero-icon">
              <MapPin size={40} color="white" />
            </div>
            <h1 className="main-header display-4 mb-4">
              Khám Phá Việt Nam
            </h1>
            <p className="lead text-muted col-lg-8 mx-auto">
              Hành trình khám phá vẻ đẹp thiên nhiên và văn hóa từ Bắc chí Nam
            </p>
          </div>

          {/* Region Selector */}
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-5">
            {Object.entries(regions).map(([key, regionInfo]) => (
              <button
                key={key}
                onClick={() => {
                  setRegion(key);
                  setExpandedIndex(null);
                }}
                className={`region-tab btn ${region === key ? 'active' : ''}`}
              >
                <div className="d-flex align-items-center gap-2">
                  {React.cloneElement(regionInfo.icon, { 
                    color: region === key ? "white" : "#2196f3" 
                  })}
                  <span>{regionInfo.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Region Description */}
          <div className="text-center mb-4">
            <p className="text-muted fs-5">
              <em>{regions[region].description}</em>
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="loading-spinner"></div>
              <p className="text-muted">Đang tải dữ liệu...</p>
            </div>
          )}

          {/* Locations List */}
          {!loading && (
            <div className="row">
              <div className="col-lg-8 mx-auto">
                {locationData[region].length === 0 ? (
                  <div className="text-center py-5">
                    <Camera size={48} className="text-muted mb-3" />
                    <p className="text-muted">Chưa có dữ liệu cho khu vực này</p>
                  </div>
                ) : (
                  locationData[region].map((location, index) => (
                    <div key={location._id} className="location-card">
                      <div 
                        className="location-header p-4"
                        onClick={() => toggleExpand(index)}
                        role="button"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-1 fw-bold text-dark">
                              {location.name}
                            </h5>
                            <small className="text-muted">
                              <MapPin size={14} className="me-1" />
                              {regions[region].name}
                            </small>
                          </div>
                          <ChevronDown 
                            className={`chevron-icon text-primary ${expandedIndex === index ? 'rotated' : ''}`} 
                            size={24}
                          />
                        </div>
                      </div>

                      <div className={`location-content ${expandedIndex === index ? 'expanded' : ''}`}>
                        <div className="p-4 abc">
                          {/* Image */}
                          {location.image && location.image.length > 0 && (
                            <div className="mb-4 text-center">
                              <img 
                                src={location.image[0]} 
                                alt={location.name} 
                                className="location-image"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                                }}
                              />
                            </div>
                          )}
                          
                          {/* Description */}
                          {location.fullDesc && location.fullDesc.length > 0 && (
                            <div className="mb-4">
                              <h6 className="fw-bold mb-3 d-flex align-items-center">
                                <Star size={16} className="text-warning me-2" />
                                Điểm nổi bật
                              </h6>
                              {location.fullDesc.map((desc, i) => (
                                <div key={i} className="feature-item">
                                  <small className="text-dark">{desc}</small>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="d-flex gap-2 flex-wrap">
                            <button className="btn btn-primary btn-sm">
                              <MapPin size={14} className="me-1" />
                              Xem các tour du lịch ở {location.name}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stats Section */}
          {!loading && (
            <div className="stats-container p-4 mt-5">
              <div className="row g-4 text-center">
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <MapPin size={24} className="text-primary me-2" />
                    <h4 className="mb-0 fw-bold text-primary">
                      {Object.values(locationData).flat().length}
                    </h4>
                  </div>
                  <small className="text-muted">Điểm du lịch</small>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Users size={24} className="text-success me-2" />
                    <h4 className="mb-0 fw-bold text-success">1M+</h4>
                  </div>
                  <small className="text-muted">Du khách đã ghé thăm</small>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Star size={24} className="text-warning me-2" />
                    <h4 className="mb-0 fw-bold text-warning">4.8</h4>
                  </div>
                  <small className="text-muted">Đánh giá trung bình</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExploreVietnam;