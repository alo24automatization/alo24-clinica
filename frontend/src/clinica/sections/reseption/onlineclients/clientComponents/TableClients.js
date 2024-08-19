import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const TableClients = ({
  baseUrl,
  setVisible,
  setCheck,
  setModal1,
  modal,
  changeStart,
  changeEnd,
  searchPhone,
  setClient,
  searchId,
  searchFullname,
  searchProbirka,
  connectors,
  setConnector,
  setCurrentPage,
  countPage,
  currentConnectors,
  setCurrentConnectors,
  currentPage,
  setPageSize,
  loading,
  setModal2,
  setPostConnector,
}) => {

  const {t} = useTranslation()

  const history = useHistory()

  return (
    <div className="border-0 table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex items-center p-2 gap-4">
                <div>
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder="Bo'limni tanlang"
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
                <div className="text-center ml-auto">
                  <Pagination
                    setCurrentDatas={setCurrentConnectors}
                    datas={connectors}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={connectors.length}
                  />
                </div>
          </div>
          <table className="table m-0">
            <thead>
              <tr>
                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Shifokor")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Bo'lim")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Mijozlar")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {currentConnectors.map((connector, key) => {
                return (
                  <tr key={key}>
                    <td
                      className="border py-1 font-weight-bold text-right"
                      style={{ maxWidth: "30px !important" }}
                    >
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border py-1 font-weight-bold">
                      {connector.lastname +
                        " " +
                        connector.firstname}
                    </td>
                    <td className="border py-1 text-right">
                      {connector?.specialty?.name}
                    </td>
                    <td className="border py-1 text-center">
                      {connector?.clients}
                    </td>
                    <td className="border py-1 text-center">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-success py-0"
                          onClick={() => {
                            history.push('/alo24/online_info', {
                              doctor: connector
                          })
                          }}
                        >
                          <FontAwesomeIcon icon={faPenAlt} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
