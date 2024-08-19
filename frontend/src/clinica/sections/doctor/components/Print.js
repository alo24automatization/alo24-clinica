import React, { useContext } from 'react'
import parse from "html-react-parser"
import ReactHtmlParser from 'react-html-parser'
import './Print.css'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../../../context/AuthContext'

const Print = ({ client, connector, sections, clinica, baseUrl, doctor, qr }) => {
    const { t } = useTranslation()
    const auth = useContext(AuthContext)
    return (
        <div className="bg-white pt-4">
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
                <div className="flex justify-between items-center row" style={{ fontSize: "20pt", marginBottom: "10px" }}>
                    {
                        auth?.clinica?.blanka ? <div className="py-2 px-[12px]  w-full">
                        <img src={baseUrl + "/api/upload/file/" + auth?.clinica?.blanka} className="w-full h-[4cm]" />
                      </div>  :
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
                    <span className="text-[20px] font-bold">{doctor?.signature}</span>
                </div>
                <div className="my-2 w-full border-2 border-black-800"></div>
            </div>
            <div className="row pt-2 w-full">
                {sections.length > 0 &&
                    sections.map((section, index) => (
                        <div key={index} className={"w-full"}>
                            {section.templates && section.templates.length > 0 &&
                                section.templates.map((template, index) => (
                                    <div>
                                        <h2 className="block text-center mb-4 text-[24px] font-bold">
                                            {template?.name}
                                        </h2>
                                        <div
                                            key={index}
                                            className={`w-full text-[20px] mb-2 print_word ${template?.transform ? 'editor' : ""}`}
                                        >

                                            {ReactHtmlParser(template.template)}

                                        </div>
                                    </div>
                                ))}
                            <div>
                                <div className="mt-2">
                                    {section.files && section.files.length > 0 && section.files.map((file) => <div className="w-full">
                                        <img src={file} alt='file' />
                                    </div>)}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {/* <div className='mt-[50px] text-center'>
                <div>
                    ___________________<span className='font-bold'>{doctor?.lastname} {doctor?.firstname[0].toUpperCase()}</span>.
                </div>
            </div> */}
        </div>

    );
}

export default Print