import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import Print from "../components/Print";
import BloodTestTables from "./BloodTestTables";
import socketIOClient from "socket.io-client";
// import { TableClients } from "./clientComponents/TableClients";

export const BloodTest = () => {
    const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
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

    //====================================================================
    //====================================================================
    // getConnectors
    const [doctorClients, setDoctorClients] = useState([]);
    const [searchStorage, setSearchStorage] = useState([]);
    const [currentDoctorClients, setCurrentDoctorClients] = useState([]);

    const getDoctorClients = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/labaratory/clientsforapprove/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        beginDay,
                        endDay,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                const currentData = data[0].services.length > 0 ? data : []
                setDoctorClients(currentData);
                setSearchStorage(currentData);
                setCurrentDoctorClients(
                    currentData.slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );

    //===================================================================
    //===================================================================
    // Searching

    const searchFullname = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setDoctorClients(searching);
            setCurrentDoctorClients(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    const searchId = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.id.toString().includes(e.target.value)
            );
            setDoctorClients(searching);
            setCurrentDoctorClients(searching.slice(0, countPage));
        },
        [searchStorage, countPage]
    );

    //===================================================================
    //===================================================================

    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentDoctorClients(doctorClients.slice(0, countPage));
        },
        [countPage, doctorClients]
    );

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getDoctorClients(beginDay, date);
    };

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getDoctorClients(beginDay, endDay);
        }
    }, [auth, beginDay, s, endDay, getDoctorClients]);
    let socket = null;
    const getSocketInstance = () => {
        if (!socket) {
            socket = socketIOClient(ENDPOINT, {
                path: '/ws',
                withCredentials: true
            });
            socket.on('disconnect', () => {
                console.log('Socket disconnected!');
                // Clean up the socket instance when disconnected
                socket = null;
            }); 
        }
        return socket;
    };
    const approveLab = async () => {
        try {
          request(
                `/api/labaratory/approve`,
                "POST",
                {
                    connector: connectorId
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            ).then((data)=>{
                notify({
                    title: data.message,
                    description: "",
                    status: "success",
                });
                const socket = getSocketInstance();
             if(socket){
                socket.emit('getDepartments', {
                    clinicaId: auth?.clinica?._id,
                    next: true,
                    clientId: undefined,
                    departments_ids: [doctorClients[0].services[0].department?._id]
                }, (response) => {
                    console.log('Socket response:', response);
                    socket.disconnect();
                    socket=null;
                    console.log('Socket disconnected!');
                });
             }else {
                console.error('Socket connection is not established.');
            }
        
                setModal(false);
                getDoctorClients(beginDay, endDay);
            })
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const [modalText, setModalText] = useState("")
    const [connectorId, setConnectorId] = useState(null)

    const handleApprove = (connector) => {
        setConnectorId(connector.connector._id)
        setModalText(`${connector.client.firstname} ${connector.client.lastname} ${t("qabul qilishni tasdiqlaysizmi?")}`)
        setModal(true);
    }

    //=====================================================================
    //=====================================================================

    return (
        <>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <BloodTestTables
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            searchId={searchId}
                            searchFullname={searchFullname}
                            doctorClients={doctorClients}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            currentDoctorClients={currentDoctorClients}
                            setCurrentDoctorClients={setCurrentDoctorClients}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            loading={loading}
                            handleApprove={handleApprove}
                        />
                    </div>
                </div>
            </div>
            <Modal
                text={modalText}
                modal={modal}
                setModal={setModal}
                handler={approveLab}
            />
        </>
    );
};
