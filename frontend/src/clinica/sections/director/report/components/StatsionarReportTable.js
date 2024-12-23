import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faMoneyBill,
  faPrint,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { Pagination } from "../../../reseption/components/Pagination";
import { DatePickers } from "../../../reseption/offlineclients/clientComponents/DatePickers";
import { useTranslation } from "react-i18next";
import Money from "../../../../common/Money";
import Moment from "react-moment";

export const StatsionarReportTable = ({
  changeClient,
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
  setServices,
  setProducts,
  getConnectorsByClientBorn,
  changeType,
  type,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [clientBorn, setClientBorn] = useState("");

  const getTotalprice = (connector) => {
    let roomprice = 0;
    if (connector?.room?.endday) {
      const day = Math.round(
        Math.abs(
          (new Date(connector?.room?.endday).setHours(0, 0, 0, 0) -
            new Date(connector?.room?.beginday).setHours(0, 0, 0, 0)) /
          (24 * 60 * 60 * 1000)
        )
      );
      roomprice = connector?.room?.room?.price * day;
    } else {
      let begin = new Date(connector?.room?.beginday);
      let today = new Date();
      const day = Math.round(
        Math.abs(
          (new Date(new Date(today).setHours(0, 0, 0, 0)).getTime() -
            new Date(new Date(begin).setHours(0, 0, 0, 0)).getTime()) /
          (24 * 60 * 60 * 1000)
        )
      );
      roomprice = connector?.room?.room?.price * day;
    }

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
    return servicesTotal + productsTotal + roomprice;
  };

  const getDebt = (connector) => {
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
      <div className="table-responsive">
        <div className="bg-white flex gap-6 items-center py-2 px-2">
          <div>
            <select
              className="form-control form-control-sm selectpicker"
              placeholder={t("Bo'limni tanlang")}
              onChange={setPageSize}
              style={{ minWidth: "50px" }}
            >
              <option value={200}>200</option>
              <option value={"all"}>{t("Barchasi")}</option>
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
          <div className="flex items-center gap-4">
            <input
              onKeyDown={(e) =>
                e.key === "Enter" && getConnectorsByClientBorn(e.target.value)
              }
              type="date"
              name="born"
              onChange={(e) => setClientBorn(e.target.value)}
              className="form-control inp"
              placeholder=""
              style={{ color: "#999" }}
            />
            <button onClick={() => getConnectorsByClientBorn(clientBorn)}>
              <FontAwesomeIcon icon={faSearch} style={{ cursor: "pointer" }} />
            </button>
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
          <div className="texte-center">
            <div className="btn btn-primary">
              <ReactHtmlTableToExcel
                id="reacthtmltoexcel"
                table="statsionarreport-table"
                sheet="Sheet"
                buttonText="Excel"
                filename={t("Statsionar")}
              />
            </div>
          </div>
          <div>
            <select
              className="form-control form-control-sm selectpicker"
              placeholder="Doctors"
              onChange={changeType}
            >
              <option value={"today"}>{t("Bugun")}</option>
              <option value={"todayPayments"}>{t("Bugungi to’lovlar")}</option>
              <option value={"done"}>{t("Yakunlangan")}</option>
              <option value={"continue"}>{t("Davolanishda")}</option>
            </select>
          </div>
        </div>

        {type !== "todayPayments" && (
          <div>
            <table className="table m-0 table-sm">
              <thead style={{ position: "sticky", top: "0" }}>
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
                    {t("Kelgan")}
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    {t("Ketgan")}
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    {t("To'lov summasi")}
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    {t("To'langan")}
                  </th>
                  {type !== 'done' && type !== 'continue' ? (
                    <>
                      <th className="border py-1 bg-alotrade text-[16px]">
                        {t("Naqt")}
                      </th>
                      <th className="border py-1 bg-alotrade text-[16px]">
                        {t("Plastik")}
                      </th>
                      <th className="border py-1 bg-alotrade text-[16px]">
                        {t("O'tkazma")}
                      </th>
                    </>
                  ) : null}
                  <th className="border py-1 bg-alotrade text-[16px]">
                    {t("Chegirma")}
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    {t("Qarz")}
                  </th>
                  {!location.pathname.includes("/alo24/statsionarreport") && (
                    <th className="border py-1 bg-alotrade text-[16px]">
                      {t("To'lov")}
                    </th>
                  )}

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
                        {connector?.client?.lastname +
                          " " +
                          connector?.client?.firstname}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        +998{connector?.client?.phone}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.client?.id}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {new Date(
                          connector?.room?.beginday
                        ).toLocaleDateString()}
                        {" "}
                        {new Date(connector?.room?.beginday).toLocaleTimeString().split(' ')[0]}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.room?.endday &&
                          `${new Date(connector?.room?.endday).toLocaleDateString()} ${new Date(connector?.room?.endday).toLocaleTimeString().split(' ')[0]}`}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {getTotalprice(connector)}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector.payments.reduce(
                          (prev, el) => prev + el.payment,
                          0
                        )}
                      </td>
                      {/*  */}
                      {type !== 'done' && type !== 'continue' ? (
                        <>
                          <td className="border py-1 text-[16px] text-right">
                            {connector.payments.reduce(
                              (prev, el) => prev + el.cash,
                              0
                            )}
                          </td>
                          <td className="border py-1 text-[16px] text-right">
                            {connector.payments.reduce(
                              (prev, el) => prev + el.card,
                              0
                            )}
                          </td>
                          <td className="border py-1 text-[16px] text-right">
                            {connector.payments.reduce(
                              (prev, el) => prev + el.transfer,
                              0
                            )}
                          </td>
                        </>
                      ) : null}
                      {/*  */}
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.discount?.discount || 0}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {getDebt(connector)}
                      </td>
                      {!location.pathname.includes(
                        "/alo24/statsionarreport"
                      ) && (
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
                                }}
                              >
                                <FontAwesomeIcon icon={faMoneyBill} />
                              </button>
                            )}
                          </td>
                        )}
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
                <tr>
                  <td
                    colSpan={2}
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                  >
                    <div className="flex justify-between">
                      <div>
                        {t("Qoldiq")}:{" "}
                        {connectors.reduce((prev, connector) => {
                          let payments = connector.payments.reduce(
                            (prev, el) => prev + el.payment,
                            0
                          );
                          return prev + payments;
                        }, 0)}
                      </div>
                    </div>
                  </td>
                  <td className="border py-1 text-[16px] font-weight-bold"></td>
                  <td className="border py-1 text-[16px] text-right"></td>
                  <td className="border py-1 text-[16px] text-right"></td>
                  <td className="border py-1 text-[16px] text-right"></td>
                  <td className="border py-1 text-[16px] text-right font-bold">
                    {connectors.reduce(
                      (prev, connector) =>
                        prev + (getTotalprice(connector) || 0),
                      0
                    )}
                  </td>
                  <td className="border py-1 text-[16px] text-right font-bold">
                    {connectors.reduce(
                      (prev, connector) =>
                        prev +
                        connector.payments.reduce(
                          (sum, payment) => sum + payment.payment,
                          0
                        ),
                      0
                    )}
                  </td>

                  {type !== 'done' && type !== 'continue' ? (
                    <>
                      <td className="border py-1 text-[16px] text-right font-bold">
                        {connectors.reduce(
                          (prev, connector) =>
                            prev +
                            connector.payments.reduce(
                              (sum, payment) => sum + payment.cash,
                              0
                            ),
                          0
                        )}
                      </td>
                      <td className="border py-1 text-[16px] text-right font-bold">
                        {connectors.reduce(
                          (prev, connector) =>
                            prev +
                            connector.payments.reduce(
                              (sum, payment) => sum + payment.card,
                              0
                            ),
                          0
                        )}
                      </td>
                      <td className="border py-1 text-[16px] text-right font-bold">
                        {connectors.reduce(
                          (prev, connector) =>
                            prev +
                            connector.payments.reduce(
                              (sum, payment) => sum + payment.transfer,
                              0
                            ),
                          0
                        )}
                      </td>
                    </>
                  ) : null}

                  <td className="border py-1 text-[16px] text-right font-bold">
                    {connectors.reduce(
                      (prev, el) => prev + (el?.discount?.discount || 0),
                      0
                    )}
                  </td>
                  <td className="border py-1 text-[16px] text-right font-bold">
                    {connectors.reduce(
                      (prev, connector) => prev + getDebt(connector),
                      0
                    )}
                  </td>
                  {!location.pathname.includes("/alo24/statsionarreport") && (
                    <td className="border py-1 text-[16px] text-center"></td>
                  )}
                  {type !== 'done' && type !== 'continue' ? <td className="border py-1 text-[16px] text-center"></td> : null}
                </tr>
              </tbody>
            </table>
            <table
              className="table m-0 table-sm d-none"
              id="statsionarreport-table"
            >
              <thead>
                <tr>
                  <th className="border py-1 bg-alotrade text-[16px]">№</th>
                  <th className="border py-1 bg-alotrade text-[16px]">F.I.O</th>
                  <th className="border py-1 bg-alotrade text-[16px]">Tel</th>
                  <th className="border py-1 bg-alotrade text-[16px]">ID</th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    Kelgan
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    Ketgan
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    To'lov summasi
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    To'langan
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">
                    Chegirma
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px]">Qarz</th>
                  {!location.pathname.includes("/alo24/statsionarreport") && (
                    <th className="border py-1 bg-alotrade text-[16px]">
                      To'lov
                    </th>
                  )}

                  <th className="border py-1 bg-alotrade text-[16px]">Chek</th>
                </tr>
              </thead>
              <tbody>
                {connectors.map((connector, key) => {
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
                        {connector?.client?.lastname +
                          " " +
                          connector?.client?.firstname}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        +998{connector?.client?.phone}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.client?.id}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {new Date(connector?.room?.beginday).toDateString()}
                        {" "}
                        {new Date(connector?.room?.beginday).toLocaleTimeString().split(' ')[0]}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.room?.endday &&
                          `${new Date(connector?.room?.endday).toLocaleDateString()} ${new Date(connector?.room?.endday).toLocaleTimeString().split(' ')[0]}`}

                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {getTotalprice(connector)}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector.payments.reduce(
                          (prev, el) => prev + el.payment,
                          0
                        )}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector?.discount?.discount || 0}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {getDebt(connector)}
                      </td>
                      {!location.pathname.includes(
                        "/alo24/statsionarreport"
                      ) && (
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
                                }}
                              >
                                <FontAwesomeIcon icon={faMoneyBill} />
                              </button>
                            )}
                          </td>
                        )}
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
        )}

        {type === "todayPayments" && (
          <div>
            <table className="table m-0 table-sm" id="statsionarreport-table">
              <thead>
                <tr>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    №
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    F.I.O
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    To'lov sanasi
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    Tel
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    ID
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    Jami to'lov
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center">
                    To'langan
                  </th>

                  <th className="border py-1 bg-alotrade text-[16px] text-center align-center">
                    Naqd
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center align-center">
                    Plastik
                  </th>
                  <th className="border py-1 bg-alotrade text-[16px] text-center align-center">
                    O'tkazma
                  </th>
                  {/*{!location.pathname.includes("/alo24/statsionarreport") && (*/}
                  {/*    <th className="border py-1 bg-alotrade text-[16px]">To'lov</th>*/}
                  {/*)}*/}

                  {/*<th className="border py-1 bg-alotrade text-[16px]">Chek</th>*/}
                </tr>
              </thead>

              <tbody>
                {connectors.map((connector, key) => {
                  return (
                    <tr key={key}>
                      <td
                        className={`border py-1 font-weight-bold text-right text-[16px]`}
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
                        <Moment date={connector.createdAt} format={"DD.MM.yyyy HH:mm:ss"} />
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        +998{connector.client.phone}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        {connector.client.id}
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        <Money value={connector.total} />
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        <Money value={connector.totalWhileNow} />
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        <Money value={connector.cash} />
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        <Money value={connector.card} />
                      </td>
                      <td className="border py-1 text-[16px] text-right">
                        <Money value={connector.transfer} />
                      </td>
                    </tr>
                  );
                })}

                <tr>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                    colSpan={2}
                  >
                    Qoldiq:
                  </td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  ></td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  ></td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  ></td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  ></td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  >
                    <Money
                      value={connectors.reduce(
                        (acc, curr) => acc + curr.totalWhileNow,
                        0
                      )}
                    />
                  </td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  >
                    <Money
                      value={connectors.reduce(
                        (acc, curr) => acc + curr.cash,
                        0
                      )}
                    />
                  </td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  >
                    <Money
                      value={connectors.reduce(
                        (acc, curr) => acc + curr.card,
                        0
                      )}
                    />
                  </td>
                  <td
                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                    style={{ maxWidth: "30px !important" }}
                  >
                    <Money
                      value={connectors.reduce(
                        (acc, curr) => acc + curr.transfer,
                        0
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
