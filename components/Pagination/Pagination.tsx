"use client";

import ReactPaginate, { type ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  page: number;
  onChange: (page: number) => void;
}

export default function Pagination({ pageCount, page, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  const handlePageChange: ReactPaginateProps["onPageChange"] = (event) => {
    onChange(event.selected + 1);
  };

  return (
    <ReactPaginate
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.page}
      previousClassName={css.nav}
      nextClassName={css.nav}
      breakClassName={css.break}
      disabledClassName={css.disabled}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      pageCount={pageCount}
      forcePage={page - 1}
      onPageChange={handlePageChange}
    />
  );
}
