import React from 'react';
import { Pagination } from "../../director/components/Pagination";
import { ExcelUpload } from "./uploadExcel/ExcelUpload";
import { Sort } from "./../components/Sort";
import parse from "html-react-parser"
import { useTranslation } from 'react-i18next';

const TableTemplate = ({
    setTemplate,
    setPageSize,
    searchName,
    searchTemplate,
    templates,
    currentTemplates,
    setCurrentTemplates,
    setCurrentPage,
    currentPage,
    countPage,
    setModal2,
    loading,
    setImports,
    setModal,
    setRemove
}) => {

    const {t} = useTranslation()

    return (
        <div className="border-0 shadow-lg table-container">
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
                                        onChange={searchName}
                                        style={{ maxWidth: "100px", minWidth: "100px" }}
                                        type="search"
                                        className="w-100 form-control form-control-sm selectpicker"
                                        placeholder=""
                                    />
                                </th>
                                <th colSpan={2}>
                                    <input
                                        onChange={searchTemplate}
                                        style={{ maxWidth: "100px" }}
                                        type="search"
                                        className="form-control form-control-sm selectpicker inline-block"
                                        placeholder=""
                                        aria-controls="basicExample"
                                    />
                                    <Pagination
                                        setCurrentDatas={setCurrentTemplates}
                                        datas={templates}
                                        setCurrentPage={setCurrentPage}
                                        countPage={countPage}
                                        totalDatas={templates && templates.length}
                                    />
                                </th>
                                <th className="text-center">
                                    <ExcelUpload setData={setImports} setModal={setModal2} loading={loading} />
                                </th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th className="border-right bg-alotrade text-[16px] text-center">№</th>
                                <th className="border-right bg-alotrade text-[16px]">
                                    {t("Nomi")}
                                </th>
                                <th className="border-right bg-alotrade text-[16px] max-w-screen-sm">
                                    {t("Shablon")}
                                </th>
                                <th className="border-right bg-alotrade text-[16px]">
                                    {t("Tahrirlash")}
                                </th>
                                <th className="border-right bg-alotrade text-[16px]">
                                    {t("O'chirish")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTemplates && currentTemplates.map((template, key) => {
                                return (
                                    <tr key={key}>
                                        <td className="border-right text-[16px] font-weight-bold text-center text-sm">
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border-right text-[16px] font-bold text-teal-600">{template.name}</td>
                                        <td className="border-right text-[16px] overflow-auto h-[150px]">
                                            {parse(template.template)}
                                        </td>
                                        <td className="border-right text-[16px] text-center">
                                            <button
                                                id={`btn${key}`}
                                                onClick={() => {
                                                    setTemplate(template);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                type="button"
                                                className="py-1 px-2 bg-alotrade font-semibold text-white rounded"
                                                style={{ fontSize: "75%" }}
                                            >
                                                {t("Tahrirlash")}
                                            </button>
                                        </td>
                                        <td className="text-center text-[16px]">
                                            <button
                                                onClick={() => {
                                                    setRemove(template);
                                                    setModal(true);
                                                }}
                                                type="button"
                                                className="py-1 px-2 bg-red-500 font-semibold text-white rounded"
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

export default TableTemplate;
