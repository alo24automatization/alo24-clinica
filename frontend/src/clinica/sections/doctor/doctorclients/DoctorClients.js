import {useToast} from "@chakra-ui/react";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import {useReactToPrint} from "react-to-print";
import {AuthContext} from "../../../context/AuthContext";
import {useHttp} from "../../../hooks/http.hook";
import AdoptionTemplate from "../components/AdoptionTemplate";
import Print from "../components/Print";
import {TableClients} from "./clientComponents/TableClients";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import {
    checkClientData,
    checkProductsData,
    checkServicesData
} from "../../reseption/offlineclients/checkData/checkData";
import {Modal} from "../../reseption/components/Modal";
import {useTranslation} from "react-i18next";
import {RegisterClient} from "../../reseption/offlineclients/clientComponents/RegisterClient";
import {useHistory} from "react-router-dom";
import socketIOClient from "socket.io-client";

const animatedComponents = makeAnimated()

export const DoctorClients = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
    //====================================================================
    //====================================================================
    const {t} = useTranslation()

    //====================================================================
    //====================================================================

    const [isAddConnector, setIsAddConnector] = useState(false)

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
        [toast]
    );
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const {request, loading} = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    const [clientsType, setClientsType] = useState('offline')

    //====================================================================
    //====================================================================
    // getConnectors
    const [doctorClients, setDoctorClients] = useState([]);
    const [searchStorage, setSearchStorage] = useState([]);
    const [currentDoctorClients, setCurrentDoctorClients] = useState([]);
    const [updatedCliets, setUpdatesClients] = useState([])
    const handleFilterClients = async (clientFilterData) => {
        const {complaints, diagnostics, from_age, to_age, gender, national} = clientFilterData;
        try {
            const data = await request(
                `/api/doctor/clients/getclients/filtr`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    beginDay,
                    endDay,
                    department: auth?.user?.specialty?._id,
                    clientFilterData
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setUpdatesClients(data)
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    };
    const [doctorAccessDetails, setDoctorAccessDetails] = useState(null)
    const getUserAccessDetails = async () => {
        try {
            const response = await request(`/api/user/getUserById/${auth?.user?._id}`, "GET");
            setDoctorAccessDetails({...response})
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }
    const getDoctorClients = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/doctor/clients/getclients`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        beginDay,
                        endDay,
                        department: auth?.user?.specialty?._id,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setDoctorClients([...data])
                setSearchStorage([...data]);
                setCurrentDoctorClients(
                    [...data].slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: t(error),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );


    const getStatsionarClients = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/doctor/clients/statsionarclients/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        beginDay,
                        endDay,
                        department: auth?.user?.specialty._id,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                // setDoctorClients([...data].filter(item => item.connector.room.endday === null));
                // setSearchStorage([...data].filter(item => item.connector.room.endday === null));
                // setCurrentDoctorClients(
                //   [...data].filter(item => item.connector.room.endday === null).slice(indexFirstConnector, indexLastConnector)
                // );
                setDoctorClients([...data]);
                setSearchStorage(data);
                setCurrentDoctorClients(
                    [...data].slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: t(error),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify, indexFirstConnector, indexLastConnector]
    );

    //===================================================================
    //===================================================================

    //===================================================================
    //===================================================================
    //Get by born date

    const getDoctorClientsByBorn = async (e) => {
        try {
            const data = await request(
                `/api/doctor/clients/getclients`,
                "POST",
                {
                    clientborn: new Date(new Date(e)),
                    department: auth?.user?.specialty,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }


    const getStatsionarClientsByBorn = async (e) => {
        try {
            const data = await request(
                `/api/doctor/clients/statsionarclients/get`,
                "POST",
                {
                    clientborn: new Date(new Date(e)),
                    department: auth?.user?.specialty,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }
    const ENDPOINT =
        process.env.REACT_APP_API_ENDPOINT;

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
    const callClient = (clientId, department) => {
        fetchDepartmentsTurns(false, clientId, department)
    }
    const fetchDepartmentsTurns = (next, clientId, department) => {
        const socket = getSocketInstance();
        if (socket) {
            socket.emit('getDepartments', {
                clinicaId: auth?.clinica?._id,
                next,
                clientId,
                departments_ids: [department]
            }, (response) => {
                console.log('Socket response:', response);
                socket = null;
                // Optionally, you can choose to disconnect the socket here
                // if you don't need it for further use.
                // socket.disconnect(); // Uncomment if you want to disconnect after use
            });
        } else {
            console.error('Socket connection is not established.');
        }
    };
    const getClientsByBorn = (e) => {
        if (clientsType === 'offline') {
            getDoctorClientsByBorn(e)
        } else {
            getStatsionarClientsByBorn(e)
        }
    }
    //===================================================================
    //===================================================================

    const getDoctorClientsByName = async () => {
        try {
            const data = await request(
                `/api/doctor/clients/getclients`,
                "POST",
                {
                    name: fullname,
                    department: auth?.user?.specialty?._id,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const getStatsionarClientsName = async (e) => {
        try {
            const data = await request(
                `/api/doctor/clients/statsionarclients/get`,
                "POST",
                {
                    name: fullname,
                    department: auth?.user?.specialty?._id,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const getClientsByName = () => {
        if (clientsType === 'offline') {
            getDoctorClientsByName()
        } else {
            getStatsionarClientsName()
        }
    }

    //===================================================================
    //===================================================================

    const getDoctorClientsById = async () => {
        try {
            const data = await request(
                `/api/doctor/clients/getclients`,
                "POST",
                {
                    clientId: clientId,
                    department: auth?.user?.specialty?._id,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const getStatsionarClientsId = async (e) => {
        try {
            const data = await request(
                `/api/doctor/clients/statsionarclients/get`,
                "POST",
                {
                    clientId: clientId,
                    department: auth?.user?.specialty?._id,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctorClients(data);
            setSearchStorage(data);
            setCurrentDoctorClients(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const getClientsById = () => {
        if (clientsType === 'offline') {
            getDoctorClientsById()
        } else {
            getStatsionarClientsId()
        }
    }

    //===================================================================
    //===================================================================
    const [isActive, setIsActive] = useState(true)
    //===================================================================
    //===================================================================

    const [modal, setModal] = useState(false);

    const checkData = () => {
        if (checkServicesData(newservices && newservices)) {
            return notify(checkServicesData(newservices));
        }

        if (checkProductsData(newproducts)) {
            return notify(checkProductsData(newproducts));
        }
        setModal(true);
    };

    //===================================================================
    //===================================================================

    const [client, setClient] = useState({})
    const [connector, setConnector] = useState({})


    const handleAdd = () => {
        if (clientsType === 'offline') {
            addServices()
        } else {
            addServiceStatsionar()
        }
    }

    const addServices = async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/doctor/clients/service/add`,
                "POST",
                {
                    client: {...client, clinica: auth.clinica._id},
                    connector: {...connector, clinica: auth.clinica._id},
                    services: [...newservices],
                    products: [...newproducts],
                    clinica: auth && auth.clinica._id,
                    user: auth?.user,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: data.message,
                description: "",
                status: "success",
            });
            setSelectedServices(null);
            setConnector({})
            setClient({})
            setModal(false);
            getDoctorClients(beginDay, endDay)
            setNewProducts([])
            setNewServices([])
            setVisible(false);
            setTimeout(() => {
                setIsActive(true)
            }, 5000)
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const addServiceStatsionar = async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/doctor/clients/statsionar/service/add`,
                "POST",
                {
                    client: {...client, clinica: auth.clinica._id},
                    connector: {...connector, clinica: auth.clinica._id},
                    services: [...newservices],
                    products: [...newproducts],
                    clinica: auth && auth.clinica._id
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: data.message,
                description: "",
                status: "success",
            });
            setSelectedServices(null);
            setConnector({})
            setClient({})
            setModal(false);
            getStatsionarClients(beginDay, endDay)
            setNewProducts([])
            setNewServices([])
            setVisible(false);
            setTimeout(() => {
                setIsActive(true)
            }, 5000)
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }

    const addConnectorHandler = async () => {
        setIsActive(false)
        try {
            const data = await request(
                `/api/offlineclient/client/connector/add`,
                "POST",
                {
                    client: {...client, clinica: auth.clinica._id},
                    connector: {probirka: connector?.probirka, clinica: auth.clinica._id},
                    services: [...newservices],
                    products: [...newproducts],
                    // counterdoctor: counterdoctor,
                    // adver: { ...adver, clinica: auth.clinica._id },
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setSelectedServices(null);
            setConnector({})
            setClient({})
            setModal(false);
            getDoctorClients(beginDay, endDay)
            setNewProducts([])
            setNewServices([])
            setVisible(false);
            setIsAddConnector(false)
            setTimeout(() => {
                setIsActive(true)
            }, 5000)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }

    //===================================================================
    //===================================================================
    // Searching

    const [fullname, setFullname] = useState('')
    const [clientId, setClientId] = useState('')

    const searchFullname =
        (e) => {
            const searching = [...searchStorage].filter((item) => {
                return (item?.client?.firstname + item?.client?.lastname)
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            });
            setDoctorClients(searching);
            setCurrentDoctorClients(searching.slice(0, countPage));
            setFullname(e.target.value)
        }

    const searchId =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.id.toString().includes(e.target.value)
            );
            setDoctorClients(searching);
            setCurrentDoctorClients(searching.slice(0, countPage));
            setClientId(e.target.value)
        }

    //===================================================================
    //===================================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentDoctorClients(searchStorage.slice(0, e.target.value));
        }

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        if (clientsType === 'offline') {
            getDoctorClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
        } else {
            getStatsionarClients(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
        }
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        if (clientsType === 'offline') {
            getDoctorClients(beginDay, date)
        } else {
            getStatsionarClients(beginDay, date)
        }
    };

    //====================================================================
    //====================================================================

    const [baseUrl, setBaseurl] = useState();

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request(`/api/baseurl`, "GET", null);
            setBaseurl(data.baseUrl);
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    //====================================================================
    //====================================================================

    // DEPARTMENTS
    const [departments, setDepartments] = useState([]);

    const getDepartments = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/department/reseption`,
                "POST",
                {clinica: auth.clinica._id},
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDepartments(data);
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }, [request, auth, notify]);

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
                {clinica: auth.clinica._id},
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
                title: t(error),
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

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);
    const history = useHistory()
    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getDoctorClients(beginDay, endDay);
            getDepartments()
            getBaseUrl()
            getProducts()
            getComplaints()
            getUserAccessDetails()
        }
    }, [auth, beginDay, s, endDay, getDoctorClients, getDepartments, getProducts]);


    const componentRef = useRef()
    const print = useReactToPrint({
        content: () => componentRef.current,
    })

    const [printBody, setPrintBody] = useState({
        connector: {},
        client: {},
        services: []
    })
    const handlePrint = (connector) => {
        setPrintBody(connector)
        setTimeout(() => {
            print()
        }, 1000)
    }

    //=====================================================================
    //=====================================================================

    const [newservices, setNewServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const changeService = (services) => {
        let s = [];
        services.map((service) => {
            if (service.department.probirka) {
                setConnector({...connector, probirka: 1, clinica: auth.clinica._id});
            }
            return s.push({
                clinica: auth.clinica._id,
                reseption: auth.user._id,
                serviceid: service.service._id,
                service: service.service,
                department: service.department._id,
                addUser: auth?.user?.specialty?.name,
                pieces: 1,
            });
        });
        setNewServices(s);
        setSelectedServices(services);
    };

    //=================================================================
    //=================================================================
    const [services, setServices] = useState([])

    const getServices = useCallback(
        (e) => {
            var s = []
            if (e === 'all') {
                departments.map((department) => {
                    return department.services.map((service) => {
                        return s.push({
                            label: service.name,
                            value: service._id,
                            service: service,
                            department: department,
                        })
                    })
                })
            } else {
                departments.map((department) => {
                    if (e === department._id) {
                        department.services.map((service) => {
                            s.push({
                                label: service.name,
                                value: service._id,
                                service: service,
                                department: department,
                            })
                            return ''
                        })
                    }
                    return ''
                })
            }
            setServices(s)
        },
        [departments],
    )

    const changeClientsType = (e) => {
        if (e.target.value === 'offline') {
            getDoctorClients(beginDay, endDay)
        }
        if (e.target.value === 'statsionar') {
            getStatsionarClients(beginDay, endDay)
        }
        setClientsType(e.target.value)
    }

    useEffect(() => {
        if (departments) {
            getServices('all')
        }
    }, [departments, getServices])

    //=====================================================================
    //=====================================================================
    const [complaints, setComplaints] = useState({});
    const getComplaints = async () => {
        try {
            const response = await request(`/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
                "GET",
                null, {
                    Authorization: `Bearer ${auth.token}`,
                });
            setComplaints(response)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }
    const changeAccept = (e) => {

        let searching = []

        if (e.target.value === 'accept') {
            searching = [...searchStorage].filter(connector => [...connector.services].some(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept))
        }
        if (e.target.value === 'not') {
            searching = [...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1)
        }
        if (e.target.value === 'all') {
            searching = [...searchStorage]
        }

        setDoctorClients(searching);
        setCurrentDoctorClients(searching.slice(0, countPage));
    }

    //=====================================================================
    //=====================================================================

    const sortData = (isSort, setIsSort) => {
        if (!isSort) {
            setDoctorClients([...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn));
            setCurrentDoctorClients(
                [...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn).slice(0, countPage)
            );
        } else {
            setDoctorClients([...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn));
            setCurrentDoctorClients(
                [...searchStorage].filter(connector => connector.services.filter(service => service.department._id === auth?.user?.specialty?._id && !service.department.probirka && service.accept).length < 1).sort((a, b) => b.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn - a.services.filter(s => s.department._id === auth?.user?.specialty?._id)[0].turn).slice(0, countPage)
            );
        }
        setIsSort(!isSort)
    }

    //=====================================================================
    //=====================================================================
    const navigateToCreateClient = () => {
        history.push('/alo24/clients?from=doctor');
    }
    return (
        <>
            <div className="d-none">
                <div
                    ref={componentRef}
                    className="container p-4"
                    style={{fontFamily: "times"}}
                >
                    <Print
                        doctor={auth.user}
                        connector={printBody.connector}
                        client={printBody.client}
                        sections={printBody.services}
                        clinica={auth && auth.clinica}
                        baseUrl={baseUrl}
                    />
                </div>
            </div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="flex">
                            {
                                doctorAccessDetails && doctorAccessDetails?.accessCreateClient ?
                                    <div className="col-6 text-end">
                                        <button
                                            className={`btn bg-alotrade text-white mb-2 w-100`}
                                            onClick={navigateToCreateClient}
                                        >
                                            {t("Registratsiya")}
                                        </button>
                                    </div> : null
                            }
                            <div
                                className={`col-${doctorAccessDetails && doctorAccessDetails?.accessCreateClient ? "6" : "12"} text-end`}>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100`}
                                    onClick={() => setVisible(!visible)}
                                >
                                    {t("Malumot")}
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            {/* <RegisterClient
                lastCardNumber={0}
                isNewClient={null}
                requiredFields={requiredFields}
                isAddService={isAddService}
                newCounterDoctor={newCounterDoctor}
                setNewCounterDoctor={setNewCounterDoctor}
                handleNewCounterDoctorCreate={handleNewCounterDoctorCreate}
                handleNewCounterDoctorInputChange={handleNewCounterDoctorInputChange}
                selectedServices={selectedServices}
                selectedProducts={selectedProducts}
                showNewCounterDoctor={showNewCounterDoctor}
                updateData={updateHandler}
                checkData={checkData}
                setNewProducts={setNewProducts}
                setNewServices={setServices}
                selectedCounterdoctor={selectedCounterdoctor}
                newservices={services}
                newproducts={newproducts}
                changeProduct={changeProduct}
                changeService={changeService}
                changeAdver={changeAdver}
                changeCounterDoctor={changeCounterDoctor}
                client={client}
                setClient={setClient}
                changeClientData={changeClientData}
                changeClientBorn={changeClientBorn}
                departments={departments}
                counterdoctors={counterdoctors}
                advers={advers}
                products={products}
                isAddHandler={client._id && !isAddConnector}
                isConnectorHandler={client._id && isAddConnector}
                loading={loading}
                clientDate={clientDate}
                setClientDate={setClientDate}
                setIsAddConnector={setIsAddConnector}
                servicetypes={serviceTypes}
              /> */}
                        </div>
                        <div className={` ${visible ? "bg-white" : "d-none"}`}>
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">{t("Xizmatlar bilan ishlash")}</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row gutters">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="fullName">{t("Bo'limlar")}</label>
                                                    <select
                                                        className="form-control form-control-sm selectpicker"
                                                        placeholder="Reklamalarni tanlash"
                                                        onChange={(event) => getServices(event.target.value)}
                                                    >
                                                        <option value="all"> {t("Barcha bo'limlar")}</option>
                                                        {departments.map((department, index) => {
                                                            return (
                                                                <option key={index} value={department._id}>
                                                                    {department.name}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail">{t("Xizmatlar")}</label>
                                                    <Select
                                                        value={selectedServices}
                                                        onChange={changeService}
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={services}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            padding: 0,
                                                            height: 0,
                                                        })}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail">{t("Mahsulotlar")}</label>
                                                    <Select
                                                        value={selectedProducts}
                                                        onChange={changeProduct}
                                                        closeMenuOnSelect={false}
                                                        components={animatedComponents}
                                                        options={products}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            padding: 0,
                                                            height: 0,
                                                        })}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <table className="table">
                                                    <thead>
                                                    <tr>
                                                        <th className="border bg-alotrade py-1">№</th>
                                                        <th className="border bg-alotrade py-1">{t("Nomi")}</th>
                                                        <th className="border bg-alotrade py-1">{t("Narxi")}</th>
                                                        <th className="border bg-alotrade py-1">{t("Soni")}</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {newservices &&
                                                        newservices.map((service, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="py-1">{index + 1}</td>
                                                                    <td className="py-1">{service.service.name}</td>
                                                                    <td className="text-right py-1">
                                                                        {service.service.price * service.pieces}
                                                                    </td>
                                                                    <td className="text-right py-1">
                                                                        <input
                                                                            onChange={(e) =>
                                                                                setNewServices(
                                                                                    Object.values({
                                                                                        ...newservices,
                                                                                        [index]: {
                                                                                            ...newservices[index],
                                                                                            pieces: e.target.value,
                                                                                        },
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="text-right outline-none"
                                                                            style={{maxWidth: '50px', outline: 'none'}}
                                                                            defaultValue={service.pieces}
                                                                            type="number"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    <tr className="border"></tr>
                                                    {newproducts &&
                                                        newproducts.map((product, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="py-1">{index + 1}</td>
                                                                    <td className="py-1">{product.product.name}</td>
                                                                    <td className="text-right py-1">
                                                                        {product.product.price * product.pieces}
                                                                    </td>
                                                                    <td className="text-right py-1">
                                                                        <input
                                                                            onChange={(e) =>
                                                                                setNewProducts(
                                                                                    Object.values({
                                                                                        ...newproducts,
                                                                                        [index]: {
                                                                                            ...newproducts[index],
                                                                                            pieces: e.target.value,
                                                                                        },
                                                                                    }),
                                                                                )
                                                                            }
                                                                            className="text-right outline-none"
                                                                            style={{maxWidth: '50px', outline: 'none'}}
                                                                            defaultValue={product.pieces}
                                                                            type="number"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                    <tr>
                                                        <th className="text-right" colSpan={2}>
                                                            {t("Jami")}:
                                                        </th>
                                                        <th colSpan={2}>
                                                            {newservices.reduce((summa, service) => {
                                                                    return (
                                                                        summa +
                                                                        service.service.price * parseInt(service.pieces)
                                                                    )
                                                                }, 0) +
                                                                newproducts.reduce((summa, product) => {
                                                                    return (
                                                                        summa +
                                                                        product.product.price * parseInt(product.pieces)
                                                                    )
                                                                }, 0)}
                                                        </th>
                                                    </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="text-right">
                                                    {loading ? (
                                                        <button className="bg-alotrade rounded text-white py-2 px-3"
                                                                disabled>
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                            Loading...
                                                        </button>
                                                    ) : (
                                                        <button onClick={checkData}
                                                                className="bg-alotrade rounded text-white py-2 px-3">
                                                            {t("Saqlash")}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TableClients
                            callClient={callClient}
                            sortData={sortData}
                            changeAccept={changeAccept}
                            updatedCliets={updatedCliets}
                            getClientsByName={getClientsByName}
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
                            complaints={complaints}
                            setPageSize={setPageSize}
                            loading={loading}
                            handlePrint={handlePrint}
                            handleFilterClients={handleFilterClients}
                            setClient={setClient}
                            setConnector={setConnector}
                            setVisible={setVisible}
                            clientsType={clientsType}
                            changeClientsType={changeClientsType}
                            getClientsByBorn={getClientsByBorn}
                            user={auth?.user}
                            getClientsById={getClientsById}
                            setIsAddConnector={setIsAddConnector}
                            setSelectedServices={setSelectedServices}
                            setNewServices={setNewServices}
                            setNewProducts={setNewProducts}
                        />
                    </div>
                </div>
            </div>
            <Modal
                modal={modal}
                text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
                setModal={setModal}
                handler={isActive && isAddConnector ? addConnectorHandler : isActive && handleAdd}
                basic={client.lastname + " " + client.firstname}
            />
        </>
    );
};
