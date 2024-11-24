import { useToast } from "@chakra-ui/react";
import {
  faAngleDown,
  faAngleUp,
  faPenAlt,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { Modal } from "../components/Modal";
import { Pagination } from "../components/Pagination";
import { DatePickers } from "../debtclients/clientComponents/DatePickers";
import { Sort } from "../debtclients/clientComponents/Sort";

const Operation = () => {
  const { t } = useTranslation();

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

  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================
  const OPERATION_DEFAULT_VALUE = {
    paymentType: "cash",
    price: "",
    client: {
      firstname: "",
      lastname: "",
    },
    operator: "",
  };
  const [operation, setOperation] = useState(OPERATION_DEFAULT_VALUE);

  //====================================================================
  //====================================================================

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getOperations(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59));

    setEndDay(date);
    getOperations(beginDay, date);
  };

  //====================================================================
  //====================================================================

  const [searchStorage, setSearchStrorage] = useState([]);
  const [operations, setOperations] = useState([]);

  const getOperations = useCallback(
    async (beginDay, endDay) => {
      try {
        const data = await request(
          `/api/cashier/operation/findAll`,
          "POST",
          { clinica: auth && auth.clinica._id, beginDay, endDay },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setSearchStrorage(data);
        setOperations(data.slice(indexFirstConnector, indexLastConnector));
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

  //=====================================================================
  //=====================================================================

  const checkData = () => {
    if (!operation?.client?.firstname) {
      return notify({
        title: t("Mijoz ismi kiritilmagan!"),
        description: "",
        status: "error",
      });
    }
    if (!operation?.client?.lastname) {
      return notify({
        title: t("Mijoz familyasi kiritilmagan!"),
        description: "",
        status: "error",
      });
    }
    if (!operation?.operator) {
      return notify({
        title: t("Operator kiritilmagan!"),
        description: "",
        status: "error",
      });
    }
    if (!operation?.price) {
      return notify({
        title: t("Operatsiya summasi kiritilmagan!"),
        description: "",
        status: "error",
      });
    }
    if (!operation?.paymentType) {
      return notify({
        title: t("Operatsiya to'lov turi kiritilmagan!"),
        description: "",
        status: "error",
      });
    }

    if (operation._id) {
      updateHandler();
    } else {
      createHandler();
    }
  };

  const createHandler = async () => {
    try {
      const data = await request(
        "/api/cashier/operation/create",
        "POST",
        { ...operation, clinica: auth && auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t("Operatsiya yaratildi!"),
        description: "",
        status: "success",
      });
      setOperation(OPERATION_DEFAULT_VALUE);
      setVisible(false);
      getOperations(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  const updateHandler = async () => {
    try {
      const data = await request(
        `/api/cashier/operation/update/${operation?._id}`,
        "PUT",
        { ...operation, clinica: auth && auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t("Operatsiyalar yangilandi!"),
        description: "",
        status: "success",
      });
      setOperation(OPERATION_DEFAULT_VALUE);
      setVisible(false);
      getOperations(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  const deleteHandler = async () => {
    try {
      const data = await request(
        `/api/cashier/operation/delete/${operation._id}`,
        "POST",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t("Operatsiya o'chirildi!"),
        description: "",
        status: "success",
      });
      setOperation(OPERATION_DEFAULT_VALUE);
      setModal(false);
      getOperations(beginDay, endDay);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  //=====================================================================
  //=====================================================================

  const searchFullname = (e) => {
    // const searching = searchStorage.filter((item) =>
    //   item.comment.toLowerCase().includes(e.target.value.toLowerCase())
    // );
    // setOperation(searching);
  };

  const setPageSize = (e) => {
    setCurrentPage(0);
    setCountPage(e.target.value);
    setOperation(searchStorage.slice(0, countPage));
  };

  //=====================================================================
  //=====================================================================

  // useEffect
  const [s, setS] = useState(0);

  useEffect(() => {
    if (!s) {
      setS(1);
      getOperations(beginDay, endDay);
    }
  }, [s, beginDay, endDay]);

  return (
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
            <div className="flex h-[310px] pt-2 items-center  justify-center gap-x-3">
              <div className="card col-md-4 h-full">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="">{t("Familya")}</label>
                    <input
                      value={operation?.client?.lastname}
                      onChange={(e) =>
                        setOperation({
                          ...operation,
                          client: {
                            ...operation.client,
                            lastname: e.target.value,
                          },
                        })
                      }
                      type="text"
                      className="form-control form-control-sm"
                      id="lastname"
                      name="lastname"
                      placeholder={t("Familya")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">{t("Ism")}</label>
                    <input
                      value={operation?.client?.firstname}
                      onChange={(e) =>
                        setOperation({
                          ...operation,
                          client: {
                            ...operation.client,
                            firstname: e.target.value,
                          },
                        })
                      }
                      type="text"
                      className="form-control form-control-sm"
                      id="lastname"
                      name="lastname"
                      placeholder={t("Ism")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">{t("Operator")}</label>
                    <input
                      value={operation?.operator}
                      onChange={(e) =>
                        setOperation({ ...operation, operator: e.target.value })
                      }
                      type="text"
                      className="form-control form-control-sm"
                      id="operator"
                      name="operator"
                      placeholder={t("Operator")}
                    />
                  </div>
                </div>
              </div>
              <div className="card col-md-4 h-full">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="">{t("To'lov")}</label>
                    <input
                      value={operation?.price}
                      onChange={(e) =>
                        setOperation({ ...operation, price: +e.target.value })
                      }
                      type="text"
                      className="form-control form-control-sm"
                      id="price"
                      name="price"
                      placeholder={t("To'lov summasi")}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">{t("To'lov turi")}</label>
                    <select
                      value={operation?.paymentType}
                      className="form-control form-control-sm selectpicker"
                      onChange={(e) =>
                        setOperation({
                          ...operation,
                          paymentType: e.target.value,
                        })
                      }
                    >
                      <option value={"cash"}>{t("Naqt")}</option>
                      <option value={"card"}>{t("Plastik")}</option>
                      <option value={"transfer"}>{t("O'tkazma")}</option>
                    </select>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="text-right">
                    {loading ? (
                      <button
                        className="bg-alotrade text-white py-2 px-3"
                        disabled
                      >
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        className="bg-alotrade text-white py-2 px-3 font-semibold"
                        onClick={checkData}
                      >
                        {t("Saqlash")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-0 shadow-lg table-container">
            <div className="border-0 table-container">
              <div className="table-responsive">
                <div className="bg-white flex gap-6 items-center py-2 px-2">
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
                  <div className="flex gap-4">
                    <input
                      onChange={searchFullname}
                      style={{ maxWidth: "60px" }}
                      type="search"
                      className="form-control form-control-sm selectpicker"
                      placeholder={t("ID")}
                    />
                  </div>
                  <div className="text-center ml-auto">
                    <Pagination
                      setCurrentDatas={setOperation}
                      datas={searchStorage}
                      setCurrentPage={setCurrentPage}
                      countPage={countPage}
                      totalDatas={searchStorage.length}
                    />
                  </div>
                  <div
                    className="text-center flex gap-2"
                    style={{ maxWidth: "200px", overflow: "hidden" }}
                  >
                    <DatePickers changeDate={changeStart} />
                    <DatePickers changeDate={changeEnd} />
                  </div>
                </div>
                <table className="table m-0" id="discount-table">
                  <thead>
                    <tr>
                      <th className="border bg-alotrade text-[16px] py-1">№</th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("Summa")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("To'lov turi")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("Mijoz")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("Operator")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("Sa'na")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("Tahrirlash")}
                      </th>
                      <th className="border bg-alotrade text-[16px] py-1">
                        {t("O'chirish")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {operations?.map((connector, key) => {
                      return (
                        <tr key={key}>
                          <td
                            className="border py-1 font-weight-bold text-[16px]"
                            style={{ maxWidth: "30px !important" }}
                          >
                            {currentPage * countPage + key + 1}
                          </td>
                          <td className="border py-1 text-right font-weight-bold text-[16px]">
                            {connector?.price}
                          </td>
                          <td className="border py-1 text-left text-[16px]">
                            {connector?.paymentType === "cash"
                              ? "Naqt"
                              : connector?.paymentType === t("card")
                              ? t("Plastik")
                              : t("O'tkazma")}
                          </td>
                          <td className="border py-1 text-left text-[16px]">
                            {connector?.client?.firstname +
                              " " +
                              connector?.client?.lastname}
                          </td>
                          <td className="border py-1 text-left text-[16px]">
                            {connector?.operator}
                          </td>
                          <td className="border py-1 text-right text-[16px]">
                            {new Date(connector.createdAt).toLocaleDateString()}
                          </td>
                          <td className="border py-1 text-center text-[16px]">
                            <button
                              className="btn btn-success py-0"
                              onClick={() => {
                                setOperation(connector);
                                setVisible(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faPenAlt} />
                            </button>
                          </td>
                          <td className="border py-1 text-center text-[16px]">
                            <button
                              className="btn btn-danger py-0"
                              onClick={() => {
                                setOperation(connector);
                                setModal(true);
                              }}
                            >
                              <FontAwesomeIcon icon={faRemove} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td
                        className="border py-1 font-weight-bold text-[16px]"
                        style={{ maxWidth: "30px !important" }}
                      ></td>
                      <td className="border py-1 text-right font-weight-bold text-[16px]">
                        {searchStorage.reduce((prev, el) => prev + el.price, 0)}
                      </td>
                      <td className="border py-1 text-left text-[16px]"></td>
                      <td className="border py-1 text-left text-[16px]"></td>
                      <td className="border py-1 text-right text-[16px]"></td>
                      <td className="border py-1 text-center text-[16px]"></td>
                      <td className="border py-1 text-center text-[16px]"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        modal={modal}
        setModal={setModal}
        text={t("Operatsiyani o'chirishni qilishini tasdiqlaysizmi")}
        handler={deleteHandler}
        basic={``}
      />
    </div>
  );
};

export default Operation;
