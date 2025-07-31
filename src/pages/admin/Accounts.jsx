import React, { useState, useEffect } from 'react';
import './Accounts.css';

const Accounts = () => {
    const [usersWithAccounts, setUsersWithAccounts] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [formErrors, setFormErrors] = useState({});
    const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
    const [newAccount, setNewAccount] = useState({
        userID: '',
        avatar: '',
        description: '',
        country: 'Việt Nam',
        phoneNumber: ''
    });
    const [accountFormErrors, setAccountFormErrors] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editUserData, setEditUserData] = useState({
        fullname: '',
        email: '',
        role: 'user'
    });
    const [editAccountData, setEditAccountData] = useState({
        avatar: '',
        description: '',
        country: '',
        phoneNumber: ''
    });
    const [editFormErrors, setEditFormErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);



    useEffect(() => {
        const fetchUsersWithAccounts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Lấy danh sách users
                const usersResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users`);
                
                if (!usersResponse.ok) {
                    throw new Error(`Lỗi khi tải danh sách người dùng: ${usersResponse.status}`);
                }
                
                const users = await usersResponse.json();
                
                // Lấy thông tin account cho từng user
                const usersWithAccounts = await Promise.all(
                    users.map(async (user) => {
                        try {
                            const accountResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/by-user/${user._id}`);
                            
                            if (accountResponse.ok) {
                                const account = await accountResponse.json();
                                return {
                                    ...user,
                                    account: account
                                };
                            } else {
                                // User chưa có account
                                return {
                                    ...user,
                                    account: null
                                };
                            }
                        } catch (error) {
                            console.error(`Error fetching account for user ${user._id}:`, error);
                            return {
                                ...user,
                                account: null
                            };
                        }
                    })
                );
                
                setUsersWithAccounts(usersWithAccounts);
                setFilteredUsers(usersWithAccounts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(`Không thể tải dữ liệu: ${error.message}`);
                setLoading(false);
            }
        };

        fetchUsersWithAccounts();
    }, []);

    // Filter users based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(usersWithAccounts);
        } else {
            const filtered = usersWithAccounts.filter(user => 
                user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, usersWithAccounts]);

    const handleEdit = (userId) => {
        const user = usersWithAccounts.find(u => u._id === userId);
        if (user) {
            setEditingUser(user);
            setEditUserData({
                fullname: user.fullname,
                email: user.email,
                role: user.role
            });
            setEditAccountData({
                avatar: user.account?.avatar || '',
                description: user.account?.description || '',
                country: user.account?.country || '',
                phoneNumber: user.account?.phoneNumber || ''
            });
            setEditFormErrors({});
            setShowEditForm(true);
        }
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
        setEditingUser(null);
        setEditUserData({
            fullname: '',
            email: '',
            role: 'user'
        });
        setEditAccountData({
            avatar: '',
            description: '',
            country: '',
            phoneNumber: ''
        });
        setEditFormErrors({});
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('user_')) {
            const fieldName = name.replace('user_', '');
            setEditUserData(prev => ({
                ...prev,
                [fieldName]: value
            }));
        } else if (name.startsWith('account_')) {
            const fieldName = name.replace('account_', '');
            setEditAccountData(prev => ({
                ...prev,
                [fieldName]: value
            }));
        }
        // Clear error when user starts typing
        if (editFormErrors[name]) {
            setEditFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateEditForm = () => {
        const errors = {};
        
        if (!editUserData.fullname.trim()) {
            errors.user_fullname = 'Tên không được để trống';
        }
        
        if (!editUserData.email.trim()) {
            errors.user_email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(editUserData.email)) {
            errors.user_email = 'Email không hợp lệ';
        }
        
        if (editingUser?.account) {
            if (!editAccountData.description.trim()) {
                errors.account_description = 'Mô tả không được để trống';
            }
            
            if (!editAccountData.country.trim()) {
                errors.account_country = 'Quốc gia không được để trống';
            }
            
            if (!editAccountData.phoneNumber.trim()) {
                errors.account_phoneNumber = 'Số điện thoại không được để trống';
            } else if (!/^[0-9+\-\s()]+$/.test(editAccountData.phoneNumber)) {
                errors.account_phoneNumber = 'Số điện thoại không hợp lệ';
            }
        }
        
        return errors;
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        
        const errors = validateEditForm();
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }
        
        try {
            // Update user data
            const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUserData)
            });
            
            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                setEditFormErrors({ submit: errorData.message || 'Có lỗi xảy ra khi cập nhật người dùng' });
                return;
            }
            
            // Update account data if user has account
            if (editingUser.account) {
                const accountResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/${editingUser.account._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editAccountData)
                });
                
                if (!accountResponse.ok) {
                    const errorData = await accountResponse.json();
                    setEditFormErrors({ submit: errorData.message || 'Có lỗi xảy ra khi cập nhật tài khoản' });
                    return;
                }
            }
            
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error('Error updating user/account:', error);
            setEditFormErrors({ submit: 'Không thể kết nối đến server' });
        }
    };

    const handleDelete = (userId) => {
        const user = usersWithAccounts.find(u => u._id === userId);
        if (user) {
            setDeletingUser(user);
            setShowDeleteConfirm(true);
        }
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setDeletingUser(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingUser) return;

        try {
            // Nếu user có account và không phải admin, xóa account trước
            if (deletingUser.account && deletingUser.role !== 'admin') {
                const accountResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/${deletingUser.account._id}`, {
                    method: 'DELETE'
                });
                
                if (!accountResponse.ok) {
                    console.error('Error deleting account:', accountResponse.status);
                }
            }

            // Xóa user
            const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${deletingUser._id}`, {
                method: 'DELETE'
            });
            
            if (userResponse.ok) {
                // Refresh data
                window.location.reload();
            } else {
                console.error('Error deleting user:', userResponse.status);
                alert('Có lỗi xảy ra khi xóa người dùng');
            }
        } catch (error) {
            console.error('Error deleting user/account:', error);
            alert('Không thể kết nối đến server');
        } finally {
            handleCloseDeleteConfirm();
        }
    };

    const handleAddUser = () => {
        setShowAddForm(true);
    };

    const handleCloseForm = () => {
        setShowAddForm(false);
        setNewUser({
            fullname: '',
            email: '',
            password: '',
            role: 'user'
        });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({
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

    const validateForm = () => {
        const errors = {};
        
        if (!newUser.fullname.trim()) {
            errors.fullname = 'Tên không được để trống';
        }
        
        if (!newUser.email.trim()) {
            errors.email = 'Email không được để trống';
        } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            errors.email = 'Email không hợp lệ';
        }
        
        if (!newUser.password.trim()) {
            errors.password = 'Mật khẩu không được để trống';
        } else if (newUser.password.length < 6) {
            errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        
        return errors;
    };

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });
            
            if (response.ok) {
                // Refresh data
                window.location.reload();
            } else {
                const errorData = await response.json();
                setFormErrors({ submit: errorData.message || 'Có lỗi xảy ra khi tạo người dùng' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setFormErrors({ submit: 'Không thể kết nối đến server' });
        }
    };

    const handleCreateAccount = (userId) => {
        setNewAccount({
            userID: userId,
            avatar: '',
            description: '',
            country: 'Việt Nam',
            phoneNumber: ''
        });
        setAccountFormErrors({});
        setShowCreateAccountForm(true);
    };

    const handleCloseAccountForm = () => {
        setShowCreateAccountForm(false);
        setNewAccount({
            userID: '',
            avatar: '',
            description: '',
            country: 'Việt Nam',
            phoneNumber: ''
        });
        setAccountFormErrors({});
    };

    const handleAccountInputChange = (e) => {
        const { name, value } = e.target;
        setNewAccount(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (accountFormErrors[name]) {
            setAccountFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateAccountForm = () => {
        const errors = {};
        
        // Chỉ validate phoneNumber nếu có nhập
        if (newAccount.phoneNumber.trim() && !/^[0-9+\-\s()]+$/.test(newAccount.phoneNumber)) {
            errors.phoneNumber = 'Số điện thoại không hợp lệ';
        }
        
        return errors;
    };

    const handleSubmitAccount = async (e) => {
        e.preventDefault();
        
        const errors = validateAccountForm();
        if (Object.keys(errors).length > 0) {
            setAccountFormErrors(errors);
            return;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAccount)
            });
            
            if (response.ok) {
                // Refresh data
                window.location.reload();
            } else {
                const errorData = await response.json();
                setAccountFormErrors({ submit: errorData.message || 'Có lỗi xảy ra khi tạo tài khoản' });
            }
        } catch (error) {
            console.error('Error creating account:', error);
            setAccountFormErrors({ submit: 'Không thể kết nối đến server' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getRoleText = (role) => {
        return role === 'admin' ? 'Quản trị viên' : 'Người dùng';
    };

    if (loading) {
        return (
            <div className="accounts-container">
                <div className="accounts-loading">Đang tải dữ liệu...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="accounts-container">
                <div className="accounts-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="accounts-container">
            {showAddForm && (
                <div className="accounts-modal">
                    <div className="accounts-modal-content">
                        <div className="accounts-modal-header">
                            <h3 className="accounts-modal-title">Thêm người dùng mới</h3>
                            <button className="accounts-modal-close" onClick={handleCloseForm}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitUser} className="accounts-modal-body">
                            <div className="accounts-form-group">
                                <label htmlFor="fullname">Họ và tên *</label>
                                <input
                                    type="text"
                                    id="fullname"
                                    name="fullname"
                                    value={newUser.fullname}
                                    onChange={handleInputChange}
                                    className={formErrors.fullname ? 'error' : ''}
                                    placeholder="Nhập họ và tên"
                                />
                                {formErrors.fullname && <span className="accounts-form-error">{formErrors.fullname}</span>}
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleInputChange}
                                    className={formErrors.email ? 'error' : ''}
                                    placeholder="Nhập email"
                                />
                                {formErrors.email && <span className="accounts-form-error">{formErrors.email}</span>}
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="password">Mật khẩu *</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleInputChange}
                                    className={formErrors.password ? 'error' : ''}
                                    placeholder="Nhập mật khẩu"
                                />
                                {formErrors.password && <span className="accounts-form-error">{formErrors.password}</span>}
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="role">Vai trò</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={newUser.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="user">Người dùng</option>
                                    <option value="admin">Quản trị viên</option>
                                </select>
                            </div>
                            
                            {formErrors.submit && (
                                <div className="accounts-form-error">{formErrors.submit}</div>
                            )}
                            
                            <div className="accounts-form-actions">
                                <button type="button" className="accounts-form-btn secondary" onClick={handleCloseForm}>
                                    Hủy
                                </button>
                                <button type="submit" className="accounts-form-btn primary">
                                    <i className="fas fa-plus"></i>
                                    Tạo người dùng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCreateAccountForm && (
                <div className="accounts-modal">
                    <div className="accounts-modal-content">
                        <div className="accounts-modal-header">
                            <h3 className="accounts-modal-title">Tạo tài khoản cho người dùng</h3>
                            <button className="accounts-modal-close" onClick={handleCloseAccountForm}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitAccount} className="accounts-modal-body">
                            <div className="accounts-form-group">
                                <label htmlFor="avatar">Avatar URL (tùy chọn)</label>
                                <input
                                    type="url"
                                    id="avatar"
                                    name="avatar"
                                    value={newAccount.avatar}
                                    onChange={handleAccountInputChange}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="description">Mô tả *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newAccount.description}
                                    onChange={handleAccountInputChange}
                                    className={accountFormErrors.description ? 'error' : ''}
                                    placeholder="Nhập mô tả về người dùng"
                                    rows="3"
                                />
                                {accountFormErrors.description && <span className="accounts-form-error">{accountFormErrors.description}</span>}
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="country">Quốc gia *</label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={newAccount.country}
                                    onChange={handleAccountInputChange}
                                    className={accountFormErrors.country ? 'error' : ''}
                                    placeholder="Nhập quốc gia"
                                />
                                {accountFormErrors.country && <span className="accounts-form-error">{accountFormErrors.country}</span>}
                            </div>
                            
                            <div className="accounts-form-group">
                                <label htmlFor="phoneNumber">Số điện thoại *</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={newAccount.phoneNumber}
                                    onChange={handleAccountInputChange}
                                    className={accountFormErrors.phoneNumber ? 'error' : ''}
                                    placeholder="Nhập số điện thoại"
                                />
                                {accountFormErrors.phoneNumber && <span className="accounts-form-error">{accountFormErrors.phoneNumber}</span>}
                            </div>
                            
                            {accountFormErrors.submit && (
                                <div className="accounts-form-error">{accountFormErrors.submit}</div>
                            )}
                            
                            <div className="accounts-form-actions">
                                <button type="button" className="accounts-form-btn secondary" onClick={handleCloseAccountForm}>
                                    Hủy
                                </button>
                                <button type="submit" className="accounts-form-btn primary">
                                    <i className="fas fa-plus"></i>
                                    Tạo tài khoản
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditForm && editingUser && (
                <div className="accounts-modal">
                    <div className="accounts-modal-content">
                        <div className="accounts-modal-header">
                            <h3 className="accounts-modal-title">Chỉnh sửa người dùng & Tài khoản</h3>
                            <button className="accounts-modal-close" onClick={handleCloseEditForm}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitEdit} className="accounts-modal-body">
                            <div className="accounts-form-section">
                                <h4>Thông tin người dùng</h4>
                                <div className="accounts-form-group">
                                    <label htmlFor="user_fullname">Họ và tên *</label>
                                    <input
                                        type="text"
                                        id="user_fullname"
                                        name="user_fullname"
                                        value={editUserData.fullname}
                                        onChange={handleEditInputChange}
                                        className={editFormErrors.user_fullname ? 'error' : ''}
                                        placeholder="Nhập họ và tên"
                                    />
                                    {editFormErrors.user_fullname && <span className="accounts-form-error">{editFormErrors.user_fullname}</span>}
                                </div>
                                
                                <div className="accounts-form-group">
                                    <label htmlFor="user_email">Email *</label>
                                    <input
                                        type="email"
                                        id="user_email"
                                        name="user_email"
                                        value={editUserData.email}
                                        onChange={handleEditInputChange}
                                        className={editFormErrors.user_email ? 'error' : ''}
                                        placeholder="Nhập email"
                                    />
                                    {editFormErrors.user_email && <span className="accounts-form-error">{editFormErrors.user_email}</span>}
                                </div>
                                
                                <div className="accounts-form-group">
                                    <label htmlFor="user_role">Vai trò</label>
                                    <select
                                        id="user_role"
                                        name="user_role"
                                        value={editUserData.role}
                                        onChange={handleEditInputChange}
                                    >
                                        <option value="user">Người dùng</option>
                                        <option value="admin">Quản trị viên</option>
                                    </select>
                                </div>
                            </div>

                            {editingUser.account && (
                                <div className="accounts-form-section">
                                    <h4>Thông tin tài khoản</h4>
                                    
                                    <div className="accounts-form-group">
                                        <label htmlFor="account_description">Mô tả *</label>
                                        <textarea
                                            id="account_description"
                                            name="account_description"
                                            value={editAccountData.description}
                                            onChange={handleEditInputChange}
                                            className={editFormErrors.account_description ? 'error' : ''}
                                            placeholder="Nhập mô tả về người dùng"
                                            rows="3"
                                        />
                                        {editFormErrors.account_description && <span className="accounts-form-error">{editFormErrors.account_description}</span>}
                                    </div>
                                    
                                    <div className="accounts-form-group">
                                        <label htmlFor="account_country">Quốc gia *</label>
                                        <input
                                            type="text"
                                            id="account_country"
                                            name="account_country"
                                            value={editAccountData.country}
                                            onChange={handleEditInputChange}
                                            className={editFormErrors.account_country ? 'error' : ''}
                                            placeholder="Nhập quốc gia"
                                        />
                                        {editFormErrors.account_country && <span className="accounts-form-error">{editFormErrors.account_country}</span>}
                                    </div>
                                    
                                    <div className="accounts-form-group">
                                        <label htmlFor="account_phoneNumber">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            id="account_phoneNumber"
                                            name="account_phoneNumber"
                                            value={editAccountData.phoneNumber}
                                            onChange={handleEditInputChange}
                                            className={editFormErrors.account_phoneNumber ? 'error' : ''}
                                            placeholder="Nhập số điện thoại"
                                        />
                                        {editFormErrors.account_phoneNumber && <span className="accounts-form-error">{editFormErrors.account_phoneNumber}</span>}
                                    </div>
                                </div>
                            )}
                            
                            {editFormErrors.submit && (
                                <div className="accounts-form-error">{editFormErrors.submit}</div>
                            )}
                            
                            <div className="accounts-form-actions">
                                <button type="button" className="accounts-form-btn secondary" onClick={handleCloseEditForm}>
                                    Hủy
                                </button>
                                <button type="submit" className="accounts-form-btn primary">
                                    <i className="fas fa-save"></i>
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteConfirm && deletingUser && (
                <div className="accounts-modal">
                    <div className="accounts-modal-content">
                        <div className="accounts-modal-header">
                            <h3 className="accounts-modal-title">Xác nhận xóa người dùng</h3>
                            <button className="accounts-modal-close" onClick={handleCloseDeleteConfirm}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="accounts-delete-confirm-content">
                            <div className="accounts-delete-warning">
                                <i className="fas fa-exclamation-triangle"></i>
                                <h4>Cảnh báo!</h4>
                            </div>
                            
                            <div className="accounts-delete-user-info">
                                <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                                <div className="accounts-user-details-delete">
                                    <div className="accounts-user-avatar-small">
                                        {deletingUser.account?.avatar ? (
                                            <img 
                                                src={`${import.meta.env.VITE_API_BASE_URL}/${deletingUser.account.avatar}`} 
                                                alt={deletingUser.fullname}
                                                className="accounts-avatar-img-small"
                                            />
                                        ) : (
                                            <div className="accounts-avatar-placeholder-small">
                                                <i className="fas fa-user"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="accounts-user-info-delete">
                                        <div className="accounts-user-name-delete">{deletingUser.fullname}</div>
                                        <div className="accounts-user-email-delete">{deletingUser.email}</div>
                                        <div className="accounts-user-role-delete">
                                            <span className={`accounts-user-role ${
                                                deletingUser.role === 'admin' ? 'admin' : 'user'
                                            }`}>
                                                {getRoleText(deletingUser.role)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {deletingUser.account && deletingUser.role !== 'admin' && (
                                <div className="accounts-delete-account-warning">
                                    <p><i className="fas fa-info-circle"></i> Tài khoản liên kết cũng sẽ bị xóa!</p>
                                    <div className="accounts-account-details-delete">
                                        <span><strong>Mô tả:</strong> {deletingUser.account.description}</span>
                                        <span><strong>Quốc gia:</strong> {deletingUser.account.country}</span>
                                        <span><strong>SĐT:</strong> {deletingUser.account.phoneNumber}</span>
                                    </div>
                                </div>
                            )}

                            <div className="accounts-delete-actions">
                                <button 
                                    type="button" 
                                    className="accounts-form-btn secondary" 
                                    onClick={handleCloseDeleteConfirm}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="accounts-delete-confirm-btn"
                                    onClick={handleConfirmDelete}
                                >
                                    <i className="fas fa-trash"></i>
                                    Xác nhận xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="accounts-header">
                <h2 className="accounts-title">Quản lý người dùng & Tài khoản</h2>
                <div className="accounts-actions">
                    <div className="accounts-search">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search"></i>
                    </div>
                    <button className="accounts-create-btn" onClick={handleAddUser}>
                        <i className="fas fa-plus"></i>
                        Thêm người dùng
                    </button>
                </div>
            </div>

            <div className="accounts-table">
                <div className="accounts-table-header">
                    <div>Avatar</div>
                    <div>Thông tin người dùng</div>
                    <div>Thông tin tài khoản</div>
                    <div>Vai trò</div>
                    <div>Ngày tạo</div>
                    <div>Thao tác</div>
                </div>
                                <div className="accounts-table-body">
                    {filteredUsers.map((user) => (
                        <div key={user._id} className="accounts-table-row">
                            <div>
                                <div className="accounts-user-info">
                                    {user.account?.avatar ? (
                                        <img 
                                            src={`${import.meta.env.VITE_API_BASE_URL}/${user.account.avatar}`} 
                                            alt={user.fullname}
                                            className="accounts-user-avatar"
                                        />
                                    ) : (
                                        <div className="accounts-avatar-placeholder">
                                            <i className="fas fa-user"></i>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="accounts-user-details">
                                    <div className="accounts-user-name">{user.fullname}</div>
                                    <div className="accounts-user-email">{user.email}</div>
                                </div>
                            </div>
                            <div>
                                {user.account ? (
                                    <div className="accounts-account-info">
                                        <div className="accounts-account-status">
                                            <strong>Mô tả:</strong> {user.account.description}
                                        </div>
                                        <div className="accounts-account-details">
                                            <span><strong>Quốc gia:</strong> {user.account.country}</span>
                                            <span><strong>SĐT:</strong> {user.account.phoneNumber}</span>
                                        </div>
                                    </div>
                                ) : user.role === 'admin' ? (
                                    <div className="accounts-account-info">
                                        <span className="accounts-user-role admin">Quản trị viên</span>
                                    </div>
                                ) : (
                                    <div className="accounts-account-info">
                                        <div className="accounts-account-status">Chưa có tài khoản</div>
                                        <button 
                                            className="accounts-create-account-btn"
                                            onClick={() => handleCreateAccount(user._id)}
                                        >
                                            <i className="fas fa-plus"></i>
                                            Tạo tài khoản
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className={`accounts-user-role ${
                                    user.role === 'admin' ? 'admin' : 'user'
                                }`}>
                                    {getRoleText(user.role)}
                                </span>
                            </div>
                            <div className="accounts-created-date">{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</div>
                            <div>
                                <div className="accounts-actions-cell">
                                    <button 
                                        className="accounts-action-btn accounts-edit-btn"
                                        onClick={() => handleEdit(user._id)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                        className="accounts-action-btn accounts-delete-btn"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Accounts;
