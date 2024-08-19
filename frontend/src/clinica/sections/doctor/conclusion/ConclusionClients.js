import { useToast } from "@chakra-ui/react";
import {
  faAngleDown,
  faAngleUp,
  faPenAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Pagination } from "../components/Pagination";
import Print from "../components/Print";
import { DatePickers } from "../doctorclients/clientComponents/DatePickers";

export const ConclusionClients = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  //====================================================================
  //====================================================================

  const history = useHistory();

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

  //====================================================================
  //====================================================================

  const [clientBorn, setClientBorn] = useState(new Date());

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
  const [type, setType] = useState("begin");
  //====================================================================
  //====================================================================
  // getConnectors
  const [doctorClients, setDoctorClients] = useState([]);
  const [searchStorage, setSearchStorage] = useState([]);
  const [currentDoctorClients, setCurrentDoctorClients] = useState([]);

  const getDoctorClients = useCallback(async () => {
    try {
      const data = await request(
        `/api/doctor/conclusion/clients/get`,
        "POST",
        {
          clinica: auth && auth?.clinica._id,
          department: auth?.user?.specialty?._id,
        },
        {
          Authorization: `Bearer ${auth?.token}`,
        }
      );
      setDoctorClients(
        [...data].filter((item) => {
          if (type === "end") {
            return item?.connector?.room?.endday;
          } else {
            return item?.connector?.room?.endday === null;
          }
        })
      );
      setSearchStorage(data);
      setCurrentDoctorClients(
        [...data]
          .filter((item) => {
            if (type === "end") {
              return item?.connector?.room?.endday;
            } else {
              return item?.connector?.room?.endday === null;
            }
          })
          .slice(indexFirstConnector, indexLastConnector)
      );
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify, indexFirstConnector, indexLastConnector]);

  //===================================================================
  //===================================================================

  const searchBorn = () => {
    setCurrentDoctorClients(
      [...searchStorage].filter((doctor) => {
        return (
          new Date(
            new Date(doctor.client.born).setHours(0, 0, 0, 0)
          ).toISOString() ===
          new Date(new Date(clientBorn).setHours(0, 0, 0, 0)).toISOString()
        );
      })
    );
  };

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

  //====================================================================
  //====================================================================

  const changeType = (e) => {
    if (e.target.value === "end") {
      const searching = searchStorage.filter(
        (item) => item?.connector?.room?.endday
      );
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    } else {
      const searching = searchStorage.filter(
        (item) => item?.connector?.room?.endday === null
      );
      setDoctorClients(searching);
      setCurrentDoctorClients(searching.slice(0, countPage));
    }
    setType(e.target.value);
  };

  //===================================================================
  //===================================================================

  const setPageSize = (e) => {
    setCurrentPage(0);
    setCountPage(e.target.value);
    setCurrentDoctorClients(searchStorage.slice(0, e.target.value));
  };

  //====================================================================
  //====================================================================
  // ChangeDate

  //====================================================================
  //====================================================================

  const [baseUrl, setBaseurl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request(`/api/baseurl`, "GET", null);
      setBaseurl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //====================================================================
  //====================================================================
  // useEffect

  const [s, setS] = useState(0);

  useEffect(() => {
    if (auth?.clinica && !s) {
      setS(1);
      getDoctorClients(beginDay, endDay);
      getBaseUrl();
    }
  }, [auth, beginDay, s, endDay, getDoctorClients, getBaseUrl]);

  const componentRef = useRef();
  const print = useReactToPrint({
    content: () => componentRef.current,
  });

  const [printBody, setPrintBody] = useState({
    connector: {},
    client: {},
    services: [],
  });
  const handlePrint = (connector) => {
    setPrintBody(connector);
    setTimeout(() => {
      print();
    }, 1000);
  };

  //=====================================================================
  //=====================================================================

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <Print
            doctor={auth?.user}
            connector={printBody?.connector}
            client={printBody?.client}
            sections={printBody?.services}
            clinica={auth && auth?.clinica}
            baseUrl={baseUrl}
          />
        </div>
      </div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="row">
              <div className="col-12 text-end">
                <button
                  className={`btn bg-alotrade text-white mb-2 w-100`}
                  onClick={() => setVisible(!visible)}
                >
                  {t("Malumot")}
                </button>
              </div>
            </div>
            <div className="border-0 shadow-lg table-container">
              <div className="border-0 table-container">
                <div className="table-responsive">
                  <div className="flex items-center justify-between gap-2 bg-white p-2">
                    <div>
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder="Bo'limni tanlang"
                        onChange={setPageSize}
                        style={{ minWidth: "50px" }}
                      >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div>
                      <input
                        onChange={searchFullname}
                        style={{ maxWidth: "100px", minWidth: "100px" }}
                        type="search"
                        className="w-100 form-control form-control-sm selectpicker"
                        placeholder={t("F.I.O")}
                      />
                    </div>
                    <div>
                      <input
                        onChange={searchId}
                        style={{ maxWidth: "60px" }}
                        type="search"
                        className="form-control form-control-sm selectpicker"
                        placeholder={t("ID")}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        onKeyDown={(e) =>
                          e.key === "Enter" && searchBorn(e.target.value)
                        }
                        type="date"
                        name="born"
                        onChange={(e) => setClientBorn(e.target.value)}
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                      />
                      <button onClick={() => searchBorn(clientBorn)}>
                        <FontAwesomeIcon
                          icon={faSearch}
                          style={{ cursor: "pointer" }}
                        />
                      </button>
                    </div>
                    <div className="text-center">
                      <Pagination
                        setCurrentDatas={setCurrentDoctorClients}
                        datas={doctorClients}
                        setCurrentPage={setCurrentPage}
                        countPage={countPage}
                        totalDatas={doctorClients.length}
                      />
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <select
                        className="form-control form-control-sm selectpicker"
                        placeholder={t("Turini tanlang")}
                        onChange={changeType}
                      >
                        <option value={"begin"}>{t("Davolanishda")}</option>
                        <option value={"end"}>{t("Yakunlangan")}</option>
                      </select>
                    </div>
                  </div>
                  <table className="table m-0" id="discount-table">
                    <thead>
                      <tr>
                        <th className="border bg-alotrade text-[16px] py-1">
                          №
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("F.I.O")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("Shifokor")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("ID")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("Telefon raqami")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("Tug'ilgan yili")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("Kelgan vaqti")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1">
                          {t("Ketgan vaqti")}
                        </th>
                        <th className="border bg-alotrade text-[16px] py-1"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDoctorClients.length > 0 &&
                        currentDoctorClients.map((connector, key) => {
                          return (
                            <tr key={key}>
                              <td
                                className="border text-[16px] py-1 font-weight-bold text-right"
                                style={{ maxWidth: "30px !important" }}
                              >
                                {currentPage * countPage + key + 1}
                              </td>
                              <td className="border text-[16px] py-1 font-weight-bold">
                                {connector?.client?.firstname}{" "}
                                {connector?.client?.lastname}
                              </td>
                              <td className="border text-[16px] py-1 font-weight-bold">
                                {connector?.connector?.doctor?.firstname}{" "}
                                {connector?.connector?.doctor?.lastname}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {connector?.client?.id}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {connector?.client?.phone}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {new Date(
                                  connector?.client?.born
                                ).toLocaleDateString()}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {new Date(
                                  connector?.connector?.createdAt
                                ).toLocaleDateString()}{" "}
                                {new Date(
                                  connector?.connector?.createdAt
                                ).toLocaleTimeString()}
                              </td>
                              <td className="border text-[16px] py-1 text-right">
                                {connector?.connector?.room?.endday &&
                                  new Date(
                                    connector?.connector?.room?.endday
                                  ).toLocaleDateString()}{" "}
                                {connector?.connector?.room?.endday &&
                                  new Date(
                                    connector?.connector?.room?.endday
                                  ).toLocaleTimeString()}
                              </td>
                              <td className="border text-[16px] py-1 text-center flex gap-[4px] items-center">
                                <button
                                  onClick={() =>
                                    history.push("/alo24/conclusion", {
                                      ...connector,
                                    })
                                  }
                                  className="btn btn-primary py-0"
                                >
                                  <FontAwesomeIcon icon={faPenAlt} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
