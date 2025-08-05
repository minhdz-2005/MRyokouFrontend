import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    { name: t('search.popular.destinations.daLat'), icon: <TbMountain /> },
    { name: t('search.popular.destinations.phuQuoc'), icon: <TbBeach /> },
    { name: t('search.popular.destinations.haNoi'), icon: <TbBuilding /> },
    { name: t('search.popular.destinations.hoiAn'), icon: <TbBuilding /> }
  ];

  return (
    <div className="searchbar-section">
      <div className="searchbar-container">
        <form className="searchbar-form" onSubmit={handleSubmit} role="search" aria-label={t('search.main.ariaLabel')}>
          <div className="searchbar-main">
            <div className="searchbar-input-group">
              <span className="searchbar-icon"><FaSearch /></span>
              <input
                type="text"
                className="searchbar-input"
                placeholder={t('search.main.placeholder')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                aria-label={t('search.main.inputAriaLabel')}
              />
              <button type="submit" className="searchbar-btn">
                {t('search.main.searchButton')}
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
                  aria-label={t('search.filters.location.label')}
                >
                  <option value="">{t('search.filters.location.all')}</option>
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
                  aria-label={t('search.filters.price.label')}
                >
                  <option value="">{t('search.filters.price.all')}</option>
                  <option value="low">{t('search.filters.price.low')}</option>
                  <option value="mid">{t('search.filters.price.mid')}</option>
                  <option value="high">{t('search.filters.price.high')}</option>
                  <option value="luxury">{t('search.filters.price.luxury')}</option>
                </select>
              </div>

              <div className="filter-group">
                <span className="filter-icon"><FaMapMarkerAlt /></span>
                <input
                  type="date"
                  className="filter-select"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label={t('search.filters.date.label')}
                  placeholder={t('search.filters.date.placeholder')}
                />
              </div>

              <div className="filter-group">
                <span className="filter-icon"><FaMapMarkerAlt /></span>
                <select 
                  className="filter-select" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  aria-label={t('search.filters.duration.label')}
                >
                  <option value="">{t('search.filters.duration.all')}</option>
                  <option value="1-3">{t('search.filters.duration.short')}</option>
                  <option value="4-7">{t('search.filters.duration.medium')}</option>
                  <option value="8+">{t('search.filters.duration.long')}</option>
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
            <span className='fs-6'>{showAdvanced ? t('search.filters.toggle.hide') : t('search.filters.toggle.show')}</span>
            <FaChevronDown className={`chevron ${showAdvanced ? 'rotate' : ''}`} />
          </button>

          <div className="popular-destinations">
            <h3>{t('search.popular.title')}</h3>
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