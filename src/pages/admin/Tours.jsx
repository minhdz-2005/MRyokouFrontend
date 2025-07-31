import React, { useState } from 'react';

const Tours = () => {
    const [tours] = useState([
        {
            id: 1,
            name: 'Du lịch Hạ Long 3 ngày 2 đêm',
            destination: 'Hạ Long, Quảng Ninh',
            duration: '3 ngày 2 đêm',
            price: '2,500,000',
            capacity: 20,
            booked: 15,
            status: 'active',
            createdAt: '2024-01-10'
        },
        {
            id: 2,
            name: 'Khám phá Sapa mùa lúa chín',
            destination: 'Sapa, Lào Cai',
            duration: '2 ngày 1 đêm',
            price: '1,800,000',
            capacity: 15,
            booked: 8,
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: 3,
            name: 'Tour Đà Nẵng - Hội An',
            destination: 'Đà Nẵng, Hội An',
            duration: '4 ngày 3 đêm',
            price: '3,200,000',
            capacity: 25,
            booked: 22,
            status: 'active',
            createdAt: '2024-01-20'
        },
        {
            id: 4,
            name: 'Du lịch Phú Quốc',
            destination: 'Phú Quốc, Kiên Giang',
            duration: '5 ngày 4 đêm',
            price: '4,500,000',
            capacity: 30,
            booked: 5,
            status: 'inactive',
            createdAt: '2024-02-01'
        }
    ]);

    const handleEdit = (id) => {
        console.log('Edit tour:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete tour:', id);
    };

    const handleAddTour = () => {
        console.log('Add new tour');
    };

    const getBookingPercentage = (booked, capacity) => {
        return Math.round((booked / capacity) * 100);
    };

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý tour</h2>
                <button className="add-btn" onClick={handleAddTour}>
                    <i className="fas fa-plus"></i>
                    Thêm tour mới
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên tour</th>
                            <th>Điểm đến</th>
                            <th>Thời gian</th>
                            <th>Giá (VNĐ)</th>
                            <th>Sức chứa</th>
                            <th>Đã đặt</th>
                            <th>Tỷ lệ đặt</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr key={tour.id}>
                                <td>{tour.id}</td>
                                <td>{tour.name}</td>
                                <td>{tour.destination}</td>
                                <td>{tour.duration}</td>
                                <td>{tour.price}</td>
                                <td>{tour.capacity}</td>
                                <td>{tour.booked}</td>
                                <td>
                                    <div className="booking-progress">
                                        <span>{getBookingPercentage(tour.booked, tour.capacity)}%</span>
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ 
                                                    width: `${getBookingPercentage(tour.booked, tour.capacity)}%`,
                                                    backgroundColor: getBookingPercentage(tour.booked, tour.capacity) > 80 ? '#e53e3e' : '#4299e1'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        tour.status === 'active' ? 'status-active' : 'status-inactive'
                                    }`}>
                                        {tour.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                    </span>
                                </td>
                                <td>{tour.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(tour.id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                            Sửa
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(tour.id)}
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
        </div>
    );
};

export default Tours;
