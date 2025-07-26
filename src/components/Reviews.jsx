// src/components/CustomerReviews.jsx
import React, { useState, useEffect } from 'react';
import './Reviews.css';
import { BsStarFill, BsStar, BsQuote, BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const reviews = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    location: 'Hà Nội',
    tour: 'Tour Hạ Long 3N2Đ',
    date: '2024-01-15',
    comment: 'Chuyến đi rất tuyệt vời! Mọi thứ đều được tổ chức chuyên nghiệp và chu đáo. Khách sạn đẹp, đồ ăn ngon và hướng dẫn viên rất nhiệt tình. Tôi chắc chắn sẽ quay lại lần sau và giới thiệu cho bạn bè.',
    verified: true
  },
  {
    id: 2,
    name: 'Lê Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    location: 'TP.HCM',
    tour: 'Tour Sapa 4N3Đ',
    date: '2024-01-20',
    comment: 'Dịch vụ tốt, giá cả hợp lý. Hướng dẫn viên thân thiện, nhiệt tình! Cảnh núi rất đẹp, trải nghiệm văn hóa địa phương thú vị. Chỉ có điều thời tiết hơi lạnh một chút.',
    verified: true
  },
  {
    id: 3,
    name: 'Trần Minh C',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 5,
    location: 'Đà Nẵng',
    tour: 'Tour Phú Quốc 5N4Đ',
    date: '2024-01-25',
    comment: 'Tôi rất hài lòng với tour này. Thời gian hợp lý, cảnh đẹp và đồ ăn ngon! Biển xanh cát trắng, resort cao cấp. Dịch vụ chuyên nghiệp từ đầu đến cuối chuyến đi.',
    verified: true
  },
  {
    id: 4,
    name: 'Phạm Thu D',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    location: 'Cần Thơ',
    tour: 'Tour Đà Lạt 3N2Đ',
    date: '2024-02-01',
    comment: 'Chuyến đi tuyệt vời với gia đình! Trẻ em rất thích và người lớn cũng được nghỉ ngơi thư giãn. Không khí trong lành, thức ăn đa dạng và phong cảnh thơ mộng.',
    verified: true
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 4,
    location: 'Hải Phòng',
    tour: 'Tour Nha Trang 4N3Đ',
    date: '2024-02-05',
    comment: 'Dịch vụ tuyệt vời, nhân viên chu đáo. Biển đẹp, hoạt động thể thao nước phong phú. Giá cả hợp lý cho chất lượng dịch vụ nhận được.',
    verified: true
  },
  {
    id: 6,
    name: 'Ngô Thị F',
    avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
    rating: 5,
    location: 'Hà Nội',
    tour: 'Tour Hội An 3N2Đ',
    date: '2024-02-10',
    comment: 'Phố cổ Hội An thật sự quyến rũ! Tour được tổ chức rất tốt, có thời gian tự do khám phá. Đồ ăn địa phương ngon miệng, đèn lồng rực rỡ về đêm.',
    verified: true
  }
];

const CustomerReviews = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedRating, setSelectedRating] = useState('all');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev === Math.ceil(filteredReviews.length / 3) - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, filteredReviews.length]);

  // Filter reviews by rating
  useEffect(() => {
    if (selectedRating === 'all') {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(review => review.rating === parseInt(selectedRating)));
    }
    setCurrentSlide(0);
  }, [selectedRating]);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === Math.ceil(filteredReviews.length / 3) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? Math.ceil(filteredReviews.length / 3) - 1 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? 'star-filled' : 'star-empty'}>
        {i < rating ? <BsStarFill /> : <BsStar />}
      </span>
    ));
  };

  const calculateAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingCount = (rating) => {
    return reviews.filter(review => review.rating === rating).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <section className="reviews-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="reviews-header text-center mb-5">
          <h2 className="section-title">
            <span className="title-highlight">Khách Hàng</span> Nói Gì Về Chúng Tôi
          </h2>
          <p className="section-subtitle">
            Những trải nghiệm thực tế từ khách hàng đã tin tưởng sử dụng dịch vụ
          </p>
          
          {/* Overall Rating */}
          <div className="overall-rating">
            <div className="rating-score">
              <span className="score-number">{calculateAverageRating()}</span>
              <div className="score-stars">
                {renderStars(Math.round(parseFloat(calculateAverageRating())))}
              </div>
              <span className="score-text">({reviews.length} đánh giá)</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="rating-filter mb-4">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedRating === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRating('all')}
            >
              Tất cả ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button 
                key={rating}
                className={`filter-btn ${selectedRating === rating.toString() ? 'active' : ''}`}
                onClick={() => setSelectedRating(rating.toString())}
              >
                {renderStars(rating)} ({getRatingCount(rating)})
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="reviews-carousel-container">
          <div 
            className="reviews-carousel"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            
            {/* Navigation Buttons */}
            <button className="carousel-btn prev-btn" onClick={prevSlide}>
              <span className='bi bi-chevron-left'></span>
            </button>
            <button className="carousel-btn next-btn" onClick={nextSlide}>
              <span className='bi bi-chevron-right'></span>
            </button>

            {/* Reviews Grid */}
            <div className="reviews-grid">
              <div 
                className="reviews-track"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {Array.from({ length: Math.ceil(filteredReviews.length / 3) }, (_, slideIndex) => (
                  <div key={slideIndex} className="reviews-slide">
                    <div className="row g-4">
                      {filteredReviews
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map(review => (
                          <div key={review.id} className="col-lg-4 col-md-6 col-12">
                            <div className="review-card">
                              
                              {/* Quote Icon */}
                              <div className="quote-icon">
                                <BsQuote />
                              </div>

                              {/* Review Header */}
                              <div className="review-header">
                                <div className="reviewer-info">
                                  <div className="avatar-container">
                                    <img 
                                      src={review.avatar} 
                                      alt={review.name}
                                      className="reviewer-avatar"
                                      loading="lazy"
                                    />
                                    {review.verified && (
                                      <div className="verified-badge">
                                        <i className="bi bi-check-circle-fill"></i>
                                      </div>
                                    )}
                                  </div>
                                  <div className="reviewer-details">
                                    <h6 className="reviewer-name">{review.name}</h6>
                                    <div className="reviewer-meta">
                                      <span className="location">{review.location}</span>
                                      <span className="date">{formatDate(review.date)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Rating */}
                                <div className="review-rating">
                                  {renderStars(review.rating)}
                                </div>
                              </div>

                              {/* Tour Info */}
                              <div className="tour-info">
                                <span className="tour-badge">{review.tour}</span>
                              </div>

                              {/* Review Content */}
                              <div className="review-content">
                                <p className="review-text">"{review.comment}"</p>
                              </div>

                              {/* Review Footer */}
                              <div className="review-footer">
                                <div className="helpful-section">
                                  <button className="helpful-btn">
                                    <i className="bi bi-hand-thumbs-up"></i>
                                    Hữu ích
                                  </button>
                                  <span className="helpful-count">12</span>
                                </div>
                              </div>

                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {Array.from({ length: Math.ceil(filteredReviews.length / 3) }, (_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className="reviews-cta text-center my-5">
          <h4>Bạn đã từng trải nghiệm dịch vụ của chúng tôi?</h4>
          <p>Chia sẻ cảm nhận của bạn để giúp những khách hàng khác</p>
          <Link to='/bookings' >
            <button className="btn btn-primary btn-lg cta-btn">
              <i className="bi bi-star-fill me-2"></i>
              Viết đánh giá
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;