import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faPlus,
  faSearch,
  faRotate,
  faSquare,
  faPenSquare,
  faPenToSquare,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../context/AuthContext";

export const TableClients = ({
  baseUrl,
  setVisible,
  setCheck,
  setModal1,
  modal,
  changeStart,
  setIsNewClient,
  isNewClient,
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
  counterdoctors,
  loading,
  getConnectorsByClientBorn,
  setClientDate,
  setIsAddConnector,
  getClientsById,
  setPrintBody,
  handlePrint,
  allModalHandle,
  getByClientName,
  getByClientPhone,
  setIsAddService,
  setSelectedCounterDoctor,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [clientBorn, setClientBorn] = useState("");
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
                onKeyDown={(e) => e.key === "Enter" && getByClientName()}
              />
            </div>
            <div>
              <input
                onChange={searchPhone}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("Tel")}
                onKeyDown={(e) => e.key === "Enter" && getByClientPhone()}
              />
            </div>
            <div>
              <input
                onChange={searchId}
                style={{ maxWidth: "80px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
                onKeyDown={(e) => e.key === "Enter" && getClientsById()}
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
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ cursor: "pointer" }}
                />
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
          </div>
          <table className="table m-0">
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
                  {t("Summa")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Xizmatlar")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Kelgan vaqti")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]"></th>
                <th className="border py-1 bg-alotrade text-[16px]"></th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qo'shish")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Chop etish")}
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
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {connector?.client?.lastname +
                        " " +
                        connector?.client?.firstname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      +998{connector?.client?.phone}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.client?.id}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.probirka}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.totalprice}
                    </td>
                    <td className="border py-1 text-right text-[16px] font-bold">
                      <button
                        onClick={() => {
                          allModalHandle(
                            connector.services,
                            connector,
                            connector.client
                          );
                        }}
                      >
                        <span
                          className={`${
                            connector.services.filter(
                              (service) => !service.refuse
                            ).length ===
                            connector.services.filter(
                              (service) => service.accept
                            ).length
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {
                            connector.services.filter(
                              (service) => !service.refuse
                            ).length
                          }
                        </span>{" "}
                        /{" "}
                        <span className="text-green-400">
                          {
                            connector.services.filter(
                              (service) => service.accept
                            ).length
                          }
                        </span>
                      </button>
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(connector?.createdAt).toLocaleDateString()}{" "}
                      {new Date(connector?.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-success py-0"
                          onClick={() => {
                            history.push("alo24/statsionar", {
                              client: { ...connector.client },
                              services: [...connector.services],
                              connector: {
                                _id: connector._id,
                                probirka: connector?.probirka,
                                accept: connector?.accept,
                              },
                            });
                          }}
                        >
                          {t("Statsionar")}
                        </button>
                      )}
                    </td>
                    <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className={`bg-orange-500 border-orange-500 hover:bg-green-400 btn btn-success py-0`}
                          onClick={() => {
                            setClient({ ...connector.client });
                            if (auth.clinica.connectorDoctor_client) {
                              if (connector.services[0]?.counterdoctor) {
                                const { firstname, lastname } =
                                  connector.services[0].counterdoctor;
                                  
                                setSelectedCounterDoctor({
                                  value:
                                    connector.services[0].counterdoctor._id,
                                  label: firstname + " " + lastname,
                                });
                              }
                            }
                   
                            setClientDate(connector.client?.born?.slice(0, 10));
                            setIsAddConnector(true);
                            setVisible(true);
                            const hasCardNumber =
                              connector.client.card_number === null;
                            setIsNewClient(hasCardNumber);
                          }}
                        >
                          <FontAwesomeIcon icon={faRotate} />
                        </button>
                      )}
                    </td>
                    <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-success" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className={`bg-green-500 border-green-500 hover:bg-green-400 btn btn-success py-0`}
                          onClick={() => {
                            const hasCardNumber =
                              connector.client.card_number === null;
                            setIsNewClient(hasCardNumber);
                            setClient({ ...connector.client });
                            setClientDate(
                              connector?.client?.born?.slice(0, 10)
                            );
                            setConnector({
                              ...connector,
                              _id: connector._id,
                              services: [...connector.services],
                            });
                            if (auth.clinica.connectorDoctor_client) {
                              if (connector.services[0]?.counterdoctor) {
                                const { firstname, lastname } =
                                  connector.services[0].counterdoctor;
                                setSelectedCounterDoctor({
                                  value:
                                    connector.services[0].counterdoctor._id,
                                  label: firstname + " " + lastname,
                                });
                              }
                            }
                            setIsAddConnector(false);
                            setVisible(true);
                            setIsAddService(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faUserPen} />
                        </button>
                      )}
                    </td>
                    <td className="border py-1 text-center text-[16px]">
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
      </div>
    </div>
  );
};
