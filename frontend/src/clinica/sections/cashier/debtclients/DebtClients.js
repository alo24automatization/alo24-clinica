import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { PaymentClients } from "./clientComponents/PaymentClients";
import { TableClients } from "./clientComponents/TableClients";
import { Modal } from "../components/Modal";
import { useTranslation } from "react-i18next";

export const DebtClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 3))
  );
  const [endDay, setEndDay] = useState(new Date());
  //====================================================================
  //====================================================================
  // MODAL
  const [modal, setModal] = useState(false);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false);

  const changeVisible = () => setVisible(!visible);

  //====================================================================
  //====================================================================
  const { t } = useTranslation();
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

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // getConnectors
  const [connectors, setConnectors] = useState([]);
  const [searchStorage, setSearchStrorage] = useState([]);
  const [offlineDebts, setOfflineDebts] = useState([]);
  const [statsionarDebts, setStatsionarDebts] = useState([]);
  const [debts, setDebts] = useState([]);

  const getOfflineDebts = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/cashier/offline/debts`,
          "POST",
          { clinica: auth && auth?.clinica._id, beginDay, endDay },
          {
            Authorization: `Bearer ${auth?.token}`,
          }
        );
        setOfflineDebts(data);
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

  const getStatsionarDebts = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/cashier/statsionar/debts`,
          "POST",
          { clinica: auth && auth?.clinica._id, beginDay, endDay },
          {
            Authorization: `Bearer ${auth?.token}`,
          }
        );
        setStatsionarDebts(data);
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
    let debts;
    if (offlineDebts.length > 0 || statsionarDebts.length > 0) {
      debts = [...offlineDebts, ...statsionarDebts];
    } else {
      debts = [];
    }
    setDebts(debts);
    setCurrentConnectors(debts.slice(indexFirstConnector, indexLastConnector));
    setConnectors(debts);
    setSearchStrorage(debts);
  }, [offlineDebts, statsionarDebts, indexFirstConnector, indexLastConnector]);

  //====================================================================
  //====================================================================

  const getDebtsByClientBorn = async (e) => {
    try {
      const data = await request(
        `/api/cashier/offline/debts`,
        "POST",
        {
          clinica: auth && auth?.clinica._id,
          clientborn: new Date(new Date(e)),
        },
        {
          Authorization: `Bearer ${auth?.token}`,
        }
      );
      const data2 = await request(
        ` /api/cashier/statsionar/debts`,
        "POST",
        {
          clinica: auth && auth?.clinica._id,
          clientborn: new Date(new Date(e)),
        },
        {
          Authorization: `Bearer ${auth?.token}`,
        }
      );
      setOfflineDebts(data);
      setStatsionarDebts(data2);
    } catch (error) {
      notify({
        title: error,
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
        (item?.client?.fullname || "")
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

  const sortDebts = (e) => {
    let sortEl = [];
    if (e.target.value === "none") {
      sortEl = [...debts];
    } else if (e.target.value === "statsionar") {
      sortEl = [...statsionarDebts];
    } else {
      sortEl = [...offlineDebts];
    }
    setSearchStrorage(sortEl);
    setCurrentConnectors(sortEl.slice(0, countPage));
  };

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

  // const [connector, setConnector] = useState({
  //   clinica: auth?.clinica && auth?.clinica._id,
  //   probirka: 0,
  // });

  // const [services, setServices] = useState([]);

  //====================================================================
  //====================================================================

  const [payment, setPayment] = useState({});
  const [payCount, setPayCount] = useState("");
  const [paymentType, setPaymentType] = useState("cash");
  const [debt, setDebt] = useState(0);

  const checkPayCount = () => {
    if (!payCount) {
      return notify({
        title: t(`Diqqat! To'lov kiritilmagan.`),
        description: t(`Iltimos to'lovni kirirting.`),
        status: "error",
      });
    }
    if (!payment.client) {
      return notify({
        title: t(`Diqqat! Mijoz aniqlamagan.`),
        description: t(`Iltimos Mijoz malumotlarini kirirting.`),
        status: "error",
      });
    }
    if (+payCount > +debt) {
      return notify({
        title: t(`Diqqat! To'lov summasi qarz dan oshmaslik kerak.`),
        description: t(`Iltimos To'lovni tug'ri kiriting.`),
        status: "error",
      });
    }
    setModal(true);
  };

  const getPayment = (connector) => {
    let obj = {
      ...connector,
      debt: 0,
      payment: connector.debt,
      card: 0,
      transfer: 0,
    };
    delete obj.discount;
    obj.cash = connector.debt;
    obj.type = "cash";
    setPayment(obj);
    setPayCount(connector.debt);
    setVisible(true);
    setDebt(connector.debt);
  };

  //====================================================================
  //====================================================================
  // PRODUCTS
  // const [products, setProducts] = useState([]);

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // CLIENT

  const [client, setClient] = useState({
    clinica: auth?.clinica && auth?.clinica._id,
    reseption: auth?.user && auth?.user._id,
  });

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getOfflineDebts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    getStatsionarDebts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59));

    setEndDay(date);
    getOfflineDebts(beginDay, date);
    getStatsionarDebts(beginDay, date);
  };

  //===================================================================
  //===================================================================
  //CreateHandler

  const sortPostPayment = () => {
    if (payment.client.id[0] === "S") {
      return postStatsionarDebts();
    } else {
      return postOfflineDebts();
    }
  };

  const postOfflineDebts = useCallback(async () => {
    try {
      const data = await request(
        `/api/cashier/offline/debt/payment`,
        "POST",
        {
          payment: {
            ...payment,
            isPayDebt: true,
            clinica: auth && auth?.clinica._id,
          },
        },
        {
          Authorization: `Bearer ${auth?.token}`,
        }
      );
      localStorage.setItem("data", data);
      setModal(false);
      setVisible(false);
      setPayment({});
      setPayCount("");
      setPaymentType("cash");
      notify({
        title: t("To'lov muvaffaqqiyatli amalga oshirildi."),
        description: "",
        status: "success",
      });
      getOfflineDebts(beginDay, endDay);
      getStatsionarDebts(beginDay, endDay);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [auth, payment, request, notify]);

  const postStatsionarDebts = useCallback(async () => {
    try {
      const data = await request(
        `/api/cashier/statsionar/debt/payment`,
        "POST",
        {
          payment: {
            ...payment,
            clinica: auth && auth?.clinica._id,
          },
        },
        {
          Authorization: `Bearer ${auth?.token}`,
        }
      );
      localStorage.setItem("data", data);
      setModal(false);
      setVisible(false);
      setPayment({});
      setPayCount("");
      setPaymentType("cash");
      notify({
        title: t("To'lov muvaffaqqiyatli amalga oshirildi."),
        description: "",
        status: "success",
      });
      getOfflineDebts(beginDay, endDay);
      getStatsionarDebts(beginDay, endDay);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [auth, payment, request, notify]);

  //===================================================================
  //===================================================================
  //====================================================================
  //====================================================================
  // useEffect

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth?.clinica && !s) {
      setS(1);
      getOfflineDebts(beginDay, endDay);
      getStatsionarDebts(beginDay, endDay);
    }
  }, [auth, getOfflineDebts, getStatsionarDebts, s, beginDay, endDay]);

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
              <PaymentClients
                payment={payment}
                client={client}
                payCount={payCount}
                setPayment={setPayment}
                setPayCount={(e) => {
                  setPayCount(e);
                  let obj = {
                    ...payment,
                    debt: +debt - +e,
                    payment: +e,
                  };
                  obj[`${payment.type}`] = +e;
                  setPayment(obj);
                }}
                checkPayCount={checkPayCount}
                loading={loading}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
              />
            </div>
            <TableClients
              setVisible={setVisible}
              changeStart={changeStart}
              changeEnd={changeEnd}
              client={client}
              setClient={setClient}
              searchFullname={searchFullname}
              searchId={searchId}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentConnectors={currentConnectors}
              setCurrentConnectors={setCurrentConnectors}
              currentPage={currentPage}
              setPageSize={setPageSize}
              loading={loading}
              connectors={connectors}
              payment={payment}
              setPayment={setPayment}
              sortDebts={sortDebts}
              getPayment={getPayment}
              getDebtsByClientBorn={getDebtsByClientBorn}
            />
          </div>
        </div>
      </div>
      <Modal
        modal={modal}
        setModal={setModal}
        text={t("to'lov qilishini tasdiqlaysizmi")}
        handler={sortPostPayment}
        basic={`${t("Mijoz")} ${payment?.client && payment?.client?.fullname}`}
      />
    </div>
  );
};

// 913385289
