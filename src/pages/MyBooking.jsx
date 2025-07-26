import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BsStarFill, BsStar } from 'react-icons/bs';
import './MyBooking.css';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [ratingModal, setRatingModal] = useState({ show: false, bookingId: null, currentRating: 5, submitting: false });
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage);
      setUser(userData);
      fetchBookings(userData._id || userData.id);
    } else {
      setError('Bạn chưa đăng nhập.');
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/bookings/user/${userId}`);
      const bookingsWithDetails = await Promise.all(
        res.data.map(async (booking) => {
          try {
            // Fetch tour details
            const tourRes = await axios.get(`http://localhost:5000/api/tours/${booking.tour}`);
            const tourDetailRes = await axios.get(`http://localhost:5000/api/tour-details/${booking.tour}`);
            
            return {
              ...booking,
              tour: tourRes.data,
              tourDetail: tourDetailRes.data
            };
          } catch (err) {
            console.log('Không thể tải chi tiết tour:', err);
            return booking;
          }
        })
      );
      setBookings(bookingsWithDetails);
    } catch {
      setError('Không thể tải danh sách tour đã đặt.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRating = (bookingId, currentRating = 5) => {
    setRatingModal({ show: true, bookingId, currentRating, submitting: false });
  };

  const handleCloseRating = () => {
    setRatingModal({ show: false, bookingId: null, currentRating: 5, submitting: false });
  };

  const handleRatingChange = (star) => {
    setRatingModal((prev) => ({ ...prev, currentRating: star }));
  };

  const handleSubmitRating = async () => {
    setRatingModal((prev) => ({ ...prev, submitting: true }));
    try {
      await axios.post('http://localhost:5000/api/ratings', {
        tour: ratingModal.bookingId,
        user: user._id || user.id,
        star: ratingModal.currentRating,
      });
      setSuccessMsg('Đánh giá thành công!');
      fetchBookings(user._id || user.id);
      setTimeout(() => setSuccessMsg(''), 2000);
      handleCloseRating();
    } catch {
      alert('Gửi đánh giá thất bại!');
      setRatingModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const calculateEndDate = (departureDate, duration) => {
    if (!departureDate || !duration) return null;
    
    const startDate = new Date(departureDate);
    // Duration giờ chỉ là số ngày (ví dụ: 3)
    const days = parseInt(duration);
    if (isNaN(days)) return null;
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + days - 1); // Trừ 1 vì ngày đi cũng tính là 1 ngày
    return endDate;
  };

  const isEnded = (booking) => {
    const endDate = calculateEndDate(booking.departureDate, booking.tour?.duration);
    if (!endDate) return false;
    return endDate < new Date();
  };

  return (
    <>
      <Header />
      <div className="mybooking-page bg-light">
        <div className="container py-5">
          <h2 className="mb-4 title text-primary">Tour đã đặt của tôi</h2>
          {loading ? (
            <div className="loading-booking">
              <div className="spinner-border text-primary" role="status"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="alert alert-info">Bạn chưa đặt tour nào.</div>
          ) : (
            <div className="row">
              {bookings.map((booking) => {
                const endDate = calculateEndDate(booking.departureDate, booking.tour?.duration);
                return (
                  <div className="col-12" key={booking._id}>
                    <div className="booking-card shadow-sm">
                      <div className="booking-card-header">
                        <h5 className="tour-title mb-0 text-primary-emphasis">{booking.tour?.title || 'Tour du lịch'}</h5>
                        <span className={`badge status-badge ${isEnded(booking) ? 'bg-success' : 'bg-secondary'}`}>
                          {isEnded(booking) ? 'Đã kết thúc' : 'Chưa kết thúc'}
                        </span>
                      </div>
                      <div className="booking-card-body">
                        <div className="tour-info-row">
                          <div className="info-item">
                            <span className="info-label">Ngày đi:</span>
                            <span className="info-value">{booking.departureDate ? new Date(booking.departureDate).toLocaleDateString('vi-VN') : '---'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ngày về:</span>
                            <span className="info-value">{endDate ? endDate.toLocaleDateString('vi-VN') : '---'}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Giá:</span>
                            <span className="info-value">{booking.totalPrice?.toLocaleString() || '---'}đ</span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Số người:</span>
                            <span className="info-value">{booking.adults} người lớn, {booking.children} trẻ em</span>
                          </div>
                        </div>
                        <div className="tour-rating mt-3">
                          {booking.rating ? (
                            <div className="rated">
                              {[...Array(5)].map((_, i) => (
                                <BsStarFill key={i} className={i < booking.rating.star ? 'text-warning' : 'text-muted'} />
                              ))}
                              <span className="ms-2">{booking.rating.star}/5 sao</span>
                            </div>
                          ) : isEnded(booking) ? (
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenRating(booking._id)}>
                              Đánh giá tour
                            </button>
                          ) : (
                            <span className="text-muted small">Chỉ có thể đánh giá sau khi tour kết thúc</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Rating Modal */}
        {ratingModal.show && (
          <div className="rating-modal-overlay">
            <div className="rating-modal">
              <h5>Đánh giá tour</h5>
              <div className="rating-stars mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} onClick={() => handleRatingChange(i + 1)} style={{ cursor: 'pointer' }}>
                    {i < ratingModal.currentRating ? (
                      <BsStarFill className="text-warning" size={28} />
                    ) : (
                      <BsStar className="text-muted" size={28} />
                    )}
                  </span>
                ))}
                <span className="ms-2">{ratingModal.currentRating}/5 sao</span>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={handleCloseRating} disabled={ratingModal.submitting}>Hủy</button>
                <button className="btn btn-primary" onClick={handleSubmitRating} disabled={ratingModal.submitting}>
                  {ratingModal.submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success rating-success-msg">{successMsg}</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default MyBooking;
