import React from "react";
import { Sort } from "./Sort";
import { Tooltip } from "@chakra-ui/react";
import { ExcelUpload } from "./ExcelUpload";
import { Pagination } from "../../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const TableRooms = ({
  searchType,
  searchNumber,
  rooms,
  setRemove,
  setModal,
  setRoom,
  setCurrentPage,
  countPage,
  currentRooms,
  setCurrentRooms,
  currentPage,
  setPageSize,
  setModal1,
  setImports,
  setModal2,
  loading
}) => {
  const {t} = useTranslation()
  return (
    <div className="border-0 table-container">
      <div className="border-0 table-container">
        <div className="table-responsive">
          <table className="table m-0">
            <thead className="bg-white">
              <tr>
                <th>
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder="Bo'limni tanlang"
                    onChange={setPageSize}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={'all'}>{t("Barchasi")}</option>
                  </select>
                </th>
                <th>
                  <input
                    onChange={searchType}
                    style={{ maxWidth: "100px" }}
                    type="search"
                    className="w-100 form-control form-control-sm selectpicker"
                    placeholder={t("Xizmat turini kiriting")}
                  />
                </th>
                <th>
                  <input
                    onChange={searchNumber}
                    style={{ maxWidth: "100px" }}
                    type="search"
                    className="form-control form-control-sm selectpicker"
                    placeholder={t("Xizmat xonasini kiriting")}
                    aria-controls="basicExample"
                  />
                </th>
                <th colSpan={3}>
                  <Pagination
                    setCurrentDatas={setCurrentRooms}
                    datas={rooms}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={rooms.length}
                  />
                </th>
                <th className="text-center">
                  <ExcelUpload setData={setImports} setModal={setModal2} loading={loading} />
                </th>
                {/* <th>
                  <Tooltip
                    hasArrow
                    label="Barcha xizmatlarni import qilish"
                    bg="blue.400"
                  >
                    <button
                      onClick={() => setModal1(true)}
                      className="btn btn-info py-1 px-3 pt-1 align-middle"
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        style={{ fontSize: "12pt" }}
                        icon={faFileExcel}
                      />
                      Export
                    </button>
                  </Tooltip>
                </th> */}
                <th className="text-center">
                  <Tooltip
                    hasArrow
                    label={t("Barcha xonalarni o'chirish")}
                    bg="red.500"
                  >
                    {loading ?
                      <button className="btn btn-danger" disabled>
                        <span class="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                      :
                      <button
                        onClick={() => setModal1(true)}
                        className="btn btn-danger py-0 px-3 pt-1"
                      >
                        <span className="icon-trash-2"></span>
                      </button>
                    }
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <thead>
              <tr>
                <th className="border-right bg-alotrade text-[16px]">№</th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Xona turi")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Xona raqami")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("O'rin raqami")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Narxi")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Shifokor ulushi")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Hamshira ulushi")}
                </th>
                <th className="border-right bg-alotrade text-[16px]">
                  {t("Holati")}
                </th>
                <th className="border-right text-center bg-alotrade text-[16px]">{t("Tahrirlash")}</th>
                <th className="text-center bg-alotrade text-[16px]">{t("O'chirish")}</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room, key) => {
                return (
                  <tr key={key}>
                    <td className="border-right font-weight-bold text-[16px]">
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border-right text-[16px]">{room.type}</td>
                    <td className="border-right text-[16px]">{room.number}</td>
                    <td className="border-right text-[16px]">{room.place}</td>
                    <td className="border-right text-[16px]">{room.price}</td>
                    <td className="border-right text-[16px]">{room?.doctorProcient}</td>
                    <td className="border-right text-[16px]">{room?.nurseProcient}</td>
                    <td className="border-right text-[16px] text-center">
                      {room.position ? (
                        <FontAwesomeIcon
                          style={{ fontSize: "18pt" }}
                          icon={faBed}
                          className="text-primary"
                        />
                      ) : (
                        <FontAwesomeIcon
                          style={{ fontSize: "14pt" }}
                          className="text-success"
                          icon={faBed}
                        />
                      )}
                    </td>
                    <td className="border-right text-center text-[16px]">
                      <button
                        onClick={() => setRoom(room)}
                        type="button"
                        className="bg-alotrade text-white font-semibold rounded py-1 px-2"
                        style={{ fontSize: "75%" }}
                      >
                        {t("Tahrirlash")}
                      </button>
                    </td>
                    <td className="text-center text-[16px]">
                      <button
                        onClick={() => {
                          setRemove(room);
                          setModal(true);
                        }}
                        type="button"
                        className="bg-red-400 text-white font-semibold rounded py-1 px-2"
                        style={{ fontSize: "75%" }}
                      >
                        {t("O'chirish")}
                      </button>
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
