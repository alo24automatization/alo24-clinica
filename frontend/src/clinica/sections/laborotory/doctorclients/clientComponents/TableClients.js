import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faAngleDown,
  faPenAlt,
  faPrint,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "../../components/Pagination";
import { DatePickers } from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useHistory } from "react-router-dom";
import { Modal } from "../../../reseption/components/Modal";
import { useTranslation } from "react-i18next";

export const TableClients = ({
  changeStart,
  changeEnd,
  searchId,
  searchFullname,
  doctorClients,
  setCurrentPage,
  countPage,
  currentDoctorClients,
  setCurrentDoctorClients,
  currentPage,
  setPageSize,
  loading,
  handlePrint,
  getDoctorClientsByClientBorn,
  searchProbirka,
  changeAccept,
  getDoctorClientsByName,
  getDoctorClientsId,
  handleSendMessage
}) => {

  const { t } = useTranslation()

  const history = useHistory()
  const [clientBorn, setClientBorn] = useState('')

  const [modal, setModal] = useState(false)
  const [debt, setDebt] = useState(0)

  const isDebt = (payments) => {
    const debt = payments.reduce((prev, item) => prev + item.debt, 0)
    if (debt > 0) {
      return 'bg-red-400'
    } else {
      return ""
    }
  }

  return (
    <div className="shadow-lg border-alotrade table-container">
      <div className="table-responsive">
        <div className="bg-white flex gap-6 items-center py-2 px-2">
          <div>
            <select
              className="form-control form-control-sm selectpicker text-[16px]"
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
              className="w-100 form-control form-control-sm selectpicker text-[16px]"
              placeholder={t("F.I.O")}
              onKeyDown={(e) => e.key === 'Enter' && getDoctorClientsByName()}
            />
          </div>
          <div>
            <input
              onChange={searchId}
              style={{ maxWidth: "60px" }}
              type="search"
              className="form-control form-control-sm selectpicker text-[16px]"
              placeholder={t("ID")}
              onKeyDown={(e) => e.key === 'Enter' && getDoctorClientsId()}
            />
          </div>
          <div>
            <input
              onChange={searchProbirka}
              style={{ maxWidth: "60px" }}
              type="probirka"
              className="form-control form-control-sm selectpicker text-[16px]"
              placeholder={t("Probirka")}
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              onKeyDown={(e) => e.key === 'Enter' && getDoctorClientsByClientBorn(e.target.value)}
              type="date"
              name="born"
              onChange={(e) => setClientBorn(e.target.value)}
              className="form-control inp"
              placeholder=""
              style={{ color: '#999' }}
            />
            <button onClick={() => getDoctorClientsByClientBorn(clientBorn)}>
              <FontAwesomeIcon
                icon={faSearch}
                style={{ cursor: "pointer" }}
              />
            </button>
          </div>
          <div className="text-center ml-auto">
            <Pagination
              setCurrentDatas={setCurrentDoctorClients}
              datas={doctorClients}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              totalDatas={doctorClients.length}
            />
          </div>
          <div
            className="flex items-center gap-2 justify-center ml-auto"
            style={{ maxWidth: "200px", overflow: "hidden" }}
          >
            <DatePickers changeDate={changeStart} />
            <DatePickers changeDate={changeEnd} />
          </div>
          <div className="texte-center">
            <div className="btn bg-green-500 text-white font-bold">
              <ReactHTMLTableToExcel
                id="reacthtmltoexcel"
                table="discount-table"
                sheet="Sheet"
                buttonText="Excel"
                filename="Chegirma"
              />
            </div>
          </div>
          {/* <div
              className="text-center"
              style={{ maxWidth: "200px" }}
            >
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Mijozalar"
                onChange={changeAccept}
                defaultValue={'not'}
              >
                <option value="all">{t("Xammasi")}</option>
                <option value="accept">{t("Tasdiqlangan")}</option>
                <option value="not">{t("Tasdiqlanmagan")}</option>
              </select>
          </div> */}
        </div>
        <table className="table m-0" id="discount-table">
          <thead>
            <tr>
              <th className="border bg-alotrade py-1 text-[14px]">№</th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Xizmatlar")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("F.I.O")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Tug'ilgan yili")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Telefon raqami")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("ID")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Probirka")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Kelgan vaqti")}
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                Sms
              </th>
              <th className="border bg-alotrade py-1 text-[14px]">
                {t("Qabul")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDoctorClients.map((connector, key) => {
              return (
                <tr key={key}>
                  <td
                    className={`${isDebt(connector.payments)} border text-[16px] py-1 font-weight-bold text-right`}
                    style={{ maxWidth: "30px !important" }}
                    onClick={() => {
                      const debt = connector.payments.reduce((prev, item) => prev + item.debt, 0)
                      if (debt > 0) {
                        setDebt(debt)
                        setModal(true)
                      }
                    }}
                  >
                    {currentPage * countPage + key + 1}
                  </td>
                  <td
                    className="border py-1 font-weight-bold text-right text-[18px]"
                  >
                    {connector.services.length}/{connector.services.filter(el => el.accept).length}
                  </td>
                  <td className="border py-1 font-weight-bold text-[16px]">
                    {connector.client.firstname} {connector.client.lastname}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    {new Date(connector.client.born).toLocaleDateString()}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    {connector.client.phone}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    {connector.client.id}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    {connector?.connector?.probirka || (connector?.connector?.dailys && connector?.connector?.dailys[0]?.probirka)}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    {new Date(connector.connector.createdAt).toLocaleDateString()} {new Date(connector.connector.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="border py-1 text-right text-[16px]">
                    <div className="custom-control custom-checkbox text-center">
                      <input
                        checked={connector.connector.isSended}
                        type="checkbox"
                        className="custom-control-input border border-dager"
                        id={`${connector.connector._id}`}
                        onChange={(e) => handleSendMessage(connector.connector._id, connector.client.id)}
                      />
                      <label className="custom-control-label"
                        htmlFor={`${connector.connector._id}`}></label>
                    </div>
                  </td>
                  <td className="border py-1 text-center">
                    {loading ? (
                      <button className="btn btn-success" disabled>
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          history.push("/alo24/adoption", { ...connector })
                        }
                        className="bg-orange-400 btn text-white py-0"
                      >
                        <FontAwesomeIcon icon={faPenAlt} />
                      </button>
                    )}
                    {loading ? (
                      <button className="ml-2 btn btn-success" disabled>
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handlePrint(connector)
                        }
                        className="ml-2 btn btn-success py-0"
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
      <Modal
        modal={modal}
        text={""}
        setModal={setModal}
        basic={debt}
      />
    </div>
  );
};
