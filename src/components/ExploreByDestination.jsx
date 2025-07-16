// src/components/ExploreByDestination.jsx
import React from 'react';
import './Explore.css';

const destinations = [
  {
    name: 'Đà Lạt',
    image: 'https://source.unsplash.com/600x400/?dalat,vietnam',
  },
  {
    name: 'Phú Quốc',
    image: 'https://source.unsplash.com/600x400/?phuquoc,beach',
  },
  {
    name: 'Hội An',
    image: 'https://source.unsplash.com/600x400/?hoian,vietnam',
  },
  {
    name: 'Sapa',
    image: 'https://source.unsplash.com/600x400/?sapa,cloud',
  },
];

const ExploreByDestination = () => {
  return (
    <div>
      <h4 className="mb-4 fw-semibold">🗺️ Khám phá theo địa điểm</h4>
      <div className="row">
        {destinations.map((place, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="destination-card position-relative rounded overflow-hidden shadow-sm">
              <img src={place.image} alt={place.name} className="img-fluid w-100" />
              <div className="overlay"></div>
              <h5 className="destination-name">{place.name}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreByDestination;
