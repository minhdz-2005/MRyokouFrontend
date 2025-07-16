// src/components/CustomerReviews.jsx
import React from 'react';
import './Reviews.css';
import { BsStarFill } from 'react-icons/bs';

const reviews = [
  {
    name: 'Nguyễn Văn A',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Chuyến đi rất tuyệt vời! Mọi thứ đều được tổ chức chuyên nghiệp và chu đáo. Tôi sẽ quay lại lần sau.',
  },
  {
    name: 'Lê Thị B',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4,
    comment: 'Dịch vụ tốt, giá cả hợp lý. Hướng dẫn viên thân thiện, nhiệt tình!',
  },
  {
    name: 'Trần Minh C',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 5,
    comment: 'Tôi rất hài lòng với tour này. Thời gian hợp lý, cảnh đẹp và đồ ăn ngon!',
  },
];

const CustomerReviews = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4">Customers Reviews</h2>
      <div className="row justify-content-center">
        {reviews.map((r, index) => (
          <div className="col-md-4 col-sm-6 mb-4" key={index}>
            <div className="card h-100 shadow-sm review-card p-3">
              <div className="d-flex align-items-center mb-3">
                <img src={r.avatar} alt={r.name} className="rounded-circle me-3" width="50" height="50" />
                <div>
                  <h6 className="mb-0">{r.name}</h6>
                  <div className="text-warning">
                    {[...Array(r.rating)].map((_, i) => (
                      <BsStarFill key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted small">"{r.comment}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
