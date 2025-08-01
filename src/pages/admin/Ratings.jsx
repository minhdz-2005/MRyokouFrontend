import React, { useState, useEffect, useCallback } from 'react';
import './Ratings.css';

const Ratings = () => {
    const [ratings, setRatings] = useState([]);
    const [filteredRatings, setFilteredRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);

    // Fetch tour details
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
            
            return await response.json();
        } catch (err) {
            console.error('Error fetching tour details:', err);
            return null;
        }
    };

    // Fetch ratings data with tour details
    const fetchRatings = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ratings`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu đánh giá');
            }

            const ratingsData = await response.json();
            
            console.log('RATING: ' + ratingsData);
            
            // Fetch tour details for each rating
            const ratingsWithDetails = [];
            console.log('Fetching tour details for ratings:', ratingsData.length);
            
            for (const rating of ratingsData) {
                console.log('Fetching details for rating:', rating._id);
                
                let tourDetails = null;
                
                // Fetch tour details from booking
                if (rating.booking?.tour) {
                    console.log('Fetching tour details for tourId:', rating.booking.tour);
                    tourDetails = await fetchTourDetails(rating.booking.tour);
                    if (tourDetails) {
                        console.log('Tour data loaded:', tourDetails.title);
                    } else {
                        console.log('Failed to load tour data for tourId:', rating.booking.tour);
                    }
                }
                
                ratingsWithDetails.push({
                    ...rating,
                    tourDetails
                });
            }
            
            console.log('All ratings with details loaded:', ratingsWithDetails.length);
            setRatings(ratingsWithDetails);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching ratings:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter ratings based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRatings(ratings);
        } else {
            const filtered = ratings.filter(rating => {
                const searchLower = searchTerm.toLowerCase();
                const userFullname = rating.user?.fullname || '';
                const userEmail = rating.user?.email || '';
                const tourTitle = rating.tourDetails?.title || '';
                const tourLocation = rating.tourDetails?.location || '';
                const tourRate = rating.tourRate || '';
                const serviceRate = rating.serviceRate || '';
                
                return (
                    userFullname.toLowerCase().includes(searchLower) ||
                    userEmail.toLowerCase().includes(searchLower) ||
                    tourTitle.toLowerCase().includes(searchLower) ||
                    tourLocation.toLowerCase().includes(searchLower) ||
                    tourRate.toLowerCase().includes(searchLower) ||
                    serviceRate.toLowerCase().includes(searchLower) ||
                    rating.star.toString().includes(searchLower)
                );
            });
            setFilteredRatings(filtered);
        }
    }, [ratings, searchTerm]);

    // Delete rating
    const handleDelete = (rating) => {
        setSelectedRating(rating);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/${selectedRating._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể xóa đánh giá');
            }

            setShowDeleteModal(false);
            setSelectedRating(null);
            fetchRatings(); // Refresh data
        } catch (err) {
            setError(err.message);
            console.error('Error deleting rating:', err);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render star rating
    const renderStars = (stars) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= stars ? 'filled' : 'empty'}`}
                    >
                        ★
                    </span>
                ))}
                <span className="star-count">({stars})</span>
            </div>
        );
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchRatings();
    }, [fetchRatings]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu đánh giá...</p>
            </div>
        );
    }

    return (
        <div className="component-container">
            <div className="component-header">
                <div className="header-content">
                    <h2 className="component-title">Quản lý Đánh giá</h2>
                    <div className="header-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Tìm kiếm đánh giá..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                            <i className="fas fa-search search-icon"></i>
                            {searchTerm && (
                                <button 
                                    onClick={clearSearch}
                                    className="clear-search-btn"
                                    title="Xóa tìm kiếm"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-body">
                {error && (
                    <div className="error">
                        <i className="fas fa-exclamation-triangle"></i>
                        {error}
                    </div>
                )}

                {filteredRatings.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-star"></i>
                        <h3>
                            {searchTerm ? 'Không tìm thấy kết quả' : 'Không có đánh giá nào'}
                        </h3>
                        <p>
                            {searchTerm 
                                ? `Không tìm thấy đánh giá nào phù hợp với "${searchTerm}"`
                                : 'Chưa có đánh giá nào được tạo.'
                            }
                        </p>
                        {searchTerm && (
                            <button onClick={clearSearch} className="clear-search-link">
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="table-container">
                        <div className="results-info">
                            Hiển thị {filteredRatings.length} đánh giá
                            {searchTerm && ` cho "${searchTerm}"`}
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Tour</th>
                                    <th>Đánh giá sao</th>
                                    <th>Đánh giá tour</th>
                                    <th>Đánh giá dịch vụ</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRatings.map((rating) => (
                                    <tr key={rating._id}>
                                        <td>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    <div className="avatar-fallback">
                                                        {rating.user?.fullname?.charAt(0) || 'U'}
                                                    </div>
                                                </div>
                                                <div className="user-details">
                                                    <div className="user-name">
                                                        {rating.user?.fullname || 'Khách'}
                                                    </div>
                                                    <div className="user-email">
                                                        {rating.user?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="tour-info">
                                                <div className="tour-name">
                                                    {rating.tourDetails?.title || 'Tour không xác định'}
                                                </div>
                                                <div className="tour-location">
                                                    {rating.tourDetails?.location || 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {renderStars(rating.star)}
                                        </td>
                                        <td>
                                            <span className="rate-badge tour-rate">
                                                {rating.tourRate}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="rate-badge service-rate">
                                                {rating.serviceRate}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                <div className="created-date">
                                                    {formatDate(rating.createdAt)}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleDelete(rating)}
                                                    className="delete-btn"
                                                    title="Xóa đánh giá"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header">
                            <h3>Xác nhận xóa</h3>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="close-btn"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                Bạn có chắc chắn muốn xóa đánh giá này không? 
                                Hành động này không thể hoàn tác.
                            </p>
                            {selectedRating && (
                                <div className="rating-preview">
                                    <div className="preview-user">
                                        <strong>Người dùng:</strong> {selectedRating.user?.fullname || 'Khách'}
                                    </div>
                                    <div className="preview-tour">
                                        <strong>Tour:</strong> {selectedRating.tourDetails?.title || 'Tour không xác định'}
                                    </div>
                                    <div className="preview-rating">
                                        <strong>Đánh giá:</strong> {renderStars(selectedRating.star)}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="cancel-btn"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="delete-confirm-btn"
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ratings;
