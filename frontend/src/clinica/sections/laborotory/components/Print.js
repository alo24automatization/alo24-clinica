import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';


const Print = ({ client, connector, sections, baseUrl, clinica, user, qr }) => {
    const location = useLocation()
    const { t } = useTranslation()
    const auth = useContext(AuthContext)
    const [printSections, setPrintSections] = useState([])


    useEffect(() => {
        if (location.pathname.includes('alo24/adoption')) {
            setPrintSections([...sections])
        } else {
            const servicetypesAll = sections.reduce((prev, el) => {
                if (!prev.includes(el.serviceid.servicetype.name)) {
                    prev.push(el.serviceid.servicetype.name)
                }
                return prev;
            }, [])

            let servicetypes = []
            for (const type of servicetypesAll) {
                sections.map((service) => {
                    if (service.column && service.tables.length > 0) {
                        if (service.serviceid.servicetype.name === type && service.tables.length <= 2) {
                            const cols = Object.keys(service.column).filter(c => c.includes('col') && service.column[c]).length;
                            const isExist = servicetypes.findIndex(i => i.servicetype === type && i.cols === cols)
                            if (isExist >= 0) {
                                servicetypes[isExist].services.push(service);
                            } else {
                                servicetypes.push({
                                    column: service.column,
                                    servicetype: type,
                                    services: [service],
                                    cols: cols
                                })
                            }
                        }
                    }
                    return service;
                })
            }
            const servicesmore = [...servicetypesAll].reduce((prev, el) => {
                sections.map((service) => {
                    if (service.serviceid.servicetype.name === el && service.tables.length > 2) {
                        prev.push({
                            column: service.column,
                            servicetype: service.service.name,
                            services: [service]
                        })
                    }
                    return service;
                })
                return prev;
            }, [])

            setPrintSections([...servicetypes, ...servicesmore])
        }
    }, [sections, location])

    return (
        <div className="px-2 pt-4 bg-white">
            <div>
                {clinica?.ifud1 && <div className="row" style={{ fontSize: "10pt" }}>
                    <div
                        className="col-4"
                        style={{ border: "1px solid", textAlign: "center" }}
                    >
                        <p className="pt-2">
                            {clinica?.ifud1}
                        </p>
                    </div>
                    <div
                        className="col-4"
                        style={{
                            border: "1px solid",
                            textAlign: "center",
                            borderLeft: "none",
                        }}
                    >
                        <p className="pt-2">{t("IFUD")}: {clinica?.ifud2}</p>
                    </div>
                    <div
                        className="col-4"
                        style={{
                            border: "1px solid",
                            textAlign: "center",
                            borderLeft: "none",
                        }}
                    >
                        <p style={{ margin: "0" }}>
                            {clinica?.ifud3}
                        </p>
                    </div>
                </div>}
                <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "10px" }}>
                    {
                        auth?.clinica?.blanka ? <div className="py-2 px-[12px] w-full">
                            <img src={baseUrl + "/api/upload/file/" + auth?.clinica?.blanka} className="w-full h-[4cm]" />
                        </div>
                            :
                            <>
                                <div className="" style={{ textAlign: "center" }}>
                                    <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                        {clinica?.name}
                                    </pre>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <img style={{ width: "150px" }} src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
                                </div>
                                <div className="" style={{ textAlign: "center" }}>
                                    <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                        {clinica?.name2}
                                    </pre>
                                </div>
                                <div className="" style={{ textAlign: "center" }}>
                                    <p className="text-end m-0">
                                        <img width="100" src={qr && qr} alt="QR" />
                                    </p>
                                </div>
                            </>
                    }
                </div>
                <div className="">
                    <div className="" style={{ padding: "0" }}>
                        <table
                            style={{
                                width: "100%",
                                border: "2px solid",
                                borderTop: "3px solid",
                            }}
                        >
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("Mijozning F.I.SH")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    <h4 className='text-[20px]'>
                                        {client && client.lastname + " " + client.firstname}
                                    </h4>
                                </td>
                                <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                    <p className="fw-bold text-[18px] m-0">
                                        {t("TEKSHIRUV")} <br /> {t("NATIJALARI")}
                                    </p>
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("Tug'ilgan yili")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && new Date(client.born).toLocaleDateString()}
                                </td>
                            </tr>
                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("Kelgan sanasi")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector &&
                                        new Date(connector.createdAt).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("Namuna")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {connector && connector.probirka}
                                </td>
                            </tr>

                            <tr style={{ textAlign: "center" }}>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("Manzil")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "33%",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && client.address}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "200px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("ID")}
                                </td>
                                <td
                                    className="p-0"
                                    style={{
                                        width: "200px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                        fontSize: "20px",
                                    }}
                                >
                                    {client && client.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                    <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                    <span className="text-[14px] font-bold">{clinica?.license}</span>
                </div>
                <div className="mt-2 mb-1 flex justify-between items-center">
                    <span className="text-[20px] font-bold">{user?.signature}</span>
                </div>
                <div className="my-2 w-full border-2 border-black-800"></div>
            </div>
            <div className="pt-2 w-full text-center mr-6">
                {printSections.length > 0 &&
                    printSections.map((section, index) => section.services.some(s => s.tables.some(t => t.accept)) && (
                        <div key={index} className={"w-full text-center mb-1"}>
                            <div className="w-full flex justify-center items-center mb-1">
                                <h2 className="block text-[20px] font-bold">
                                    {section?.servicetype}
                                </h2>
                            </div>
                            <table className="w-full text-center">
                                <thead>
                                    <tr>
                                        <th className="border-[1px] border-black bg-gray-400 text-[18px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                        {section?.column?.col2 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                        {section?.column?.col3 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                        {section?.column?.col4 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                        {section?.column?.col5 && <th className="text-[18px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {section?.services && section?.services.map((service, ind) => {
                                        return service.tables.map((table, key) => table.accept && (
                                            <tr key={key} >
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}> <pre
                                                    style={{ fontFamily: "sans-serif" }}
                                                    className="border-none outline-none text-left"
                                                >
                                                    {table?.col1}
                                                </pre> </td>
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col2}
                                                    </pre>
                                                </td>
                                                <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col3}
                                                    </pre>
                                                </td>
                                                {section?.column?.col4 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col4}
                                                    </pre></td>}
                                                {section?.column?.col5 && <td className={`border-[1px] text-[16px] border-black py-1 px-[12px]`}>
                                                    <pre
                                                        style={{ fontFamily: "sans-serif" }}
                                                        className="border-none outline-none"
                                                    >
                                                        {table?.col5}
                                                    </pre></td>}
                                            </tr>
                                        ))
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))}
                {printSections.map((section => <div className='py-[20px]'>
                    <div className="">
                        {section.services.map(service => service.files && service.files.map((file) => <div className="">
                            <img className='h-[39cm]' src={file} alt='file' />
                        </div>))}
                    </div>
                </div>))}
            </div>
        </div>
    )
}

export default Print