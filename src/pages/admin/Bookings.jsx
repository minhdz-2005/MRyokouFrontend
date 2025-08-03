import React, { useState, useEffect, useCallback } from 'react';
import './Bookings.css';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [tours, setTours] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch tour details by ID
    const fetchTourDetails = async (tourId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tours/${tourId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin tour');
            }

            const tourData = await response.json();
            return tourData;
        } catch (error) {
            console.error('Error fetching tour details:', error);
            return null;
        }
    };

    // Fetch bookings from API
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách đặt tour');
            }

            const data = await response.json();
            setBookings(data);

            // Fetch tour details for each booking
            const tourDetails = {};
            console.log('Fetching tour details for bookings:', data.length);
            for (const booking of data) {
                if (booking.tour) {
                    console.log('Fetching tour details for tourId:', booking.tour);
                    const tourData = await fetchTourDetails(booking.tour);
                    if (tourData) {
                        tourDetails[booking.tour] = tourData;
                        console.log('Tour data loaded:', tourData.title, 'duration:', tourData.duration);
                    } else {
                        console.log('Failed to load tour data for tourId:', booking.tour);
                    }
                }
            }
            console.log('All tour details loaded:', Object.keys(tourDetails));
            setTours(tourDetails);
            setFilteredBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter bookings based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter(booking => 
                booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tours[booking.tour]?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tours[booking.tour]?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
    }, [searchTerm, bookings, tours]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Handle booking cancellation
    const handleCancel = async (bookingId) => {
        try {
            setActionLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể hủy đặt tour');
            }

            // Refresh bookings list
            await fetchBookings();
            setShowCancelModal(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setError(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openCancelModal = (booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    // Check if booking has ended
    const isBookingEnded = (booking) => {
        if (!booking.departureDate) {
            console.log('No departure date for booking:', booking._id);
            return false;
        }
        
        if (!tours[booking.tour]) {
            console.log('Tour data not loaded for booking:', booking._id, 'tourId:', booking.tour);
            return false;
        }
        
        if (!tours[booking.tour].duration) {
            console.log('No duration for tour:', booking.tour, tours[booking.tour]);
            return false;
        }
        
        const departureDate = new Date(booking.departureDate);
        const tourDuration = parseInt(tours[booking.tour].duration);
        
        const endDate = new Date(departureDate);
        endDate.setDate(departureDate.getDate() + tourDuration - 1);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isEnded = endDate < today;
        
        console.log('Booking ended check:', {
            bookingId: booking._id,
            departureDate: departureDate.toLocaleDateString('vi-VN'),
            tourDuration,
            endDate: endDate.toLocaleDateString('vi-VN'),
            today: today.toLocaleDateString('vi-VN'),
            isEnded
        });
        
        return isEnded;
    };

    if (loading) {
        return (
            <div className="component-container">
                <div className="loading">Đang tải danh sách đặt tour...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="component-container">
                <div className="error-message">
                    <p>Lỗi: {error}</p>
                    <button onClick={fetchBookings} className="retry-btn">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="component-container bookings-component">
            <div className="component-header">
                <div className="header-content">
                    <h2 className="component-title">Quản lý đặt tour</h2>
                    <div className="header-actions">
                        <div className="search-container">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc tên tour..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            
                        </div>
                        <button className="refresh-btn" onClick={fetchBookings}>
                            <i className="fas fa-refresh"></i>
                            Làm mới
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {filteredBookings.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-calendar-times"></i>
                    <h3>
                        {bookings.length === 0 ? 'Không có đặt tour nào' : 'Không tìm thấy kết quả phù hợp'}
                    </h3>
                    <p>
                        {bookings.length === 0 
                            ? 'Chưa có đặt tour nào được tạo.'
                            : `Không tìm thấy đặt tour nào phù hợp với "${searchTerm}"`
                        }
                    </p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <div className="booking-id">#{booking._id.slice(-8)}</div>
                                <div className="booking-status">
                                    {isBookingEnded(booking) ? (
                                        <span className="status-badge ended">Đã kết thúc</span>
                                    ) : (
                                        <span className="status-badge active">Đang hoạt động</span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="booking-content">
                                <div className="customer-info">
                                    <h4 className="customer-name">{booking.fullName}</h4>
                                    <div className="contact-info">
                                        <div className="contact-item">
                                            <i className="fas fa-envelope"></i>
                                            <span>{booking.email}</span>
                                        </div>
                                        <div className="contact-item">
                                            <i className="fas fa-phone"></i>
                                            <span>{booking.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="tour-info">
                                    <h5 className="tour-title">
                                        {tours[booking.tour]?.title || 'Tour không xác định'}
                                    </h5>
                                    <div className="tour-details">
                                        <span className="tour-duration">
                                            <i className="fas fa-clock"></i>
                                            {tours[booking.tour]?.duration ? `${tours[booking.tour].duration} ngày` : 'N/A'}
                                        </span>
                                        <span className="tour-location">
                                            <i className="fas fa-map-marker-alt"></i>
                                            {tours[booking.tour]?.location || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="booking-details">
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <label>Ngày đặt:</label>
                                            <span>{formatDate(booking.createdAt)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Ngày đi:</label>
                                            <span>{formatDate(booking.departureDate)}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <div className="detail-item">
                                            <label>Số người:</label>
                                            <span>
                                                {booking.adults} người lớn
                                                {booking.children > 0 && `, ${booking.children} trẻ em`}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Tổng tiền:</label>
                                            <span className="total-price">{formatPrice(booking.totalPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {booking.note && (
                                    <div className="booking-note">
                                        <label>Ghi chú:</label>
                                        <p>{booking.note}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="booking-actions">
                                {!isBookingEnded(booking) && (
                                    <button 
                                        className="cancel-booking-btn"
                                        onClick={() => openCancelModal(booking)}
                                        title="Hủy đặt tour"
                                    >
                                        <i className="fas fa-times"></i>
                                        Hủy đặt tour
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Hủy đặt tour</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowCancelModal(false)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn hủy đặt tour này?</p>
                            <div className="booking-details">
                                <div className="detail-item">
                                    <strong>Khách hàng:</strong> {selectedBooking.fullName}
                                </div>
                                <div className="detail-item">
                                    <strong>Tour:</strong> {tours[selectedBooking.tour]?.title || 'N/A'}
                                </div>
                                <div className="detail-item">
                                    <strong>Ngày đi:</strong> {formatDate(selectedBooking.departureDate)}
                                </div>
                                <div className="detail-item">
                                    <strong>Tổng tiền:</strong> {formatPrice(selectedBooking.totalPrice)}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-btn"
                                onClick={() => setShowCancelModal(false)}
                                disabled={actionLoading}
                            >
                                Không
                            </button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleCancel(selectedBooking._id)}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Hủy đặt tour'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
