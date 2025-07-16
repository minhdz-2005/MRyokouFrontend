// src/components/ExploreBySeason.jsx
import React from 'react';

const seasonData = [
  {
    season: '🌸 Mùa Xuân',
    places: ['Hà Giang', 'Đà Lạt', 'Huế'],
  },
  {
    season: '☀️ Mùa Hè',
    places: ['Phú Quốc', 'Nha Trang', 'Côn Đảo'],
  },
  {
    season: '🍂 Mùa Thu',
    places: ['Hội An', 'Yên Bái'],
  },
  {
    season: '❄️ Mùa Đông',
    places: ['Sapa', 'Mộc Châu'],
  },
];

const ExploreBySeason = () => {
  return (
    <div>
      <h4 className="mb-4 fw-semibold">☀️ Khám phá theo mùa</h4>
      <div className="row">
        {seasonData.map((season, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="p-4 bg-light rounded shadow-sm h-100">
              <h5 className="fw-bold mb-3">{season.season}</h5>
              <ul className="mb-0">
                {season.places.map((place, idx) => (
                  <li key={idx}>{place}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreBySeason;
