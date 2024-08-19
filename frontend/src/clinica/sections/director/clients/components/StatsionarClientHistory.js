import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import QRCode from "qrcode"
import ReactHtmlParser from 'react-html-parser'
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const StatsionarClientHistory = () => {

    const {connector, clinica, baseUrl, user} = useLocation().state

    const {t} = useTranslation()

    const [doctorServices, setDoctorServices] = useState([])
    const [labServices, setLabServices] = useState([])

    useEffect(() => {
        setDoctorServices([...connector.services].filter(service => service.department.probirka === false));
        const servicetypesAll = connector.services.reduce((prev, el) => {
            if (!prev.includes(el.serviceid.servicetype.name)) {
              prev.push(el.serviceid.servicetype.name)
            }
            return prev;
          }, [])
          let servicetypes = []
          for (const type of servicetypesAll) {
            connector.services.map((service) => {
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
            connector.services.map((service) => {
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
          setLabServices([...servicetypes, ...servicesmore])
    }, [connector]);
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const [qr, setQr] = useState()

    useEffect(() => {
        if (connector && baseUrl) {
            QRCode.toDataURL(`${baseUrl}/clienthistory/laboratory/${connector?.connector?._id}`)
                .then(data => {
                    setQr(data)
                })
        }
    }, [connector, baseUrl])

    return <>
            <div className="container p-4">
                {clinica?.ifud1 && <div className="row" style={{ marginTop: '10px', fontSize: "10pt" }}>
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
                        <p className="pt-2">{clinica?.ifud2}</p>
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
                <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "30px" }}>
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
                                        {connector?.client && connector?.client.lastname + " " + connector?.client.firstname}
                                    </h4>
                                </td>
                                <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                    <p className="fw-bold fs-5 m-0">
                                        {t("TAHLIL")} <br /> {t("NATIJALARI")}
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
                                    {connector?.client && new Date(connector?.client.born).toLocaleDateString()}
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
                                    {connector.clientsType === 'offline' ?
                                        new Date(connector?.connector?.createdAt).toLocaleDateString() :
                                        new Date(connector?.connector?.room?.beginday).toLocaleDateString()}
                                </td>
                                <td
                                    className="p-0 fw-bold"
                                    style={{
                                        width: "100px",
                                        backgroundColor: "white",
                                        border: "1px solid #000",
                                    }}
                                >
                                    {t("NAMUNA")}
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
                                    {connector?.client && connector?.client.address}
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
                                    {connector?.client && connector?.client?.id}
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                    <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                    <span className="text-[14px] font-bold">{clinica?.license}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-[20px] font-bold">{user?.signature}</span>
                </div>
                <div className="row pt-2 w-full">
                    {doctorServices.length > 0 &&
                        doctorServices.map((section, index) => (
                            <div key={index} className={"w-full"}>
                                {section.templates && section.templates.length > 0 &&
                                    section.templates.map((template, index) => (
                                        <div>
                                            <div className="w-full flex justify-center items-center mb-1">
                                                <h2 className="mx-auto block text-center text-[22px] font-bold">
                                                    {template?.name}
                                                </h2>
                                                {(typeof connector?.client?.id === 'string') && <div className="flex justify-end items-center">
                                                    <div className="text-[12px] font-bold mt-2 px-2 py-1 bg-gray-400">{t("Tekshiruv sanasi")}: {new Date(section.createdAt).toLocaleDateString()}</div>
                                                </div>}
                                            </div>
                                            <div
                                                key={index}
                                                className="w-full text-[16px] mb-2 print_word"
                                            >

                                                {ReactHtmlParser(template.template)}

                                            </div>
                                        </div>
                                    ))}
                                <div>
                                    <div className="mt-1">
                                        {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-full">
                                            <img src={file} alt='file' />
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="pt-2 w-full text-center">
                    {labServices.length > 0 &&
                        labServices.map((section, index) => (
                            <div key={index} className={"w-full text-center mb-1"}>
                                <div className="w-full flex justify-center items-center mb-1">
                                    <h2 className="block mx-auto text-[18px] font-bold">
                                        {section?.servicetype}
                                    </h2>
                                    {(typeof connector?.client?.id === 'string') && <div className="flex justify-end items-center">
                                        <div className="text-[12px] font-bold my-2 px-2 py-1 bg-gray-400">{t("Tekshiruv sanasi")}: {new Date(section.createdAt).toLocaleDateString()}</div>
                                    </div>}
                                </div>
                                <table className="w-full text-center">
                                    <thead>
                                        <tr>
                                            <th className="border-[1px] border-black bg-gray-400 text-[16px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                            {section?.column?.col2 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                            {section?.column?.col3 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                            {section?.column?.col4 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                            {section?.column?.col5 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section?.services.map((service, ind) => {
                                            return service.tables.map((table, key) => (
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
                    {labServices.map((section => <div className='py-[20px]'>
                        <div className="">
                            {section.services.map(service => service.files && service.files.map((file) => <div className="w-[400px]">
                                <img src={file} alt='file' />
                            </div>))}
                        </div>
                    </div>))}
                </div>
            </div>
            <div className="d-none">
                <div ref={componentRef} style={{ fontFamily: "times" }} className="container px-[1.5cm]">
                    {clinica?.ifud1 && <div className="row" style={{ marginTop: '10px', fontSize: "10pt" }}>
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
                            <p className="pt-2">{clinica?.ifud2}</p>
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
                    <div className="flex justify-between items-center" style={{ fontSize: "20pt", marginBottom: "30px" }}>
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
                                            {connector?.client && connector?.client.lastname + " " + connector?.client.firstname}
                                        </h4>
                                    </td>
                                    <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                                        <p className="fw-bold fs-5 m-0">
                                            {t("TAHLIL")} <br /> {t("NATIJALARI")}
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
                                        {connector?.client && new Date(connector?.client.born).toLocaleDateString()}
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
                                        {connector.clientsType === 'offline' ?
                                            new Date(connector?.connector?.createdAt).toLocaleDateString() :
                                            new Date(connector?.connector?.room?.beginday).toLocaleDateString()}
                                    </td>
                                    <td
                                        className="p-0 fw-bold"
                                        style={{
                                            width: "100px",
                                            backgroundColor: "white",
                                            border: "1px solid #000",
                                        }}
                                    >
                                        {t("NAMUNA")}
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
                                        {connector?.client && connector?.client.address}
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
                                        {connector?.client && connector?.client?.id}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                        <span className="text-[14px] font-bold">{clinica?.organitionName}</span>
                        <span className="text-[14px] font-bold">{clinica?.license}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-[20px] font-bold">{user?.signature}</span>
                    </div>
                    <div className="pt-2">
                        {doctorServices.length > 0 &&
                            doctorServices.map((section, index) => (
                                <div key={index} className={""}>
                                    {section.templates && section.templates.length > 0 &&
                                        section.templates.map((template, index) => (
                                            <div style={{ paddingRight: '0', paddingLeft: "0" }} className="container">
                                                <div className="w-full flex justify-center items-center mb-1">
                                                    <h2 className="mx-auto block text-center text-[22px] font-bold">
                                                        {template?.name}
                                                    </h2>
                                                    {(typeof connector?.client?.id === 'string') && <div className="flex justify-end items-center">
                                                        <div className="text-[12px] font-bold mt-2 px-2 py-1 bg-gray-400">{t("Tekshiruv sanasi")}: {new Date(section.createdAt).toLocaleDateString()}</div>
                                                    </div>}
                                                </div>
                                                <div
                                                    key={index}
                                                    className="w-full text-[20px] mb-2 print_word"
                                                >

                                                    {ReactHtmlParser(template.template)}

                                                </div>
                                            </div>
                                        ))}
                                    <div>
                                        <div className="mt-1">
                                            {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-full">
                                                <img src={file} alt='file' />
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="pt-2 w-full">
                        {labServices.length > 0 &&
                            labServices.map((section, index) => (
                                <div key={index} className={"w-full text-center mb-1"}>
                                    <div className="w-full flex justify-center items-center mb-1">
                                        <h2 className="block mx-auto text-[18px] font-bold">
                                            {section?.servicetype}
                                        </h2>
                                        {(typeof connector?.client?.id === 'string') && <div className="flex justify-end items-center">
                                            <div className="text-[12px] font-bold my-2 px-2 py-1 bg-gray-400">{t("Tekshiruv sanasi")}: {new Date(section.createdAt).toLocaleDateString()}</div>
                                        </div>}
                                    </div>
                                    <table className="w-full text-center">
                                        <thead>
                                            <tr>
                                                <th className="border-[1px] border-black bg-gray-400 text-[16px] px-[12px] py-1 text-center">{section?.column?.col1}</th>
                                                {section?.column?.col2 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col2}</th>}
                                                {section?.column?.col3 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col3}</th>}
                                                {section?.column?.col4 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col4}</th>}
                                                {section?.column?.col5 && <th className="text-[16px] border-[1px] border-black bg-gray-400 px-[12px] py-1 text-center">{section?.column?.col5}</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {section?.services.map((service, ind) => {
                                                return service.tables.map((table, key) => (
                                                    <tr key={key} >
                                                        <td className={`border-[1px] text-[16px] border-black py-[2px] px-[12px]`}> <pre
                                                            style={{ fontFamily: "times" }}
                                                            className="border-none outline-none text-left"
                                                        >
                                                            {table?.col1}
                                                        </pre> </td>
                                                        <td className={`border-[1px] text-[16px] border-black py-[2px] px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col2}
                                                            </pre>
                                                        </td>
                                                        <td className={`border-[1px] text-[16px] border-black py-[2px] px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col3}
                                                            </pre>
                                                        </td>
                                                        {section?.column?.col4 && <td className={`border-[1px] text-[16px] border-black py-[2px] px-[12px]`}>
                                                            <pre
                                                                style={{ fontFamily: "sans-serif" }}
                                                                className="border-none outline-none"
                                                            >
                                                                {table?.col4}
                                                            </pre></td>}
                                                        {section?.column?.col5 && <td className={`border-[1px] text-[16px] border-black py-[2px] px-[12px]`}>
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
                        {labServices.map((section => <div className='py-[20px]'>
                            <div className="">
                                {section.services.map(service => service.files && service.files.map((file) => <div className="w-[400px]">
                                    <img src={file} alt='file' />
                                </div>))}
                            </div>
                        </div>))}
                    </div>
                </div>
            </div>
            <div className="container p-4 bg-white">
                <div className="row">
                    <div className="col-12 text-center my-4">
                        <button className="btn btn-info px-5" onClick={handlePrint} >{t("Chop etish")}</button>
                    </div>
                </div>
            </div>
        </>
}

export default StatsionarClientHistory;