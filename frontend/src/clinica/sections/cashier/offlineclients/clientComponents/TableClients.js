import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faMoneyBill,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const TableClients = ({
  changeClient,
  baseUrl,
  setVisible,
  setCheck,
  setModal1,
  modal,
  changeStart,
                               setTurnCheckData,
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
  setServices,
  setProducts,
  searchStorage,
  getConnectorsByClientBorn,
  beginDay,
  endDay,
}) => {
  const { t } = useTranslation();
  const getTotalprice = (connector) => {
    let servicesTotal = connector.services.reduce((prev, s) => {
      if (s.refuse === false) {
        prev += s.service.price * s.pieces;
      }
      return prev;
    }, 0);
    let productsTotal = connector.products.reduce((prev, el) => {
      if (el.refuse === false) {
        prev += el.product.price * el.pieces;
      }
      return prev;
    }, 0);
    return servicesTotal + productsTotal;
  };

  const getDebt = (connector) => {
    let servicesTotal = connector.services.reduce(
      (prev, s) => prev + s.service.price * s.pieces,
      0
    );
    let productsTotal = connector.products.reduce(
      (prev, el) => prev + el.product.price * el.pieces,
      0
    );
    const debt =
      connector?.payments.length > 0
        ? getTotalprice(connector) -
          (connector?.discount?.discount || 0) -
          connector.payments.reduce((prev, el) => prev + el.payment, 0)
        : 0;
    return debt;
  };

  const setPosition = (connector) => {
    const total = getTotalprice(connector);
    const debt = getDebt(connector);
    const payments = connector.payments.reduce(
      (prev, el) => prev + el.payment,
      0
    );
    if (debt) {
      return "bg-red-400";
    }
    if (
      total > 0 &&
      payments > 0 &&
      total - (connector?.discount?.discount || 0) === payments
    ) {
      return "bg-green-400";
    }
    return "bg-orange-400";
  };

  return (
    <div className="border-0 table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex gap-6 items-center py-2 px-2">
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
            <div>
              <input
                onChange={searchPhone}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("Tel")}
              />
            </div>
            <div>
              <input
                onChange={searchId}
                style={{ maxWidth: "80px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
              />
            </div>
            <div>
              <input
                onChange={searchProbirka}
                style={{ maxWidth: "70px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("Probirka")}
              />
            </div>
            <div
              className="text-center"
              style={{ maxWidth: "120px", overflow: "hidden" }}
            >
              <input
                type="date"
                name="born"
                className="form-control inp"
                placeholder=""
                style={{ color: "#999" }}
                onKeyDown={(e) =>
                  e.key === "Enter" && getConnectorsByClientBorn(e)
                }
              />
            </div>
            <div className="text-center ml-auto ">
              <Pagination
                setCurrentDatas={setCurrentConnectors}
                datas={connectors}
                setCurrentPage={setCurrentPage}
                countPage={countPage}
                totalDatas={connectors.length}
              />
            </div>
            <div
              className="text-center ml-auto flex gap-2"
              style={{ overflow: "hidden" }}
            >
              <DatePickers changeDate={changeStart} />
              <DatePickers changeDate={changeEnd} />
            </div>
          </div>
          <table className="table m-0 table-sm">
            <thead>
              <tr>
                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("F.I.O")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Tel")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("ID")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Probirka")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("To'lov summasi")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("To'langan")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Chegirma")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qarz")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qarzdan to'lov")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qaytarilgan summa")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qabul qilish")}
                </th>

                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Chek")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentConnectors.map((connector, key) => {
                return (
                  <tr key={key}>
                    <td
                      className={`${setPosition(
                        connector
                      )} border py-1 font-weight-bold text-right text-[16px]`}
                      style={{ maxWidth: "30px !important" }}
                    >
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border py-1 text-[16px] font-weight-bold">
                      {connector.client.lastname +
                        " " +
                        connector.client.firstname}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      +998{connector.client.phone}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector.client.id}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector.probirka}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {getTotalprice(connector)}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector.payments.reduce((prev, el) => {
                        if (
                          new Date(el.createdAt) >= new Date(beginDay) &&
                          new Date(el.createdAt) <= new Date(endDay)
                        ) {
                          prev += el.payment;
                        }
                        return prev;
                      }, 0)}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector?.discount?.discount || 0}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {getDebt(connector)}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector.payments.reduce((prev, el) => {
                        if (el.isPayDebt) {
                          prev += el.payment;
                        }
                        return prev;
                      }, 0)}
                    </td>
                    <td className="border py-1 text-[16px] text-right">
                      {connector.services.reduce(
                        (prev, el) =>
                          prev + ((el.refuse && el.service.price) || 0),
                        0
                      ) +
                        connector.products.reduce(
                          (prev, el) =>
                            prev + ((el.refuse && el.product.price) || 0),
                          0
                        )}
                    </td>
                    <td className="border py-1 text-[16px] text-center">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-success py-0"
                          onClick={() => {
                            changeClient(connector, key);
                            setVisible(true);
                            setCheck(connector);
                            setTurnCheckData(connector)
                            window.scrollTo({
                              top: 0,
                              behavior: "smooth",
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faMoneyBill} />
                        </button>
                      )}
                    </td>
                    <td className="border py-1 text-[16px] text-center">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary py-0"
                          onClick={() => {
                            setCheck(connector);
                            setTurnCheckData(connector)
                            setModal1(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faPrint} />
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
