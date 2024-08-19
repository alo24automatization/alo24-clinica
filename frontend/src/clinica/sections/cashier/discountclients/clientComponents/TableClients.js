import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useTranslation } from "react-i18next";

export const TableClients = ({
  currentConnectors,
  setCurrentConnectors,
  searchFullname,
  searchId,
  setPageSize,
  setCurrentPage,
  countPage,
  changeStart,
  changeEnd,
  currentPage,
  commentSelect,
  sortComment,
  sortDiscounts,
  getDiscountsByClientBorn
}) => {
  const {t} = useTranslation()
  return (
    <div className="border-0 shadow-lg table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex gap-6 items-center py-2 px-2">
            <div>
              <select
                className="form-control form-control-sm selectpicker"
                placeholder={t("Bo'limni tanlang")}
                onChange={setPageSize}
                style={{ minWidth: "50px" }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              <input
                onChange={searchFullname}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("F.I.O")}
              />
            </div>
            <div>
              <input
                onChange={searchId}
                style={{ maxWidth: "60px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
              />
            </div>
            <div>
              <input
                type="date"
                name="born"
                className="form-control inp"
                placeholder=""
                style={{ color: '#999' }}
                onKeyDown={(e) => e.key === 'Enter' && getDiscountsByClientBorn(e)}
              />
            </div>
            <div className="text-center ml-auto">
              <Pagination
                setCurrentDatas={setCurrentConnectors}
                datas={currentConnectors}
                setCurrentPage={setCurrentPage}
                countPage={countPage}
                totalDatas={currentConnectors.length}
              />
            </div>
            <div className="text-center">
              <select
                className="form-control form-control-sm selectpicker"
                onChange={sortDiscounts}
              >
                <option value="none">{t("Hammasi")}</option>
                <option value="statsionar">{t("Statsionar")}</option>
                <option value="offline">{t("Kunduzgi")}</option>
              </select>
            </div>
            <div
              className="flex gap-2"
              style={{ maxWidth: "200px", overflow: "hidden" }}
            >
              <DatePickers changeDate={changeStart} />
              <DatePickers changeDate={changeEnd} />
            </div>
            <div className="text-center">
              <div className="btn btn-primary">
                <ReactHTMLTableToExcel
                  id="reacthtmltoexcel"
                  table="discount-table"
                  sheet="Sheet"
                  buttonText="Excel"
                  filename={t("Chegirma")}
                />
              </div>
            </div>
            <div className="text-center">
              <select
                className="form-control form-control-sm selectpicker"
                onChange={sortComment}
              >
                <option value="none">{t("Hammasi")}</option>
                {commentSelect.map((item, index) => (
                  <option key={index} value={item}>
                    {t(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <table className="table m-0" id="discount-table">
            <thead>
              <tr>
                <th className="border py-1 bg-alotrade text-[14px]">№</th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("F.I.O")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("ID")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("Telefon raqami")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("Tug'ilgan yili")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("Jami to'lov")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("Procient")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">
                  {t("Chegirma summasi")}
                </th>
                <th className="border py-1 bg-alotrade text-[14px]">{t("Izoh")}</th>
              </tr>
            </thead>
            <tbody>
              {currentConnectors.map((connector, key) => {
                return (
                  <tr key={key}>
                    <td
                      className="border py-1 font-weight-bold text-right text-[16px]"
                      style={{ maxWidth: "30px !important" }}
                    >
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {connector?.client?.fullname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.client?.id}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.client?.phone}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(connector?.client?.born).toLocaleDateString()}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.total}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.procient}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.discount}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {t(connector?.comment)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table
            className="table"
            style={{ marginLeft: "auto", maxWidth: "300px" }}
          >
            <tbody>
              <tr>
                <td className="py-1 text-right font-weight-bold" colSpan={2}>
                  {t("Jami")}:
                </td>
                <td className="py-1 font-weight-bold" colSpan={4}>
                  {currentConnectors &&
                    currentConnectors.reduce((total, el) => {
                      return total + el.discount;
                    }, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
