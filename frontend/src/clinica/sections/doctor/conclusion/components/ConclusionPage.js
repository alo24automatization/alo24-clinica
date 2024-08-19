import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import TextEditor from "../../components/TextEditor";
import ReactHtmlParser from 'react-html-parser'
import "../../components/Print.css"
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";
import Select from "react-select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import QRcode from "../../../../../qrcode.png"
import { useTranslation } from "react-i18next";

const ConclusionPage = ({ connector, onChange, setConnector, clinica, baseUrl }) => {
    
    const {t} = useTranslation()

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })


    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        []
    );

    //====================================================================
    //====================================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    const handleDeleteTemplate = (i) => {
        const newTemplates = [...connector.client.conclusions].filter((temp, ind) => ind !== i)
        setConnector({
            ...connector, client: {
                ...connector.client,
                conclusions: newTemplates
            }
        })
    }

    //====================================================================
    //====================================================================

    const saveClient = async () => {
        try {
            const data = await request(
                `/api/doctor/conclusion/client/save`,
                "POST",
                {
                    client: { ...connector.client }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: t("Mijoz qabul qilindi!"),
                description: "",
                status: "success",
            });
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const [temps, setTemps] = useState([])

    const getConclusionTemps = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/doctor/conclusion/template/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setTemps([...data].map(item => ({
                    ...item,
                    value: item._id,
                    label: item.name
                })));
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    useEffect(() => {
        getConclusionTemps()
    }, [getConclusionTemps])


    return (
        <>
            <div className="pt-2">
                <div className="w-[300px]">
                    <Select
                        options={temps}
                        onChange={e => {
                            const newTemp = connector.client.conclusions ? [...connector.client.conclusions, {
                                name: e.name,
                                template: e.template
                            }] : [{
                                name: e.name,
                                template: e.template
                            }]
                            setConnector({
                                ...connector, client: {
                                    ...connector.client,
                                    conclusions: newTemp
                                }
                            })
                        }}
                    />
                </div>
            </div>
            <div className="container">
                {auth?.clinica?.ifud1 && <div className="row" style={{ fontSize: "10pt" }}>
                    <div
                        className="col-4"
                        style={{ border: "1px solid", textAlign: "center" }}
                    >
                        <p className="pt-2">
                            {auth?.clinica?.ifud1}
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
                        <p className="pt-2">{auth?.clinica?.ifud2}</p>
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
                            {auth?.clinica?.ifud3}
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
                            <img width="100" src={QRcode} alt="QR" />
                        </p>
                    </div>
                </div>
                <h1 className="text-center mb-4 text-[18px] font-bold">{t("ТИББИЙ БАЙОННОМАДАН КЎЧИРМА")} №: {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}</h1>
                <div className="col-12" style={{ padding: "0" }}>
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
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Mijozning F.I.SH")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    fontSize: "20px",
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                <h4>
                                    {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                </h4>
                            </td>
                            <td colSpan={2} style={{ width: "25%" }}>
                                <p className="fw-bold fs-5 m-0">
                                    {connector?.client?.department}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Tug'ilgan yili")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Jinsi")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.gender === 'man' && t('Erkak')}
                                {connector?.client?.gender === 'women' && t('Ayol')}
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Kelgan sanasi")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector &&
                                    new Date(connector?.room?.beginday).toLocaleDateString()} {new Date(connector?.createdAt).toLocaleTimeString().slice(0, 5)}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    width: "100px",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Ketgan vaqti")}
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
                                {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()} {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleTimeString().slice(0, 5)}
                            </td>
                        </tr>

                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Manzil")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.address}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("ID")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}
                            </td>
                        </tr>
                    </table>
                </div>
                <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
                    <span className="text-[14px] font-bold">{auth.clinica?.organitionName}</span>
                    <span className="text-[14px] font-bold">{auth?.clinica?.license}</span>
                </div>
                <div>
                    {connector.client?.conclusions && connector.client?.conclusions.map((t, i) =>
                        <div>
                            <div className="flex justify-between items-center py-2 px-4">
                                <div className="flex justify-between items-center">
                                    <FontAwesomeIcon
                                        onClick={() => handleDeleteTemplate(i)}
                                        icon={faTrash}
                                        style={{ cursor: "pointer", fontSize: '18px', color: 'red' }}
                                    />
                                </div>
                            </div>
                            <TextEditor
                                value={t.template}
                                onChange={(html, key) => {
                                    const newTemplates = [...connector.client.conclusions].map((temp, index) => {
                                        if (index === i) {
                                            temp.template = html
                                        }
                                        return temp;
                                    })
                                    setConnector({
                                        ...connector, client: {
                                            ...connector.client,
                                            conclusions: newTemplates
                                        }
                                    })
                                }}
                                index={i}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="container p-4 bg-white">
                <div className="row">
                    <div className="col-12 text-center my-4">
                        <button className="btn btn-success px-4 mx-4" onClick={saveClient} > {t("Tasdiqlash")}</button>
                        <button className="btn btn-info px-5" onClick={handlePrint} >{t("Chop etish")}</button>
                    </div>
                </div>
            </div>
            <div className="d-none">
                <div ref={componentRef} style={{fontFamily: "times"}} className="container px-[1cm] pt-4">
                    {auth?.clinica?.ifud1 && <div className="row" style={{ marginTop: '10px', fontSize: "10pt" }}>
                        <div
                            className="col-4"
                            style={{ border: "1px solid", textAlign: "center" }}
                        >
                            <p className="pt-2">
                                {auth?.clinica?.ifud1}
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
                            <p className="pt-2">{t("IFUD")}: {auth?.clinica?.ifud2}</p>
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
                                {auth?.clinica?.ifud3}
                            </p>
                        </div>
                    </div>}
                    <div className="flex justify-between items-center pt-2" style={{ fontSize: "20pt", marginBottom: "30px" }}>
                        <div className="" style={{ textAlign: "center" }}>
                            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                {clinica?.name}
                            </pre>
                        </div>
                        <div className="px-1" style={{ textAlign: "center" }}>
                            <img style={{ width: "150px" }} src={baseUrl + '/api/upload/file/' + clinica?.image} alt="logo" />
                        </div>
                        <div className="" style={{ textAlign: "center" }}>
                            <pre className="" style={{ fontFamily: "-moz-initial", border: 'none', outline: "none" }}>
                                {clinica?.name2}
                            </pre>
                        </div>
                        <div className="px-1" style={{ textAlign: "center" }}>
                            <p className="text-end m-0">
                                <img width="80" src={QRcode} alt="QR" />
                            </p>
                        </div>
                    </div>
                    <h1 className="text-center mb-4 text-[18px] font-bold">{t("ТИББИЙ БАЙОННОМАДАН КЎЧИРМА")} №: {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}</h1>
                    <div className="col-12" style={{ padding: "0" }}>
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
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Mijozning F.I.SH")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    fontSize: "20px",
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                <h4>
                                    {connector?.client && connector.client.lastname + " " + connector.client.firstname}
                                </h4>
                            </td>
                            <td colSpan={2} style={{ width: "25%" }}>
                                <p className="fw-bold fs-5 m-0">
                                    {connector?.client?.department}
                                </p>
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Tug'ilgan yili")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client && new Date(connector.client.born).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Jinsi")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.gender === 'man' && t('Erkak')}
                                {connector?.client?.gender === 'women' && t('Ayol')}
                            </td>
                        </tr>
                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Kelgan sanasi")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector &&
                                    new Date(connector?.room?.beginday).toLocaleDateString()}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    width: "100px",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Ketgan vaqti")}
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
                                {connector?.room?.endday && new Date(connector?.room?.endday).toLocaleDateString()}
                            </td>
                        </tr>

                        <tr style={{ textAlign: "center" }}>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("Manzil")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    width: "25%",
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.address}
                            </td>
                            <td
                                className="p-0 fw-bold"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                }}
                            >
                                {t("ID")}
                            </td>
                            <td
                                className="p-0"
                                style={{
                                    backgroundColor: "white",
                                    border: "1px solid #000",
                                    fontSize: "20px",
                                }}
                            >
                                {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}
                            </td>
                        </tr>
                    </table>
                </div>
                    <div className="mt-2 mb-4 px-2 py-1 bg-gray-400 flex justify-between items-center">
                        <span className="text-[14px] font-bold">{auth.clinica?.organitionName}</span>
                        <span className="text-[14px] font-bold">{auth?.clinica?.license}</span>
                    </div>
                    <div className="w-full text-[20px] mb-2 print_word">
                        {connector.client?.conclusions && connector.client.conclusions.map(t => ReactHtmlParser(t.template))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConclusionPage;