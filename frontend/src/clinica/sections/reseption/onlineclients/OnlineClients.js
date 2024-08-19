import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal, Modal as Modal2 } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkClientData, checkProductsData, checkServicesData, } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useTranslation } from "react-i18next";

export const OnlineClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
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
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/onlineclient/client/getdoctors`,
                    "POST",
                    { clinica: auth && auth.clinica._id, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectors(data);
                setSearchStrorage(data);
                setCurrentConnectors(
                    data.slice(indexFirstConnector, indexLastConnector)
                );
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
    //====================================================================+

    //====================================================================
    //====================================================================
    // SEARCH
    const searchFullname = (e) => {
            const searching = searchStorage.filter((item) =>
                (item.firstname + item.lastname)
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setConnectors(searching);
            setCurrentConnectors(searching.slice(0, countPage));
        }
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, countPage));
        },
        [countPage, connectors]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // BASEURL
    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data);
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
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
        department: auth?.user?.specialty?._id,
        bronTime: null,
        queue: null,
        serviceType: null,
        service: null
    });

    const changeClientData = (e) => {
        setClient({ ...client, [e.target.name]: e.target.value });
    };

    const [clientDate, setClientDate] = useState(new Date().toISOString().slice(0, 10))

    const changeClientBorn = (e) => {
        setClientDate(e.target.value)
        setClient({ ...client, brondate: new Date(e.target.value) });
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
    }, [auth]);

    const checkData = () => {
        if (checkClientData(client, t)) {
            return notify(checkClientData(client, t));
        }
        setModal(true);
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CreateHandler

    const createHandler = useCallback(async (id) => {
        try {
             await request(
                `/api/onlineclient/client/register`,
                "POST",
                {
                    client: { ...client, clinica: auth.clinica._id },
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
            getConnectors(beginDay, endDay)
            setModal(false);
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
        notify,
        request,
        indexLastConnector,
        indexFirstConnector,
        connectors,
        clearDatas,
    ]);
    
    const updateHandler = useCallback(async () => {
        if (checkClientData(client)) {
            return notify(checkClientData(client));
        }
        try {
            const data = await request(
                `/api/onlineclient/client/update`,
                "PUT",
                {
                    client: { ...client, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            getConnectors(beginDay, endDay);
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
        notify,
        request,
        clearDatas,
        getConnectors,
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
        getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(
            new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
                0,
                0,
                0,
                0
            )
        );

        setEndDay(date);
        getConnectors(beginDay, date);
    };

    //====================================================================
    //====================================================================

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

    //====================================================================
    //====================================================================
    // useEffect
    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getConnectors(beginDay, endDay);
            getDepartments();
            getBaseUrl();
        }
    }, [
        auth,
        getConnectors, 
        s,
        getDepartments,
        getBaseUrl,
        beginDay,
        endDay,
    ]);

    //====================================================================
    //====================================================================
    return (
        <div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        {/* <div className="row">
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
                                updateData={updateHandler}
                                checkData={checkData}
                                client={client}
                                setClient={setClient}
                                changeClientData={changeClientData}
                                changeClientBorn={changeClientBorn}
                                departments={departments}
                                loading={loading}
                                setModal={setModal}
                                clientDate={clientDate}
                            />
                        </div> */}
                        <TableClients
                            setVisible={setVisible}
                            modal1={modal1}
                            setModal1={setModal1}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            setClient={setClient}
                            searchFullname={searchFullname}
                            connectors={connectors}
                            // setModal={setModal}
                            setConnectors={setConnectors}
                            // setConnector={setConnector}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            loading={loading}
                            setModal2={setModal2}
                        />
                    </div>
                </div>
            </div>

            {/* <CheckModal
                baseUrl={baseUrl}
                connector={check}
                modal={modal1}
                setModal={setModal1}
            /> */}

            <Modal
                modal={modal}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal}
                handler={client._id ? updateHandler : createHandler}
                basic={client.lastname + " " + client.firstname}
            />

            {/* <Modal2
                modal={modal2}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal2}
                handler={PostToOffline}
                basic={postConnector.client && postConnector.client.fullname}
            /> */}
        </div>
    );
};
