// src/components/FeaturedTours.jsx
import React from 'react';
import './FeaturedTour.css';

const tours = [
  {
    country: 'Philippines',
    properties: 390,
    rating: 4.7,
    image: '',
  },
  {
    country: 'Indonesia',
    properties: 560,
    rating: 4.9,
    image: '',
  },
  {
    country: 'Thailand',
    properties: 420,
    rating: 4.8,
    image: '',
  },
];

const FeaturedTours = () => {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">Featured Destinations</h2>
      <div className="row justify-content-center">
        {tours.map((tour, index) => (
          <div className="col-md-4 col-sm-6 mb-4" key={index}>
            <div className="card tour-card shadow-sm h-100">
              <img src={tour.image} className="card-img-top" alt={tour.country} />
              <div className="card-body text-center">
                <h5 className="card-title">{tour.country}</h5>
                <p className="card-text text-muted">{tour.properties} Properties</p>
                <div className="rating text-warning">
                  ★ {tour.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedTours;
