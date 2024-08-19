import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import { RegisterClient } from "./clientComponents/RegisterClient";
import { TableClients } from "./clientComponents/TableClients";
import { checkData, checkServices } from "./checkData/checkData";
import { CheckModal } from "../components/ModalCheck";
import { CheckModalStatsionar } from "../../reseption/components/ModalCheckStatsionar";
import { useTranslation } from "react-i18next";
// import {
//   checkClientData,
//   checkProductsData,
//   checkServicesData,
// } from "./checkData/checkData";
// import { CheckModal } from "../components/ModalCheck";

export const StatsionarClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date(new Date().getMonth() - 3).setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setUTCHours(23, 59, 59, 59))
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

  const notify = useCallback((data) => {
    toast({
      title: data.title && data.title,
      description: data.description && data.description,
      status: data.status && data.status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }, []);
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================
  const [check, setCheck] = useState({});
  //====================================================================
  //====================================================================
  // getConnectors
  const [connectors, setConnectors] = useState([]);
  const [searchStorage, setSearchStrorage] = useState([]);

  const getConnectors = useCallback(
    async (beginDay, endDay, type) => {
      try {
        const data = await request(
          `/api/cashier/statsionar/getall`,
          "POST",
          { clinica: auth && auth.clinica._id, beginDay, endDay, type },
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

  const [type, setType] = useState("today");

  //====================================================================
  //====================================================================
  // SEARCH
  const searchFullname = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item?.client?.fullname
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
  const setPageSize = (e) => {
    if (e.target.value === "all") {
      setCurrentPage(0);
      setCountPage(100);
      setCurrentConnectors(connectors);
    } else {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentConnectors(connectors.slice(0, e.target.value));
    }
  };

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
    // getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, type)
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59));

    setEndDay(date);
    // getConnectors(beginDay, date, type)
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
  const [room, setRoom] = useState({
    price: 0,
    totalprice: 0,
    day: 0,
    type: "",
  });

  const changeClient = useCallback((connector, index) => {
    setIndex(index);
    let total = 0;
    let servs = JSON.parse(JSON.stringify(connector.services));
    for (const serv of servs) {
      if (serv.payment) {
        total += serv.service.price * serv.pieces;
      }
    }

    let prods = JSON.parse(JSON.stringify(connector.products));
    for (const prod of prods) {
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

    let roomprice = 0;
    if (connector.room.endday) {
      const day = Math.round(
        Math.abs(
          (new Date(connector?.room?.endday).setHours(0, 0, 0, 0) -
            new Date(connector?.room?.beginday).setHours(0, 0, 0, 0)) /
            (24 * 60 * 60 * 1000)
        )
      );
      roomprice = connector.room.room.price * day;
      setRoom({
        price: connector.room.room.price,
        day: day,
        totalprice: roomprice,
        type: connector.room.room.type,
      });
    } else {
      let begin = new Date(connector.room.beginday);
      let today = new Date();
      const day = Math.round(
        Math.abs(
          (new Date(connector?.room?.endday).setHours(0, 0, 0, 0) -
            new Date(connector?.room?.beginday).setHours(0, 0, 0, 0)) /
            (24 * 60 * 60 * 1000)
        )
      );
      roomprice = connector.room.room.price * day;
      setRoom({
        price: connector.room.room.price,
        day: day,
        totalprice: roomprice,
        type: connector.room.room.type,
      });
    }

    total += roomprice;
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

    let total = room.totalprice;
    for (const serv of servs) {
      if (serv.payment) {
        total += serv.service.price * serv.pieces;
      }
    }
    for (const prod of prods) {
      if (prod.payment) {
        total += prod.product.price * prod.pieces;
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
    });
    setTotalPayment(total);
    setDiscount({
      total: total,
      discount: 0,
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

    let total = room.totalprice;
    for (const serv of servs) {
      if (serv.payment) {
        total += serv.service.price * serv.pieces;
      }
    }
    for (const prod of prods) {
      if (prod.payment) {
        total += prod.product.price * prod.pieces;
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
    });
    setTotalPayment(total);
    setDiscount({
      total: total,
      discount: 0,
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
    let disc = 0;
    if (e.target.value !== "") disc = parseInt(e.target.value);

    if (disc > totalpayment - payment.debt - payment.payment) {
      e.target.value = parseInt(parseInt(e.target.value) / 10);
      return notify({
        title: t(
          "Diqqat! Chegirma summasi umumiy to'lov summasidan oshmasligi kerak!"
        ),
        description: "",
        status: "error",
      });
    }

    if (disc <= 100) {
      setDiscount({
        ...discount,
        procient: disc,
        discount: parseInt((totalpayment * disc) / 100),
      });
      setPayment({
        total: totalpayment,
        debt: 0,
        card: 0,
        cash: 0,
        transfer: 0,
        type: "",
        payment: 0,
        clinica: connector.clinica,
        client: connector.client._id,
        connector: connector._id,
      });
    } else {
      setDiscount({
        ...discount,
        procient: 0,
        discount: disc,
      });
      setPayment({
        total: totalpayment,
        debt: 0,
        card: 0,
        cash: 0,
        transfer: 0,
        type: "",
        payment: 0,
        clinica: connector.clinica,
        client: connector.client._id,
        connector: connector._id,
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
      total: totalpayment,
      card: 0,
      cash: 0,
      transfer: 0,
      type: "",
      debt: debt,
      payment: totalpayment - payments - discount.discount - debt,
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
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
        // if ((totalpayment - payments < m + payment.card + payment.transfer + discount.discount
        //     && m > 0) || (totalpayment - payments > m + payment.card + payment.transfer + discount.discount
        //         && m < 0)) {
        //     return notify({
        //         title:
        //             "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!",
        //         description: '',
        //         status: 'error',
        //     })
        // }
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
        //     if ((totalpayment - payments < m + payment.cash + payment.transfer + discount.discount && m > 0) ||
        //         (totalpayment - payments > m + payment.cash + payment.transfer + discount.discount && m < 0)) {
        //         return notify({
        //             title:
        //                 "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!",
        //             description: '',
        //             status: 'error',
        //         })
        //     }
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
        // if ((totalpayment - payments < m + payment.card + payment.cash + discount.discount
        //     && m > 0)
        //     ||
        //     (totalpayment - payments > m + payment.card + payment.cash + discount.discount
        //         && m < 0)) {
        //     return notify({
        //         title:
        //             "Diqqat! to'lov summasi umumiy to'lov summasidan oshmasligi kerak!",
        //         description: '',
        //         status: 'error',
        //     })
        // }
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
    if (connector.room && connector.room.endday)
      if (checkData(totalpayment, payment, discount, services, products)) {
        return toast(
          checkData(totalpayment, payment, discount, services, products)
        );
      }
    setModal(true);
  };

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/cashier/statsionar/payment`,
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
      );
      localStorage.setItem("data", data);
      setModal(false);
      setVisible(false);
      notify({
        title: t("To'lov muvaffaqqiyatli amalga oshirildi."),
        description: "",
        status: "success",
      });
      setAll();
      getConnectors(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [auth, payment, discount, request, services, products, notify, setAll]);

  const createPrepayment = useCallback(async () => {
    try {
      if (checkServices(services, products)) {
        return toast(checkServices(services, products));
      }
      const data = await request(
        `/api/cashier/statsionar/prepayment`,
        "POST",
        {
          payment: { ...payment },
          services: [...services],
          products: [...products],
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      localStorage.setItem("data", data);
      setModal(false);
      setVisible(false);
      notify({
        title: t("To'lov muvaffaqqiyatli amalga oshirildi."),
        description: "",
        status: "success",
      });
      setAll();
      getConnectors(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [
    beginDay,
    endDay,
    toast,
    getConnectors,
    auth,
    payment,
    request,
    services,
    products,
    notify,
    setAll,
  ]);

  const updateServices = useCallback(async () => {
    try {
      if (checkServices(services, products)) {
        return toast(checkServices(services, products));
      }
      const data = await request(
        `/api/cashier/statsionar/updateservices`,
        "POST",
        {
          services: [...services],
          products: [...products],
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      setVisible(false);
      localStorage.setItem("data", data);
      notify({
        title: data.message,
        description: "",
        status: "success",
      });
      setAll();
      getConnectors(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [
    request,
    auth,
    beginDay,
    endDay,
    getConnectors,
    notify,
    services,
    products,
    setAll,
    toast,
  ]);
  //====================================================================
  //====================================================================

  const getConnectorsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/cashier/statsionar/getall`,
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

  const changeType = (e) => {
    setType(e.target.value);
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
  // useEffect

  useEffect(() => {
    getBaseUrl();
  }, []);

  useEffect(() => {
    getConnectors(beginDay, endDay, type);
  }, [beginDay, endDay, type]);

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
                updateServices={updateServices}
                room={room}
                inputPayment={inputPayment}
                totalpayment={totalpayment}
                checkPayment={checkPayment}
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
              getConnectorsByClientBorn={getConnectorsByClientBorn}
              changeType={changeType}
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
        text={
          connector.room && connector.room.endday ? (
            <div className="card">
              <div className="card-header">
                <div className="card-title">{t("Hisobot")}</div>
              </div>
              <div className="card-body">
                <table className="table table-sm">
                  <tfoot>
                    <tr>
                      <th className="text-right w-50">{t("Jami to'lov")}:</th>
                      <th className="text-left w-50">{totalpayment}</th>
                    </tr>
                    <tr>
                      <th className="text-right">{t("Chegirma")}:</th>
                      <th className="text-left">{discount.discount}</th>
                    </tr>
                    <tr>
                      <th className="text-right">{t("To'langan")}:</th>
                      <th className="text-left">{payments}</th>
                    </tr>
                    <tr>
                      <th className="text-right">{t("Qarz")}:</th>
                      <th className="text-left">{payment.debt}</th>
                    </tr>
                    <tr>
                      <th className="text-right">{t("To'lanayotgan")}:</th>
                      <th className="text-left">{payment.payment}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ) : (
            <div className="card-body">
              <table className="table table-sm">
                <tfoot>
                  <tr>
                    <th className="text-right w-50">{t("Jami to'lov")}:</th>
                    <th className="text-left w-50">{totalpayment}</th>
                  </tr>
                  <tr>
                    <th className="text-right">{t("Oldindan to'lov")}:</th>
                    <th className="text-left">{payments}</th>
                  </tr>
                  <tr>
                    <th className="text-right">{t("To'lanayotgan summa")}:</th>
                    <th className="text-left">{payment?.payment}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        }
        setModal={setModal}
        handler={
          connector?.room && connector?.room?.endday
            ? createHandler
            : createPrepayment
        }
        basic={client?.lastname + " " + client?.firstname}
      />
    </div>
  );
};
