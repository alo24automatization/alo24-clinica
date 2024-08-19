import React from 'react';
// import {ExcelUpload} from "./uploadExcel/ExcelUpload";
import { Sort } from "./../components/Sort";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPen, faTable } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from '../components/Pagination';
import { useTranslation } from "react-i18next";

const TableServices = ({
    setVisible,
    searchServiceType,
    updateService,
    servicePlace,
    serviceVisible,
    setService,
    setPageSize,
    searchName,
    searchService,
    services,
    currentServices,
    setCurrentServices,
    setCurrentPage,
    currentPage,
    countPage,
    setModal2,
    loading,
    setImports,
    setModal,
    setRemove,
    serviceTypes,
    setDepartmentName
}) => {
    const {t} = useTranslation()
    return (
        <div className="shadow-lg border-alotrade table-container">
            <div className="table-responsive">
                <table className="table m-0">
                    <thead className="bg-white">
                        <tr>
                            <th>
                                {/* <select
                                    className="form-control form-control-sm selectpicker"
                                    placeholder="Bo'limni tanlang"
                                    onChange={setPageSize}
                                    style={{ minWidth: "50px" }}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select> */}
                            </th>
                            <th>
                                <select
                                    className="form-control form-control-sm selectpicker"
                                    placeholder="Bo'limni tanlang"
                                    onChange={(e) => {
                                        setCurrentServices([...services].filter(s => {
                                            if (e.target.value === 'all') {
                                                setDepartmentName('')
                                                return s
                                            } else {
                                                setDepartmentName(e.target.value)
                                                return s.servicetype._id === e.target.value
                                            }
                                        }))
                                    }}
                                    style={{ minWidth: "100px" }}
                                >
                                    <option value={'all'}>{t("Hammasi")}</option>
                                    {serviceTypes.map(item =>
                                        <option value={item.value}>{item.label}</option>
                                    )}
                                </select>
                            </th>
                            <th>
                                <input
                                    onChange={searchName}
                                    style={{ maxWidth: "100px" }}
                                    type="search"
                                    className="form-control form-control-sm selectpicker inline-block"
                                    placeholder={t("Xizmat nomi")}
                                    aria-controls="basicExample"
                                />
                            </th>
                            <th className="text-center" colSpan={4}>
                                {/* <Pagination
                                    setCurrentDatas={setCurrentServices}
                                    datas={services}
                                    setCurrentPage={setCurrentPage}
                                    countPage={countPage}
                                    totalDatas={services && services.length}
                                /> */}
                                {/*<ExcelUpload setData={setImports} setModal={setModal2} loading={loading}/>*/}
                            </th>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center text-center">№</th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center">
                                {t("Xizmat turi")}
                            </th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center max-w-screen-sm">
                                {t("Xizmat nomi")}
                            </th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center">
                                {t("O'rni")}
                            </th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center">
                                {t("Ko'rinishi")}
                            </th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center">
                                {t("Saqlash")}
                            </th>
                            <th className="border-right text-[14px] bg-alotrade py-2 text-center">
                                {t("Tahrirlash")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentServices && currentServices.map((service, key) => {
                            return (
                                <tr key={key}>
                                    <td className="border-right text-[16px] py-0 font-weight-bold text-center text-sm">
                                        {currentPage * countPage + key + 1}
                                    </td>
                                    <td className="border-right text-[16px] py-0 font-bold text-teal-600">{service?.servicetype?.name}</td>
                                    <td className="border-right text-[16px] py-0">
                                        {service?.name}
                                    </td>
                                    <td className="border-right text-[16px] py-0 text-center">
                                        <input
                                            type="number"
                                            style={{ maxWidth: "50px" }}
                                            defaultValue={service?.place}
                                            className="outline-0 px-1 border max-w-xs text-right"
                                            onChange={(e) => servicePlace(e, key)}
                                        />
                                    </td>
                                    <td className="border-right text-[16px] py-0 text-center">
                                        <div className="custom-control custom-checkbox text-center">
                                            <input
                                                checked={service.visible}
                                                type="checkbox"
                                                className="custom-control-input border border-dager"
                                                id={`service${service?._id}`}
                                                onChange={(e) => serviceVisible(e, key)}
                                            />
                                            <label className="custom-control-label"
                                                htmlFor={`service${service?._id}`}></label>
                                        </div>
                                    </td>
                                    <td className="border-right text-[16px] py-0 text-center">
                                        <button
                                            id={`btn${key}`}
                                            onClick={() => {
                                                updateService(key);
                                            }}
                                            type="button"
                                            className="btn btn-success py-1 px-2 bg-teal-500 hover:bg-teal-600 font-sm"
                                            style={{ fontSize: "75%" }}
                                        >
                                            <FontAwesomeIcon icon={faFloppyDisk} className="text-sm px-3" />
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn text-white py-1 px-2 bg-cyan-600 text-xs px-3 "
                                            style={{ fontSize: "75%" }}
                                            onClick={() => {
                                                setVisible(true)
                                                if (!service.column) {
                                                    setService({ ...service, column: { col1: 'Наименование', col2: 'Результат', col3: 'Норма' } })
                                                } else {
                                                    setService(service)
                                                }
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                        >
                                            <FontAwesomeIcon className='text-[14px]' icon={faPen} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableServices;
