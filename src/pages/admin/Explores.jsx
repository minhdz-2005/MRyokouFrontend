import React, { useState } from 'react';

const Explores = () => {
    const [explores] = useState([
        {
            id: 1,
            title: 'Khám phá văn hóa dân tộc Tây Bắc',
            category: 'Văn hóa',
            location: 'Tây Bắc',
            description: 'Trải nghiệm văn hóa độc đáo của các dân tộc thiểu số vùng Tây Bắc',
            views: 1250,
            likes: 89,
            status: 'active',
            createdAt: '2024-01-15',
            author: 'Admin'
        },
        {
            id: 2,
            title: 'Ẩm thực đường phố Hà Nội',
            category: 'Ẩm thực',
            location: 'Hà Nội',
            description: 'Khám phá những món ăn đường phố nổi tiếng của thủ đô',
            views: 2100,
            likes: 156,
            status: 'active',
            createdAt: '2024-01-20',
            author: 'Manager'
        },
        {
            id: 3,
            title: 'Du lịch mùa hoa anh đào Đà Lạt',
            category: 'Thiên nhiên',
            location: 'Đà Lạt',
            description: 'Ngắm hoa anh đào nở rộ tại thành phố ngàn hoa',
            views: 890,
            likes: 67,
            status: 'active',
            createdAt: '2024-02-01',
            author: 'Staff'
        },
        {
            id: 4,
            title: 'Khám phá hang động Phong Nha',
            category: 'Thiên nhiên',
            location: 'Quảng Bình',
            description: 'Khám phá hệ thống hang động kỳ vĩ tại Phong Nha - Kẻ Bàng',
            views: 1560,
            likes: 123,
            status: 'inactive',
            createdAt: '2024-02-10',
            author: 'Admin'
        }
    ]);

    const handleEdit = (id) => {
        console.log('Edit explore:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete explore:', id);
    };

    const handlePublish = (id) => {
        console.log('Publish explore:', id);
    };

    const handleAddExplore = () => {
        console.log('Add new explore');
    };

    return (
        <div className="component-container">
            <div className="component-header">
                <h2 className="component-title">Quản lý khám phá</h2>
                <button className="add-btn" onClick={handleAddExplore}>
                    <i className="fas fa-plus"></i>
                    Thêm bài viết mới
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Danh mục</th>
                            <th>Địa điểm</th>
                            <th>Tác giả</th>
                            <th>Lượt xem</th>
                            <th>Lượt thích</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {explores.map((explore) => (
                            <tr key={explore.id}>
                                <td>{explore.id}</td>
                                <td>
                                    <div>
                                        <strong>{explore.title}</strong>
                                        <div className="explore-description">
                                            {explore.description.substring(0, 100)}...
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        explore.category === 'Văn hóa' ? 'status-active' : 
                                        explore.category === 'Ẩm thực' ? 'status-pending' : 'status-inactive'
                                    }`}>
                                        {explore.category}
                                    </span>
                                </td>
                                <td>{explore.location}</td>
                                <td>{explore.author}</td>
                                <td>
                                    <span className="views-count">
                                        {explore.views.toLocaleString()}
                                    </span>
                                </td>
                                <td>
                                    <span className="likes-count">
                                        {explore.likes}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${
                                        explore.status === 'active' ? 'status-active' : 'status-inactive'
                                    }`}>
                                        {explore.status === 'active' ? 'Đã xuất bản' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td>{explore.createdAt}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEdit(explore.id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                            Sửa
                                        </button>
                                        {explore.status === 'inactive' && (
                                            <button 
                                                className="edit-btn"
                                                onClick={() => handlePublish(explore.id)}
                                            >
                                                <i className="fas fa-upload"></i>
                                                Xuất bản
                                            </button>
                                        )}
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDelete(explore.id)}
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

export default Explores;
