import React from 'react';

const travelGuideData = [
  {
    title: "Chuẩn bị hành lý khi đi du lịch",
    points: [
      "Mang quần áo phù hợp với thời tiết và địa hình điểm đến.",
      "Đem theo giấy tờ tùy thân, vé máy bay, booking tour/khách sạn.",
      "Dụng cụ cá nhân cơ bản như kem đánh răng, khăn, sạc dự phòng.",
      "Thuốc cơ bản: cảm, đau bụng, thuốc say xe,..."
    ]
  },
  {
    title: "Lưu ý về thời gian và thời tiết",
    points: [
      "Nên xem dự báo thời tiết trước khi đi 3–5 ngày.",
      "Tránh mùa mưa lũ ở miền Trung (thường từ tháng 9–11).",
      "Du lịch biển nên đi từ tháng 4–8 để có thời tiết đẹp."
    ]
  },
  {
    title: "Mẹo tiết kiệm chi phí khi du lịch",
    points: [
      "Đặt tour và vé máy bay sớm để có giá tốt.",
      "Đi nhóm đông để chia sẻ chi phí xe, phòng, hướng dẫn viên.",
      "Mang theo bình nước cá nhân và đồ ăn nhẹ để tiết kiệm chi tiêu lặt vặt."
    ]
  },
  {
    title: "Du lịch theo tour hay tự túc?",
    points: [
      "Theo tour phù hợp cho người lớn tuổi, lịch trình có sẵn, ít lo lắng.",
      "Tự túc linh hoạt, thích hợp với người trẻ muốn khám phá.",
      "Có thể kết hợp: đặt tour ngắn ngày ở địa phương trong hành trình tự túc."
    ]
  }
];

const TravelGuide = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Cẩm Nang Du Lịch</h2>

      {travelGuideData.map((section, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">{section.title}</h3>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {section.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TravelGuide;
