import React, { useState } from 'react';
import './SortBar.css';
import { 
  FaSortAmountDownAlt, 
  FaSortAmountUp, 
  FaStar,
  FaCalendarAlt,
  FaFilter,
  FaChevronDown
} from 'react-icons/fa';
import { GiPriceTag } from 'react-icons/gi';

const SortBar = ({ onSortChange }) => {
  const [activeSort, setActiveSort] = useState('');

  const sortOptions = [
    { value: 'price-asc', label: 'Giá thấp đến cao', icon: <FaSortAmountDownAlt /> },
    { value: 'price-desc', label: 'Giá cao đến thấp', icon: <FaSortAmountUp /> },
    { value: 'rating', label: 'Đánh giá cao nhất', icon: <FaStar /> },
    { value: 'newest', label: 'Mới nhất', icon: <FaCalendarAlt /> }
  ];

  const handleSortChange = (value) => {
    setActiveSort(value);
    if (onSortChange) onSortChange(value);
  };

  return (
    <div className="sortbar">
      <div className="container">
        <div className="sortbar-container">
          <div className="sortbar-main">
            <h5 className="sortbar-title">Sắp xếp theo:</h5>
            <div className="sortbar-options">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`sortbar-option ${activeSort === option.value ? 'active' : ''}`}
                  onClick={() => handleSortChange(option.value)}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortBar;