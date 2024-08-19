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
import { useTranslation } from "react-i18next";


const ClientCard = ({ connector, setConnector }) => {

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

    const {t} = useTranslation()

    //====================================================================
    //====================================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    const handleDeleteTemplate = (i) => {
        const newTemplates = [...connector.client.templates].filter((temp, ind) => ind !== i)
        setConnector({
            ...connector, client: {
                ...connector.client,
                templates: newTemplates
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
                            const newTemp = connector.client.templates ? [...connector.client.templates, {
                                name: e.name,
                                template: e.template
                            }] : [{
                                name: e.name,
                                template: e.template
                            }]
                            setConnector({
                                ...connector, client: {
                                    ...connector.client,
                                    templates: newTemp
                                }
                            })
                        }}
                        placeholder={t("Tanlang...")}
                    />
                </div>
            </div>
            <div className="container">
                <div className="flex justify-between items-center w-full mb-4">
                    <div className="text-[16px] font-bold">
                        {t("Ўзбекистон Республикаси")} <br />
                        {t("Соғлиқни сақлаш вазирлиги")} <br />
                        {connector?.clinica?.name}
                    </div>
                    <div className="text-[16px] font-bold">
                        {t("Ўзбекистон Республикаси")} <br />
                        {t("Соғлиқни сақлаш вазирининг")} <br />
                        {t("2020 йил 31 декабрдаги   № 363-сонли")} <br />
                        {t("буйруғи билан тасдиқланган")} <br />
                        {t("003- рақамли тиббий хужжат шакли")} <br />
                    </div>
                </div>
                <h1 className="text-center mb-4 text-[18px] font-bold">{t("СТАЦИОНАР БЕМОРНИНГ ТИББИЙ КАРТАСИ")} №: {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}</h1>
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
                                {connector?.client?.gender === 'man' && 'Erkak'}
                                {connector?.client?.gender === 'women' && 'Ayol'}
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
                <div className="mb-4 mt-4 text-[16px]">
                    <p>1. {t("Қон гурухи")}: <span className="mr-[20px] font-bold"> {connector?.client?.bloodgroup}</span>  {t("резус мансублиги")}: <span className="font-bold">{connector?.client?.rezus}</span></p>
                    <p>2. {t("Дориларнинг ножўя таъсири")}: <span className="font-bold">{connector?.client?.medicineresult}</span></p>
                    <p>3. {t("Бўйи")}: <span className="mr-[30px] font-bold">{connector?.client?.height},</span> {t("вазни")}: <span className="mr-[30px] font-bold">{connector?.client?.weight},</span> {t("тана харорати")}: <span className="font-bold">{connector?.client?.temperature}</span></p>
                    <p>4. {t("Қариндошларнинг яшаш жойи ва телефон рақамлари")}: <span className="font-bold">{connector?.client?.relative_info}</span></p>
                    <p>5. {t("Иш жойи")}, {t("касби")}, {t("лавозими")}: <span className="font-bold">{connector?.client?.profession_info}</span></p>
                    <p>6. {t("Бемор қаердан юборилган")}: <span className="font-bold">{connector?.client?.sending_info}</span></p>
                    <p>7. {t("Касалхонага шошилинч равишда келтирилган")}: <span className="font-bold">{connector?.client?.isAmbulance}</span></p>
                    <p>8. {t("Қандай транспортда келтирилган")}: <span className="font-bold">{connector?.client?.ambulance_transport}</span></p>
                    <p>9. {t("Касаллик бошлангандан сўнг утган вақт, жарохатдан сўнг")}: <span className="font-bold">{connector?.client?.start_sickness}</span></p>
                    <p>10. {t("Бемор йўлланмасидаги ташҳис")}: <span className="font-bold">{connector?.client?.conter_diagnosis}</span></p>
                    <p>11. {t("Қабулхонада қуйилган ташҳис")}: <span className="font-bold">{connector?.client?.diagnosis}</span></p>
                </div>
                <div>
                    {connector.client?.templates && connector.client?.templates.map((t, i) =>
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
                                    const newTemplates = [...connector.client.templates].map((temp, index) => {
                                        if (index === i) {
                                            temp.template = html
                                        }
                                        return temp;
                                    })
                                    setConnector({
                                        ...connector, client: {
                                            ...connector.client,
                                            templates: newTemplates
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
                <div ref={componentRef} className="container px-[1cm] pt-4">
                    <div className="flex justify-between items-center w-full mb-4">
                        <div className="text-[16px] font-bold">
                            {t("Ўзбекистон Республикаси")} <br />
                            {t("Соғлиқни сақлаш вазирлиги")} <br />
                            {connector?.clinica?.name}
                        </div>
                        <div className="text-[16px] font-bold">
                            {t("Ўзбекистон Республикаси")} <br />
                            {t("Соғлиқни сақлаш вазирининг")} <br />
                            {t("2020 йил 31 декабрдаги   № 363-сонли")} <br />
                            {t("буйруғи билан тасдиқланган")} <br />
                            {t("003- рақамли тиббий хужжат шакли")} <br />
                        </div>
                    </div>
                    <h1 className="text-center mb-4 text-[18px] font-bold">{t("СТАЦИОНАР БЕМОРНИНГ ТИББИЙ КАРТАСИ")} №: {connector?.client?.id2 ? connector?.client?.id2 : connector?.client?.id}</h1>
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
                                    {connector?.client?.gender === 'man' && 'Erkak'}
                                    {connector?.client?.gender === 'women' && 'Ayol'}
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
                                    {connector.client && connector.client.address}
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
                    <div className="mb-4 mt-4 text-[16px]">
                        <p>1. {t("Қон гурухи")}: <span className="mr-[20px] font-bold"> {connector?.client?.bloodgroup}</span>  {t("резус мансублиги")}: <span className="font-bold">{connector?.client?.rezus}</span></p>
                        <p>2. {t("Дориларнинг ножўя таъсири")}: <span className="font-bold">{connector?.client?.medicineresult}</span></p>
                        <p>3. {t("Бўйи")}: <span className="mr-[30px] font-bold">{connector?.client?.height},</span> {t("вазни")}: <span className="mr-[30px] font-bold">{connector?.client?.weight},</span> {t("тана харорати")}: <span className="font-bold">{connector?.client?.temperature}</span></p>
                        <p>4. {t("Қариндошларнинг яшаш жойи ва телефон рақамлари")}: <span className="font-bold">{connector?.client?.relative_info}</span></p>
                        <p>5. {t("Иш жойи")}, {t("касби")}, {t("лавозими")}: <span className="font-bold">{connector?.client?.profession_info}</span></p>
                        <p>6. {t("Бемор қаердан юборилган")}: <span className="font-bold">{connector?.client?.sending_info}</span></p>
                        <p>7. {t("Касалхонага шошилинч равишда келтирилган")}: <span className="font-bold">{connector?.client?.isAmbulance}</span></p>
                        <p>8. {t("Қандай транспортда келтирилган")}: <span className="font-bold">{connector?.client?.ambulance_transport}</span></p>
                        <p>9. {t("Касаллик бошлангандан сўнг утган вақт, жарохатдан сўнг")}: <span className="font-bold">{connector?.client?.start_sickness}</span></p>
                        <p>10. {t("Бемор йўлланмасидаги ташҳис")}: <span className="font-bold">{connector?.client?.conter_diagnosis}</span></p>
                        <p>11. {t("Қабулхонада қуйилган ташҳис")}: <span className="font-bold">{connector?.client?.diagnosis}</span></p>
                    </div>
                    <div className="print_word">
                        {connector.client?.templates && connector.client.templates.map(t => ReactHtmlParser(t.template))}
                    </div>
                </div>
            </div>
        </>
    )
}


export default ClientCard