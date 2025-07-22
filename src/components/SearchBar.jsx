import React, { useState } from 'react';
import './SearchBar.css';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaChevronDown,
  FaFilter
} from 'react-icons/fa';
import { TbBeach, TbMountain, TbBuilding } from 'react-icons/tb';

const SearchBar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, location, price, date, duration });
    }
  };

  const popularDestinations = [
    { name: 'Đà Lạt', icon: <TbMountain /> },
    { name: 'Phú Quốc', icon: <TbBeach /> },
    { name: 'Hà Nội', icon: <TbBuilding /> },
    { name: 'Hội An', icon: <TbBuilding /> }
  ];

  return (
    <div className="searchbar-section">
      <div className="searchbar-container">
        <form className="searchbar-form" onSubmit={handleSubmit} role="search" aria-label="Tìm kiếm tour">
          <div className="searchbar-main">
            <div className="searchbar-input-group">
              <span className="searchbar-icon"><FaSearch /></span>
              <input
                type="text"
                className="searchbar-input"
                placeholder="Bạn muốn đi đâu? Tìm kiếm điểm đến, tên tour..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label="Tìm điểm đến, tên tour"
              />
              <button type="submit" className="searchbar-btn">
                Tìm kiếm
              </button>
            </div>
          </div>

          <div className={`searchbar-advanced ${showAdvanced ? 'show' : ''}`}>
            <div className="advanced-filters">
              <div className="filter-group">
                <span className="filter-icon"><FaMapMarkerAlt /></span>
                <select 
                  className="filter-select" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  aria-label="Chọn địa điểm"
                >
                  <option value="">Tất cả địa điểm</option>
                  {popularDestinations.map((dest, index) => (
                    <option key={index} value={dest.name}>{dest.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <span className="filter-icon"><FaMoneyBillWave /></span>
                <select 
                  className="filter-select" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  aria-label="Chọn mức giá"
                >
                  <option value="">Mọi mức giá</option>
                  <option value="low">Dưới 3 triệu</option>
                  <option value="mid">3 - 5 triệu</option>
                  <option value="high">Trên 5 triệu</option>
                  <option value="luxury">Trên 10 triệu</option>
                </select>
              </div>

              <div className="filter-group">
                <span className="filter-icon"><FaMapMarkerAlt /></span>
                <input
                  type="date"
                  className="filter-select"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Chọn ngày đi"
                  placeholder="Ngày đi"
                />
              </div>

              <div className="filter-group">
                <span className="filter-icon"><FaMapMarkerAlt /></span>
                <select 
                  className="filter-select" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  aria-label="Chọn thời lượng"
                >
                  <option value="">Thời lượng</option>
                  <option value="1-3">1-3 ngày</option>
                  <option value="4-7">4-7 ngày</option>
                  <option value="8+">Trên 7 ngày</option>
                </select>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            className="toggle-advanced-btn"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <FaFilter />
            <span className='fs-6'>{showAdvanced ? 'Ẩn bộ lọc' : 'Bộ lọc nâng cao'}</span>
            <FaChevronDown className={`chevron ${showAdvanced ? 'rotate' : ''}`} />
          </button>

          <div className="popular-destinations">
            <h3>Điểm đến phổ biến:</h3>
            <div className="destinations-list mt-4">
              {popularDestinations.map((dest, index) => (
                <button
                  type="button"
                  key={index}
                  className="destination-tag fs-6"
                  onClick={() => {
                    setLocation(dest.name);
                    if (onSearch) {
                      onSearch({ keyword: '', location: dest.name, price: '' });
                    }
                  }}
                >
                  {dest.icon}
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;