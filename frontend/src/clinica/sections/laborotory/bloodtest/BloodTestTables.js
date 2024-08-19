import { faAngleDown, faAngleUp, faCheck, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useTranslation } from 'react-i18next';
import { Pagination } from '../components/Pagination';
import { DatePickers } from '../doctorclients/clientComponents/DatePickers';

const BloodTestTables = ({
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
    handleApprove
}) => {
    const {t} = useTranslation()
    return (
        <div className="shadow-lg border-alotrade table-container">
            <div className="table-responsive">
                <table className="table m-0" id="discount-table">
                    <thead className="bg-white">
                        <tr>
                            <th>
                                <select
                                    className="form-control form-control-sm selectpicker text-[14px]"
                                    placeholder="Bo'limni tanlang"
                                    onChange={setPageSize}
                                    style={{ minWidth: "50px" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </th>
                            <th>
                                <input
                                    onChange={searchFullname}
                                    style={{ maxWidth: "100px", minWidth: "100px" }}
                                    type="search"
                                    className="w-100 text-[14px] form-control form-control-sm selectpicker"
                                    placeholder={t("F.I.O")}
                                />
                            </th>
                            <th>
                                <input
                                    onChange={searchId}
                                    style={{ maxWidth: "60px" }}
                                    type="search"
                                    className="form-control text-[14px] form-control-sm selectpicker"
                                    placeholder={t("ID")}
                                />
                            </th>
                            <th className="text-center text-[14px]">
                                <Pagination
                                    setCurrentDatas={setCurrentDoctorClients}
                                    datas={doctorClients}
                                    setCurrentPage={setCurrentPage}
                                    countPage={countPage}
                                    totalDatas={doctorClients.length}
                                />
                            </th>
                            <th
                                className="flex items-center gap-2 justify-center"
                                style={{ maxWidth: "200px", overflow: "hidden" }}
                            >
                                <DatePickers changeDate={changeStart} />
                                <DatePickers changeDate={changeEnd} />
                            </th>
                            <th className="texte-center">
                                <div className="btn bg-green-400 text-white">
                                    <ReactHtmlTableToExcel
                                        id="reacthtmltoexcel"
                                        table="discount-table"
                                        sheet="Sheet"
                                        buttonText="Excel"
                                        filename="Chegirma"
                                    />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th className="border text-[14px] bg-alotrade py-1">№</th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("F.I.O")}
                            </th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("ID")}
                            </th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("Probirka")}
                            </th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("Telefon raqami")}
                            </th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("Tug'ilgan yili")}
                            </th>
                            <th className="border text-[14px] bg-alotrade py-1">
                                {t("Qabul")}
                            </th>
                        </tr>
                    </thead>
                    {currentDoctorClients.length > 0 && <tbody>
                        {currentDoctorClients.map((connector, key) => {
                            return (
                                <tr key={key}>
                                    <td
                                        className="border text-[16px] py-1 font-weight-bold text-right"
                                        style={{ maxWidth: "30px !important" }}
                                    >
                                        {currentPage * countPage + key + 1}
                                    </td>
                                    <td className="border text-[16px] py-1 font-weight-bold">
                                        {connector.client.firstname} {connector.client.lastname}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector.client.id}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector?.connector?.probirka}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector.client.phone}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {new Date(connector.client.born).toLocaleDateString()}
                                    </td>
                                    <td className="border text-[16px] py-1 text-center">
                                        {connector.connector.accept ? <span className='font-bold w-full text-green-400' ><FontAwesomeIcon className='font-bold text-[18px]' icon={faCheck} /> {t("Qabul qilingan")} </span> : <button
                                            onClick={() =>
                                                handleApprove(connector)
                                            }
                                            className="px-4 btn btn-success rounded-xl"
                                        >
                                            {t("Qabul qilish")}
                                        </button>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>}
                </table>
            </div>
        </div>)
}

export default BloodTestTables