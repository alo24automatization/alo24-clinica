import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkData } from "./checkData/checkData";

import { CheckModal } from "../components/ModalCheck";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import socketIOClient from "socket.io-client";

export const OfflineClients = () => {
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
  const [modal1, setModal1] = useState(false);
  //====================================================================
  //====================================================================
  const { t } = useTranslation();
  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false);
  const [openSmallCheck, setOpenSmallCheck] = useState(false);
  const changeVisible = () => setVisible(!visible);

  //====================================================================
  //====================================================================
  const [smallCheckType, setSmallCheckType] = useState("all");
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
  const [check, setCheck] = useState({});
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

  const [isActive, setIsActive] = useState(true);

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
          `/api/cashier/offline/getall`,
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
  //====================================================================

  const getConnectorsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/cashier/offline/getall`,
        "POST",
        {
          clinica: auth && auth.clinica._id,
          clientborn: new Date(e.target.value),
        },
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
        item.client.id.toString().includes(e.target.value)
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
  // CLIENT

  const [client, setClient] = useState({
    clinica: auth.clinica && auth.clinica._id,
    reseption: auth.user && auth.user._id,
  });
  const [connector, setConnector] = useState({
    clinica: auth.clinica && auth.clinica._id,
    probirka: 0,
  });

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

  //====================================================================
  //====================================================================
  // Payment

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [index, setIndex] = useState();

  const [payments, setPayments] = useState(0);
  const [totalpayment, setTotalPayment] = useState(0);
  const [payment, setPayment] = useState({
    payment: 0,
    card: 0,
    cash: 0,
    transfer: 0,
    debt: 0,
    type: "",
  });
  const [discount, setDiscount] = useState({
    discount: 0,
  });
  const location = useLocation();
  const history = useHistory();
  const IsPayFromReseption =
    sessionStorage.getItem("payFromReseption") === "payFromReseption";
  const IsPayFromReseptionAndMonoblok = auth?.clinica?.showRegisterOnMonoblok;
  const client_id = sessionStorage.getItem("client_id");
  const [openPayModal, setOpenPayModal] = useState(false);
  useEffect(() => {
    if (client_id) {
      if (loading === false && connectors.length > 0) {
        const connector = connectors.find((c) => c.client._id === client_id);
        if (connector) {
          const index = connectors.indexOf(connector);
          changeClient(connector, index);
          changeVisible();
          setOpenPayModal(true);
        }
      }
    }
  }, [connectors, loading]);

  const changeClient = useCallback((connector, index) => {
    setIndex(index);
    let total = 0;
    let services = [];
    let products = [];
    let servs = JSON.parse(JSON.stringify(connector?.services || ""));
    for (const serv of servs) {
      serv.isPayment = serv.payment;
      if (!serv.payment && !serv.refuse) {
        services.push(serv._id);
        serv.payment = true;
      }
      if (serv.payment && !serv.refuse) {
        total += serv.service.price * serv.pieces;
      }
    }
    let prods = JSON.parse(JSON.stringify(connector?.products || ""));
    for (const prod of prods) {
      if (!prod.payment && !prod.refuse) {
        products.push(prod._id);
        prod.payment = true;
      }
      if (prod.payment) {
        total += prod.product.price * prod.pieces;
      }
    }

    setServices(servs);
    setProducts(prods);

    setClient(JSON.parse(JSON.stringify(connector.client)));
    setConnector({ ...connector });

    let payments = connector.payments.reduce((summa, payment) => {
      return summa + payment.payment;
    }, 0);

    setPayments(payments);

    setPayment({
      total: total,
      payment: 0,
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
      card: 0,
      cash: 0,
      transfer: 0,
      debt: 0,
      services: [...services],
      products: [...products],
    });
    setTotalPayment(total);

    if (connector.discount) {
      setDiscount(connector.discount);
    } else {
      setDiscount({
        total: total,
        discount: 0,
        clinica: connector.clinica,
        client: connector.client._id,
        connector: connector._id,
      });
    }
    history.replace({ ...history.location, state: undefined });
  }, []);

  const changeService = (e, index) => {
    let servs = [...services];
    let prods = [...products];
    if (e.target.checked) {
      servs[index].payment = true;
      servs[index].refuse = false;
      delete servs[index].comment;
    } else {
      servs[index].payment = false;
      servs[index].refuse = true;
    }

    let total = 0;
    let servicess = [];
    let productss = [];
    for (const i in servs) {
      if (!connector.services[i].payment && servs[i].payment) {
        servicess.push(servs[i]._id);
      }
      if (servs[i].payment) {
        total += servs[i].service.price * servs[i].pieces;
      }
    }

    for (const i in prods) {
      if (!connector.products[i].payment && prods[i].payment) {
        productss.push(prods[i]._id);
      }
      if (prods[i].payment) {
        total += prods[i].product.price * prods[i].pieces;
      }
    }

    setServices(servs);
    setPayment({
      total: total,
      payment: 0,
      debt: 0,
      card: 0,
      cash: 0,
      transfer: 0,
      type: "",
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
      services: [...servicess],
      products: [...productss],
    });

    setTotalPayment(total);
    setDiscount({
      total: total,
      discount: 0,
      procient: 0,
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
    });
  };

  const changeProduct = (e, index) => {
    let servs = [...services];
    let prods = [...products];
    if (e.target.checked) {
      prods[index].payment = true;
      prods[index].refuse = false;
      delete prods[index].comment;
    } else {
      prods[index].payment = false;
      prods[index].refuse = true;
    }

    let total = 0;
    let servicess = [];
    let productss = [];
    for (const i in servs) {
      if (!connector.services[i].payment && servs[i].payment) {
        servicess.push(servs[i]._id);
      }
      if (servs[i].payment) {
        total += servs[i].service.price * servs[i].pieces;
      }
    }

    for (const i in prods) {
      if (!connector.products[i].payment && prods[i].payment) {
        productss.push(prods[i]._id);
      }
      if (prods[i].payment) {
        total += prods[i].product.price * prods[i].pieces;
      }
    }

    setProducts(prods);
    setPayment({
      total: total,
      payment: 0,
      debt: 0,
      card: 0,
      cash: 0,
      transfer: 0,
      type: "",
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
      services: [...servicess],
      products: [...productss],
    });

    setTotalPayment(total);
    setDiscount({
      total: total,
      discount: 0,
      procient: 0,
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
    });
  };

  const serviceComment = (e, index) => {
    let servs = [...services];
    servs[index].comment = e.target.value;
    setServices(servs);
  };
  const productComment = (e, index) => {
    let prods = [...products];
    prods[index].comment = e.target.value;
    setProducts(prods);
  };

  const changeDiscount = (e) => {
    let total = 0;
    let servs = [];
    for (const i in services) {
      if (services[i].payment) {
        total += services[i].service.price * services[i].pieces;
        servs.push(services[i]._id);
      }
    }

    let disc = 0;
    if (e.target.value !== "") disc = parseInt(e.target.value);

    if (disc > total) {
      e.target.value = parseInt(parseInt(e.target.value) / 10);
      return notify({
        title: t(
          "Diqqat! Chegirma summasi umumiy xizmatlar summasidan oshmasligi kerak!"
        ),
        description: "",
        status: "error",
      });
    }

    if (disc <= 100) {
      setDiscount({
        ...discount,
        procient: disc,
        total,
        discount: parseInt((total * disc) / 100),
        services: [...servs],
      });
      setPayment({
        ...payment,
        total: totalpayment,
        debt: 0,
        card: 0,
        cash: 0,
        transfer: 0,
        type: "",
        payment: 0,
      });
    } else {
      setDiscount({
        ...discount,
        procient: 0,
        discount: disc,
        total,
        services: [...servs],
      });
      setPayment({
        ...payment,
        total: totalpayment,
        debt: 0,
        card: 0,
        cash: 0,
        transfer: 0,
        type: "",
        payment: 0,
      });
    }
  };

  const discountComment = (e) => {
    if (e.target.value === "delete") {
      let s = discount;
      delete s.comment;
      setDiscount(s);
    } else {
      setDiscount({ ...discount, comment: e.target.value });
    }
  };

  const changeDebt = (e) => {
    let debt = 0;
    if (e.target.value !== "") debt = parseInt(e.target.value);

    if (debt > totalpayment - discount.discount - payments) {
      e.target.value = parseInt(parseInt(e.target.value) / 10);
      return notify({
        title: t(
          "Diqqat! Qarz summasi umumiy to'lov summasidan oshmasligi kerak!"
        ),
        description: "",
        status: "error",
      });
    }
    setPayment({
      ...payment,
      total: totalpayment,
      card: 0,
      cash: 0,
      transfer: 0,
      type: "",
      debt: debt,
      payment: totalpayment - payments - discount.discount - debt,
    });
  };

  const debtComment = (e) => {
    setPayment({
      ...payment,
      comment: e.target.value,
    });
  };
  const inputPayment = (e) => {
    let m = e.target.value === "" ? 0 : parseInt(e.target.value);

    switch (e.target.name) {
      case "cash":
        if (
          (totalpayment - payments <
            m + payment.card + payment.transfer + discount.discount &&
            m > 0) ||
          (totalpayment - payments >
            m + payment.card + payment.transfer + discount.discount &&
            m < 0)
        ) {
          return notify({
            title: t(
              "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!"
            ),
            description: "",
            status: "error",
          });
        }
        return setPayment({
          ...payment,
          [e.target.name]: m,
          payment: m + payment.card + payment.transfer,
          debt:
            totalpayment -
            (payments +
              discount.discount +
              m +
              payment.card +
              payment.transfer),
        });
      case "card":
        if (
          (totalpayment - payments <
            m + payment.cash + payment.transfer + discount.discount &&
            m > 0) ||
          (totalpayment - payments >
            m + payment.cash + payment.transfer + discount.discount &&
            m < 0)
        ) {
          return notify({
            title: t(
              "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!"
            ),
            description: "",
            status: "error",
          });
        }
        return setPayment({
          ...payment,
          [e.target.name]: m,
          payment: m + payment.cash + payment.transfer,
          debt:
            totalpayment -
            (payments +
              discount.discount +
              m +
              payment.cash +
              payment.transfer),
        });
      case "transfer":
        if (
          (totalpayment - payments <
            m + payment.card + payment.cash + discount.discount &&
            m > 0) ||
          (totalpayment - payments >
            m + payment.card + payment.cash + discount.discount &&
            m < 0)
        ) {
          return notify({
            title: t(
              "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!"
            ),
            description: "",
            status: "error",
          });
        }
        return setPayment({
          ...payment,
          [e.target.name]: m,
          payment: m + payment.card + payment.cash,
          debt:
            totalpayment -
            (payments + discount.discount + m + payment.card + payment.cash),
        });
      default:
    }
  };

  const setAll = useCallback(() => {
    setServices([]);
    setProducts([]);
    setPayment({
      payment: 0,
      card: 0,
      cash: 0,
      transfer: 0,
      debt: 0,
      type: "",
    });
    setDiscount({
      discount: 0,
    });
    setIndex();
    setPayments(0);
    setClient({
      clinica: auth.clinica && auth.clinica._id,
      reseption: auth.user && auth.user._id,
    });
    setConnector({
      clinica: auth.clinica && auth.clinica._id,
      probirka: 0,
    });
    setTotalPayment(0);
  }, [auth]);
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // CreatePayment

  const checkPayment = () => {
    if (checkData(totalpayment, payment, discount, services, products)) {
      return toast(
        checkData(totalpayment, payment, discount, services, products)
      );
    }
    setModal(true);
    return true;
  };
  const createHandler = async () => {
    setIsActive(false);
    try {
      await request(
        `/api/cashier/offline/payment`,
        "POST",
        {
          payment: { ...payment },
          discount: { ...discount },
          services: [...services],
          products: [...products],
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      ).then((data) => {
        localStorage.setItem("data", data);
        setModal(false);
        setVisible(false);
        const socket = socketIOClient(ENDPOINT, {
          path: "/ws",
          withCredentials: true,
        });
        socket.on("connect", () => {
          socket.emit(
            "getDepartments",
            {
              clinicaId: auth?.clinica?._id,
              next: true,
              clientId: undefined,
              departments_ids: [services[0].department?._id],
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
          
          setIsActive(true);
        });

        notify({
          title: t("To'lov muvaffaqqiyatli amalga oshirildi."),
          description: "",
          status: "success",
        });
        setAll();
        setCheck(data);


        setTurnCheckData(data);
        if (auth.clinica?.reseption_and_pay) {
          setOpenSmallCheck(IsPayFromReseption);

          sessionStorage.removeItem("payFromReseption");
          sessionStorage.removeItem("modeMonoblok");
          sessionStorage.removeItem("client_id");
          if (IsPayFromReseption) {
            history.push("/alo24");
          }
        }
        // setSmallCheckType("done");
        getConnectors(beginDay, endDay);
        setTimeout(() => {
          setIsActive(true);
        }, 1000);
        setOpenSmallCheck(true);
        setTimeout(() => {
          setOpenSmallCheck(false);
        }, 1000);
        setTimeout(() => {
          setSmallCheckType("all");
        }, 1005);
      });
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
      setIsActive(true);
    }
  };
  // useEffect

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth.clinica && !s) {
      setS(1);
      getConnectors(beginDay, endDay);
      getBaseUrl();
    }
  }, [auth, getConnectors, getBaseUrl, s, beginDay, endDay]);
  const [turnCheckData, setTurnCheckData] = useState(null);
  //====================================================================
  //====================================================================
  return (
    <div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100 ${
                    visible ? "d-none" : ""
                  }`}
                  onClick={changeVisible}
                >
                  {t("Malumot")}
                </button>
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100 ${
                    visible ? "" : "d-none"
                  }`}
                  onClick={changeVisible}
                >
                  {t("Malumot")}
                </button>
              </div>
            </div>
            <div className={` ${visible ? "" : "d-none"}`}>
              <RegisterClient
                openPayModal={openPayModal}
                setOpenPayModal={setOpenPayModal}
                IsPayFromReseptionAndMonoblok={IsPayFromReseptionAndMonoblok}
                inputPayment={inputPayment}
                totalpayment={totalpayment}
                checkPayment={checkPayment}
                createHandler={createHandler}
                debtComment={debtComment}
                changeDebt={changeDebt}
                serviceComment={serviceComment}
                productComment={productComment}
                discountComment={discountComment}
                discount={discount}
                changeDiscount={changeDiscount}
                setPayment={setPayment}
                changeProduct={changeProduct}
                changeService={changeService}
                payments={payments}
                payment={payment}
                client={client}
                index={index}
                services={services}
                products={products}
                setServices={setServices}
                setProducts={setProducts}
                loading={loading}
                connector={connector}
              />
            </div>
            <TableClients
              turnCheckData={turnCheckData}
              setTurnCheckData={setTurnCheckData}
              setVisible={setVisible}
              modal1={modal1}
              setModal1={setModal1}
              setCheck={setCheck}
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchPhone={searchPhone}
              changeClient={changeClient}
              setConnector={setConnector}
              searchFullname={searchFullname}
              searchId={searchId}
              connectors={connectors}
              searchProbirka={searchProbirka}
              setConnectors={setConnectors}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentConnectors={currentConnectors}
              setCurrentConnectors={setCurrentConnectors}
              currentPage={currentPage}
              setPageSize={setPageSize}
              // setModal2={setModal2}
              loading={loading}
              searchStorage={searchStorage}
              getConnectorsByClientBorn={getConnectorsByClientBorn}
              beginDay={beginDay}
              endDay={endDay}
            />
          </div>
        </div>
      </div>

      <CheckModal
        turnCheckData={turnCheckData}
        baseUrl={baseUrl}
        openSmallCheck={openSmallCheck}
        connector={check}
        clinica={auth && auth.clinica}
        user={auth && auth.user}
        modal={modal1}
        setModal={setModal1}
        smallCheckType={smallCheckType}
        setSmallCheckType={setSmallCheckType}
      />

      <Modal
        modal={modal}
        text={
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("Hisobot")}</div>
            </div>
            <div className="card-body">
              <table className="table table-sm">
                <tfoot>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Jami to'lov")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {totalpayment}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Chegirma")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {discount.discount}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("To'langan")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {payments}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("Qarz")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {payment.debt}
                    </th>
                  </tr>
                  <tr>
                    <th className="text-right" colSpan={2}>
                      {t("To'lanayotgan")}:
                    </th>
                    <th className="text-left" colSpan={4}>
                      {payment.payment}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        }
        setModal={setModal}
        handler={() => isActive && createHandler()}
        basic={client.lastname + " " + client.firstname}
      />
    </div>
  );
};
