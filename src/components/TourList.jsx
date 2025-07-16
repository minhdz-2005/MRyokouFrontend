// src/components/TourList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortBar from '../components/SortBar'
import './TourList.css';
import { BsStarFill } from 'react-icons/bs';

const toursPerPage = 4; // bạn có thể đổi

const TourList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [tours, setTours] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  /* ───────────── Fetch tour mỗi khi đổi trang ───────────── */
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setErrMsg('');
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/tours`,
          {
            params: { page: currentPage, limit: toursPerPage, sort },
          }
        );
        setTours(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Đăng nhập thất bại, thử lại sau!';
          setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, sort]);

  /* hàm thay đổi sort (nhận từ SortBar) */
  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1); // quay về trang 1 khi đổi sort
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container my-5">
      <SortBar onSortChange={handleSortChange} />

      <h2 className="text-center fw-bold mb-4">Danh sách Tour</h2>

      {/* Loading / Error */}
      {loading && <p className="text-center">Đang tải dữ liệu…</p>}
      {errMsg && <p className="text-center text-danger">{errMsg}</p>}

      {/* Danh sách tour */}
      <div className="row">
        {!loading &&
          tours.map((tour) => (
            <div className="col-md-3 col-sm-6 mb-4" key={tour._id}>
              <div className="card h-100 tour-card shadow-sm">
                <img
                  src={tour.image}
                  className="card-img-top"
                  alt={tour.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{tour.title}</h5>
                  <p className="card-text text-muted">{tour.location}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-warning">
                      <BsStarFill /> {tour.rating}
                    </span>
                    <span className="fw-bold text-primary">
                      {tour.price.toLocaleString()}đ
                    </span>
                  </div>
                  <button
                    className="btn btn-outline-primary w-100 mt-3"
                    disabled
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? 'active' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? 'disabled' : ''
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TourList;
