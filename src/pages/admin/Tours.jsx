import React, { useState, useEffect, useCallback } from 'react';
import './Tours.css';

const Tours = () => {
    const [tours, setTours] = useState([]);
    const [tourDetails, setTourDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddDetailModal, setShowAddDetailModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10); // Tours per page for admin
    
    // Filter states
    const [sortBy, setSortBy] = useState('newest');

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        price: '',
        duration: '',
        image: '',
        tags: []
    });
    const [tourDetailForm, setTourDetailForm] = useState({
        image: [],
        highlights: [],
        itinerary: [],
        schedules: [],
        notes: []
    });

    // Add schedule to tourDetailForm
    const handleAddSchedule = () => {
        setTourDetailForm(prev => {
            const newSchedule = {
                startDate: '',
                endDate: '',
                status: 'Còn chỗ'
            };
            
            // Nếu có duration, tự động tính toán endDate khi startDate được nhập
            if (formData.duration) {
                const duration = parseInt(formData.duration);
                if (!isNaN(duration) && duration > 0) {
                    // endDate sẽ được tính toán khi startDate được nhập
                    newSchedule.endDate = '';
                }
            }
            
            return {
                ...prev,
                schedules: [...prev.schedules, newSchedule]
            };
        });
    };

    // Remove schedule from tourDetailForm
    const handleRemoveSchedule = (index) => {
        setTourDetailForm(prev => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== index)
        }));
    };

    // Update schedule in tourDetailForm
    const handleScheduleChange = (index, field, value) => {
        setTourDetailForm(prev => ({
            ...prev,
            schedules: prev.schedules.map((schedule, i) => {
                if (i === index) {
                    const updatedSchedule = { ...schedule, [field]: value };
                    
                    // Tự động tính toán endDate khi startDate thay đổi
                    if (field === 'startDate' && value && formData.duration) {
                        const startDate = new Date(value);
                        const duration = parseInt(formData.duration);
                        if (!isNaN(duration) && duration > 0) {
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + duration);
                            updatedSchedule.endDate = endDate.toISOString().split('T')[0];
                        }
                    }
                    
                    return updatedSchedule;
                }
                return schedule;
            })
        }));
    };

    // Cập nhật tất cả endDate của schedules khi duration thay đổi
    const updateAllScheduleEndDates = () => {
        if (formData.duration && tourDetailForm.schedules.length > 0) {
            const duration = parseInt(formData.duration);
            if (!isNaN(duration) && duration > 0) {
                setTourDetailForm(prev => ({
                    ...prev,
                    schedules: prev.schedules.map(schedule => {
                        if (schedule.startDate) {
                            const startDate = new Date(schedule.startDate);
                            const endDate = new Date(startDate);
                            endDate.setDate(endDate.getDate() + duration);
                            return {
                                ...schedule,
                                endDate: endDate.toISOString().split('T')[0]
                            };
                        }
                        return schedule;
                    })
                }));
            }
        }
    };
    const [tempInputValues, setTempInputValues] = useState({
        image: '',
        highlights: '',
        itinerary: '',
        schedules: '',
        notes: '',
        tags: ''
    });
    const [submitError, setSubmitError] = useState('');

    // Fetch tours and their details
    const fetchToursWithDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            // Build query parameters
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: limit.toString(),
                sort: sortBy
            });

            // Fetch tours with pagination and filters
            const toursResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tours?${queryParams}`);
            if (!toursResponse.ok) {
                throw new Error('Không thể tải danh sách tour');
            }
            const toursResponseData = await toursResponse.json();
            const toursData = toursResponseData.data; // Extract tours from response
            
            // Update pagination state
            setTotalPages(toursResponseData.totalPages);
            
            console.log('Tours response:', toursResponseData);
            console.log('Tours data:', toursData);

            // Fetch tour details for each tour using Promise.all
            const toursWithDetails = await Promise.all(
                toursData.map(async (tour) => {
                    try {
                        const detailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details/${tour._id}`);
                        console.log("fetch for: " + tour._id);
                        if (detailResponse.ok) {
                            const detailData = await detailResponse.json();
                            return { tour, tourDetail: detailData };
                        } else {
                            return { tour, tourDetail: null };
                        }
                    } catch (error) {
                        console.error(`Error fetching tour detail for tour ${tour._id}:`, error);
                        return { tour, tourDetail: null };
                    }
                })
            );

            // Convert to the expected format
            const toursDataFinal = toursWithDetails.map(item => item.tour);
            const tourDetailsMap = {};
            toursWithDetails.forEach(item => {
                if (item.tourDetail) {
                    tourDetailsMap[item.tour._id] = item.tourDetail;
                }
            });

            setTours(toursDataFinal);
            setTourDetails(tourDetailsMap);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau!');
        } finally {
            setLoading(false);
        }
    }, [currentPage, sortBy, limit]);

    useEffect(() => {
        fetchToursWithDetails();
    }, [currentPage, sortBy, fetchToursWithDetails]);

    // Filter tours based on search term (client-side)
    const filteredTours = tours.filter(tour => 
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tour.tags && tour.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    // Handle pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle filter changes
    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setSortBy('newest');
        setCurrentPage(1);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Cập nhật tất cả endDate của schedules khi duration thay đổi
        if (name === 'duration') {
            setTimeout(() => {
                updateAllScheduleEndDates();
            }, 0);
        }
    };



    // Handle array inputs (tags, highlights, etc.)
    const handleArrayInputChange = (field, value) => {
        setTempInputValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Add new item to form array fields (tags)
    const handleAddFormArrayItem = (field) => {
        const currentValue = tempInputValues[field];
        if (currentValue.trim()) {
        setFormData(prev => ({
            ...prev,
                [field]: [...prev[field], currentValue.trim()]
            }));
            setTempInputValues(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Remove item from form array fields (tags)
    const handleRemoveFormArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleTourDetailArrayInputChange = (field, value) => {
        setTempInputValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Add new item to array fields
    const handleAddArrayItem = (field) => {
        const currentValue = tempInputValues[field];
        if (currentValue.trim()) {
        setTourDetailForm(prev => ({
            ...prev,
                [field]: [...prev[field], currentValue.trim()]
            }));
            setTempInputValues(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Remove item from array fields
    const handleRemoveArrayItem = (field, index) => {
        setTourDetailForm(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Add new tour
    const handleAddTour = async (e) => {
        e.preventDefault();
        setSubmitError('');

        try {
            // Create tour first
            const tourResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    tags: formData.tags
                })
            });

            if (!tourResponse.ok) {
                const errorData = await tourResponse.json();
                throw new Error(errorData.message || 'Không thể tạo tour');
            }

            const newTour = await tourResponse.json();

            // Create tour detail automatically
            const tourDetailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tour: newTour._id,
                    image: tourDetailForm.image,
                    highlights: tourDetailForm.highlights,
                    itinerary: tourDetailForm.itinerary,
                    schedules: tourDetailForm.schedules,
                    notes: tourDetailForm.notes
                })
            });

            if (!tourDetailResponse.ok) {
                const errorData = await tourDetailResponse.json();
                throw new Error(errorData.message || 'Không thể tạo chi tiết tour');
            }

            setShowAddModal(false);
            setFormData({
                title: '',
                location: '',
                description: '',
                price: '',
                duration: '',
                image: '',
                tags: []
            });
            setTourDetailForm({
                image: [],
                highlights: [],
                itinerary: [],
                schedules: [],
                notes: []
            });
            setTempInputValues({
                image: '',
                highlights: '',
                itinerary: '',
                schedules: '',
                notes: '',
                tags: ''
            });
            fetchToursWithDetails();
        } catch (error) {
            console.error('Error adding tour:', error);
            setSubmitError(error.message);
        }
    };

    // Add tour detail for existing tour
    const handleAddDetail = (tour) => {
        setSelectedTour(tour);
        setFormData({
            title: tour.title,
            location: tour.location,
            description: tour.description,
            price: tour.price.toString(),
            duration: tour.duration,
            image: tour.image,
            tags: tour.tags || []
        });
        setTourDetailForm({
            image: [],
            highlights: [],
            itinerary: [],
            schedules: [],
            notes: []
        });
        setTempInputValues({
            image: '',
            highlights: '',
            itinerary: '',
            schedules: '',
            notes: '',
            tags: ''
        });
        setShowAddDetailModal(true);
    };

    const handleAddTourDetail = async (e) => {
        e.preventDefault();
        setSubmitError('');

        try {
            const tourDetailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tour: selectedTour._id,
                    image: tourDetailForm.image,
                    highlights: tourDetailForm.highlights,
                    itinerary: tourDetailForm.itinerary,
                    schedules: tourDetailForm.schedules,
                    notes: tourDetailForm.notes
                })
            });

            if (!tourDetailResponse.ok) {
                const errorData = await tourDetailResponse.json();
                throw new Error(errorData.message || 'Không thể tạo chi tiết tour');
            }

            setShowAddDetailModal(false);
            setSelectedTour(null);
            setTourDetailForm({
                image: [],
                highlights: [],
                itinerary: [],
                schedules: [],
                notes: []
            });
            setTempInputValues({
                image: '',
                highlights: '',
                itinerary: '',
                schedules: '',
                notes: '',
                tags: ''
            });
            fetchToursWithDetails();
        } catch (error) {
            console.error('Error adding tour detail:', error);
            setSubmitError(error.message);
        }
    };

    // Edit tour
    const handleEdit = (tour) => {
        setSelectedTour(tour);
        setFormData({
            title: tour.title,
            location: tour.location,
            description: tour.description,
            price: tour.price.toString(),
            duration: tour.duration,
            image: tour.image,
            tags: tour.tags || []
        });
        setTourDetailForm({
            image: tourDetails[tour._id]?.image || [],
            highlights: tourDetails[tour._id]?.highlights || [],
            itinerary: tourDetails[tour._id]?.itinerary || [],
            schedules: tourDetails[tour._id]?.schedules || [],
            notes: tourDetails[tour._id]?.notes || []
        });
        setTempInputValues({
            image: '',
            highlights: '',
            itinerary: '',
            schedules: '',
            notes: '',
            tags: ''
        });
        setShowEditModal(true);
    };

    const handleUpdateTour = async (e) => {
        e.preventDefault();
        setSubmitError('');

        try {
            // Update tour
            const tourResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tours/${selectedTour._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    tags: formData.tags
                })
            });

            if (!tourResponse.ok) {
                const errorData = await tourResponse.json();
                throw new Error(errorData.message || 'Không thể cập nhật tour');
            }

            // Check if tour detail exists using existing state
            const tourDetailExists = tourDetails[selectedTour._id] && Object.keys(tourDetails[selectedTour._id]).length > 0;
            console.log('Tour detail exists:', tourDetailExists);
            console.log('Tour details state:', tourDetails[selectedTour._id]);
            
            // Get the tour detail ID if it exists
            const existingTourDetail = tourDetails[selectedTour._id];
            const tourDetailId = existingTourDetail?._id;
            console.log('Tour detail ID:', tourDetailId);
            
            // Try to update tour detail first (PUT method) if we have the tour detail ID
            let tourDetailResponse;
            if (tourDetailId) {
                tourDetailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details/${tourDetailId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tour: selectedTour._id,
                        image: tourDetailForm.image,
                        highlights: tourDetailForm.highlights,
                        itinerary: tourDetailForm.itinerary,
                        schedules: tourDetailForm.schedules,
                        notes: tourDetailForm.notes
                })
            });

                console.log('Tour detail response status (PUT):', tourDetailResponse.status);
                console.log('Tour detail response ok (PUT):', tourDetailResponse.ok);
            }

            // If PUT fails or no tour detail ID exists, try POST to create new
            if (!tourDetailId || !tourDetailResponse?.ok) {
                console.log('PUT failed or no tour detail ID, trying POST to create new tour detail');
                tourDetailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tour: selectedTour._id,
                        image: tourDetailForm.image,
                        highlights: tourDetailForm.highlights,
                        itinerary: tourDetailForm.itinerary,
                        schedules: tourDetailForm.schedules,
                        notes: tourDetailForm.notes
                    })
                });
                
                console.log('POST response status:', tourDetailResponse.status);
                console.log('POST response ok:', tourDetailResponse.ok);
            }

            if (!tourDetailResponse.ok) {
                const errorData = await tourDetailResponse.json();
                console.error('Tour detail error data:', errorData);
                throw new Error(errorData.message || 'Không thể cập nhật chi tiết tour');
            }

            setShowEditModal(false);
            setSelectedTour(null);
            setTempInputValues({
                image: '',
                highlights: '',
                itinerary: '',
                schedules: '',
                notes: '',
                tags: ''
            });
            fetchToursWithDetails();
        } catch (error) {
            console.error('Error updating tour:', error);
            setSubmitError(error.message);
        }
    };

    // Delete tour
    const handleDelete = (tour) => {
        setSelectedTour(tour);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            // Delete tour detail first (if exists)
            if (tourDetails[selectedTour._id]) {
                const tourDetailId = tourDetails[selectedTour._id]._id;
                if (tourDetailId) {
                    const tourDetailResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tour-details/${tourDetailId}`, {
                    method: 'DELETE'
                });
                    
                    if (!tourDetailResponse.ok) {
                        console.warn('Không thể xóa tour detail, tiếp tục xóa tour');
                    } else {
                        console.log('Đã xóa tour detail thành công');
                    }
                }
            }

            // Delete tour
            const tourResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tours/${selectedTour._id}`, {
                method: 'DELETE'
            });

            if (!tourResponse.ok) {
                const errorData = await tourResponse.json();
                throw new Error(errorData.message || 'Không thể xóa tour');
            }

            console.log('Đã xóa tour thành công');
            setShowDeleteModal(false);
            setSelectedTour(null);
            fetchToursWithDetails();
        } catch (error) {
            console.error('Error deleting tour:', error);
            setSubmitError(error.message);
        }
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="component-container">
                <div className="loading">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="component-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý tour</h2>
                <div className="header-actions">
                    <div className="search-container">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Tìm kiếm tour..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-btn" onClick={() => setShowAddModal(true)}>
                        <i className="fas fa-plus"></i>
                        Thêm tour mới
                    </button>
                </div>
            </div>

            {/* Sort Control */}
            <div className="sort-control">
                <div className="sort-group">
                    <label>Sắp xếp:</label>
                    <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                        <option value="newest">Mới nhất</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                        <option value="rating">Đánh giá cao nhất</option>
                    </select>
                </div>
                <button className="clear-filters-btn" onClick={clearFilters}>
                    <i className="fas fa-times"></i>
                    Xóa bộ lọc
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Ảnh</th>
                            <th>Tên tour</th>
                            <th>Địa điểm</th>
                            <th>Thời gian</th>
                            <th>Giá (VNĐ)</th>
                            <th>Đánh giá</th>
                            <th>Tags</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTours.map((tour) => (
                            <tr key={tour._id}>
                                <td>
                                    <div className="tour-image">
                                        <img 
                                            src={tour.image} 
                                            alt={tour.title}
                                            onError={(e) => {
                                                e.target.src = '/images/travel.png';
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="tour-info">
                                        <div className="tour-title">{tour.title}</div>
                                    </div>
                                </td>
                                <td className='text-dark'>{tour.location}</td>
                                <td className='text-dark'>{tour.duration}</td>
                                <td className='text-dark'>{formatPrice(tour.price)}</td>
                                <td>
                                    <div className="rating">
                                        <span className="rating-stars">
                                            {'★'.repeat(Math.floor(tour.rating))}
                                            {'☆'.repeat(5 - Math.floor(tour.rating))}
                                        </span>
                                        <span className="rating-number">({tour.rating})</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="tags">
                                        {tour.tags?.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className='text-dark'>{formatDate(tour.createdAt)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(tour)}
                                        >
                                            <i className="fas fa-edit"></i>
                                            Sửa
                                        </button>
                                        {!tourDetails[tour._id] && (
                                            <button 
                                                className="add-detail-btn"
                                                onClick={() => handleAddDetail(tour)}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm chi tiết
                                            </button>
                                        )}
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(tour)}
                                        >
                                            <i className="fas fa-trash"></i>
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Hiển thị {filteredTours.length} trong tổng số {tours.length} tour
                        {searchTerm && ` (đã lọc theo: "${searchTerm}")`}
                    </div>
                    <div className="pagination-controls">
                        <button 
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                            Trước
                        </button>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        
                        <button 
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Add Tour Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Thêm tour mới</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddTour} className="add-tour-form">
                            {submitError && <div className="submit-error">{submitError}</div>}
                            
                            <div className="form-section">
                                <h4>Thông tin cơ bản</h4>
                                <div className="form-group">
                                    <label>Tên tour *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa điểm *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        minLength={20}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Thời gian *</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="VD: 3"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ảnh đại diện (URL) *</label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tags</label>
                                    <div className="array-input-container">
                                    <input
                                        type="text"
                                            value={tempInputValues.tags}
                                        onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                                            placeholder="VD: beach"
                                        />
                                        <button 
                                            type="button" 
                                            className="add-item-btn"
                                            onClick={() => handleAddFormArrayItem('tags')}
                                        >
                                            <i className="fas fa-plus"></i>
                                            Thêm
                                        </button>
                                    </div>
                                    {formData.tags.length > 0 && (
                                        <div className="array-items">
                                            {formData.tags.map((tag, index) => (
                                                <div key={index} className="array-item">
                                                    <span>{tag}</span>
                                                    <button 
                                                        type="button" 
                                                        className="remove-item-btn"
                                                        onClick={() => handleRemoveFormArrayItem('tags', index)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Chi tiết tour</h4>
                                <div className="form-group">
                                    <label>Ảnh chi tiết</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <input
                                        type="text"
                                                value={tempInputValues.image}
                                        onChange={(e) => handleTourDetailArrayInputChange('image', e.target.value)}
                                                placeholder="VD: https://example.com/image1.jpg"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('image')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.image.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.image.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('image', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Điểm nổi bật</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.highlights}
                                        onChange={(e) => handleTourDetailArrayInputChange('highlights', e.target.value)}
                                                placeholder="VD: Khám phá vịnh Hạ Long"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('highlights')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.highlights.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.highlights.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('highlights', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.itinerary}
                                        onChange={(e) => handleTourDetailArrayInputChange('itinerary', e.target.value)}
                                                placeholder="VD: Ngày 1: Khởi hành từ Hà Nội"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('itinerary')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.itinerary.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.itinerary.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('itinerary', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.notes}
                                        onChange={(e) => handleTourDetailArrayInputChange('notes', e.target.value)}
                                                placeholder="VD: Mang theo kem chống nắng"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('notes')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.notes.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.notes.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('notes', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình khởi hành</label>
                                    <button 
                                        type="button" 
                                        className="add-schedule-btn"
                                        onClick={handleAddSchedule}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm lịch trình
                                    </button>
                                    {tourDetailForm.schedules.length > 0 && (
                                        <div className="schedules-container">
                                            {tourDetailForm.schedules.map((schedule, index) => (
                                                <div key={index} className="schedule-item">
                                                    <div className="schedule-header">
                                                        <h5>Lịch trình {index + 1}</h5>
                                                        <button 
                                                            type="button" 
                                                            className="remove-schedule-btn"
                                                            onClick={() => handleRemoveSchedule(index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                    <div className="schedule-fields">
                                                        <div className="form-row">
                                                            <div className="form-group">
                                                                <label>Ngày khởi hành *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.startDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'startDate', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Ngày kết thúc *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.endDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'endDate', e.target.value)}
                                                                    required
                                                                    readOnly
                                                                    title="Ngày kết thúc được tính toán tự động dựa trên ngày khởi hành và thời gian tour"
                                                                />
                                                                <small className="form-text text-muted">
                                                                    Tự động tính toán từ ngày khởi hành + thời gian tour
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Trạng thái</label>
                                                            <select
                                                                value={schedule.status}
                                                                onChange={(e) => handleScheduleChange(index, 'status', e.target.value)}
                                                            >
                                                                <option value="Còn chỗ">Còn chỗ</option>
                                                                <option value="Hết chỗ">Hết chỗ</option>
                                                                <option value="Sắp khởi hành">Sắp khởi hành</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-plus"></i>
                                    Thêm tour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Tour Modal */}
            {showEditModal && selectedTour && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Sửa tour: {selectedTour.title}</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateTour} className="edit-tour-form">
                            {submitError && <div className="submit-error">{submitError}</div>}
                            
                            <div className="form-section">
                                <h4>Thông tin cơ bản</h4>
                                <div className="form-group">
                                    <label>Tên tour *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Địa điểm *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        minLength={20}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Thời gian *</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ảnh đại diện (URL) *</label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Tags</label>
                                    <div className="array-input-container">
                                    <input
                                        type="text"
                                            value={tempInputValues.tags}
                                        onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                                            placeholder="VD: beach"
                                        />
                                        <button 
                                            type="button" 
                                            className="add-item-btn"
                                            onClick={() => handleAddFormArrayItem('tags')}
                                        >
                                            <i className="fas fa-plus"></i>
                                            Thêm
                                        </button>
                                    </div>
                                    {formData.tags.length > 0 && (
                                        <div className="array-items">
                                            {formData.tags.map((tag, index) => (
                                                <div key={index} className="array-item">
                                                    <span>{tag}</span>
                                                    <button 
                                                        type="button" 
                                                        className="remove-item-btn"
                                                        onClick={() => handleRemoveFormArrayItem('tags', index)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Chi tiết tour</h4>
                                <div className="form-group">
                                    <label>Ảnh chi tiết</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <input
                                        type="text"
                                                value={tempInputValues.image}
                                        onChange={(e) => handleTourDetailArrayInputChange('image', e.target.value)}
                                                placeholder="VD: https://example.com/image1.jpg"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('image')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.image.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.image.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('image', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Điểm nổi bật</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.highlights}
                                        onChange={(e) => handleTourDetailArrayInputChange('highlights', e.target.value)}
                                                placeholder="VD: Khám phá vịnh Hạ Long"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('highlights')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.highlights.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.highlights.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('highlights', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.itinerary}
                                        onChange={(e) => handleTourDetailArrayInputChange('itinerary', e.target.value)}
                                                placeholder="VD: Ngày 1: Khởi hành từ Hà Nội"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('itinerary')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.itinerary.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.itinerary.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('itinerary', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.notes}
                                        onChange={(e) => handleTourDetailArrayInputChange('notes', e.target.value)}
                                                placeholder="VD: Mang theo kem chống nắng"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('notes')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.notes.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.notes.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('notes', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình khởi hành</label>
                                    <button 
                                        type="button" 
                                        className="add-schedule-btn"
                                        onClick={handleAddSchedule}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm lịch trình
                                    </button>
                                    {tourDetailForm.schedules.length > 0 && (
                                        <div className="schedules-container">
                                            {tourDetailForm.schedules.map((schedule, index) => (
                                                <div key={index} className="schedule-item">
                                                    <div className="schedule-header">
                                                        <h5>Lịch trình {index + 1}</h5>
                                                        <button 
                                                            type="button" 
                                                            className="remove-schedule-btn"
                                                            onClick={() => handleRemoveSchedule(index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                    <div className="schedule-fields">
                                                        <div className="form-row">
                                                            <div className="form-group">
                                                                <label>Ngày khởi hành *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.startDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'startDate', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Ngày kết thúc *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.endDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'endDate', e.target.value)}
                                                                    required
                                                                    readOnly
                                                                    title="Ngày kết thúc được tính toán tự động dựa trên ngày khởi hành và thời gian tour"
                                                                />
                                                                <small className="form-text text-muted">
                                                                    Tự động tính toán từ ngày khởi hành + thời gian tour
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Trạng thái</label>
                                                            <select
                                                                value={schedule.status}
                                                                onChange={(e) => handleScheduleChange(index, 'status', e.target.value)}
                                                            >
                                                                <option value="Còn chỗ">Còn chỗ</option>
                                                                <option value="Hết chỗ">Hết chỗ</option>
                                                                <option value="Sắp khởi hành">Sắp khởi hành</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-save"></i>
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Tour Detail Modal */}
            {showAddDetailModal && selectedTour && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Thêm chi tiết cho tour: {selectedTour.title}</h3>
                            <button className="close-btn" onClick={() => setShowAddDetailModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddTourDetail} className="add-detail-form">
                            {submitError && <div className="submit-error">{submitError}</div>}
                            
                            <div className="form-section">
                                <h4>Chi tiết tour</h4>
                                <div className="form-group">
                                    <label>Ảnh chi tiết</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <input
                                        type="text"
                                                value={tempInputValues.image}
                                        onChange={(e) => handleTourDetailArrayInputChange('image', e.target.value)}
                                                placeholder="VD: https://example.com/image1.jpg"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('image')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.image.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.image.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('image', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Điểm nổi bật</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.highlights}
                                        onChange={(e) => handleTourDetailArrayInputChange('highlights', e.target.value)}
                                                placeholder="VD: Khám phá vịnh Hạ Long"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('highlights')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.highlights.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.highlights.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('highlights', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.itinerary}
                                        onChange={(e) => handleTourDetailArrayInputChange('itinerary', e.target.value)}
                                                placeholder="VD: Ngày 1: Khởi hành từ Hà Nội"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('itinerary')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.itinerary.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.itinerary.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('itinerary', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <div className="array-input-container">
                                        <div className="input-group">
                                    <textarea
                                                value={tempInputValues.notes}
                                        onChange={(e) => handleTourDetailArrayInputChange('notes', e.target.value)}
                                                placeholder="VD: Mang theo kem chống nắng"
                                            />
                                            <button 
                                                type="button" 
                                                className="add-item-btn"
                                                onClick={() => handleAddArrayItem('notes')}
                                            >
                                                <i className="fas fa-plus"></i>
                                                Thêm
                                            </button>
                                        </div>
                                        {tourDetailForm.notes.length > 0 && (
                                            <div className="array-items">
                                                {tourDetailForm.notes.map((item, index) => (
                                                    <div key={index} className="array-item">
                                                        <span>{item}</span>
                                                        <button 
                                                            type="button" 
                                                            className="remove-item-btn"
                                                            onClick={() => handleRemoveArrayItem('notes', index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Lịch trình khởi hành</label>
                                    <button 
                                        type="button" 
                                        className="add-schedule-btn"
                                        onClick={handleAddSchedule}
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm lịch trình
                                    </button>
                                    {tourDetailForm.schedules.length > 0 && (
                                        <div className="schedules-container">
                                            {tourDetailForm.schedules.map((schedule, index) => (
                                                <div key={index} className="schedule-item">
                                                    <div className="schedule-header">
                                                        <h5>Lịch trình {index + 1}</h5>
                                                        <button 
                                                            type="button" 
                                                            className="remove-schedule-btn"
                                                            onClick={() => handleRemoveSchedule(index)}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                    <div className="schedule-fields">
                                                        <div className="form-row">
                                                            <div className="form-group">
                                                                <label>Ngày khởi hành *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.startDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'startDate', e.target.value)}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label>Ngày kết thúc *</label>
                                                                <input
                                                                    type="date"
                                                                    value={schedule.endDate}
                                                                    onChange={(e) => handleScheduleChange(index, 'endDate', e.target.value)}
                                                                    required
                                                                    readOnly
                                                                    title="Ngày kết thúc được tính toán tự động dựa trên ngày khởi hành và thời gian tour"
                                                                />
                                                                <small className="form-text text-muted">
                                                                    Tự động tính toán từ ngày khởi hành + thời gian tour
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Trạng thái</label>
                                                            <select
                                                                value={schedule.status}
                                                                onChange={(e) => handleScheduleChange(index, 'status', e.target.value)}
                                                            >
                                                                <option value="Còn chỗ">Còn chỗ</option>
                                                                <option value="Hết chỗ">Hết chỗ</option>
                                                                <option value="Sắp khởi hành">Sắp khởi hành</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddDetailModal(false)}>
                                    Hủy
                                </button>
                                <button type="submit" className="submit-btn">
                                    <i className="fas fa-plus"></i>
                                    Thêm chi tiết
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedTour && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="delete-confirm-content">
                            <div className="delete-warning">
                                <i className="fas fa-exclamation-triangle"></i>
                                <h4>Xác nhận xóa tour</h4>
                            </div>
                            <p>Bạn có chắc chắn muốn xóa tour <strong>"{selectedTour.title}"</strong>?</p>
                            <p>Hành động này sẽ xóa:</p>
                            <ul>
                                <li>Thông tin tour cơ bản</li>
                                <li>Chi tiết tour (nếu có)</li>
                                <li>Tất cả đánh giá và bình luận</li>
                            </ul>
                            <p><strong>Hành động này không thể hoàn tác!</strong></p>
                            
                            {submitError && <div className="submit-error">{submitError}</div>}
                            
                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="delete-btn"
                                    onClick={handleConfirmDelete}
                                >
                                    <i className="fas fa-trash"></i>
                                    Xóa tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tours;
