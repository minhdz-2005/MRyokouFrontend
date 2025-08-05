// src/components/FeaturedTours.jsx
import React, { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './FeaturedTour.css';
import axios from 'axios';

// const tours = [
//   {
//     title: 'Hội An',
//     location: 'Hội An, Quảng Nam',
//     description: 'Khám phá phố cổ với những ngôi nhà cổ kính, đèn lồng rực rỡ và văn hóa độc đáo.',
//     price: 4800000,
//     duration: 3,
//     image: 'https://images.unsplash.com/photo-1559592413-7cec4d0d9b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     rating: 4.7,
//     reviews: 234,
//     tags: [
//       'Văn hóa',
//       'Phố cổ',
//       'Đèn lồng',
//       'Ẩm thực'
//     ],
//   },
//   {
//     title: 'Nha Trang',
//     location: 'Nha Trang, Khánh Hòa',
//     description: 'Tận hưởng bãi biển tuyệt đẹp, hoạt động thể thao dưới nước và cuộc sống về đêm sôi động.',
//     price: 4800000,
//     duration: 4,
//     image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     rating: 4.5,
//     reviews: 186,
//     tags: [
//       'Biển',
//       'Lặn biển',
//       'Resort',
//       'Thể thao nước'
//     ],
//   },
//   {
//     title: 'Phú Quốc',
//     location: 'Phú Quốc, Kiên Giang',
//     description: 'Đảo ngọc với những bãi biển hoang sơ, rừng nhiệt đới và hải sản tươi ngon.',
//     price: 5200000,
//     duration: 5,
//     image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
//     rating: 4.8,
//     reviews: 312,
//     tags: [
//       'Đảo',
//       'Nghỉ dưỡng',
//       'Hải sản',
//       'Thiên nhiên'
//     ],
//   },
// ];

const FeaturedTours = () => {
  const { t } = useTranslation();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedTours = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tours`, {
          params: {
            limit: 3,
            sort: 'rating' // Sort by rating descending
          }
        });
        setTours(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || t('featured.content.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedTours();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }

    return stars;
  };

  if (loading) {
    return (
      <section className="featured-tours-section py-5">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">{t('featured.content.loading')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-tours-section py-5">
        <div className="container text-center py-5">
          <div className="alert alert-warning">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-tours-section">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <span className="badge bg-primary bg-gradient px-3 py-2 mb-3 rounded-pill">
              ✈️ {t('featured.header.badge')}
            </span>
            <h2 className="display-5 fw-bold text-dark mb-3">
              {t('featured.header.title')} <span className="text-primary">{t('featured.header.highlight')}</span>
            </h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
              {t('featured.header.subtitle')}
            </p>
          </div>
        </div>

        <div className="row g-4">
          {tours.map((tour, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="tour-card h-100 position-relative">
                <div className="tour-image-wrapper">
                  <img 
                    src={tour.image} 
                    className="tour-image" 
                    alt={tour.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250/007bff/ffffff?text=Tour+Image';
                    }}
                  />
                  <div className="tour-overlay">
                    <div className="tour-tags">
                      {tour.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span key={tagIndex} className="tag-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tour-content">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="tour-title">{tour.title}</h5>
                    <div className="duration-badge">
                      <i className="fas fa-clock me-1"></i>
                      {tour.duration} {t('featured.content.days')}
                    </div>
                  </div>

                  <p className="tour-location text-muted mb-2">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    {tour.location}
                  </p>

                  <p className="tour-description text-muted mb-3">
                    {tour.description.length > 80
                      ? tour.description.slice(0, 80) + '...'
                      : tour.description}
                  </p>

                  <div className="rating-section mb-3">
                    <div className="d-flex align-items-center">
                      <div className="stars me-2">
                        {renderStars(tour.rating)}
                      </div>
                      <span className="rating-score fw-bold text-dark me-2">
                        {tour.rating}
                      </span>
                    </div>
                  </div>

                  <div className="price-section">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="price-info me-3">
                        <div className="current-price fw-bold text-primary fs-5">
                          {formatPrice(tour.price)}
                          <small className="text-muted"> {t('featured.content.perPerson')}</small>
                        </div>
                      </div>
                      <Link target='blank' to={`/tours/${tour._id}`}>
                        <button className="btn btn-primary btn-book px-4 py-2">
                          <i className="fas fa-calendar-check me-2"></i>
                          {t('featured.content.bookTour')}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link to='/tour' className='btn btn-outline-primary btn-lg px-5 py-3'>
              <i className="fas fa-search me-2"></i>
              {t('featured.content.viewAllTours')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;