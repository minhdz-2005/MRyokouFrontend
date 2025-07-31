import React, { useState, useEffect, useCallback } from 'react';

const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [bookings, setBookings] = useState({});
    const [tours, setTours] = useState({});
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Fetch booking details by ID
    const fetchBookingDetails = async (bookingId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${bookingId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin đặt tour');
            }

            const bookingData = await response.json();
            return bookingData;
        } catch (error) {
            console.error('Error fetching booking details:', error);
            return null;
        }
    };

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

    // Fetch user details by ID
    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin người dùng');
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    // Fetch ratings from API
    const fetchRatings = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ratings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể tải danh sách đánh giá');
            }

            const data = await response.json();
            setRatings(data);

            // Fetch booking, tour, and user details for each rating
            const bookingDetails = {};
            const tourDetails = {};
            const userDetails = {};

            for (const rating of data) {
                console.log(rating + "RATING");
                if (rating.booking) {
                    const bookingData = await fetchBookingDetails(rating.booking);
                    if (bookingData) {
                        bookingDetails[rating.booking] = bookingData;
                        
                        // Fetch tour details if booking has tour
                        if (bookingData.tour) {
                            const tourData = await fetchTourDetails(bookingData.tour);
                            if (tourData) {
                                tourDetails[bookingData.tour] = tourData;
                            }
                        }
                        
                        // Fetch user details if booking has user
                        if (bookingData.user) {
                            const userData = await fetchUserDetails(bookingData.user);
                            if (userData) {
                                userDetails[bookingData.user] = userData;
                            }
                        }
                    }
                }
            }

            setBookings(bookingDetails);
            setTours(tourDetails);
            setUsers(userDetails);
            setFilteredRatings(data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter ratings based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRatings(ratings);
        } else {
            const filtered = ratings.filter(rating => {
                const booking = bookings[rating.booking];
                const user = booking ? users[booking.user] : null;
                const tour = booking ? tours[booking.tour] : null;
                
                return (
                    (user?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (tour?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (rating.tourRate || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (rating.serviceRate || '').toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setFilteredRatings(filtered);
        }
    }, [searchTerm, ratings, bookings, tours, users]);

    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]);

    // Handle rating deletion
    const handleDelete = async (ratingId) => {
        try {
            setActionLoading(true);
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${ratingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể xóa đánh giá');
            }

            // Refresh ratings list
            await fetchRatings();
            setShowDeleteModal(false);
            setSelectedRating(null);
        } catch (error) {
            console.error('Error deleting rating:', error);
            setError(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const openDeleteModal = (rating) => {
        setSelectedRating(rating);
        setShowDeleteModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const renderStars = (rating) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                        key={star} 
                        className={`star ${star <= rating ? 'filled' : 'empty'}`}
                    >
                        ★
                    </span>
                ))}
                <span className="rating-number">({rating}/5)</span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="component-container">
                <div className="loading">Đang tải danh sách đánh giá...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="component-container">
                <div className="error-message">
                    <p>Lỗi: {error}</p>
                    <button onClick={fetchRatings} className="retry-btn">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý đánh giá</h2>
                <div className="header-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên, email, tên tour hoặc đánh giá..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <i className="fas fa-search search-icon"></i>
                    </div>
                    <button className="add-btn" onClick={fetchRatings}>
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
                            <th>Tour</th>
                            <th>Đánh giá sao</th>
                            <th>Đánh giá tour</th>
                            <th>Đánh giá dịch vụ</th>
                            <th>Ngày đánh giá</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRatings.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="no-data">
                                    {ratings.length === 0 ? 'Không có đánh giá nào' : 'Không tìm thấy kết quả phù hợp'}
                                </td>
                            </tr>
                        ) : (
                            filteredRatings.map((rating) => {
                                const booking = bookings[rating.booking];
                                const tour = booking ? tours[booking.tour] : null;
                                
                                return (
                                    <tr key={rating._id}>
                                        <td className='text-dark'>{rating._id}</td>
                                        <td>
                                            <div className='text-dark'>
                                                <strong>{booking?.fullName || 'N/A'}</strong>
                                                <div>{booking?.email || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <strong className='text-dark'>{tour?.title || 'N/A'}</strong>
                                                {tour?.duration && (
                                                    <div className="tour-info text-dark">
                                                        {tour.duration} ngày
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {renderStars(rating.star)}
                                        </td>
                                        <td className='text-dark'>
                                            <span className={`rate-badge ${rating.tourRate === 'Perfect' ? 'perfect' : rating.tourRate === 'Good' ? 'good' : 'average'}`}>
                                                {rating.tourRate}
                                            </span>
                                        </td>
                                        <td className='text-dark'>
                                            <span className={`rate-badge ${rating.serviceRate === 'Perfect' ? 'perfect' : rating.serviceRate === 'Good' ? 'good' : 'average'}`}>
                                                {rating.serviceRate}
                                            </span>
                                        </td>
                                        <td className='text-dark'>{formatDate(rating.createdAt)}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => openDeleteModal(rating)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && selectedRating && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Xóa đánh giá</h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa đánh giá này?</p>
                            <div className="rating-details">
                                <p><strong>Khách hàng:</strong> {users[bookings[selectedRating.booking]?.user]?.fullName || 'N/A'}</p>
                                <p><strong>Tour:</strong> {tours[bookings[selectedRating.booking]?.tour]?.title || 'N/A'}</p>
                                <p><strong>Đánh giá sao:</strong> {selectedRating.star}/5</p>
                                <p><strong>Đánh giá tour:</strong> {selectedRating.tourRate}</p>
                                <p><strong>Đánh giá dịch vụ:</strong> {selectedRating.serviceRate}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={actionLoading}
                            >
                                Không
                            </button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(selectedRating._id)}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Xóa đánh giá'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ratings;
