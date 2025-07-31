import React, { useState } from 'react';

const TourDetails = () => {
    const [tourDetails] = useState([
        {
            id: 1,
            tourName: 'Du lịch Hạ Long 3 ngày 2 đêm',
            itinerary: [
                'Ngày 1: Hà Nội - Hạ Long - Tham quan vịnh',
                'Ngày 2: Khám phá hang động - Chèo kayak',
                'Ngày 3: Hạ Long - Hà Nội'
            ],
            highlights: [
                'Tham quan vịnh Hạ Long - Di sản thế giới',
                'Khám phá hang động Sửng Sốt',
                'Chèo kayak khám phá vịnh',
                'Thưởng thức hải sản tươi ngon'
            ],
            included: [
                'Vé tham quan các điểm du lịch',
                'Khách sạn 3-4 sao',
                'Ăn sáng, trưa, tối',
                'Hướng dẫn viên tiếng Việt',
                'Xe đưa đón'
            ],
            excluded: [
                'Đồ uống cá nhân',
                'Chi phí cá nhân',
                'Bảo hiểm du lịch',
                'Tip cho hướng dẫn viên'
            ],
            requirements: [
                'Giấy tờ tùy thân hợp lệ',
                'Sức khỏe tốt',
                'Trang phục phù hợp'
            ],
            status: 'active',
            lastUpdated: '2024-03-15'
        },
        {
            id: 2,
            tourName: 'Khám phá Sapa mùa lúa chín',
            itinerary: [
                'Ngày 1: Hà Nội - Sapa - Tham quan bản Cát Cát',
                'Ngày 2: Trekking Fansipan - Bản Tả Van'
            ],
            highlights: [
                'Ngắm ruộng bậc thang mùa lúa chín',
                'Trekking Fansipan - Nóc nhà Đông Dương',
                'Khám phá văn hóa dân tộc H\'Mông',
                'Thưởng thức ẩm thực địa phương'
            ],
            included: [
                'Vé tham quan các điểm du lịch',
                'Homestay tại bản làng',
                'Ăn sáng, trưa, tối',
                'Hướng dẫn viên địa phương',
                'Xe đưa đón'
            ],
            excluded: [
                'Cáp treo Fansipan',
                'Đồ uống cá nhân',
                'Chi phí cá nhân',
                'Bảo hiểm du lịch'
            ],
            requirements: [
                'Sức khỏe tốt để trekking',
                'Giày trekking phù hợp',
                'Trang phục ấm'
            ],
            status: 'active',
            lastUpdated: '2024-03-10'
        }
    ]);

    const handleEdit = (id) => {
        console.log('Edit tour details:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete tour details:', id);
    };

    const handleAddDetails = () => {
        console.log('Add new tour details');
    };

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý chi tiết tour</h2>
                <button className="add-btn" onClick={handleAddDetails}>
                    <i className="fas fa-plus"></i>
                    Thêm chi tiết tour
                </button>
            </div>

            <div className="tour-details-container">
                {tourDetails.map((tour) => (
                    <div key={tour.id} className="tour-detail-card">
                        <div className="tour-header">
                            <h3>{tour.tourName}</h3>
                            <div className="tour-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleEdit(tour.id)}
                                >
                                    <i className="fas fa-edit"></i>
                                    Chỉnh sửa
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDelete(tour.id)}
                                >
                                    <i className="fas fa-trash"></i>
                                    Xóa
                                </button>
                            </div>
                        </div>

                        <div className="tour-content">
                            <div className="detail-section">
                                <h4>Lịch trình</h4>
                                <ul>
                                    {tour.itinerary.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4>Điểm nổi bật</h4>
                                <ul>
                                    {tour.highlights.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4>Bao gồm</h4>
                                <ul>
                                    {tour.included.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4>Không bao gồm</h4>
                                <ul>
                                    {tour.excluded.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-section">
                                <h4>Yêu cầu</h4>
                                <ul>
                                    {tour.requirements.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="tour-footer">
                            <span className={`status-badge ${
                                tour.status === 'active' ? 'status-active' : 'status-inactive'
                            }`}>
                                {tour.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                            </span>
                            <span className="last-updated">
                                Cập nhật lần cuối: {tour.lastUpdated}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TourDetails;
