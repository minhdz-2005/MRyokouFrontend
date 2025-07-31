import React, { useState } from 'react';

const Ratings = () => {
    const [ratings] = useState([
        {
            id: 1,
            customerName: 'Nguyễn Văn An',
            tourName: 'Du lịch Hạ Long 3 ngày 2 đêm',
            rating: 5,
            comment: 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, khách sạn sạch sẽ, đồ ăn ngon. Chắc chắn sẽ quay lại!',
            status: 'approved',
            createdAt: '2024-03-10',
            helpful: 12
        },
        {
            id: 2,
            customerName: 'Trần Thị Bình',
            tourName: 'Khám phá Sapa mùa lúa chín',
            rating: 4,
            comment: 'Cảnh đẹp, thời tiết mát mẻ. Tuy nhiên, một số điểm dừng hơi vội vàng.',
            status: 'approved',
            createdAt: '2024-03-08',
            helpful: 8
        },
        {
            id: 3,
            customerName: 'Lê Văn Cường',
            tourName: 'Tour Đà Nẵng - Hội An',
            rating: 3,
            comment: 'Tour ổn nhưng giá hơi cao so với dịch vụ được cung cấp.',
            status: 'pending',
            createdAt: '2024-03-12',
            helpful: 3
        },
        {
            id: 4,
            customerName: 'Phạm Thị Dung',
            tourName: 'Du lịch Phú Quốc',
            rating: 5,
            comment: 'Biển đẹp, nước trong xanh. Khách sạn sang trọng, nhân viên phục vụ tốt.',
            status: 'approved',
            createdAt: '2024-03-05',
            helpful: 15
        },
        {
            id: 5,
            customerName: 'Hoàng Văn Em',
            tourName: 'Du lịch Hạ Long 3 ngày 2 đêm',
            rating: 2,
            comment: 'Không hài lòng với dịch vụ. Hướng dẫn viên thiếu chuyên nghiệp.',
            status: 'rejected',
            createdAt: '2024-03-15',
            helpful: 1
        }
    ]);

    const handleApprove = (id) => {
        console.log('Approve rating:', id);
    };

    const handleReject = (id) => {
        console.log('Reject rating:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete rating:', id);
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

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'status-active';
            case 'pending':
                return 'status-pending';
            case 'rejected':
                return 'status-inactive';
            default:
                return 'status-pending';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Đã duyệt';
            case 'pending':
                return 'Chờ duyệt';
            case 'rejected':
                return 'Từ chối';
            default:
                return 'Chờ duyệt';
        }
    };

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý đánh giá</h2>
                <div className="header-actions">
                    <button className="add-btn">
                        <i className="fas fa-chart-bar"></i>
                        Thống kê đánh giá
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách hàng</th>
                            <th>Tour</th>
                            <th>Đánh giá</th>
                            <th>Nhận xét</th>
                            <th>Hữu ích</th>
                            <th>Trạng thái</th>
                            <th>Ngày đánh giá</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((rating) => (
                            <tr key={rating.id}>
                                <td>{rating.id}</td>
                                <td>
                                    <div>
                                        <strong>{rating.customerName}</strong>
                                    </div>
                                </td>
                                <td>{rating.tourName}</td>
                                <td>
                                    {renderStars(rating.rating)}
                                </td>
                                <td>
                                    <div className="comment-text">
                                        {rating.comment.length > 100 
                                            ? `${rating.comment.substring(0, 100)}...` 
                                            : rating.comment
                                        }
                                    </div>
                                </td>
                                <td>
                                    <span className="helpful-count">
                                        {rating.helpful} người
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(rating.status)}`}>
                                        {getStatusText(rating.status)}
                                    </span>
                                </td>
                                <td>{rating.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        {rating.status === 'pending' && (
                                            <>
                                                <button 
                                                    className="edit-btn"
                                                    onClick={() => handleApprove(rating.id)}
                                                >
                                                    <i className="fas fa-check"></i>
                                                    Duyệt
                                                </button>
                                                <button 
                                                    className="delete-btn"
                                                    onClick={() => handleReject(rating.id)}
                                                >
                                                    <i className="fas fa-times"></i>
                                                    Từ chối
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(rating.id)}
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

export default Ratings;
