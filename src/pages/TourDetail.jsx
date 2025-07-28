import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Modal } from 'react-bootstrap';
import './TourDetail.css'; // Import CSS tùy chỉnh
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('highlights');
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Form data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [note, setNote] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // State để lưu thông tin account (chủ yếu để lấy phoneNumber)
  const [_userAccount, setUserAccount] = useState(null);

  // Tự động điền fullname và email nếu có user, chỉ khi form đang rỗng
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullname || '');
      if (!email) setEmail(user.email || '');
      // Lấy thông tin account để có số điện thoại
      fetchUserAccount(user._id || user.id);
    }
    // eslint-disable-next-line
  }, [user, email]);

  // Hàm lấy thông tin account
  const fetchUserAccount = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/by-user/${userId}`);
      setUserAccount(response.data);
      // Tự động điền số điện thoại nếu có
      if (!phone && response.data.phoneNumber) {
        setPhone(response.data.phoneNumber);
      }
    } catch (err) {
      console.log('Không thể tải thông tin account:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tourRes, detailRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tours/${id}`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details/${id}`),
        ]);
        setTour(tourRes.data);
        setDetail(detailRes.data);
      } catch (err) {
        setErrMsg(err.response?.data?.message || 'Không tìm thấy thông tin!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên';
    if (!email.trim()) errors.email = 'Vui lòng nhập email';
    if (!phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
    if (!departureDate) errors.departureDate = 'Vui lòng chọn ngày khởi hành';
    
    const selectedDate = new Date(departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.departureDate = 'Ngày khởi hành phải từ hôm nay trở đi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const bookingData = {
      tour: tour._id,
      userId: user?._id || user?.id || '', // Gửi userId đúng schema
      fullName,
      email,
      phone,
      departureDate,
      adults,
      children,
      totalPrice: calculateTotalPrice(), // Gửi totalPrice thay vì price
      note
    };

    try {
      await axios.post('${import.meta.env.VITE_API_BASE_URL}/api/bookings', bookingData);
      setShowModal(true);
      setShowBookingForm(false);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setDepartureDate('');
      setAdults(1);
      setChildren(0);
      setNote('');
      setFormErrors({});
    } catch (error) {
      alert('Đặt tour thất bại! Vui lòng thử lại sau.');
      console.error(error);
    }
  };

  const calculateTotalPrice = () => {
    if (!tour) return 0;
    const adultPrice = tour.price * adults;
    const childPrice = tour.price * 0.7 * children; // Giảm 30% cho trẻ em
    return adultPrice + childPrice;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải thông tin tour...</p>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {errMsg}
        </div>
      </div>
    );
  }

  if (!tour || !detail) return null;

  return (
    <>
      <Header />
      
      <div className="tour-detail-page">
        {/* Hero Section */}
        <div className="tour-hero">
          <div className="hero-overlay"></div>
          <div className="container">
            <div className="row align-items-center min-vh-50">
              <div className="col-lg-8">
                <div className="hero-content">
                  <h1 className="hero-title">{tour.title}</h1>
                  <div className="tour-badges">
                    <span className="badge bg-primary me-2">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {tour.location}
                    </span>
                    <span className="badge bg-warning">
                      <i className="fas fa-star me-1"></i>
                      {tour.rating}/5
                    </span>
                  </div>
                  <div className="price-section">
                    <span className="price-label">Chỉ từ</span>
                    <span className="price-value">{tour.price.toLocaleString()}đ</span>
                    <span className="price-unit">/người</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container my-5">
          {/* Tour Description */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="description-card">
                <h3 className="section-title">
                  <i className="fas fa-info-circle text-primary me-2"></i>
                  Về chuyến du lịch này
                </h3>
                <p className="lead">{tour.description || 'Trải nghiệm tuyệt vời đang chờ đón bạn!'}</p>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="tour-gallery-section">
            <h3 className="gallery-title">
              <i className="fas fa-images text-primary me-2"></i>
              Thư viện ảnh
            </h3>
            <div className="gallery-container">
              {/* Main image with navigation */}
              <div className="main-image-wrapper">
                <button 
                  className="nav-btn prev-btn"
                  onClick={() => setSelectedImage((prev) => (prev === 0 ? detail.image.length - 1 : prev - 1))}
                  aria-label="Ảnh trước"
                  type="button"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="main-image-container">
                  <div className={`main-image-inner ${isImageLoading ? 'loading' : 'loaded'}`}> 
                    <img 
                      src={detail.image[selectedImage]} 
                      alt={`Tour image ${selectedImage + 1}`} 
                      className="main-image"
                      loading="lazy"
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                      style={{opacity: isImageLoading ? 0.5 : 1, transition: 'opacity 0.5s'}}
                    />
                    {isImageLoading && <div className="image-loading-spinner"></div>}
                  </div>
                  <div className="image-counter">
                    {selectedImage + 1} / {detail.image.length}
                  </div>
                </div>
                <button 
                  className="nav-btn next-btn"
                  onClick={() => setSelectedImage((prev) => (prev === detail.image.length - 1 ? 0 : prev + 1))}
                  aria-label="Ảnh tiếp theo"
                  type="button"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              {/* Thumbnail navigation */}
              <div className="thumbnail-gallery">
                {detail.image.map((img, i) => (
                  <div 
                    key={i}
                    className={`thumbnail-item ${i === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(i)}
                    tabIndex={0}
                    aria-label={`Chọn ảnh ${i + 1}`}
                    role="button"
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedImage(i)}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${i + 1}`} 
                      className="thumbnail-image"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tour Details Tabs */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="tour-details-card">
                <ul className="nav nav-pills custom-tabs mb-4" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'highlights' ? 'active' : ''}`}
                      onClick={() => setActiveTab('highlights')}
                    >
                      <i className="fas fa-star me-2"></i>Điểm nổi bật
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'itinerary' ? 'active' : ''}`}
                      onClick={() => setActiveTab('itinerary')}
                    >
                      <i className="fas fa-route me-2"></i>Lịch trình
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
                      onClick={() => setActiveTab('schedule')}
                    >
                      <i className="fas fa-calendar me-2"></i>Lịch khởi hành
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button 
                      className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <i className="fas fa-exclamation-triangle me-2"></i>Lưu ý
                    </button>
                  </li>
                </ul>

                <div className="tab-content">
                  {activeTab === 'highlights' && (
                    <div className="tab-pane-content">
                      <h4 className="mb-3">✨ Trải nghiệm thú vị</h4>
                      <div className="row">
                        {detail.highlights.map((highlight, i) => (
                          <div key={i} className="col-md-6 mb-3">
                            <div className="highlight-item">
                              <i className="fas fa-check-circle text-success me-2"></i>
                              {highlight}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'itinerary' && (
                    <div className="tab-pane-content">
                      <h4 className="mb-3">📋 Chương trình tour</h4>
                      <div className="itinerary-timeline">
                        {detail.itinerary.map((item, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-marker">
                              <span className="timeline-number">{i + 1}</span>
                            </div>
                            <div className="timeline-content">
                              <p>{item}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'schedule' && (
                    <div className="tab-pane-content">
                      <h4 className="mb-3">📆 Lịch khởi hành</h4>
                      <div className="table-responsive">
                        <table className="table table-hover custom-table">
                          <thead>
                            <tr>
                              <th><i className="fas fa-play text-success me-1"></i>Bắt đầu</th>
                              <th><i className="fas fa-stop text-danger me-1"></i>Kết thúc</th>
                              <th><i className="fas fa-info text-info me-1"></i>Trạng thái</th>
                              <th><i className="fas fa-money-bill text-warning me-1"></i>Giá (đ)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detail.schedules.map((schedule, i) => (
                              <tr key={i}>
                                <td>{new Date(schedule.startDate).toLocaleDateString('vi-VN')}</td>
                                <td>{new Date(schedule.endDate).toLocaleDateString('vi-VN')}</td>
                                <td>
                                  <span className={`badge ${schedule.status === 'Available' ? 'bg-success' : 'bg-danger'}`}>
                                    {schedule.status}
                                  </span>
                                </td>
                                <td className="fw-bold text-primary">{schedule.price.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="tab-pane-content">
                      <h4 className="mb-3">⚠️ Lưu ý quan trọng</h4>
                      <div className="notes-list">
                        {detail.notes.map((note, i) => (
                          <div key={i} className="note-item">
                            <i className="fas fa-info-circle text-warning me-2"></i>
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking CTA */}
          <div className="booking-cta-section">
            <div className="booking-cta-card text-center">
              <h3 className="mb-3">Sẵn sàng cho chuyến phiêu lưu?</h3>
              <p className="lead mb-4">Đừng bỏ lỡ cơ hội trải nghiệm những khoảnh khắc tuyệt vời!</p>
              <button 
                onClick={() => setShowBookingForm(!showBookingForm)} 
                className="btn btn-primary btn-lg px-5 py-3"
              >
                <i className="fas fa-paper-plane me-2"></i>
                {showBookingForm ? 'Ẩn form đặt tour' : 'Đặt tour ngay'}
              </button>
            </div>
          </div>

          {/* Enhanced Booking Form */}
          {showBookingForm && (
            <div className="booking-form-container mt-5">
              <div className="booking-form-card">
                <div className="form-header">
                  <h4><i className="fas fa-edit me-2"></i>Thông tin đặt tour</h4>
                  <p className='text-white'>Vui lòng điền đầy đủ thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-user me-1"></i>Họ và tên *
                      </label>
                      <input 
                        type="text" 
                        className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nhập họ và tên của bạn"
                      />
                      {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-envelope me-1"></i>Email *
                      </label>
                      <input 
                        type="email" 
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                      />
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-phone me-1"></i>Số điện thoại *
                      </label>
                      <input 
                        type="tel" 
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0123 456 789"
                      />
                      {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-calendar-alt me-1"></i>Ngày khởi hành *
                      </label>
                      <select
                        className={`form-select ${formErrors.departureDate ? 'is-invalid' : ''} bg-white text-muted border border-secondary`}
                        value={departureDate}
                        onChange={e => setDepartureDate(e.target.value)}
                      >
                        <option value="">-- Chọn ngày khởi hành --</option>
                        {detail.schedules.map((schedule, idx) => (
                          <option key={idx} value={schedule.startDate}>
                            {new Date(schedule.startDate).toLocaleDateString('vi-VN')}
                          </option>
                        ))}
                      </select>
                      {formErrors.departureDate && <div className="invalid-feedback">{formErrors.departureDate}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-users me-1"></i>Số người lớn
                      </label>
                      <div className="input-group">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                        >
                          <i className='fas fa-minus'></i>
                        </button>
                        <input 
                          type="number" 
                          min="1" 
                          className="form-control text-center"
                          value={adults} 
                          onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setAdults(adults + 1)}
                        >
                          <i className='fas fa-plus'></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <i className="fas fa-child me-1"></i>Số trẻ em
                      </label>
                      <div className="input-group">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                        >
                          <i className='fas fa-minus'></i>
                        </button>
                        <input 
                          type="number" 
                          min="0" 
                          className="form-control text-center"
                          value={children} 
                          onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                        />
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary"
                          onClick={() => setChildren(children + 1)}
                        >
                          <i className='fas fa-plus'></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      <i className="fas fa-sticky-note me-1"></i>Ghi chú (tùy chọn)
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={note} 
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Có điều gì đặc biệt bạn muốn chúng tôi biết không?"
                    />
                  </div>

                  {/* Price Summary */}
                  <div className="price-summary mb-4">
                    <h6>Chi tiết giá:</h6>
                    <div className="d-flex justify-content-between">
                      <span>Người lớn ({adults} x {tour.price.toLocaleString()}đ):</span>
                      <span>{(adults * tour.price).toLocaleString()}đ</span>
                    </div>
                    {children > 0 && (
                      <div className="d-flex justify-content-between">
                        <span>Trẻ em ({children} x {(tour.price * 0.7).toLocaleString()}đ):</span>
                        <span>{(children * tour.price * 0.7).toLocaleString()}đ</span>
                      </div>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between fw-bold text-primary fs-5">
                      <span>Tổng cộng:</span>
                      <span>{calculateTotalPrice().toLocaleString()}đ</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success btn-lg w-100">
                    <i className="fas fa-paper-plane me-2"></i>
                    Gửi yêu cầu đặt tour
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

      </div>

      <Footer />

      {/* Enhanced Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-success">
            <i className="fas fa-check-circle me-2"></i>
            Đặt tour thành công!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="success-animation mb-4">
            <i className="fas fa-check-circle text-success" style={{fontSize: '4rem'}}></i>
          </div>
          <h5 className="mb-3">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</h5>
          <p className="mb-3">Yêu cầu đặt tour của bạn đã được ghi nhận thành công.</p>
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            Nhân viên tư vấn sẽ liên hệ với bạn trong vòng <strong>24 giờ</strong> để xác nhận thông tin và hướng dẫn các bước tiếp theo.
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <button className="btn btn-primary px-4" onClick={() => setShowModal(false)}>
            <i className="fas fa-home me-2"></i>
            Về trang chủ
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourDetail;