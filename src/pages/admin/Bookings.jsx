import React, { useState } from 'react';

const Bookings = () => {
    const [bookings] = useState([
        {
            id: 1,
            customerName: 'Nguyễn Văn An',
            customerEmail: 'nguyenvanan@gmail.com',
            customerPhone: '0901234567',
            tourName: 'Du lịch Hạ Long 3 ngày 2 đêm',
            bookingDate: '2024-03-15',
            travelDate: '2024-04-20',
            numberOfPeople: 4,
            totalPrice: '10,000,000',
            status: 'confirmed',
            paymentStatus: 'paid',
            createdAt: '2024-03-10'
        },
        {
            id: 2,
            customerName: 'Trần Thị Bình',
            customerEmail: 'tranthibinh@gmail.com',
            customerPhone: '0912345678',
            tourName: 'Khám phá Sapa mùa lúa chín',
            bookingDate: '2024-03-12',
            travelDate: '2024-04-15',
            numberOfPeople: 2,
            totalPrice: '3,600,000',
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: '2024-03-12'
        },
        {
            id: 3,
            customerName: 'Lê Văn Cường',
            customerEmail: 'levancuong@gmail.com',
            customerPhone: '0923456789',
            tourName: 'Tour Đà Nẵng - Hội An',
            bookingDate: '2024-03-08',
            travelDate: '2024-04-25',
            numberOfPeople: 6,
            totalPrice: '19,200,000',
            status: 'confirmed',
            paymentStatus: 'paid',
            createdAt: '2024-03-08'
        },
        {
            id: 4,
            customerName: 'Phạm Thị Dung',
            customerEmail: 'phamthidung@gmail.com',
            customerPhone: '0934567890',
            tourName: 'Du lịch Phú Quốc',
            bookingDate: '2024-03-14',
            travelDate: '2024-05-10',
            numberOfPeople: 3,
            totalPrice: '13,500,000',
            status: 'cancelled',
            paymentStatus: 'refunded',
            createdAt: '2024-03-14'
        }
    ]);

    const handleViewDetails = (id) => {
        console.log('View booking details:', id);
    };

    const handleConfirm = (id) => {
        console.log('Confirm booking:', id);
    };

    const handleCancel = (id) => {
        console.log('Cancel booking:', id);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed':
                return 'status-active';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-inactive';
            default:
                return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'pending':
                return 'Chờ xác nhận';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Chờ xác nhận';
        }
    };

    const getPaymentStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Đã thanh toán';
            case 'pending':
                return 'Chờ thanh toán';
            case 'refunded':
                return 'Đã hoàn tiền';
            default:
                return 'Chờ thanh toán';
        }
    };

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý đặt tour</h2>
                <div className="header-actions">
                    <button className="add-btn">
                        <i className="fas fa-download"></i>
                        Xuất báo cáo
                    </button>
                </div>
            </div>

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
                            <th>Trạng thái</th>
                            <th>Thanh toán</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>
                                    <div>
                                        <strong>{booking.customerName}</strong>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div>{booking.customerEmail}</div>
                                        <div>{booking.customerPhone}</div>
                                    </div>
                                </td>
                                <td>{booking.tourName}</td>
                                <td>{booking.bookingDate}</td>
                                <td>{booking.travelDate}</td>
                                <td>{booking.numberOfPeople}</td>
                                <td>{booking.totalPrice} VNĐ</td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        booking.paymentStatus === 'paid' ? 'status-active' : 
                                        booking.paymentStatus === 'refunded' ? 'status-inactive' : 'status-pending'
                                    }`}>
                                        {getPaymentStatusText(booking.paymentStatus)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleViewDetails(booking.id)}
                                        >
                                            <i className="fas fa-eye"></i>
                                            Chi tiết
                                        </button>
                                        {booking.status === 'pending' && (
                                            <>
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleConfirm(booking.id)}
                                                >
                                                    <i className="fas fa-check"></i>
                                                    Xác nhận
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleCancel(booking.id)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                    Từ chối
                                                </button>
                                            </>
                                        )}
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

export default Bookings;
