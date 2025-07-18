import React from 'react';

const reviews = [
  {
    name: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Chuyến đi rất tuyệt vời, hướng dẫn viên thân thiện và nhiệt tình!',
  },
  {
    name: 'Trần Thị B',
    rating: 4,
    comment: 'Lịch trình hợp lý, cảnh đẹp, tuy nhiên hơi đông khách một chút.',
  },
  {
    name: 'Lê Văn C',
    rating: 5,
    comment: 'Dịch vụ tốt, xe di chuyển thoải mái, đáng giá tiền!',
  },
];

const TourReviews = () => {
  return (
    <div className="mt-5">
      <h4 className="mb-4 text-primary">📝 Đánh giá tour</h4>
      {reviews.map((review, index) => (
        <div className="mb-3 border-bottom pb-2" key={index}>
          <strong>{review.name}</strong> – ⭐ {review.rating}/5
          <p className="mb-1">{review.comment}</p>
        </div>
      ))}
      <div className="text-end">
        <button className="btn btn-outline-secondary btn-sm">Xem tất cả đánh giá</button>
      </div>
    </div>
  );
};

export default TourReviews;
