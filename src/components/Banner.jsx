// src/components/Banner.jsx
import React from 'react';
import './Banner.css';

const Banner = () => {
  return (
    <div className="banner d-flex flex-column justify-content-center align-items-center text-white text-center">
      <h1 className="banner-title">
        Your Dream <span className="text-highlight">Vacation</span> Awaits
      </h1>

      <div className="search-box bg-white rounded shadow p-3 d-flex align-items-center justify-content-between mt-4 flex-wrap">
        <input type="text" className="form-control border-0 m-2 search-item" placeholder="Places, hotel, leisure..." />
        <input type="date" className="form-control border-0 m-2 search-item" />
        <input type="date" className="form-control border-0 m-2 search-item" />
        <input type="text" className="form-control border-0 m-2 search-item" placeholder="Guests" />
        <button className="btn btn-primary m-2 px-4 search-item">
            <i className="bi bi-search"></i>
        </button>
      </div>

    </div>
  );
};

export default Banner;
