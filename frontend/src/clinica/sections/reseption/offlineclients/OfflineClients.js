import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import {
  checkClientData,
  checkProductsData,
  checkServicesData,
} from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import AllServices from "../components/AllServices";
import { useTranslation } from "react-i18next";
import Print from "../../laborotory/components/Print";
import AllModal from "./clientComponents/AllModal";
import { useLocation, useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";

export const OfflineClients = () => {
  const history = useHistory();
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

  const [servicesBody, setServicesBody] = useState([]);
  const [selectedDepartament, setSelectedDepartament] = useState(null);
  const [newCounterDoctor, setNewCounterDoctor] = useState({
    value: "",
    visible: false,
  });

  //====================================================================
  //====================================================================

  const { state } = useLocation();

  //====================================================================
  //====================================================================

  const [isAddService, setIsAddService] = useState(false);

  //====================================================================
  //====================================================================

  const { t } = useTranslation();

  //====================================================================
  //====================================================================

  const [connectorPrint, setConnectorPrint] = useState({});
  const [clientPrint, setClientPrint] = useState({});

  //====================================================================
  //====================================================================

  const [printBody, setPrintBody] = useState(null);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
    [toast]
  );
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================
  const [isActive, setIsActive] = useState(true);
  //====================================================================
  //====================================================================
  // getConnectors
  const [connectors, setConnectors] = useState([]);
  const [searchStorage, setSearchStrorage] = useState([]);
  const [lastCardNumber, setLastCardNumber] = useState(0);
  const getConnectors = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/offlineclient/client/getallreseption`,
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
  const getLastCardNumber = async () => {
    try {
      const { card_number } = await request(
        `/api/offlineclient/client/lastCardNumber/${auth && auth.clinica._id}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setLastCardNumber(card_number);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };
  //====================================================================
  //====================================================================

  const getConnectorsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth.clinica._id, clientborn: new Date(e) },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnectors(data);
      setSearchStrorage(data);
      setCurrentConnectors(data.slice(indexFirstConnector, indexLastConnector));
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //====================================================================
  //====================================================================

  const [clientId, setClientId] = useState("");

  const getClientsById = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth.clinica._id, clientId },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnectors(data);
      setSearchStrorage(data);
      setCurrentConnectors(data.slice(indexFirstConnector, indexLastConnector));
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //====================================================================
  //====================================================================

  const [name, setName] = useState("");

  const getByClientName = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth.clinica._id, name },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnectors(data);
      setSearchStrorage(data);
      setCurrentConnectors(data.slice(indexFirstConnector, indexLastConnector));
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //====================================================================
  //====================================================================

  const [phone, setPhone] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);
  const getByClientPhone = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/getallreseption`,
        "POST",
        { clinica: auth && auth.clinica._id, phone },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setConnectors(data);
      setSearchStrorage(data);
      setCurrentConnectors(data.slice(indexFirstConnector, indexLastConnector));
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

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
      setName(e.target.value);
      setConnectors(searching);
      setCurrentConnectors(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
  );

  const searchId = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.id.toString().includes(e.target.value)
      );
      setClientId(e.target.value);
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
      setPhone(e.target.value);
      setConnectors(searching);
      setCurrentConnectors(searching.slice(0, countPage));
    },
    [searchStorage, countPage]
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
  });

  const [check, setCheck] = useState({});

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const changeService = (services) => {
    let s = [];
    services.map((service) => {
      if (service.department.probirka) {
        setConnector({ ...connector, probirka: 1, clinica: auth.clinica._id });
      }
      return s.push({
        clinica: auth.clinica._id,
        reseption: auth.user._id,
        serviceid: service.service._id,
        service: service.service,
        department: service.department._id,
        addUser: "Qabulxona",
        pieces: 1,
      });
    });
    setServices(s);
    setSelectedServices(services);
  };

  //====================================================================
  //====================================================================

  const [isAddConnector, setIsAddConnector] = useState(false);

  //====================================================================
  //====================================================================
  // COUNTERDOCTORS
  const [counterdoctors, setCounterDoctors] = useState([]);

  const getCounterDoctors = useCallback(async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/counter_doctors/get`,
        "POST",
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setCounterDoctors(
        [...data].map((item) => ({
          value: item._id,
          label: item.firstname + " " + item.lastname,
        }))
      );
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);

  const [counterdoctor, setCounterDoctor] = useState(null);
  const [selectedCounterdoctor, setSelectedCounterDoctor] = useState(null);

  const changeCounterDoctor = (selectedOption) => {
    if (selectedOption.value === "delete") {
      setCounterDoctor(null);
      setSelectedCounterDoctor(null);
    } else {
      setCounterDoctor(selectedOption.value);
      setSelectedCounterDoctor(selectedOption);
    }
  };
  useEffect(() => {
    if (selectedCounterdoctor) {
      setCounterDoctor(selectedCounterdoctor.value);
    }
  }, [selectedCounterdoctor]);
  //====================================================================
  //====================================================================

  const [serviceTypes, setServiceTypes] = useState([]);

  const getServiceTypes = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/servicetype/getall`,
        "POST",
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setServiceTypes(data);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);

  //====================================================================
  //====================================================================
  // ADVERS
  const [advers, setAdvers] = useState([]);
  const [requiredFields, setRequiredFieds] = useState(null);
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
  // Required Fields
  const getRequiredFields = useCallback(async () => {
    try {
      const data = await request(
        `/api/clinica/requiredFields/${auth.clinica._id}`,
        "GET",
        null
      );
      setRequiredFieds(data.requiredFields);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  });
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // CLIENT

  const [clientDate, setClientDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [client, setClient] = useState({
    clinica: auth.clinica && auth.clinica._id,
    reseption: auth.user && auth.user._id,
    born: new Date(),
  });

  const changeClientData = (e) => {
    let key = e.target.name;
    let value = e.target.value;
    if (key === "lastname" && value.endsWith(" ")) {
      document.querySelector('input[id="client_firstname"]').focus();
    }
    if (key === "firstname" || key === "lastname" || key === "fathername") {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setClient({ ...client, [key]: value });
  };

  const changeClientBorn = (e) => {
    setClientDate(e.target.value);
    setClient({ ...client, born: new Date(e.target.value) });
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
    setCounterDoctor(null);
    setNewProducts([]);
    setServices([]);
    setSelectedDepartament(null);
    setSelectedProducts([]);
    setSelectedServices([]);
    setClientDate(new Date().toISOString().slice(0, 10));
    setIsAddConnector(false);
    setCounterDoctor(null);
    setSelectedCounterDoctor(null);
  }, [auth]);

  const checkData = () => {
    if (checkClientData(client, t)) {
      return notify(checkClientData(client, t));
    }

    if (checkServicesData(services && services, t)) {
      return notify(checkServicesData(services, t));
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
  const navigateToPay = (client_id) => {
    if (auth.clinica.reseption_and_pay) {
      history.push({
        pathname: "/alo24/cashier",
        search: "?payFromReseption=true",
        state: {
          client_id,
        },
      });
      sessionStorage.setItem("payFromReseption", "payFromReseption");
    }
  };
  const location = useLocation();

  // Function to parse query string
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  // Get the query parameters
  const queryParams = getQueryParams(location.search);
  const fromQuery = queryParams.get("from");

  const createHandler = useCallback(async () => {
    setIsActive(false);
    try {
      const data = await request(
        `/api/offlineclient/client/register`,
        "POST",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          services: [...services],
          products: [...newproducts],
          counterdoctor: counterdoctor,
          adver: { ...adver, clinica: auth.clinica._id },
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
      navigateToPay(data?.client?._id);
      setConnectors(s);
      setSearchStrorage(s);
      setCurrentConnectors(s.slice(indexFirstConnector, indexLastConnector));
      setModal(false);
      clearDatas();
      setVisible(false);
      getLastCardNumber();
      const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
      const socket = socketIOClient(ENDPOINT, {
        path: "/ws",
        withCredentials: true,
      });
      socket.on("connect", () => {
        console.log("Socket connected!");
        socket.emit(
          "getDepartmentsOnline",
          {
            clinicaId: auth?.clinica?._id,
            departments_id: services[0].department?._id,
          },
          (response) => {
            console.log("Socket response:", response);
            // Disconnect the socket after the operation
            socket.disconnect();
            console.log("Socket disconnected!");
          }
        );
      });

      socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
        notify({
          title: t("Socket connection error."),
          description: "",
          status: "error",
        });
        setIsActive(true);
      });
      localStorage.removeItem("newClient");
      setTimeout(() => {
        setIsActive(true);
      }, 5000);
      if (fromQuery === "doctor")
        setTimeout(() => {
          history.push("/alo24");
        }, 0);
      history.replace({
        pathname: history.location.pathname,
        state: {},
      });
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
      setIsActive(true);
    }
  }, [
    auth,
    client,
    connector,
    notify,
    services,
    newproducts,
    request,
    indexLastConnector,
    indexFirstConnector,
    connectors,
    clearDatas,
    adver,
    counterdoctor,
  ]);

  const updateHandler = useCallback(async () => {
    setIsActive(false);
    if (checkClientData(client)) {
      return notify(checkClientData(client));
    }
    try {
      const data = await request(
        `/api/offlineclient/client/update`,
        "PUT",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          counterdoctor: counterdoctor,
          adver: { ...adver, clinica: auth.clinica._id },
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      getConnectors(beginDay, endDay);
      notify({
        title: `${data.lastname + " " + data.firstname}  ${t(
          "ismli mijoz ma'lumotlari muvaffaqqiyatl yangilandi."
        )}`,
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
    counterdoctor,
    connector,
    notify,
    request,
    clearDatas,
    getConnectors,
    beginDay,
    endDay,
  ]);

  const addHandler = useCallback(async () => {
    setIsActive(false);
    try {
      const data = await request(
        `/api/offlineclient/client/add`,
        "POST",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          services: [...services],
          products: [...newproducts],
          counterdoctor: counterdoctor,
          adver: { ...adver, clinica: auth.clinica._id },
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      localStorage.setItem("data", data);
      navigateToPay(data?.client?._id);
      getConnectors(beginDay, endDay);
      notify({
        title: `${client.lastname + " " + client.firstname}  ${t(
          "ismli mijozga xizmatlar muvaffaqqiyatli qo'shildi."
        )}`,
        description: "",
        status: "success",
      });
      clearDatas();
      setModal(false);
      setVisible(false);
      setTimeout(() => {
        setIsActive(true);
      }, 5000);
      setIsAddService(false);
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
    services,
    newproducts,
    connector,
    adver,
    counterdoctor,
    beginDay,
    endDay,
    notify,
    request,
    clearDatas,
    getConnectors,
  ]);
  const addConnectorHandler = async () => {
    setIsActive(false);
    try {
      const data = await request(
        `/api/offlineclient/client/connector/add`,
        "POST",
        {
          client: { ...client, clinica: auth.clinica._id },
          connector: { ...connector, clinica: auth.clinica._id },
          services: [...services],
          products: [...newproducts],
          counterdoctor: counterdoctor,
          adver: { ...adver, clinica: auth.clinica._id },
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      navigateToPay(data?.client?._id);
      getConnectors(beginDay, endDay);
      clearDatas();
      setModal(false);
      setTimeout(() => {
        setIsActive(true);
      }, 5000);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

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
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59));

    setEndDay(date);
    getConnectors(beginDay, date);
  };
  const handleNewCounterDoctorInputChange = (e) => {
    let value = e.target.value;
    setNewCounterDoctor({ ...newCounterDoctor, value });
  };
  const handleNewCounterDoctorCreate = async () => {
    let nameParts = newCounterDoctor.value.split(" ");
    let firstname = nameParts[0];
    let lastname = nameParts.slice(1).join(" ");
    try {
      const data = await request(
        `/api/counter_agent/doctor/create`,
        "POST",
        {
          clinica: auth.clinica._id,
          firstname,
          lastname,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      getCounterDoctors();
      setTimeout(() => {
        setCounterDoctor(data?._id);
        setSelectedCounterDoctor({
          value: data?._id,
          label: firstname + " " + lastname,
        });
        showNewCounterDoctor();
      }, 0);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };
  const showNewCounterDoctor = () =>
    setNewCounterDoctor((prev) => ({ value: "", visible: !prev.visible }));
  //====================================================================
  //====================================================================
  // useEffect

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth.clinica && !s) {
      setS(1);
      getConnectors(beginDay, endDay);
      getDepartments();
      getLastCardNumber();
      getCounterDoctors();
      getAdvers();
      getProducts();
      getBaseUrl();
      getRequiredFields();
    }
  }, [
    auth,
    getConnectors,
    getAdvers,
    s,
    getProducts,
    getCounterDoctors,
    getDepartments,
    getBaseUrl,
    beginDay,
    endDay,
  ]);
  useEffect(() => {
    if (state?.onlineclient) {
      let onlineclient = state?.onlineclient;
      setClient({
        onlineClientId: onlineclient._id,
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
        firstname: onlineclient.firstname,
        lastname: onlineclient.lastname,
        phone: onlineclient.phone,
        brondate: onlineclient.brondate,
        bronTime: onlineclient.bronTime,
        queue: onlineclient.queue,
      });
      setVisible(true);
      setSelectedDepartament(onlineclient?.department);
      let s = [];
      onlineclient?.service?.map((service) => {
        if (service?.department?.probirka) {
          setConnector({
            ...connector,
            probirka: 1,
            clinica: auth.clinica._id,
          });
        }
        return s.push({
          clinica: auth?.clinica?._id,
          reseption: auth?.user._id,
          serviceid: service._id,
          service: service,
          department: service?.department?._id,
          addUser: "Qabulxona",
          pieces: 1,
        });
      });
      setServices(s);
      setSelectedServices(
        onlineclient.service.map((service) => ({
          label: (
            <div className="w-full flex justify-between items-center gap-x-2">
              <span>{service.name}</span>
              <span className="p-1 rounded-sm !bg-green-500 font-medium  text-white">
                {service.price} so'm
              </span>
            </div>
          ),
          price: service.price,
          name: service.name,
          value: service._id,
          service: service,
          department: onlineclient.department,
        }))
      );
    }
  }, [state?.onlineclient]);
  //=================================================== =================
  //====================================================================
  return (
    <div className="min-h-full">
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100 `}
                  onClick={() => {
                    changeVisible();
                    if (visible === false) {
                      setIsNewClient(true);
                    } else {
                      setIsNewClient(false);
                    }
                  }}
                >
                  {t("Registratsiya")}
                </button>
              </div>
            </div>
            <div className={` ${visible ? "" : "d-none"}`}>
              <RegisterClient
                lastCardNumber={lastCardNumber}
                isNewClient={isNewClient}
                requiredFields={requiredFields}
                isAddService={isAddService}
                newCounterDoctor={newCounterDoctor}
                setNewCounterDoctor={setNewCounterDoctor}
                handleNewCounterDoctorCreate={handleNewCounterDoctorCreate}
                handleNewCounterDoctorInputChange={
                  handleNewCounterDoctorInputChange
                }
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
                selectedDepartament={selectedDepartament}
                setSelectedDepartament={setSelectedDepartament}
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
              />
            </div>
            <TableClients
              selectedDepartament={selectedDepartament}
              setSelectedDepartament={setSelectedDepartament}
              setIsAddService={setIsAddService}
              setVisible={setVisible}
              modal1={modal1}
              setModal1={setModal1}
              setCheck={setCheck}
              getConnectorsByClientBorn={getConnectorsByClientBorn}
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchPhone={searchPhone}
              setClient={setClient}
              isNewClient={isNewClient}
              setIsNewClient={setIsNewClient}
              setSelectedCounterDoctor={setSelectedCounterDoctor}
              searchFullname={searchFullname}
              searchId={searchId}
              connectors={connectors}
              searchProbirka={searchProbirka}
              // setModal={setModal}
              setConnectors={setConnectors}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              setConnector={setConnector}
              currentConnectors={currentConnectors}
              setCurrentConnectors={setCurrentConnectors}
              currentPage={currentPage}
              setPageSize={setPageSize}
              // setModal2={setModal2}
              loading={loading}
              setClientDate={setClientDate}
              setIsAddConnector={setIsAddConnector}
              getClientsById={getClientsById}
              getByClientName={getByClientName}
              getByClientPhone={getByClientPhone}
              setPrintBody={setPrintBody}
              handlePrint={handlePrint}
              counterdoctors={counterdoctors}
              setCounterDoctor={setCounterDoctor}
              allModalHandle={(services, connector, client) => {
                setServicesBody(services);
                setConnectorPrint(connector);
                setClientPrint(client);
                setTimeout(() => {
                  setModal2(true);
                }, 1000);
              }}
            />
          </div>
        </div>
      </div>

      <CheckModal
        clinica={auth && auth.clinica}
        baseUrl={baseUrl}
        connector={check}
        modal={modal1}
        setModal={setModal1}
      />

      <div className="d-none">
        <div className="container p-4 bg-white text-center" ref={componentRef}>
          {printBody && (
            <Print
              baseUrl={baseUrl}
              clinica={auth?.clinica}
              connector={printBody}
              client={printBody?.client}
              sections={printBody?.services}
            />
          )}
        </div>
      </div>

      <Modal
        modal={modal}
        text={t("ma'lumotlar to'g'ri kiritilganligini tasdiqlaysizmi?")}
        setModal={setModal}
        handler={
          client._id && !isAddConnector
            ? isActive && addHandler
            : client._id && isAddConnector
            ? isActive && addConnectorHandler
            : isActive && createHandler
        }
        basic={client.lastname + " " + client.firstname}
      />
      <AllModal
        modal={modal2}
        services={servicesBody}
        setModal={setModal2}
        handler={handlePrint}
        client={clientPrint}
        connector={connectorPrint}
        clinica={auth?.clinica}
        doctor={auth?.user}
        baseUrl={baseUrl}
      />
    </div>
  );
};
