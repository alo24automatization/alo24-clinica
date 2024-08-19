import React, { useCallback } from "react";
import ReactPaginate from "react-paginate";

export const Pagination = ({
  countPage,
  totalDatas,
  setCurrentPage,
  setCurrentDatas,
  datas,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalDatas / countPage); i++) {
    pageNumbers.push(i);
  }

  const pageHandle = useCallback((data) => {
    setCurrentPage(data.selected);
    setCurrentDatas(
      datas.slice(
        data.selected * countPage,
        data.selected * countPage + countPage
      )
    );
  }, [datas, setCurrentPage, setCurrentDatas, countPage]);

  return (
    <nav className="float-right">
      <ReactPaginate
        previousLabel={"<<"}
        nextLabel=">>"
        breakLabel={"..."}
        pageCount={pageNumbers.length}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={pageHandle}
        containerClassName={"pagination justify-content-right"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </nav>
  );
};
