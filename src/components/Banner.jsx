// src/components/Banner.jsx
import React, { useState } from 'react';
import './Banner.css';

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    console.log('Searching for:', { searchTerm, selectedDate, guests });
    // Thêm logic tìm kiếm ở đây
  };

  return (
    <div className="banner-container">
      {/* Video Background */}
      <div className="banner-video">
        <div className="video-overlay"></div>
      </div>

      {/* Main Content */}
      <div className="banner-content d-flex flex-column justify-content-center align-items-center text-white text-center">
        
        {/* Hero Text */}
        <div className="hero-text mb-5">
          <h1 className="banner-title animate-fade-in">
            Khám Phá <span className="text-highlight">Việt Nam</span>
          </h1>
          <h2 className="banner-subtitle animate-fade-in-delay">
            Cùng Chúng Tôi
          </h2>
          <p className="banner-description text-muted animate-fade-in-delay-2">
            Trải nghiệm những chuyến du lịch tuyệt vời với dịch vụ chuyên nghiệp
          </p>
        </div>

        {/* Enhanced Search Box */}
        <div className="search-container animate-slide-up">
          <div className="search-box bg-white rounded-4 shadow-lg p-4">
            <div className="row g-3">
              
              {/* Destination Input */}
              <div className="col-lg-4 col-md-6 col-12">
                <div className="search-field">
                  <label className="search-label">
                    <i className="bi bi-geo-alt text-primary me-2"></i>
                    Điểm đến
                  </label>
                  <input 
                    type="text" 
                    className="form-control search-input" 
                    placeholder="Bạn muốn đi đâu?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="col-lg-3 col-md-6 col-12">
                <div className="search-field">
                  <label className="search-label">
                    <i className="bi bi-calendar text-primary me-2"></i>
                    Ngày khởi hành
                  </label>
                  <input 
                    type="date" 
                    className="form-control search-input"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Guests Input */}
              <div className="col-lg-3 col-md-6 col-12">
                <div className="search-field">
                  <label className="search-label">
                    <i className="bi bi-people text-primary me-2"></i>
                    Số khách
                  </label>
                  <select 
                    className="form-select search-input"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} khách
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="col-lg-2 col-md-6 col-12">
                <div className="search-field d-flex align-items-end h-100">
                  <button 
                    className="btn btn-primary search-btn w-100"
                    onClick={handleSearch}
                  >
                    <i className="bi bi-search me-2"></i>
                    Tìm kiếm
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-section mt-5 animate-fade-in-delay-3">
          <div className="row text-center">
            <div className="col-md-4 col-6 mb-3">
              <div className="stat-item">
                <h3 className="stat-number text-danger">1000+</h3>
                <p className="stat-label text-muted">Điểm đến</p>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="stat-item">
                <h3 className="stat-number text-danger">50K+</h3>
                <p className="stat-label text-muted">Khách hài lòng</p>
              </div>
            </div>
            <div className="col-md-4 col-6 mb-3">
              <div className="stat-item">
                <h3 className="stat-number text-danger">24/7</h3>
                <p className="stat-label text-muted">Hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow animate-bounce">
          <i className="bi bi-chevron-down"></i>
        </div>
      </div>
    </div>
  );
};

export default Banner;