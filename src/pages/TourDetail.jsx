import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import TourReviews from '../components/TourRating';
import Footer from '../components/Footer';
import { Modal } from 'react-bootstrap';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form data
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [note, setNote] = useState('');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/tours/${id}`);
        setTour(data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Không tìm thấy tour!';
        setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      tour: tour._id,
      fullName,
      email,
      phone,
      departureDate,
      adults,
      children,
      note
    };

    try {
      await axios.post('http://localhost:5000/api/bookings', bookingData);
      setShowModal(true); // Hiện modal cảm ơn
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setDepartureDate('');
      setAdults(1);
      setChildren(0);
      setNote('');
    } catch (error) {
      alert('Đặt tour thất bại! Vui lòng thử lại sau.');
      console.error(error)
    }
  };

  if (loading) return <p className="text-center mt-5">Đang tải thông tin tour…</p>;
  if (errMsg) return <p className="text-center text-danger mt-5">{errMsg}</p>;
  if (!tour) return null;

  return (
    <>
      <Header />
      <div className="container my-5">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <img
              src={tour.image}
              alt={tour.title}
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
            />
          </div>
          <div className="col-md-6">
            <h2 className="mb-3 text-primary">{tour.title}</h2>
            <p><strong>📍 Địa điểm:</strong> {tour.location}</p>
            <p><strong>💰 Giá:</strong> {tour.price.toLocaleString()}đ</p>
            <p><strong>⭐ Đánh giá:</strong> {tour.rating}/5</p>
            <p className="mt-3"><strong>📝 Mô tả:</strong></p>
            <p>{tour.description || 'Chưa có mô tả.'}</p>
          </div>
        </div>

        {/* Nút đặt tour */}
        <div className="text-center mt-5">
          <button onClick={() => setShowBookingForm(!showBookingForm)} className="btn btn-success">
            {showBookingForm ? 'Ẩn form đặt tour' : 'Đặt tour ngay'}
          </button>
        </div>

        {/* Form đặt tour */}
        {showBookingForm && (
          <div className="card shadow mt-4 p-4">
            <h4 className="mb-4 text-success">🧾 Form đặt tour</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Họ tên</label>
                <input type="text" className="form-control" required
                  value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" required
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input type="tel" className="form-control" required
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày khởi hành</label>
                <input type="date" className="form-control" required
                  value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              </div>
              <div className="mb-3 row">
                <div className="col-md-6">
                  <label className="form-label">👨‍🦰 Số người lớn</label>
                  <input type="number" min="1" className="form-control" required
                    value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">🧒 Số trẻ em</label>
                  <input type="number" min="0" className="form-control"
                    value={children} onChange={(e) => setChildren(Number(e.target.value))} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Ghi chú (tuỳ chọn)</label>
                <textarea className="form-control" rows="3"
                  value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100">📨 Gửi yêu cầu đặt tour</button>
            </form>
          </div>
        )}

        <TourReviews />
      </div>
      <Footer />

      {/* Modal cảm ơn */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🎉 Đặt tour thành công!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Cảm ơn bạn đã đặt tour tại hệ thống của chúng tôi.</p>
          <p>Nhân viên của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận thông tin.</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TourDetail;
