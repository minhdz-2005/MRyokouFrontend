import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location, price });
    }
  };

  return (
    <div className="searchbar-section py-4">
      <div className="container">
        <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
          <div className="col-md-4 col-sm-12">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm điểm đến, tên tour..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <select className="form-select" value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Chọn địa điểm</option>
              <option value="Đà Lạt">Đà Lạt</option>
              <option value="Phú Quốc">Phú Quốc</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="Hội An">Hội An</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6">
            <select className="form-select" value={price} onChange={(e) => setPrice(e.target.value)}>
              <option value="">Chọn mức giá</option>
              <option value="low">Dưới 3 triệu</option>
              <option value="mid">3 – 5 triệu</option>
              <option value="high">Trên 5 triệu</option>
            </select>
          </div>

          <div className="col-md-2 col-sm-12">
            <button type="submit" className="btn btn-primary w-100">Tìm kiếm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
