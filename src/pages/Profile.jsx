import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [user, setUser] = useState(null);
  const [userForm, setUserForm] = useState({});
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage);
      setUser(userData);
      fetchProfile(userData._id || userData.id);
      fetchUserRatings(userData._id || userData.id);
      fetchUserBookings(userData._id || userData.id);
    } else {
      setError(t('profile.error.loginRequired'));
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
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/by-user/${userId}`);
      setProfile(response.data);
      console.log(response.data);
      setEditForm({
        description: response.data.description || '',
        country: response.data.country || '',
        phoneNumber: response.data.phoneNumber || ''
      });
    } catch (err) {
      setError(err.response?.data?.message || t('profile.error.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async (userId) => {
    try {
      setRatingsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/ratings/user/${userId}`);
      setRatings(response.data);
    } catch (err) {
      console.log('Không thể tải đánh giá:', err);
    } finally {
      setRatingsLoading(false);
    }
  };

  const fetchUserBookings = async (userId) => {
    try {
      setBookingsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/user/${userId}`);
      setBookings(response.data);
    } catch (err) {
      console.log('Không thể tải bookings:', err);
    } finally {
      setBookingsLoading(false);
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
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update user
      const userId = user._id || user.id;
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
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
      alert(t('profile.error.updateError') + (err.response?.data?.message || t('profile.error.unknownError')));
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
          <p>{t('profile.loading.text')}</p>
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
            <h3>{t('profile.error.title')}</h3>
            <p>{error}</p>
            <button onClick={fetchProfile} className="btn btn-primary">
              {t('profile.error.retry')}
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
          <h3>{t('profile.notFound.title')}</h3>
          <p>{t('profile.notFound.description')}</p>
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
                  src={avatarPreview || (profile.avatar ? `${import.meta.env.VITE_API_BASE_URL}/${profile.avatar}` : 'https://i.pinimg.com/736x/f9/f7/b4/f9f7b48c9ba210a41fe50c837e079537.jpg')} 
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
                      placeholder={t('profile.header.namePlaceholder')}
                    />
                  ) : (
                    user?.fullname || t('profile.header.defaultName')
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
                      placeholder={t('profile.header.countryPlaceholder')}
                    />
                  ) : (
                    <span className="country-text">
                      {profile.country || t('profile.header.defaultCountry')}
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
                  {t('profile.header.editProfile')}
                </button>
              ) : (
                <div className="edit-actions">
                  <button 
                    className="btn btn-success me-2"
                    onClick={handleSubmit}
                  >
                    <BsCheckLg className="me-2" />
                    {t('profile.header.saveChanges')}
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    <BsX className="me-2" />
                    {t('profile.header.cancel')}
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
                    {t('profile.sections.about.title')}
                  </h3>
                  
                  {isEditing ? (
                    <div className="form-group">
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleInputChange}
                        className="form-control"
                        rows="4"
                        placeholder={t('profile.sections.about.placeholder')}
                      />
                    </div>
                  ) : (
                    <p className="profile-description">
                      {profile.description || t('profile.sections.about.defaultDescription')}
                    </p>
                  )}
                </div>

                {/* Contact Information */}
                <div className="profile-section">
                  <h3 className="section-title">{t('profile.sections.contact.title')}</h3>
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <BsTelephone className="contact-icon" />
                      <div className="contact-details">
                        <span className="contact-label">{t('profile.sections.contact.phone.label')}</span>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={editForm.phoneNumber}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder={t('profile.sections.contact.phone.placeholder')}
                          />
                        ) : (
                          <span className="contact-value">
                            {profile.phoneNumber || t('profile.sections.contact.phone.defaultValue')}
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
                  <h4 className="stats-title">{t('profile.sections.stats.title')}</h4>
                  
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-number">
                        {ratingsLoading ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          ratings.length
                        )}
                      </div>
                      <div className="stat-label">{t('profile.sections.stats.ratings')}</div>
                    </div>
                    
                    <div className="stat-item">
                      <div className="stat-number">
                        {bookingsLoading ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          bookings.length
                        )}
                      </div>
                      <div className="stat-label">{t('profile.sections.stats.bookings')}</div>
                    </div>
                    
                    <div className="stat-item">
                      <div className="stat-number">
                        {ratingsLoading ? (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          ratings.filter(rating => rating.star >= 4).length
                        )}
                      </div>
                      <div className="stat-label">{t('profile.sections.stats.helpfulRatings')}</div>
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
