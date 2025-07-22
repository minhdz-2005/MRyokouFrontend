// src/components/TourList.jsx
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SortBar from '../components/SortBar'
import SearchBar from './SearchBar';
import './TourList.css';
import { BsStarFill } from 'react-icons/bs';
import fallbackImg from '../images/banner.jpg';

const toursPerPage = 8; // bạn có thể đổi

const TourList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState('');
  const [searchParams, setSearchParams] = useState({});
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
            params: { page: currentPage, limit: toursPerPage, sort, ...searchParams },
          }
        );
        setTours(data.data);
        setTotalPages(data.totalPages);
      } catch (err) {
        const msg =
          err.response?.data?.message || 'Failed!';
          setErrMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, sort, searchParams]);

  const handleSearch = (filters) => {
    setSearchParams(filters);
    setCurrentPage(1); // reset về page 1
  };

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
      <SearchBar onSearch={handleSearch} />
      <SortBar onSortChange={handleSortChange} />

      <h2 className="text-center fw-bold mb-4 tourlist-title">Danh sách Tour</h2>

      {/* Loading / Error */}
      {loading && <div className="tourlist-loading"><div className="spinner"></div><span>Đang tải dữ liệu…</span></div>}
      {errMsg && <div className="tourlist-error"><span>{errMsg}</span></div>}

      {/* Danh sách tour */}
      <div className="row">
        {!loading &&
          tours.map((tour) => (
            <div className="col-md-3 col-sm-6 mb-4" key={tour._id}>
              <div className="card h-100 tour-card shadow-sm animate-fadein">
                <div className="tour-card-img-wrapper">
                  <img
                    src={tour.image || fallbackImg}
                    className="card-img-top"
                    alt={tour.title}
                  />
                  {tour.isHot && <span className="tour-badge">Hot</span>}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{tour.title}</h5>
                  <span className="tour-location badge bg-info mb-2">{tour.location}</span>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-warning tour-rating" aria-label={`Đánh giá: ${tour.rating}`}>
                      <BsStarFill /> {tour.rating}
                    </span>
                    <span className="fw-bold text-primary tour-price">
                      {tour.price.toLocaleString()}đ
                    </span>
                  </div>
                  <Link target='blank' to={`/tours/${tour._id}`} className="btn btn-outline-primary w-100 mt-3">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4" aria-label="Pagination">
          <ul className="pagination tourlist-pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                &laquo;
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TourList;
