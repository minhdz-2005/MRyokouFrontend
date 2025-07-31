import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import './MyBooking.css';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [ratingModal, setRatingModal] = useState({ 
    show: false, 
    bookingId: null, 
    currentRating: 5, 
    tourRate: 'Perfect',
    serviceRate: 'Perfect',
    tourRateCustom: '',
    serviceRateCustom: '',
    submitting: false,
    isEditing: false,
    ratingId: null
  });
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
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/user/${userId}`);
      const bookingsWithDetails = await Promise.all(
        res.data.map(async (booking) => {
          try {
            // Fetch tour details
            const tourRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tours/${booking.tour}`);
            const tourDetailRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details/${booking.tour}`);
            
            // Fetch rating for this booking
            let rating = null;
            try {
              const ratingRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/booking/${booking._id}`);
              // API trả về array, lấy phần tử đầu tiên
              rating = Array.isArray(ratingRes.data) ? ratingRes.data[0] : ratingRes.data;
            } catch (_ratingErr) {
              // Rating not found, that's okay
              console.log('Lỗi khi fetch rating:', _ratingErr);
              console.log('Không tìm thấy đánh giá cho booking:', booking._id);
            }
            
            return {
              ...booking,
              tour: tourRes.data,
              tourDetail: tourDetailRes.data,
              rating: rating
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
    setRatingModal({ 
      show: true, 
      bookingId, 
      currentRating, 
      tourRate: 'Perfect',
      serviceRate: 'Perfect',
      tourRateCustom: '',
      serviceRateCustom: '',
      submitting: false,
      isEditing: false,
      ratingId: null
    });
  };

  const handleEditRating = (bookingId, rating) => {
    setRatingModal({ 
      show: true, 
      bookingId, 
      currentRating: rating.star,
      tourRate: rating.tourRate,
      serviceRate: rating.serviceRate,
      tourRateCustom: '',
      serviceRateCustom: '',
      submitting: false,
      isEditing: true,
      ratingId: rating._id
    });
  };

  const handleCloseRating = () => {
    setRatingModal({ 
      show: false, 
      bookingId: null, 
      currentRating: 5, 
      tourRate: 'Perfect',
      serviceRate: 'Perfect',
      tourRateCustom: '',
      serviceRateCustom: '',
      submitting: false,
      isEditing: false,
      ratingId: null
    });
  };

  const handleRatingChange = (star) => {
    setRatingModal((prev) => ({ ...prev, currentRating: star }));
  };

  const handleTourRateChange = (rate) => {
    setRatingModal((prev) => ({ 
      ...prev, 
      tourRate: rate,
      tourRateCustom: '' // Reset custom input khi chọn từ dropdown
    }));
  };

  const handleServiceRateChange = (rate) => {
    setRatingModal((prev) => ({ 
      ...prev, 
      serviceRate: rate,
      serviceRateCustom: '' // Reset custom input khi chọn từ dropdown
    }));
  };

  const handleTourRateCustomChange = (value) => {
    setRatingModal((prev) => ({ 
      ...prev, 
      tourRateCustom: value,
      tourRate: 'Custom' // Set dropdown về Custom khi nhập text
    }));
  };

  const handleServiceRateCustomChange = (value) => {
    setRatingModal((prev) => ({ 
      ...prev, 
      serviceRateCustom: value,
      serviceRate: 'Custom' // Set dropdown về Custom khi nhập text
    }));
  };

  const handleSubmitRating = async () => {
    setRatingModal((prev) => ({ ...prev, submitting: true }));
    try {
      // Sử dụng custom value nếu có, không thì dùng dropdown value
      const finalTourRate = ratingModal.tourRateCustom || ratingModal.tourRate;
      const finalServiceRate = ratingModal.serviceRateCustom || ratingModal.serviceRate;

      if (ratingModal.isEditing) {
        // Update existing rating
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${ratingModal.ratingId}`, {
          star: ratingModal.currentRating,
          tourRate: finalTourRate,
          serviceRate: finalServiceRate,
        });
        setSuccessMsg('Cập nhật đánh giá thành công!');
      } else {
        // Create new rating
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ratings`, {
          booking: ratingModal.bookingId,
          user: user._id || user.id,
          star: ratingModal.currentRating,
          tourRate: finalTourRate,
          serviceRate: finalServiceRate,
        });
        setSuccessMsg('Đánh giá thành công!');
      }
      
      fetchBookings(user._id || user.id);
      setTimeout(() => setSuccessMsg(''), 2000);
      handleCloseRating();
    } catch (err) {
      console.error('Lỗi gửi đánh giá:', err);
      alert(ratingModal.isEditing ? 'Cập nhật đánh giá thất bại!' : 'Gửi đánh giá thất bại!');
      setRatingModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${ratingId}`);
        setSuccessMsg('Xóa đánh giá thành công!');
        fetchBookings(user._id || user.id);
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (err) {
        console.error('Lỗi xóa đánh giá:', err);
        alert('Xóa đánh giá thất bại!');
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Bạn có chắc muốn hủy booking này? Hành động này không thể hoàn tác.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`);
        setSuccessMsg('Hủy booking thành công!');
        fetchBookings(user._id || user.id);
        setTimeout(() => setSuccessMsg(''), 2000);
      } catch (err) {
        console.error('Lỗi hủy booking:', err);
        alert('Hủy booking thất bại!');
      }
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

  const canCancelBooking = (booking) => {
    if (!booking.departureDate) return false;
    
    const departureDate = new Date(booking.departureDate);
    const currentDate = new Date();
    const threeDaysBefore = new Date(departureDate);
    threeDaysBefore.setDate(departureDate.getDate() - 3);
    
    // Có thể hủy nếu hiện tại < 3 ngày trước ngày đi
    return currentDate < threeDaysBefore;
  };

  const getCancelDeadline = (booking) => {
    if (!booking.departureDate) return null;
    
    const departureDate = new Date(booking.departureDate);
    const threeDaysBefore = new Date(departureDate);
    threeDaysBefore.setDate(departureDate.getDate() - 3);
    
    return threeDaysBefore;
  };

  const ratingOptions = [
    { value: 'Perfect', label: 'Hoàn hảo' },
    { value: 'Good', label: 'Tốt' },
    { value: 'Average', label: 'Trung bình' },
    { value: 'Poor', label: 'Kém' },
    { value: 'Custom', label: 'Tự nhập...' }
  ];

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
                const cancelDeadline = getCancelDeadline(booking);
                const canCancel = canCancelBooking(booking);
                
                return (
                  <div className="col-12" key={booking._id}>
                    <div className="booking-card shadow-sm">
                      <div className="booking-card-header">
                        <h5 className="tour-title mb-0 text-primary-emphasis">{booking.tour?.title || 'Tour du lịch'}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`badge status-badge ${isEnded(booking) ? 'bg-success' : 'bg-secondary'}`}>
                            {isEnded(booking) ? 'Đã kết thúc' : 'Chưa kết thúc'}
                          </span>
                          {canCancel && (
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelBooking(booking._id)}
                              title="Hủy booking"
                            >
                              <FaTimes className="me-1" />
                              Hủy
                            </button>
                          )}
                        </div>
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
                        
                        {/* Thông báo về deadline hủy booking */}
                        {!isEnded(booking) && !canCancel && cancelDeadline && (
                          <div className="alert alert-warning mt-3 mb-3">
                            <strong>Lưu ý:</strong> Bạn chỉ có thể hủy booking trước ngày {cancelDeadline.toLocaleDateString('vi-VN')} (3 ngày trước ngày đi).
                          </div>
                        )}

                        <div className="tour-rating mt-3">
                          {booking.rating ? (
                            <div className="rated">
                              <div className="rating-display">
                                {[...Array(5)].map((_, i) => (
                                  <BsStarFill key={i} className={i < booking.rating.star ? 'text-warning' : 'text-muted'} />
                                ))}
                                <span className="ms-2 text-warning fs-4">{booking.rating.star}/5 sao</span>
                                {booking.rating.tourRate && (
                                  <span className="ms-2 text-muted">| Tour: {booking.rating.tourRate}</span>
                                )}
                                {booking.rating.serviceRate && (
                                  <span className="ms-2 text-muted">| Dịch vụ: {booking.rating.serviceRate}</span>
                                )}
                              </div>
                              <div className="rating-actions mt-2">
                                <button 
                                  className="btn btn-outline-primary btn-sm me-2" 
                                  onClick={() => handleEditRating(booking._id, booking.rating)}
                                >
                                  <FaEdit className="me-1" />
                                  Chỉnh sửa
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm" 
                                  onClick={() => handleDeleteRating(booking.rating._id)}
                                >
                                  <FaTrash className="me-1" />
                                  Xóa
                                </button>
                              </div>
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
              <h5>{ratingModal.isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá tour'}</h5>
              
              {/* Star Rating */}
              <div className="rating-section mb-3">
                <label className="form-label text-muted">Đánh giá tổng quan:</label>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} onClick={() => handleRatingChange(i + 1)} style={{ cursor: 'pointer' }}>
                      {i < ratingModal.currentRating ? (
                        <BsStarFill className="text-warning" size={28} />
                      ) : (
                        <BsStar className="text-muted" size={28} />
                      )}
                    </span>
                  ))}
                  <span className="ms-2 text-warning fs-3">{ratingModal.currentRating}/5 sao</span>
                </div>
              </div>

              {/* Tour Rate */}
              <div className="rating-section mb-3">
                <label className="form-label text-muted">Đánh giá tour:</label>
                <select 
                  className="form-select mb-2" 
                  value={ratingModal.tourRate}
                  onChange={(e) => handleTourRateChange(e.target.value)}
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {ratingModal.tourRate === 'Custom' && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập đánh giá tour của bạn..."
                    value={ratingModal.tourRateCustom}
                    onChange={(e) => handleTourRateCustomChange(e.target.value)}
                  />
                )}
              </div>

              {/* Service Rate */}
              <div className="rating-section mb-3">
                <label className="form-label text-muted">Đánh giá dịch vụ:</label>
                <select 
                  className="form-select mb-2" 
                  value={ratingModal.serviceRate}
                  onChange={(e) => handleServiceRateChange(e.target.value)}
                >
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {ratingModal.serviceRate === 'Custom' && (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập đánh giá dịch vụ của bạn..."
                    value={ratingModal.serviceRateCustom}
                    onChange={(e) => handleServiceRateCustomChange(e.target.value)}
                  />
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" onClick={handleCloseRating} disabled={ratingModal.submitting}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSubmitRating} disabled={ratingModal.submitting}>
                  {ratingModal.submitting ? 'Đang gửi...' : (ratingModal.isEditing ? 'Cập nhật' : 'Gửi đánh giá')}
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
