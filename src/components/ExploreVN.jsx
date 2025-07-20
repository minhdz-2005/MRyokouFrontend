import React, { useState } from 'react';

const locationData = {
  north: [
    {
      name: "Hà Nội",
      fullDesc: "Hà Nội là trung tâm văn hóa, chính trị của Việt Nam. Du khách có thể khám phá Hồ Gươm, Văn Miếu, Lăng Bác, và thưởng thức phở, bún chả, cà phê trứng..."
    },
    {
      name: "Sapa",
      fullDesc: "Sapa là điểm đến mát mẻ quanh năm, nổi tiếng với Fansipan - nóc nhà Đông Dương, bản Cát Cát, Tả Van, và các lễ hội văn hóa đặc trưng dân tộc H’Mông, Dao..."
    },
  ],
  central: [
    {
      name: "Đà Nẵng",
      fullDesc: "Đà Nẵng nổi tiếng với cầu Rồng, biển Mỹ Khê, Bà Nà Hills và gần Hội An, Huế."
    },
  ],
  south: [
    {
      name: "TP. Hồ Chí Minh",
      fullDesc: "Thành phố năng động với nhiều điểm đến như Nhà thờ Đức Bà, Bến Thành, phố đi bộ Nguyễn Huệ..."
    },
  ]
};

const ExploreVietnam = () => {
  const [region, setRegion] = useState('north');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Khám Phá Việt Nam</h2>

      {/* Selector vùng miền */}
      <div className="flex justify-center gap-6 mb-4 font-semibold text-lg">
        {['north', 'central', 'south'].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRegion(r);
              setExpandedIndex(null);
            }}
            className={`pb-1 border-b-2 ${
              region === r ? 'border-black text-black' : 'border-transparent text-gray-500'
            }`}
          >
            {r === 'north' ? 'Miền Bắc' : r === 'central' ? 'Miền Trung' : 'Miền Nam'}
          </button>
        ))}
      </div>

      {/* Danh sách địa điểm */}
      <div className="space-y-2">
        {locationData[region].map((location, index) => (
          <div key={index}>
            <button
              onClick={() => toggleExpand(index)}
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <span className="font-medium">{location.name}</span>
              <span>{expandedIndex === index ? '▲' : '▼'}</span>
            </button>
            {expandedIndex === index && (
              <div className="bg-white p-4 border rounded-b text-gray-700">
                {location.fullDesc}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreVietnam;
