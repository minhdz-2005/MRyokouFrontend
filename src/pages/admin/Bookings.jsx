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
        // Kiểm tra nếu không có dữ liệu tour hoặc departure date
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
        
        // Tính ngày kết thúc tour (ngày cuối cùng của tour)
        const endDate = new Date(departureDate);
        endDate.setDate(departureDate.getDate() + tourDuration - 1); // Trừ 1 vì ngày đầu cũng tính
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
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
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý đặt tour</h2>
                <div className="header-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc tên tour..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <i className="fas fa-search search-icon"></i>
                    </div>
                    <button className="add-btn" onClick={fetchBookings}>
                        <i className="fas fa-refresh"></i>
                        Làm mới
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Thông tin liên hệ</th>
                            <th>Tour</th>
                            <th>Ngày đặt</th>
                            <th>Ngày đi</th>
                            <th>Số người</th>
                            <th>Tổng tiền</th>
                            <th>Ghi chú</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                                                 {filteredBookings.length === 0 ? (
                             <tr>
                                 <td colSpan="10" className="no-data">
                                     {bookings.length === 0 ? 'Không có đặt tour nào' : 'Không tìm thấy kết quả phù hợp'}
                                 </td>
                             </tr>
                         ) : (
                             filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td className='text-dark'>{booking._id}</td>
                                    <td>
                                        <div className='text-dark'>
                                            <strong>{booking.fullName}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div className='text-dark'>{booking.email}</div>
                                            <div className='text-dark'>{booking.phone}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong className='text-dark'>{tours[booking.tour]?.title || 'N/A'}</strong>
                                            <div className="tour-info text-dark">
                                                {tours[booking.tour]?.duration && `${tours[booking.tour].duration} ngày`}
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-dark'>{formatDate(booking.createdAt)}</td>
                                    <td className='text-dark'>{formatDate(booking.departureDate)}</td>
                                    <td>
                                        <div>
                                            <div className='text-dark'>Người lớn: {booking.adults}</div>
                                            {booking.children > 0 && (
                                                <div className='text-dark'>Trẻ em: {booking.children}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className='text-dark'>{formatPrice(booking.totalPrice)}</td>
                                    <td className='text-dark'>
                                        {booking.note ? (
                                            <div className="note-text" title={booking.note}>
                                                {booking.note.length > 50 
                                                    ? booking.note.substring(0, 50) + '...' 
                                                    : booking.note}
                                            </div>
                                        ) : (
                                            <span className="no-note">Không có</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {(() => {
                                                const ended = isBookingEnded(booking);
                                                console.log(`Booking ${booking._id} ended:`, ended, {
                                                    departureDate: booking.departureDate,
                                                    tourData: tours[booking.tour],
                                                    tourDuration: tours[booking.tour]?.duration
                                                });
                                                return !ended ? (
                                                    <button 
                                                        className="delete-btn"
                                                        onClick={() => openCancelModal(booking)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                        Hủy
                                                    </button>
                                                ) : (
                                                    <span className="booking-ended-badge">
                                                        Đã kết thúc
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

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
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn hủy đặt tour này?</p>
                            <div className="booking-details">
                                <p><strong>Khách hàng:</strong> {selectedBooking.fullName}</p>
                                <p><strong>Tour:</strong> {tours[selectedBooking.tour]?.name || 'N/A'}</p>
                                <p><strong>Ngày đi:</strong> {formatDate(selectedBooking.departureDate)}</p>
                                <p><strong>Tổng tiền:</strong> {formatPrice(selectedBooking.totalPrice)}</p>
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
