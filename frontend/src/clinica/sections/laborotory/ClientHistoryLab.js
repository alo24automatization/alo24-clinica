import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import ReactHtmlParser from 'react-html-parser'

const Print = ({ client, connector, sections, baseUrl, clinica }) => {

    const [doctorServices, setDoctorServices] = useState([])
    const [labServices, setLabServices] = useState([])

    useEffect(() => {
        setDoctorServices([...connector.services].filter(service => service.department.probirka == false));
        const serviceTypes = []
        const serviceIdArr = []
        for (const service of connector.services) {
            if (service.department.probirka) {
                const check = service.serviceid.servicetype._id
                if (!serviceIdArr.includes(check)) {
                    serviceTypes.push({
                        servicetypeid: check,
                        servicetypename: service.serviceid.servicetype.name,
                        services: [service],
                        column: service.column,
                        createdAt: service.createdAt
                    })
                    serviceIdArr.push(check);
                } else {
                    const checkCols = Object.keys(service?.column).filter(el => el.includes('col')).length;
                    const index = serviceTypes.findIndex(el =>
                        el.servicetypeid === check
                        && Object.keys(el?.column).filter(el => el.includes('col')).length === checkCols)
                    if (index >= 0) {
                        serviceTypes[index].services.push(service)
                        serviceTypes[index].column = service.column
                    } else {
                        serviceTypes.push({
                            servicetypeid: check,
                            servicetypename: service.serviceid.servicetype.name,
                            services: [service],
                            column: service.column,
                            createdAt: service.createdAt
                        })
                    }
                }
            }
        }
        setLabServices([...serviceTypes].map(section =>
            ({ ...section, services: section.services })).filter(el => el.services.length > 0))
    }, [connector]);

    return (
        <div style={{ fontFamily: "times" }} className="container px-[1.5cm]">
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
                {/* <div className="" style={{ textAlign: "center" }}>
                            <p className="text-end m-0">
                                <img width="100" src={QRcode} alt="QR" />
                            </p>
                        </div> */}
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
                                Mijozning F.I.SH
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
                                    TAHLIL <br /> NATIJALARI
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
                                Tug'ilgan yili
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
                                Kelgan sanasi
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
                                Namuna
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
                                Manzil
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
                                ID
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
                                                <div className="text-[12px] font-bold mt-2 px-2 py-1 bg-gray-400">Tekshiruv sanasi: {new Date(section.createdAt).toLocaleDateString()}</div>
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
                                    {section?.servicetypename}
                                </h2>
                                {(typeof connector?.client?.id === 'string') && <div className="flex justify-end items-center">
                                    <div className="text-[12px] font-bold my-2 px-2 py-1 bg-gray-400">Tekshiruv sanasi: {new Date(section.createdAt).toLocaleDateString()}</div>
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
    )
}

const ClientHistoryLab = () => {

    const { id } = useParams();

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const { request } = useHttp();
    const auth = useContext(AuthContext);

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

    const [connector, setConnector] = useState({})
    const [client, setClient] = useState({})
    const [services, setServices] = useState([])

    const getClientHistory = useCallback(
        async (id) => {
            try {
                const data = await request(
                    `/api/labaratory/client/history/get`,
                    "POST",
                    {
                        id: id
                    }
                );
                setConnector({ ...data })
                setClient({ ...data.client })
                setServices([...data.services])
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, notify]
    );


    const [baseUrl, setBaseUrl] = useState()

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request('/api/baseurl', 'GET', null)
            setBaseUrl(data.baseUrl)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

    useEffect(() => {
        getClientHistory(id)
    }, [getClientHistory]);

    useEffect(() => {
        getBaseUrl()
    }, [getBaseUrl]);


    return <>
        <div className="container p-4 bg-white text-center" style={{ fontFamily: "times" }}>
            <div className="row">
                <div className="col-12 text-center my-4">
                    <button className="btn btn-info px-5" onClick={handlePrint} >Chop etish</button>
                </div>
            </div>
        </div>
        {services.length > 0 && <div className="d-none">
            <div
                ref={componentRef}
                className="container p-4"
            >
                <Print
                    baseUrl={baseUrl}
                    clinica={connector?.clinica}
                    connector={connector}
                    client={client}
                    sections={services}
                />
            </div>
        </div>}
    </>
}

export default ClientHistoryLab;