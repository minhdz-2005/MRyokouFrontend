import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accounts from './Accounts';
import Tours from './Tours';
import Bookings from './Bookings';
import Explores from './Explores';
import Ratings from './Ratings';
import { useUser } from '../../contexts/UserContext';
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('accounts');
    const { currentUser, logout, loadingUser, isAdmin, isAuthenticated } = useUser();
    const navigate = useNavigate();

    // Kiểm tra quyền admin khi component mount và khi currentUser thay đổi
    useEffect(() => {
        // Chỉ kiểm tra sau khi đã load xong user data
        if (!loadingUser) {
            if (!isAdmin() || !isAuthenticated()) {
                logout();
                navigate('/');
                return;
            }
        }
    }, [currentUser, loadingUser, logout, navigate, isAdmin, isAuthenticated]);

    // Test authentication status (có thể xóa sau khi test xong)
    useEffect(() => {
        if (!loadingUser) {
            console.log('🔐 Admin Authentication Test:', {
                currentUser: currentUser ? { id: currentUser._id, role: currentUser.role, email: currentUser.email } : null,
                isAdmin: isAdmin(),
                isAuthenticated: isAuthenticated(),
                hasAccessToken: !!localStorage.getItem('accessToken'),
                loadingUser
            });
        }
    }, [currentUser, loadingUser, isAdmin, isAuthenticated]);

    // Hiển thị loading nếu đang load user data
    if (loadingUser) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    // Nếu không phải admin, không render gì (sẽ redirect)
    if (!isAdmin()) {
        return null;
    }

    const renderComponent = () => {
        switch (activeTab) {
            case 'accounts':
                return <Accounts />;
            case 'tours':
                return <Tours />;
            case 'bookings':
                return <Bookings />;
            case 'explores':
                return <Explores />;
            case 'ratings':
                return <Ratings />;
            default:
                return <Accounts />;
        }
    };

    /* ───────────────── 2. Đăng xuất ───────────────── */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="admin-header">
                    <h2>Admin Dashboard</h2>
                </div>
                <nav className="admin-nav">
                    <ul>
                        <li>
                            <button 
                                className={activeTab === 'accounts' ? 'active' : ''}
                                onClick={() => setActiveTab('accounts')}
                            >
                                <i className="fas fa-user-cog"></i>
                                Quản lý tài khoản
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'tours' ? 'active' : ''}
                                onClick={() => setActiveTab('tours')}
                            >
                                <i className="fas fa-map-marked-alt"></i>
                                Quản lý tour
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'bookings' ? 'active' : ''}
                                onClick={() => setActiveTab('bookings')}
                            >
                                <i className="fas fa-calendar-check"></i>
                                Quản lý đặt tour
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'ratings' ? 'active' : ''}
                                onClick={() => setActiveTab('ratings')}
                            >
                                <i className="fas fa-star"></i>
                                Quản lý đánh giá
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeTab === 'explores' ? 'active' : ''}
                                onClick={() => setActiveTab('explores')}
                            >
                                <i className="fas fa-compass"></i>
                                Quản lý khám phá
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <div className="content-header">
                    <h1>Dashboard</h1>
                    <div className="admin-user">
                        <span>{currentUser?.fullname}</span>
                        <button onClick={handleLogout} className="logout-btn">Đăng xuất</button>
                    </div>
                </div>
                <div className="content-body">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

export default Admin;
