import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../styles/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="pagination-first"
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        <span className="icon-pagination">
          <FaChevronLeft />
        </span>
      </button>
      <div className="panination-content">
        Trang {currentPage} / {totalPages}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        <span className="icon-pagination">
          <FaChevronRight />
        </span>
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="pagination-last"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
