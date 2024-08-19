import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import {
    checkClientData,
    checkConnectorData,
    checkProductsData,
    checkRoomData,
    checkServicesData,
} from "./checkData/checkData";
import { CheckModalStatsionar } from "../components/ModalCheckStatsionar";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const StatsionarClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date(new Date().getMonth() - 3).setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setUTCHours(23, 59, 59, 59))
    );

    const [type, setType] = useState('today')

    //====================================================================
    //====================================================================
    // MODAL
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    //====================================================================
    //====================================================================
    const {t} = useTranslation()
    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;
    const [currentConnectors, setCurrentConnectors] = useState([]);

    //====================================================================
    //====================================================================

    const state = useLocation().state

    //====================================================================
    //====================================================================
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

    //====================================================================
    //====================================================================
    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getConnectors = useCallback(
        async (beginDay, endDay, type) => {
            try {
                const data = await request(
                    `/api/statsionarclient/client/getallreseption`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay, type },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors(data);
                setSearchStrorage(data);
                setCurrentConnectors([...data].slice(indexFirstConnector, indexLastConnector));
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );
    //====================================================================
    //====================================================================

    const [doctorSelect, setDoctorSelect] = useState(null)
    const [roomSelect, setRoomSelect] = useState(null)
    const [agentSelect, setAgentSelect] = useState(null)

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchId = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.id
                    .toLowerCase()
                    .toString()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchProbirka = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.probirka.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchPhone = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.phone.toString().includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchBornDay = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) => {
                return new Date(item.client.born)
                    .toLocaleDateString()
                    .includes(e.target.value);
            });
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    //====================================================================
    //====================================================================

    const searchFinished = (e) => {
            setType(e.target.value)
    }

    //====================================================================
    //====================================================================

    const searchDoctor = useCallback(
        (e) => {
            const searching = [...searchStorage].filter(
                (item) =>
                    item.doctor.lastname.includes(e.target.value) ||
                    item.doctor.firstname.includes(e.target.value)
            );
            setConnectors(searching);
            setCurrentConnectors(searching);
        },
        [searchStorage]
    );

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, e.target.value));
        },
        [connectors]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // DEPARTMENTS
    const [departments, setDepartments] = useState([]);

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/reseption`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDepartments(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [connector, setConnector] = useState({
        clinica: auth.clinica && auth.clinica._id,
        probirka: 0,
        reseption: auth.user && auth.user._id,
    });

    const [check, setCheck] = useState({});

    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const changeService = (services) => {
        let s = [];
        let counter = 0;
        services.map((service) => {
            if (service.department.probirka) {
                counter++;
                setConnector({ ...connector, probirka: 1 });
            }
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                serviceid: service.service._id,
                service: service.service,
                department: service.department._id,
                pieces: 1,
            });
        });
        if (!counter) {
            setConnector({ ...connector, probirka: 0 });
        }
        setServices(s);
        setSelectedServices(services);
    };

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // COUNTERDOCTORS
    const [counterdoctors, setCounterDoctors] = useState([]);

    const getCounterDoctors = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctorall/get`,
                "POST",
                { clinica: auth.clinica._id, type: "CounterDoctor" },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setCounterDoctors([...data].map(doctor => ({
                ...doctor,
                value: doctor._id,
                label: doctor?.firstname + ' ' + doctor?.lastname
            })));
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);
    
    const [counteragent, setCounterAgent] = useState(null);

    const changeCounterAgent = (e) => {
        if (e.value === "delete") {
            setCounterAgent(null)
            setAgentSelect(null)
        } else {
            setCounterAgent(e.value);
            setAgentSelect(e)
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ADVERS
    const [advers, setAdvers] = useState([]);

    const getAdvers = useCallback(async () => {
        try {
            const data = await request(
                `/api/adver/adver/getall`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setAdvers(data);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [adver, setAdver] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeAdver = (e) => {
        if (e.target.value === "delete") {
            let s = { ...adver };
            delete s.adver;
            setAdver(s);
        } else {
            setAdver({
                ...adver,
                adver: e.target.value,
            });
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // PRODUCTS
    const [products, setProducts] = useState([]);

    const getProducts = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/product/getallreseption`,
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );

            let s = [];
            data.map((product) => {
                return s.push({
                    label: product.name,
                    value: product._id,
                    product: product,
                });
            });
            setProducts(s);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [newproducts, setNewProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const changeProduct = (newproducts) => {
        let s = [];
        newproducts.map((product) => {
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                productid: product.product._id,
                product: product.product,
                pieces: 1,
            });
        });
        setNewProducts(s);
        setSelectedProducts(newproducts);
    };

    //====================================================================
    //====================================================================

    // ===================================================================
    // ===================================================================
    // Get Doctors
    const [doctors, setDoctors] = useState([]);

    const getDoctors = useCallback(async () => {
        try {
            const data = await request(
                "/api/user/gettype",
                "POST",
                { clinica: auth.clinica._id, type: "Doctor" },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctors([...data].map(doctor => ({
                ...doctor,
                label: doctor.firstname + ' ' + doctor.lastname,
                value: doctor._id,
            })));
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const changeDoctor = (e) => {
        if (e.value === "delete") {
            let s = { ...connector };
            delete s.doctor;
            setConnector(s);
        } else {
            setConnector({
                ...connector,
                doctor: e.value,
            });
            setDoctorSelect(e)
        }
    };

    //====================================================================
    //====================================================================

    // ===================================================================
    // ===================================================================
    // Get Rooms
    const [rooms, setRooms] = useState([]);

    const getRooms = useCallback(async () => {
        try {
            const data = await request(
                "/api/services/room/notbusy",
                "POST",
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setRooms([...data].map(room => ({
                ...room,
                value: room._id,
                label: room.type + " " + room.number + " xona " + room.place + " o'rin"
            })));
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

    const [room, setRoom] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user._id,
        beginday: new Date()
    });

    const changeRoom = (e) => {
        if (e.value === "delete") {
            let s = { ...room };
            delete s.room;
            delete s.roomid;
            setRoom(s);
        } else {
            setRoom({
                ...room,
                room: e,
                roomid: e._id,
            });
            setRoomSelect(e)
        }
    };
    // ===================================================================
    // ===================================================================
    //====================================================================
    //====================================================================
    // BASEURL
    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data.baseUrl);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLIENT
    const [client, setClient] = useState({
        _id: null,
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    // ===================================================================
    // ===================================================================

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const changeClientBorn = (e) => {
        setClientDate(e.target.value);
        setClient({ ...client, born: new Date(e.target.value) });
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Diagnos

    const changeDiagnos = (e) => {
        setConnector({ ...connector, diagnosis: e.target.value });
    };

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLEAR

    const clearDatas = useCallback(() => {
        setClient({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setConnector({
            clinica: auth.clinica && auth.clinica._id,
            probirka: 0,
        });
        setAdver({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setCounterAgent({
            clinica: auth.clinica && auth.clinica._id,
            reseption: auth.user && auth.user._id,
        });
        setNewProducts([]);
        setServices([]);
        setSelectedProducts([]);
        setSelectedServices([]);
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client, t)) {
            return notify(checkClientData(client, t));
        }

        if (checkConnectorData(connector, client, t)) {
            return notify(checkConnectorData(connector, client, t));
        }

        if (checkRoomData(room, client, t)) {
            return notify(checkRoomData(room, client, t));
        }

        if (checkServicesData(services && services)) {
            return notify(checkServicesData(services && services, t));
        }

        if (checkProductsData(newproducts, t)) {
            return notify(checkProductsData(newproducts, t));
        }

        setModal(true);
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CreateHandler

    const createHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/statsionarclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counterdoctor: counteragent,
                    adver: { ...adver, clinica: auth.clinica._id },
                    room: { ...room },
                    offlineclient: offlineclient,
                    offlineconnector: offlineconnector
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            const s = [data, ...connectors];
            setConnectors(s);
            setSearchStrorage(s);
            setCurrentConnectors(s.slice(indexFirstConnector, indexLastConnector));
            setModal(false);
            clearDatas();
            setVisible(false);
            setOfflineclient()
            setOfflineconnector()
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        connector,
        services,
        newproducts,
        indexLastConnector,
        indexFirstConnector,
        connectors,
        adver,
        counteragent,
        room,
        request,
        notify,
        clearDatas,
    ]);
    
    const updateHandler = useCallback(async () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/statsionarclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    counteragent: counteragent,
                    adver: { ...adver, clinica: auth.clinica._id },
                    room: { ...room }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay, type);
            notify({
                title: `${data.lastname + " " + data.firstname
                    }  ${t("ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi.")}`,
                description: "",
                status: "success",
            });
            clearDatas();
            setVisible(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        adver,
        counteragent,
        connector,
        room,
        notify,
        request,
        clearDatas,
        getConnectors,
        beginDay,
        endDay,
    ]);

    const addHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/statsionarclient/client/add`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
                    connector: { ...connector, clinica: auth.clinica._id },
                    services: [...services],
                    products: [...newproducts],
                    counteragent: { ...counteragent, clinica: auth.clinica._id },
                    adver: { ...adver, clinica: auth.clinica._id },
                    room: { ...room },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            localStorage.setItem("data", data);
            getConnectors(beginDay, endDay, type);
            notify({
                title: `${client.lastname + " " + client.firstname
                    }  ${t("ismli mijozga xizmatlar muvaffaqqiyatli qo'shildi.")}`,
                description: "",
                status: "success",
            });
            clearDatas();
            setModal(false);
            setVisible(false);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [
        auth,
        client,
        notify,
        request,
        clearDatas,
        getConnectors,
        services,
        newproducts,
        connector,
        adver,
        counteragent,
        room,
        beginDay,
        endDay,
    ]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        // getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        setEndDay(new Date(new Date(e).setUTCHours(23, 59, 59, 59)));
        // getConnectors(beginDay, date);
    };
    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getDepartments();
            getCounterDoctors();
            getAdvers();
            getProducts();
            getBaseUrl();
            getDoctors();
        }
        getRooms();
    }, [
        // getConnectors,
        getAdvers,
        getProducts,
        getCounterDoctors,
        getDepartments,
        getBaseUrl,
        getDoctors,
        getRooms,
        auth,
        s,
        beginDay,
        endDay,
    ]);


    useEffect(() => {
        getConnectors(beginDay, endDay, type);
    }, [beginDay, endDay, type])

    //=================================================================
    //=================================================================

    //=================================================================
    //=================================================================
    const [postRoomBody, setPostRoomBody] = useState({});

    const postRoom = async () => {
        try {
            const data = await request(
                `/api/offlineclient/client/end`,
                "PUT",
                {
                    clinica: auth.clinica._id,
                    room: { ...postRoomBody },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            localStorage.setItem("room", data);
            setModal2(false);
            notify({
                title: t("Mijoz muvaffaqqiyatli yaratildi."),
                description: "",
                status: "success",
            });
            getConnectors(beginDay, endDay);
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    };

    //=================================================================
    //=================================================================

    const [offlineconnector, setOfflineconnector] = useState()
    const [offlineclient, setOfflineclient] = useState()

    useEffect(() => {
        if (state?.client) {
            setOfflineclient(state.client._id)
            setOfflineconnector(state.connector._id)
            let clientData = { ...state.client }
            delete clientData._id
            let connector = { ...state.connector }
            let services = [...state.services]
            setClient({ ...client, ...clientData })
            setVisible(true)
            setClientDate(clientData.born.slice(0, 10))
            setConnector({ ...connector, reseption: auth.user && auth.user._id, })
            let s = [];
            services.map((service) => {
                if (!service.refuse) {
                    s.push({
                        clinica: auth.clinica._id,
                        reseption: auth.user._id,
                        serviceid: service.service._id,
                        service: service.service,
                        department: service.department._id,
                        pieces: 1,
                        templates: service.templates,
                        column: service.column,
                        tables: service.tables,
                        accept: service.accept,
                        refuse: service.refuse
                    });
                }
                return ''
            });
            setServices(s)
            setSelectedServices([...services].map(item => item.refuse && ({
                label: item.service.name,
                value: item.service._id
            })));
        }
    }, [state])

    //=================================================================
    //=================================================================
    return (
        <div>
            <div className="content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-12 text-end">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            <RegisterClient
                                changeRoom={changeRoom}
                                changeDoctor={changeDoctor}
                                selectedServices={selectedServices}
                                selectedProducts={selectedProducts}
                                updateData={updateHandler}
                                checkData={checkData}
                                setNewProducts={setNewProducts}
                                setNewServices={setServices}
                                newservices={services}
                                newproducts={newproducts}
                                changeProduct={changeProduct}
                                changeService={changeService}
                                changeAdver={changeAdver}
                                changeCounterAgent={changeCounterAgent}
                                client={client}
                                setClient={setClient}
                                changeClientData={changeClientData}
                                changeClientBorn={changeClientBorn}
                                departments={departments}
                                counterdoctors={counterdoctors}
                                advers={advers}
                                products={products}
                                loading={loading}
                                doctors={doctors}
                                rooms={rooms}
                                room={room}
                                setRoom={setRoom}
                                connector={connector}
                                setConnector={setConnector}
                                changeDiagnos={changeDiagnos}
                                clientDate={clientDate}
                                doctorSelect={doctorSelect}
                                roomSelect={roomSelect}
                                agentSelect={agentSelect}
                                isFromOffline={state?.client}
                            />
                        </div>
                        <TableClients
                            setVisible={setVisible}
                            setCheck={setCheck}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            searchPhone={searchPhone}
                            setClient={setClient}
                            setConnector={setConnector}
                            searchFullname={searchFullname}
                            searchId={searchId}
                            connectors={connectors}
                            searchProbirka={searchProbirka}
                            // setModal={setModal}
                            setConnectors={setConnectors}
                            // setConnector={setConnector}
                            setRoom={setRoom}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            setModal1={setModal1}
                            // setModal2={setModal2}
                            loading={loading}
                            setPostRoomBody={setPostRoomBody}
                            setModal2={setModal2}
                            searchBornDay={searchBornDay}
                            searchFinished={searchFinished}
                            searchDoctor={searchDoctor}
                            setDoctorSelect={setDoctorSelect}
                            setRoomSelect={setRoomSelect}
                        />
                    </div>
                </div>
            </div>

            <CheckModalStatsionar
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            />

            <Modal
                modal={modal}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal}
                handler={client._id ? addHandler : createHandler}
                basic={client.lastname + " " + client.firstname}
            />

            <Modal2
                modal={modal2}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal2}
                handler={postRoom}
            />
        </div>
    );
};
