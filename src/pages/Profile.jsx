import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './Profile.css';
import { 
  BsPerson, 
  BsTelephone, 
  BsGeoAlt, 
  BsStarFill, 
  BsPencil,
  BsCamera,
  BsCheckLg,
  BsX
} from 'react-icons/bs';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [userForm, setUserForm] = useState({});

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage);
      setUser(userData);
      fetchProfile(userData._id || userData.id);
    } else {
      setError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.');
      setLoading(false);
    }
  }, []);

  // Set userForm khi user thay đổi
  useEffect(() => {
    if (user) {
      setUserForm({
        fullname: user.fullname || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const fetchProfile = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/accounts/by-user/${userId}`);
      setProfile(response.data);
      console.log(response.data);
      setEditForm({
        description: response.data.description || '',
        country: response.data.country || '',
        phoneNumber: response.data.phoneNumber || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update account
      const formData = new FormData();
      formData.append('description', editForm.description);
      formData.append('country', editForm.country);
      formData.append('phoneNumber', editForm.phoneNumber);
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const accountId = profile._id;
      await axios.put(`http://localhost:5000/api/accounts/${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update user
      const userId = user._id || user.id;
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        fullname: userForm.fullname,
        email: user.email
      });

      // Update user trong localStorage và state
      const updatedUser = {
        ...user,
        fullname: userForm.fullname
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Trigger custom event để Header biết user đã thay đổi
      window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));

      // Refresh lại profile sau khi update
      await fetchProfile(userId);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      alert('Cập nhật profile thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định'));
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      description: profile?.description || '',
      country: profile?.country || '',
      phoneNumber: profile?.phoneNumber || ''
    });
    setUserForm({
      fullname: user?.fullname || '',
      email: user?.email || ''
    });
    setAvatarFile(null);
    setAvatarPreview(null);
  };



  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="profile-error">
          <div className="error-content">
            <h3>Không thể tải thông tin</h3>
            <p>{error}</p>
            <button onClick={fetchProfile} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="profile-not-found">
          <h3>Không tìm thấy profile</h3>
          <p>Profile này không tồn tại hoặc đã bị xóa.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="profile-page">
        <div className="container py-5">
          
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="avatar-container">
                <img 
                  src={avatarPreview || (profile.avatar ? `http://localhost:5000/${profile.avatar}` : 'https://i.pinimg.com/736x/f9/f7/b4/f9f7b48c9ba210a41fe50c837e079537.jpg')} 
                  alt="Avatar" 
                  className="profile-avatar"
                  onError={(e) => {
                    e.target.src = 'https://i.pinimg.com/736x/f9/f7/b4/f9f7b48c9ba210a41fe50c837e079537.jpg';
                  }}
                />
                {isEditing && (
                  <div className="avatar-upload">
                    <label htmlFor="avatar-input" className="upload-btn">
                      <BsCamera />
                    </label>
                    <input 
                      id="avatar-input"
                      type="file" 
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h1 className="profile-name">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullname"
                      value={userForm.fullname}
                      onChange={handleUserInputChange}
                      className="form-control name-input"
                      placeholder="Nhập tên"
                    />
                  ) : (
                    user?.fullname || 'Người dùng'
                  )}
                </h1>
                <div className="profile-country">
                  <BsGeoAlt className="country-icon" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={editForm.country}
                      onChange={handleInputChange}
                      className="form-control country-input"
                      placeholder="Nhập quốc gia"
                    />
                  ) : (
                    <span className="country-text">
                      {profile.country || 'Chưa cập nhật quốc gia'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-actions">
              {!isEditing ? (
                <button 
                  className="btn btn-primary edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <BsPencil className="me-2" />
                  Chỉnh sửa Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-success me-2"
                    onClick={handleSubmit}
                  >
                    <BsCheckLg className="me-2" />
                    Lưu thay đổi
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    <BsX className="me-2" />
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            <div className="row">
              <div className="col-lg-8">
                
                {/* About Section */}
                <div className="profile-section">
                  <h3 className="section-title">
                    <BsPerson className="me-2" />
                    Giới thiệu
                  </h3>
                  
                  {isEditing ? (
                    <div className="form-group">
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="4"
                        placeholder="Viết gì đó về bản thân..."
                      />
                    </div>
                  ) : (
                    <p className="profile-description">
                      {profile.description || 'Chưa có thông tin giới thiệu.'}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="profile-section">
                  <h3 className="section-title">Thông tin liên hệ</h3>
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <BsTelephone className="contact-icon" />
                      <div className="contact-details">
                        <span className="contact-label">Số điện thoại</span>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={editForm.phoneNumber}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Nhập số điện thoại"
                          />
                        ) : (
                          <span className="contact-value">
                            {profile.phoneNumber || 'Chưa cập nhật'}
                          </span>
                        )}
                      </div>
                    </div>


                  </div>
                </div>

              </div>

              <div className="col-lg-4">
                
                {/* Profile Stats */}
                <div className="profile-stats">
                  <h4 className="stats-title">Thống kê</h4>
                  
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">{profile.rating?.count || 0}</div>
                      <div className="stat-label">Đánh giá</div>
                    </div>
                    
                    <div className="stat-item">
                      <div className="stat-number">0</div>
                      <div className="stat-label">Tour đã đi</div>
                    </div>
                    
                    <div className="stat-item">
                      <div className="stat-number">0</div>
                      <div className="stat-label">Đánh giá hữu ích</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                  <h4 className="activity-title">Hoạt động gần đây</h4>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <BsStarFill />
                      </div>
                      <div className="activity-content">
                        <p>Chưa có hoạt động nào</p>
                        <small className="text-muted">Chưa có dữ liệu</small>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
