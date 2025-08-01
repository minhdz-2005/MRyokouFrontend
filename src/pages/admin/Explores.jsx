import React, { useState, useEffect, useCallback } from 'react';
import './Explores.css';

const Explores = () => {
    const [explores, setExplores] = useState([]);
    const [filteredExplores, setFilteredExplores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedExplore, setSelectedExplore] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        region: 'north',
        fullDesc: [''],
        image: ['']
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Fetch explores data
    const fetchExplores = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/explore`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error('Không thể tải dữ liệu khám phá');
            }

            const data = await response.json();
            console.log('EXPLORES: ', data);
            setExplores(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching explores:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Filter explores based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredExplores(explores);
        } else {
            const filtered = explores.filter(explore => {
                const searchLower = searchTerm.toLowerCase();
                const name = explore.name || '';
                const location = explore.location || '';
                const region = explore.region || '';
                const description = explore.fullDesc?.join(' ') || '';
                
                return (
                    name.toLowerCase().includes(searchLower) ||
                    location.toLowerCase().includes(searchLower) ||
                    region.toLowerCase().includes(searchLower) ||
                    description.toLowerCase().includes(searchLower)
                );
            });
            setFilteredExplores(filtered);
        }
    }, [explores, searchTerm]);

    // Delete explore
    const handleDelete = (explore) => {
        setSelectedExplore(explore);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/explore/${selectedExplore._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể xóa khám phá');
            }

            setShowDeleteModal(false);
            setSelectedExplore(null);
            fetchExplores(); // Refresh data
        } catch (err) {
            setError(err.message);
            console.error('Error deleting explore:', err);
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

    // Format region
    const formatRegion = (region) => {
        const regionMap = {
            'north': 'Miền Bắc',
            'central': 'Miền Trung',
            'south': 'Miền Nam'
        };
        return regionMap[region] || region;
    };

    // Get region badge class
    const getRegionBadgeClass = (region) => {
        const badgeMap = {
            'north': 'region-north',
            'central': 'region-central',
            'south': 'region-south'
        };
        return badgeMap[region] || 'region-default';
    };

    // Format description
    const formatDescription = (fullDesc) => {
        if (!fullDesc || fullDesc.length === 0) return 'Chưa có mô tả';
        const combinedDesc = fullDesc.join(' ');
        return combinedDesc.length > 100 ? combinedDesc.substring(0, 100) + '...' : combinedDesc;
    };

    // Form handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleArrayInputChange = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleAddArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleRemoveArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Tên khám phá là bắt buộc';
        }
        
        if (!formData.location.trim()) {
            errors.location = 'Địa điểm là bắt buộc';
        }
        
        if (!formData.region) {
            errors.region = 'Miền là bắt buộc';
        }
        
        // Validate fullDesc - at least one non-empty description
        const validDescriptions = formData.fullDesc.filter(desc => desc.trim());
        if (validDescriptions.length === 0) {
            errors.fullDesc = 'Ít nhất một mô tả là bắt buộc';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSubmitting(true);
            
            // Filter out empty descriptions and images
            const submitData = {
                ...formData,
                fullDesc: formData.fullDesc.filter(desc => desc.trim()),
                image: formData.image.filter(img => img.trim())
            };
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/explore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });
            
            if (!response.ok) {
                throw new Error('Không thể tạo khám phá mới');
            }
            
            // Reset form and close modal
            setFormData({
                name: '',
                location: '',
                region: 'north',
                fullDesc: [''],
                image: ['']
            });
            setFormErrors({});
            setShowAddModal(false);
            
            // Refresh data
            fetchExplores();
            
        } catch (err) {
            setError(err.message);
            console.error('Error creating explore:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setSubmitting(true);
            
            // Filter out empty descriptions and images
            const submitData = {
                ...formData,
                fullDesc: formData.fullDesc.filter(desc => desc.trim()),
                image: formData.image.filter(img => img.trim())
            };
            
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/explore/${selectedExplore._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });
            
            if (!response.ok) {
                throw new Error('Không thể cập nhật khám phá');
            }
            
            // Reset form and close modal
            setFormData({
                name: '',
                location: '',
                region: 'north',
                fullDesc: [''],
                image: ['']
            });
            setFormErrors({});
            setShowEditModal(false);
            setSelectedExplore(null);
            
            // Refresh data
            fetchExplores();
            
        } catch (err) {
            setError(err.message);
            console.error('Error updating explore:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddExplore = () => {
        setShowAddModal(true);
        setFormErrors({});
    };

    const handleEditExplore = (explore) => {
        setSelectedExplore(explore);
        setFormData({
            name: explore.name || '',
            location: explore.location || '',
            region: explore.region || 'north',
            fullDesc: explore.fullDesc && explore.fullDesc.length > 0 ? explore.fullDesc : [''],
            image: explore.image && explore.image.length > 0 ? explore.image : ['']
        });
        setFormErrors({});
        setShowEditModal(true);
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setFormData({
            name: '',
            location: '',
            region: 'north',
            fullDesc: [''],
            image: ['']
        });
        setFormErrors({});
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedExplore(null);
        setFormData({
            name: '',
            location: '',
            region: 'north',
            fullDesc: [''],
            image: ['']
        });
        setFormErrors({});
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchExplores();
    }, [fetchExplores]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải dữ liệu khám phá...</p>
            </div>
        );
    }

    return (
        <div className="component-container">
            <div className="component-header">
                <div className="header-content">
                    <h2 className="component-title">Quản lý Khám phá</h2>
                    <div className="header-actions">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khám phá..."
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
                        <button className="add-btn" onClick={handleAddExplore}>
                            <i className="fas fa-plus"></i>
                            Thêm khám phá mới
                        </button>
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

                {filteredExplores.length === 0 ? (
                    <div className="empty-state">
                        <i className="fas fa-compass"></i>
                        <h3>
                            {searchTerm ? 'Không tìm thấy kết quả' : 'Không có khám phá nào'}
                        </h3>
                        <p>
                            {searchTerm 
                                ? `Không tìm thấy khám phá nào phù hợp với "${searchTerm}"`
                                : 'Chưa có khám phá nào được tạo.'
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
                            Hiển thị {filteredExplores.length} khám phá
                            {searchTerm && ` cho "${searchTerm}"`}
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên khám phá</th>
                                    <th>Địa điểm</th>
                                    <th>Miền</th>
                                    <th>Mô tả</th>
                                    <th>Hình ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExplores.map((explore) => (
                                    <tr key={explore._id}>
                                        <td>{explore._id}</td>
                                        <td>
                                            <div className="explore-name">
                                                <strong>{explore.name}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="explore-location">
                                                {explore.location}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`region-badge ${getRegionBadgeClass(explore.region)}`}>
                                                {formatRegion(explore.region)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="explore-description">
                                                {formatDescription(explore.fullDesc)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="explore-images">
                                                {explore.image && explore.image.length > 0 ? (
                                                    <div className="image-count">
                                                        <i className="fas fa-images"></i>
                                                        {explore.image.length} ảnh
                                                    </div>
                                                ) : (
                                                    <span className="no-images">Không có ảnh</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleEditExplore(explore)}
                                                    title="Sửa khám phá"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(explore)}
                                                    title="Xóa khám phá"
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

            {/* Add Explore Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-modal">
                        <div className="modal-header">
                            <h3>Thêm khám phá mới</h3>
                            <button
                                onClick={handleCloseAddModal}
                                className="close-btn"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="add-explore-form">
                            <div className="modal-body">
                                <div className="form-section">
                                    <h4>Thông tin cơ bản</h4>
                                    <div className="form-group">
                                        <label htmlFor="name">Tên khám phá *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={formErrors.name ? 'error' : ''}
                                            placeholder="Nhập tên khám phá"
                                        />
                                        {formErrors.name && (
                                            <span className="error-message">{formErrors.name}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="location">Địa điểm *</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={formErrors.location ? 'error' : ''}
                                            placeholder="Nhập địa điểm"
                                        />
                                        {formErrors.location && (
                                            <span className="error-message">{formErrors.location}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="region">Miền *</label>
                                        <select
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            className={formErrors.region ? 'error' : ''}
                                        >
                                            <option value="north">Miền Bắc</option>
                                            <option value="central">Miền Trung</option>
                                            <option value="south">Miền Nam</option>
                                        </select>
                                        {formErrors.region && (
                                            <span className="error-message">{formErrors.region}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Mô tả</h4>
                                    {formData.fullDesc.map((desc, index) => (
                                        <div key={index} className="form-group">
                                            <label>Mô tả {index + 1}</label>
                                            <div className="input-with-button">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => handleArrayInputChange('fullDesc', index, e.target.value)}
                                                    placeholder="Nhập mô tả"
                                                    rows="3"
                                                />
                                                {formData.fullDesc.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArrayItem('fullDesc', index)}
                                                        className="remove-btn"
                                                        title="Xóa mô tả"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddArrayItem('fullDesc')}
                                        className="add-array-btn"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm mô tả
                                    </button>
                                    {formErrors.fullDesc && (
                                        <span className="error-message">{formErrors.fullDesc}</span>
                                    )}
                                </div>
                                
                                <div className="form-section">
                                    <h4>Hình ảnh</h4>
                                    {formData.image.map((img, index) => (
                                        <div key={index} className="form-group">
                                            <label>URL ảnh {index + 1}</label>
                                            <div className="input-with-button">
                                                <input
                                                    type="url"
                                                    value={img}
                                                    onChange={(e) => handleArrayInputChange('image', index, e.target.value)}
                                                    placeholder="Nhập URL hình ảnh"
                                                />
                                                {formData.image.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArrayItem('image', index)}
                                                        className="remove-btn"
                                                        title="Xóa ảnh"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddArrayItem('image')}
                                        className="add-array-btn"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm ảnh
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={handleCloseAddModal}
                                    className="cancel-btn"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang tạo...' : 'Tạo khám phá'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Explore Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content add-modal">
                        <div className="modal-header">
                            <h3>Sửa khám phá</h3>
                            <button
                                onClick={handleCloseEditModal}
                                className="close-btn"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit} className="add-explore-form">
                            <div className="modal-body">
                                <div className="form-section">
                                    <h4>Thông tin cơ bản</h4>
                                    <div className="form-group">
                                        <label htmlFor="edit-name">Tên khám phá *</label>
                                        <input
                                            type="text"
                                            id="edit-name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={formErrors.name ? 'error' : ''}
                                            placeholder="Nhập tên khám phá"
                                        />
                                        {formErrors.name && (
                                            <span className="error-message">{formErrors.name}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="edit-location">Địa điểm *</label>
                                        <input
                                            type="text"
                                            id="edit-location"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className={formErrors.location ? 'error' : ''}
                                            placeholder="Nhập địa điểm"
                                        />
                                        {formErrors.location && (
                                            <span className="error-message">{formErrors.location}</span>
                                        )}
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="edit-region">Miền *</label>
                                        <select
                                            id="edit-region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleInputChange}
                                            className={formErrors.region ? 'error' : ''}
                                        >
                                            <option value="north">Miền Bắc</option>
                                            <option value="central">Miền Trung</option>
                                            <option value="south">Miền Nam</option>
                                        </select>
                                        {formErrors.region && (
                                            <span className="error-message">{formErrors.region}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Mô tả</h4>
                                    {formData.fullDesc.map((desc, index) => (
                                        <div key={index} className="form-group">
                                            <label>Mô tả {index + 1}</label>
                                            <div className="input-with-button">
                                                <textarea
                                                    value={desc}
                                                    onChange={(e) => handleArrayInputChange('fullDesc', index, e.target.value)}
                                                    placeholder="Nhập mô tả"
                                                    rows="3"
                                                />
                                                {formData.fullDesc.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArrayItem('fullDesc', index)}
                                                        className="remove-btn"
                                                        title="Xóa mô tả"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddArrayItem('fullDesc')}
                                        className="add-array-btn"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm mô tả
                                    </button>
                                    {formErrors.fullDesc && (
                                        <span className="error-message">{formErrors.fullDesc}</span>
                                    )}
                                </div>
                                
                                <div className="form-section">
                                    <h4>Hình ảnh</h4>
                                    {formData.image.map((img, index) => (
                                        <div key={index} className="form-group">
                                            <label>URL ảnh {index + 1}</label>
                                            <div className="input-with-button">
                                                <input
                                                    type="url"
                                                    value={img}
                                                    onChange={(e) => handleArrayInputChange('image', index, e.target.value)}
                                                    placeholder="Nhập URL hình ảnh"
                                                />
                                                {formData.image.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveArrayItem('image', index)}
                                                        className="remove-btn"
                                                        title="Xóa ảnh"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddArrayItem('image')}
                                        className="add-array-btn"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm ảnh
                                    </button>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    onClick={handleCloseEditModal}
                                    className="cancel-btn"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang cập nhật...' : 'Cập nhật khám phá'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                Bạn có chắc chắn muốn xóa khám phá này không? 
                                Hành động này không thể hoàn tác.
                            </p>
                            {selectedExplore && (
                                <div className="explore-preview">
                                    <div className="preview-name">
                                        <strong>Tên:</strong> {selectedExplore.name}
                                    </div>
                                    <div className="preview-location">
                                        <strong>Địa điểm:</strong> {selectedExplore.location}
                                    </div>
                                    <div className="preview-region">
                                        <strong>Miền:</strong> {formatRegion(selectedExplore.region)}
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

export default Explores;
