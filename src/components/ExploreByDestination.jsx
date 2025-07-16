import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Explore.css';

const ExploreByDestination = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/explore/destinations`);
        setDestinations(res.data);
      } catch (err) {
        console.error('Không thể tải địa điểm', err);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div>
      <h4 className="mb-4 fw-semibold">🗺️ Khám phá theo địa điểm</h4>
      <div className="row">
        {destinations.map((place, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="destination-card position-relative rounded overflow-hidden shadow-sm">
              <img src={place.image} alt={place.name} className="img-fluid w-100" />
              <div className="overlay"></div>
              <h5 className="destination-name">
                {place.name} ({place.totalTours} tour)
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreByDestination;
