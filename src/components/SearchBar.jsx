// src/components/SearchBar.jsx
import React from 'react';
import './SearchBar.css';

const SearchBar = () => {
  return (
    <div className="searchbar-section py-4">
      <div className="container">
        <form className="row g-3 align-items-center">
          {/* Từ khóa */}
          <div className="col-md-4 col-sm-12">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm điểm đến, tên tour..."
            />
          </div>

          {/* Địa điểm */}
          <div className="col-md-3 col-sm-6">
            <select className="form-select">
              <option value="">Chọn địa điểm</option>
              <option value="dalat">Đà Lạt</option>
              <option value="phuquoc">Phú Quốc</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hoian">Hội An</option>
            </select>
          </div>

          {/* Giá */}
          <div className="col-md-3 col-sm-6">
            <select className="form-select">
              <option value="">Chọn mức giá</option>
              <option value="low">Dưới 3 triệu</option>
              <option value="mid">3 – 5 triệu</option>
              <option value="high">Trên 5 triệu</option>
            </select>
          </div>

          {/* Nút tìm */}
          <div className="col-md-2 col-sm-12">
            <button type="submit" className="btn btn-primary w-100">
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
