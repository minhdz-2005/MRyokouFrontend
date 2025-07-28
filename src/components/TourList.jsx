// src/components/TourList.jsx
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortBar from '../components/SortBar'
import SearchBar from './SearchBar';
import './TourList.css';
import { BsStarFill, BsClock, BsGeoAlt, BsEye } from 'react-icons/bs';
import fallbackImg from '/images/Noel_Bauza1.jpg';

const toursPerPage = 6; // Tăng lên 9 để layout đẹp hơn

const TourList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [tours, setTours] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  /* ───────────── Fetch tour mỗi khi đổi trang ───────────── */
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/tours`,
          {
            params: { page: currentPage, limit: toursPerPage, sort, ...searchParams },
          }
        );
        setTours(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Không thể tải dữ liệu tour!';
          setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, sort, searchParams]);

  const handleSearch = (filters) => {
    setSearchParams(filters);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      buttons.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>1</button>
        </li>
      );
      if (startPage > 2) {
        buttons.push(
          <li key="dots1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Visible pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <li key="dots2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      buttons.push(
        <li key="last" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>
      );
    }

    return buttons;
  };

  return (
    <div className="tour-list-container">
      <div className="container-fluid px-4 bg-light">
        {/* Header Section */}
        <div className="tour-list-header">
          <SearchBar onSearch={handleSearch} />
          <SortBar onSortChange={handleSortChange} />
        </div>

        <div className="section-title">
          <h2 className="main-title text-primary">
            <span className="title-gradient">Khám Phá</span> Các Tour Du Lịch
          </h2>
          <p className="subtitle text-muted">Hơn {tours.length} tour tuyệt vời đang chờ bạn khám phá</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <p className="loading-text">Đang tải các tour tuyệt vời...</p>
          </div>
        )}

        {/* Error State */}
        {errMsg && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{errMsg}</p>
            <button 
              className="btn btn-primary retry-btn"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Tours Grid */}
        {!loading && tours.length > 0 && (
          <div className="tours-grid">
            {tours.map((tour, index) => (
              <div 
                className="tour-card-wrapper" 
                key={tour._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="tour-card">
                  <div className="tour-image-container">
                    <img
                      src={tour.image || fallbackImg}
                      alt={tour.title}
                      className="tour-image"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = fallbackImg;
                      }}
                    />
                    <div className="tour-overlay">
                      <Link 
                        to={`/tours/${tour._id}`} 
                        className="view-detail-btn"
                        target="_blank"
                      >
                        <BsEye /> Xem chi tiết
                      </Link>
                    </div>
                    {tour.isHot && <div className="hot-badge">🔥 Hot</div>}
                    <div className="price-badge bg-light">
                      <span className='text-primary'>{formatPrice(tour.price)} / Người</span>
                    </div>
                  </div>

                  <div className="tour-content bg-light">
                    <div className="tour-location">
                      <BsGeoAlt className="location-icon" />
                      {tour.location}
                    </div>
                    
                    <h3 className="tour-title text-dark">{tour.title}</h3>
                    
                    {tour.description && (
                      <p className="tour-description">
                        {tour.description.length > 100 
                          ? `${tour.description.substring(0, 100)}...` 
                          : tour.description
                        }
                      </p>
                    )}

                    <div className="tour-info">
                      <div className="tour-rating">
                        <BsStarFill className="star-icon" />
                        <span className="rating-value text-primary">{tour.rating}</span>
                        <span className="rating-text">Đánh giá</span>
                      </div>
                      
                      {tour.duration && (
                        <div className="tour-duration">
                          Thời gian:
                          <BsClock className="duration-icon" />
                          <span>{tour.duration} ngày</span>
                        </div>
                      )}
                    </div>

                    <div className="tour-actions">
                      <Link 
                        to={`/tours/${tour._id}`}
                        className="book-now-btn"
                        target="_blank"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tours.length === 0 && !errMsg && (
          <div className="empty-state">
            <div className="empty-icon">🏝️</div>
            <h3 className='text-muted'>Không tìm thấy tour nào</h3>
            <p className='text-muted'>Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pagination-container">
            <nav aria-label="Tour pagination">
              <ul className="custom-pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link prev-btn bg-outline-primary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                     <span className='text-primary'>
                     <span className='fa fa-arrow-left'></span>
                     </span>
                  </button>
                </li>

                {renderPaginationButtons()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link next-btn bg-outline-primary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className='text-primary next'>
                      <span className='fa fa-arrow-right'></span>
                    </span>
                  </button>
                </li>
              </ul>
            </nav>
            
            <div className="pagination-info text-dark font-weight-bold">
              Trang {currentPage} / {totalPages} - Tổng {tours.length} tour
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourList;