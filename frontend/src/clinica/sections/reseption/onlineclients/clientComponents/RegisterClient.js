import React, { useCallback, useContext, useEffect, useState } from "react";
import { DatePickers } from "./DatePickers";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../../hooks/http.hook";
import { AuthContext } from "../../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
const animatedComponents = makeAnimated();

export const RegisterClient = ({
  checkData,
  client,
  setClient,
  changeClientData,
  changeClientBorn,
  departments,
  setModal,
  loading,
  clientDate,
}) => {
  const { t } = useTranslation();
  const { request } = useHttp();
  const auth = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [time, setTime] = useState();
  const [queue, setQueue] = useState();
  const [disableds, setDisableds] = useState({ time: false, queue: false });
  const [serviceOptions, setServiceOptions] = useState([]);
  // const getServices = useCallback(
  //   (e) => {
  //     var s = [];
  //     if (e === "all") {
  //       departments.map((department) => {
  //         return department.services.map((service) => {
  //           return s.push({
  //             label: service.name,
  //             value: service._id,
  //             service: service,
  //             department: department,
  //           });
  //         });
  //       });
  //     } else {
  //       departments.map((department) => {
  //         if (e === department._id) {
  //           department.services.map((service) => {
  //             s.push({
  //               label: service.name,
  //               value: service._id,
  //               service: service,
  //               department: department,
  //             });
  //             return "";
  //           });
  //         }
  //         return "";
  //       });
  //     }
  //     setServices(s);
  //   },
  //   [departments]
  // );

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

  const getServiceType = async () => {
    try {
      const data = await request(
        `/api/services/servicetype/getalldepartment`,
        "POST",
        { clinica: auth.clinica._id, department: auth?.user?.specialty?._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      console.log(data);
      data?.map((item) => {
        setServiceTypes((old) => [
          ...old,
          { value: item._id, label: item.name },
        ]);
      });
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  const getService = async (id) => {
    try {
      const data = await request(
        `/api/services/servicetype/findById`,
        "POST",
        { _id: id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      console.log(data);
      data &&
        data?.services?.map((item) => {
          setServices((old) => [...old, { value: item._id, label: item.name }]);
        });
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };

  console.log(serviceTypes);

  // useEffect(() => {
  //   if (departments) {
  //     getServices("all");
  //   }
  // }, [departments, getServices]);

  useEffect(() => {
    getServiceType();
  }, []);

  console.log(client);
  return (
    <>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {t("Mijozning shaxsiy ma'lumotlari")}
              </div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">{t("Familiyasi")}</label>
                    <input
                      value={client?.lastname || ""}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="lastname"
                      name="lastname"
                      placeholder={t("Familiyasi")}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">{t("Ismi")}</label>
                    <input
                      value={client?.firstname || ""}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="firstname"
                      name="firstname"
                      placeholder={t("Ismi")}
                    />
                  </div>
                </div>
                <>
                  <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
                    <div className="form-group">
                      <label htmlFor="education">{t("Kelish sanasi")}</label>
                      <input
                        onChange={(e) => {
                          changeClientBorn(e);
                        }}
                        type="date"
                        name="born"
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                        value={clientDate}
                      />
                    </div>
                  </div>
                  <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
                    <div className="form-group">
                      <label htmlFor="education">{t("Vaqt")}</label>
                      <input
                        onChange={(e) => {
                          setClient({
                            ...client,
                            queue: "",
                            bronTime: e.target.value,
                          });
                        }}
                        value={time}
                        type="time"
                        name="born"
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                      />
                    </div>
                  </div>
                  <div className="col-xl-1 col-lg-1 col-md-1 col-sm-1 col-12">
                    <div className="form-group">
                      <label htmlFor="navbat">{t("Navbat")}</label>
                      <input
                        value={client.queue || ""}
                        onChange={(e) => {
                          setClient({
                            ...client,
                            bronTime: "",
                            queue: e.target.value,
                          });
                        }}
                        type="text"
                        className="form-control form-control-sm"
                        id="navbat"
                        name="navbat"
                      />
                    </div>
                  </div>
                </>

                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="addreSs">{t("Telefon raqami")}</label>
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend">
                        <span
                          className="input-group-text"
                          id="inputGroup-sizing-sm"
                        >
                          +998
                        </span>
                      </div>
                      <input
                        value={client?.phone || ""}
                        onChange={changeClientData}
                        type="number"
                        className="form-control"
                        name="phone"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="addreSs">{t("Xizmat turi")}</label>
                    <Select
                      onChange={(e) => {
                        getService(e.value);
                        setClient({ ...client, serviceType: e.value });
                      }}
                      name="serivceType"
                      options={serviceTypes}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="addreSs">{t("Xizmatni tanlang")}</label>
                    <Select
                      // defaultValue={[service]}
                      isMulti
                      name="service"
                      options={services}
                      onChange={(e) => {
                        let data = [];
                        e.map((item) => {
                          data.push(item.value);
                        });
                        setClient({ ...client, service: data });
                      }}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </div>
                </div>

                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="text-right">
                    {loading ? (
                      <button
                        className="bg-alotrade rounded text-white py-2 px-3"
                        disabled
                      >
                        <span className="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        onClick={checkData}
                        className="bg-alotrade rounded text-white py-2 px-3"
                      >
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
      {/* Row end */}
    </>
  );
};
