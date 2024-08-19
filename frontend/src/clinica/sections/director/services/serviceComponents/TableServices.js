import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Sort } from "./Sort";
import { Tooltip } from "@chakra-ui/react";
import { ExcelUpload } from "./ExcelUpload";
import { Pagination } from "../../components/Pagination";
import { useTranslation } from "react-i18next";

export const TableServices = ({
  servicetypes,
  searchDepartment,
  searchName,
  services,
  setRemove,
  setModal,
  setServices,
  setService,
  setCurrentPage,
  countPage,
  setCountPage,
  currentServices,
  setCurrentServices,
  currentPage,
  setPageSize,
  departments,
  setModal1,
  setImports,
  setModal2,
  loading,
  servicetypesSelect,
  searchServiceType,
}) => {

  const { t } = useTranslation()

  const edit = (e, service) => {
    setService(service);
    const index = departments.findIndex(
      (d) => service.department._id === d._id
    );
    document.getElementsByTagName("select")[0].selectedIndex = index + 1;

    const i = departments[index].servicetypes.findIndex(
      (d) => service.servicetype && service.servicetype._id === d._id
    );

    document.getElementsByTagName("select")[1].selectedIndex = i + 1;
    // Xatolik bor birinchi mareta tahrirlash bosilganda xizmat turi tanlay olinmaydi
  };
  return (
    <div className="border-0 table-container">
      <div className="border-0 table-container">
        <div className="table-responsive ">
          <table className="table">
            <thead>
              <tr className="bg-white">
                <th className="text-[16px]">
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder={t("Bo'limni tanlang")}
                    onChange={setPageSize}
                    style={{ minWidth: "50px" }}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={'all'}>{t("Barchasi")}</option>
                  </select>
                </th>
                <th className="text-[16px]">
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder={t("Bo'limni tanlang")}
                    onChange={searchDepartment}
                    style={{ minWidth: "50px" }}
                  >
                    <option value='none'>{t("Hammasi")}</option>
                    {departments.length > 0 && departments.map((d, ind) =>
                      <option value={d._id} key={ind}>{d.name}</option>
                    )}
                  </select>
                </th>
                <th className="text-[16px]">
                  <select
                    className="form-control form-control-sm selectpicker"
                    placeholder={t("Xizmat turini tanlang")}
                    onChange={searchServiceType}
                    style={{ minWidth: "50px" }}
                  >
                    <option value='none'>{t("Hammasi")}</option>
                    {servicetypesSelect.length > 0 && servicetypesSelect.map((d, ind) =>
                      <option value={d._id} key={ind}>{d.name}</option>
                    )}
                  </select>
                </th>
                <th className="text-[16px]">
                  <input
                    style={{ minWidth: "70px" }}
                    onChange={searchName}
                    type="text"
                    className="form-control w-75"
                    placeholder={t("Xizmat nomini kiriting")}
                  />
                </th>
                <th colSpan={4} className="text-[16px]">
                  <Pagination
                    setCurrentDatas={setCurrentServices}
                    datas={services}
                    setCurrentPage={setCurrentPage}
                    countPage={countPage}
                    totalDatas={services.length}
                  />
                </th>
                <th className="text-center text-[16px]">
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
                    label={t("Barcha xizmatlarni o'chirish")}
                    bg="red.500"
                  >
                    {loading ? <button className='btn btn-danger' disabled>
                      <span class="spinner-border spinner-border-sm"></span>
                      Loading...
                    </button> :
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
              <tr>
                <th className="border-right  text-[12px] bg-alotrade">№</th>
                <th className="border-right  text-[12px] bg-alotrade">
                  {t("Bo'lim")}
                </th>
                <th className="border-right  text-[12px] bg-alotrade">
                  {t("Xizmat turi")}
                </th>
                <th className="border-right  text-[12px] bg-alotrade">
                  {t("Xizmat")}
                </th>
                {/* <th className="border-right text-[12px] bg-alotrade">
                  {t("Qisqartma nomi")}
                </th> */}
                {/* <th className="border-right text-[12px] bg-alotrade">
                  {t("Xizmat xonasi")}
                </th> */}
                <th className="border-right text-[12px] bg-alotrade">
                  {t("Narxi")}
                </th>
                <th className="border-right text-[12px] bg-alotrade ">
                  {t("Doktor ulushi")}
                </th>
                <th className="border-right text-[12px] bg-alotrade ">
                  {t("Kontragent ulushi")}
                </th>
                <th className="border-right text-[12px] bg-alotrade ">
                  {t("Kounterdoktor ulushi")}
                </th>
                <th className="border-right text-center text-[12px] bg-alotrade">{t("Tahrirlash")}</th>
                <th className="text-center text-[12px] bg-alotrade">{t("O'chirish")}</th>
              </tr>
            </thead>
            <tbody>
              {currentServices.map((service, key) => {
                return (
                  <tr key={key}>
                    <td className="border-right text-[16px] f ont-weight-bold">
                      {currentPage * countPage + key + 1}
                    </td>
                    <td className="border-right text-[16px]">{service.department.name}</td>
                    <td className="border-right text-[16px]">
                      {service.servicetype && service.servicetype.name}
                    </td>
                    <td className="border-right text-[16px]">{service.name}</td>
                    {/* <td className="border-right text-[16px]">{service.shortname}</td> */}
                    {/* <td className="border-right text-[16px]">{service?.serviceroom}</td> */}
                    <td className="border-right text-[16px]">{service.price}</td>
                    <td className="border-right text-[16px] ">{service.doctorProcient}</td>
                    <td className="border-right text-[16px]">
                      {service.counterAgentProcient}
                    </td>
                    <td className="border-right text-[16px]">
                      {service.counterDoctorProcient}
                    </td>
                    <td className="border-right text-[16px] text-center">
                      <button
                        id={`btn${key}`}
                        onClick={(e) => {
                          edit(e, service);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        type="button"
                        className="text-white font-semibold bg-alotrade rounded py-1 px-2"
                        style={{ fontSize: "75%" }}
                      >
                        {t("Tahrirlash")}
                      </button>
                    </td>
                    <td className="text-center text-[16px]">
                      <button
                        onClick={() => {
                          setRemove(service);
                          setModal(true);
                        }}
                        type="button"
                        className="text-white font-semibold bg-red-400 rounded-lg py-1 px-2"
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
