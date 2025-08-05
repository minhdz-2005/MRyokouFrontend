import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [activeSort, setActiveSort] = useState('');

  const sortOptions = [
    { value: 'price-asc', label: t('sort.options.priceAsc'), icon: <FaSortAmountDownAlt /> },
    { value: 'price-desc', label: t('sort.options.priceDesc'), icon: <FaSortAmountUp /> },
    { value: 'rating', label: t('sort.options.rating'), icon: <FaStar /> },
    { value: 'newest', label: t('sort.options.newest'), icon: <FaCalendarAlt /> }
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
            <h5 className="sortbar-title">{t('sort.title')}</h5>
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