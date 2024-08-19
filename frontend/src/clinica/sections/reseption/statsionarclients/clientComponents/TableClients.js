import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import { useTranslation } from "react-i18next";

export const TableClients = ({
  setVisible,
  setModal1,
  setCheck,
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
  setPostRoomBody,
  setModal2,
  searchBornDay,
  searchFinished,
  searchDoctor,
  setRoom,
  setDoctorSelect,
  setRoomSelect,
}) => {
  const { t } = useTranslation();
  return (
    <div className="border-0 shadow-lg table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <div className="bg-white flex items-center justify-between gap-2 p-2">
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
                onChange={searchBornDay}
                style={{ maxWidth: "100px", minWidth: "100px" }}
                type="search"
                className="w-100 form-control form-control-sm selectpicker"
                placeholder={t("Tug'ilgan yili")}
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
                style={{ maxWidth: "60px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("ID")}
              />
            </div>
            <div>
              <input
                onChange={searchDoctor}
                style={{ maxWidth: "100px" }}
                type="search"
                className="form-control form-control-sm selectpicker"
                placeholder={t("Shifokor")}
              />
            </div>
            <div className="text-center">
              <Pagination
                setCurrentDatas={setCurrentConnectors}
                datas={connectors}
                setCurrentPage={setCurrentPage}
                countPage={countPage}
                totalDatas={connectors.length}
              />
            </div>
            <div
              className="text-center"
              style={{ maxWidth: "120px", overflow: "hidden" }}
            >
              <DatePickers changeDate={changeStart} />
            </div>
            <div
              className="text-center"
              style={{ maxWidth: "120px", overflow: "hidden" }}
            >
              <DatePickers changeDate={changeEnd} />
            </div>
            <div className="text-center" style={{ maxWidth: "120px" }}>
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Doctors"
                onChange={searchFinished}
              >
                <option value={"today"}>{t("Bugun")}</option>
                <option value={"done"}>{t("Yakunlangan")}</option>
                <option value={"continue"}>{t("Davolanishda")}</option>
              </select>
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
                  {t("Tug'ilgan yili")}
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
                  {t("Shikokor")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Kelgan vaqti")}
                </th>
                <th className="border py-1 bg-alotrade text-[16px]">
                  {t("Qo'shish")}
                </th>
                {/* <th className="border py-1 bg-alotrade text-[16px] text-center">{t("Chek")}</th> */}
                <th className="border py-1 bg-alotrade text-[16px] text-center">
                  {t("Tugatish")}
                </th>
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
                      {connector.client.fullname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(connector.client.born).toLocaleDateString()}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      +998{connector.client.phone}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector.client.id}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.dailys[0]?.probirka}
                    </td>
                    <td className="border py-1 text-[16px]">
                      {connector?.doctor?.lastname +
                        " " +
                        connector?.doctor?.firstname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {connector?.room?.beginday &&
                        new Date(
                          connector.room.beginday
                        ).toLocaleDateString()}{" "}
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
                            setClient(connector.client);
                            setConnector({
                              ...connector,
                              _id: connector._id,
                              services: [...connector.services],
                            });
                            setVisible(true);
                            setRoom(connector.room);
                            setDoctorSelect({
                              ...connector.doctor,
                              label:
                                connector?.doctor?.firstname +
                                " " +
                                connector?.doctor?.lastname,
                              value: connector?.doctor?._id,
                            });
                            setRoomSelect({
                              ...connector?.room,
                              value: connector?.room?._id,
                              label:
                                connector?.room?.room?.type +
                                " " +
                                connector?.room?.room?.number +
                                " xona " +
                                connector?.room?.room?.place +
                                " o'rin",
                            });
                          }}
                        >
                          +
                        </button>
                      )}
                    </td>

                    {/* <td className="border py-1 text-center text-[16px]">
                      {loading ? (
                        <button className="btn btn-primary" disabled>
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
                    </td> */}
                    <td className="border py-1 text-center text-[16px]">
                      {connector?.room?.endday ? (
                        t("Yakunlangan")
                      ) : loading ? (
                        <button className="btn btn-danger" disabled>
                          <span className="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger py-0"
                          onClick={() => {
                            setPostRoomBody(connector.room);
                            setModal2(true);
                          }}
                        >
                          {t("Tugatish")}
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
