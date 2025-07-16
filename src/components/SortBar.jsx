// src/components/SortBar.jsx
import React from 'react';
import './SortBar.css';

const SortBar = ({ onSortChange }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (onSortChange) onSortChange(value); // Gửi giá trị về parent nếu có callback
  };

  return (
    <div className="sortbar py-3 bg-light border-bottom">
      <div className="container d-flex justify-content-between align-items-center flex-wrap">
        <h5 className="mb-2 mb-md-0 fw-semibold">Sắp xếp tour:</h5>
        <select className="form-select w-auto" onChange={handleChange}>
          <option value="">-- Chọn tiêu chí --</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
          <option value="rating">Đánh giá cao nhất</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>
    </div>
  );
};

export default SortBar;
