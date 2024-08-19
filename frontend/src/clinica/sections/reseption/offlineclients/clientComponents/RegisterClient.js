import React, { useCallback, useContext, useEffect, useState } from "react";
import { DatePickers } from "./DatePickers";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../../context/AuthContext";
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Switch,
} from "@chakra-ui/react";
import {
  faClose,
  faPlus,
  faRotate,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const animatedComponents = makeAnimated();

export const RegisterClient = ({
  selectedServices,
  selectedProducts,
  isAddHandler,
  isConnectorHandler,
  updateData,
  isNewClient,
  checkData,
  requiredFields,
  setNewServices,
  showNewCounterDoctor,
  setNewProducts,
  newproducts,
  newservices,
  changeProduct,
  selectedCounterdoctor,
  changeService,
  changeCounterDoctor,
  changeAdver,
  setClient,
  client,
  changeClientData,
  changeClientBorn,
  departments,
  counterdoctors,
  advers,
  products,
  loading,
  clientDate,
  servicetypes,
  isAddService,
  lastCardNumber,
  newCounterDoctor,
  handleNewCounterDoctorInputChange,
  handleNewCounterDoctorCreate,
  selectedDepartament,
  setSelectedDepartament,
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const auth = useContext(AuthContext);
  const selectedDoctor =
    counterdoctors.find(
      (doctor) => doctor.value === selectedCounterdoctor?.value
    ) || null;
  const [services, setServices] = useState([]);
  const getServices = useCallback(
    (e) => {
      var s = [];
      if (e === "all") {
        departments.map((department) => {
          return department.services.map((service) => {
            return s.push({
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
              department: department,
            });
          });
        });
      } else {
        departments.map((department) => {
          if (e === department._id) {
            department.services.map((service) => {
              s.push({
                label: (
                  <div className="w-full flex justify-between  items-center gap-x-2">
                    <span>{service.name}</span>
                    <span className="p-1 rounded-sm !bg-green-500 font-medium text-white">
                      {service.price} so'm
                    </span>
                  </div>
                ),
                value: service._id,
                price: service.price,
                name: service.name,
                service: service,
                department: department,
              });
              return "";
            });
          }
          return "";
        });
      }
      setServices(s);
    },
    [departments]
  );

  useEffect(() => {
    if (departments) {
      getServices("all");
    }
  }, [departments, getServices]);
  const filterOption = (option, rawInput) => {
    const input = rawInput.toLowerCase();
    if (!isNaN(input.charAt(0))) {
      return option.data.price.toString().includes(input);
    }
    return option.data.name.toLowerCase().includes(input);
  };
  return (
    <>
      {/* Row start */}
      <div className={`row gutters`}>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 relative">
          <div
            className={
              isAddService && !isVisible
                ? "absolute top-0 left-0 w-full h-[80%] bg-gray-400 bg-opacity-50 z-10 flex justify-center items-center p-4"
                : "hidden"
            }
          >
            <div className="text-red-500 font-bold text-[14px] p-2">
              Mijozning ma'lumotlarini o'zgartirish uchun TAHRIRLASH tugmasini
              bosing{" "}
            </div>
          </div>
          <div className="card h-[96%]">
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
                      value={client.lastname || ""}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      name="lastname"
                      id="client_lastname"
                      placeholder={t("Familiyasi")}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">{t("Ismi")}</label>
                    <input
                      value={client.firstname || ""}
                      onChange={changeClientData}
                      type="text"
                      className="form-control form-control-sm"
                      id="client_firstname"
                      name="firstname"
                      placeholder={t("Ismi")}
                    />
                  </div>
                </div>
                {!requiredFields ? null : (
                  <>
                    {requiredFields?.fathername && (
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="education">
                            {t("Otasining ismi")}
                          </label>
                          <input
                            value={client.fathername || ""}
                            onChange={changeClientData}
                            type="text"
                            className="form-control form-control-sm"
                            id="fathername"
                            name="fathername"
                            placeholder={t("Otasining ismi")}
                          />
                        </div>
                      </div>
                    )}
                    {requiredFields?.born && (
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <label htmlFor="education">
                          {t("Tug'ilgan sanasi")}
                        </label>
                        {/* <DatePickers changeDate={changeClientBorn} /> */}
                        <input
                          onChange={(e) => changeClientBorn(e)}
                          type="date"
                          name="born"
                          className="form-control inp"
                          placeholder=""
                          style={{ color: "#999" }}
                          value={clientDate}
                        />
                      </div>
                    )}
                    {requiredFields?.phone && (
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
                              value={client.phone || ""}
                              onChange={changeClientData}
                              type="number"
                              className="form-control"
                              name="phone"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {requiredFields?.gender && (
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="biO">{t("Jinsi")}</label>
                          <div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                checked={
                                  client.gender && client.gender === "man"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setClient({ ...client, gender: "man" });
                                }}
                                type="radio"
                                id="customRadioInline1"
                                name="gender"
                                className="custom-control-input"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customRadioInline1"
                              >
                                {t("Erkak")}
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                defaultChecked={
                                  client.gender === "woman" ? true : false
                                }
                                onChange={(e) => {
                                  setClient({ ...client, gender: "woman" });
                                }}
                                type="radio"
                                id="customRadioInline2"
                                name="gender"
                                className="custom-control-input"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="customRadioInline2"
                              >
                                {t("Ayol")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {requiredFields.nation && (
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                        <div className="form-group">
                          <label htmlFor="biO">{t("Fuqoroligi")}</label>
                          <div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                checked={
                                  client.national && client.national === "uzb"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  setClient({ ...client, national: "uzb" });
                                }}
                                type="radio"
                                id="national1"
                                name="national"
                                className="custom-control-input"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="national1"
                              >
                                {t("Uzbek")}
                              </label>
                            </div>
                            <div className="custom-control custom-radio custom-control-inline">
                              <input
                                defaultChecked={
                                  client.national === "foreigner" ? true : false
                                }
                                onChange={(e) => {
                                  setClient({
                                    ...client,
                                    national: "foreigner",
                                  });
                                }}
                                type="radio"
                                id="national2"
                                name="national"
                                className="custom-control-input"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="national2"
                              >
                                {t("Chet'ellik")}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {requiredFields.address && (
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="biO">{t("Manzili")}</label>
                          <textarea
                            value={client.address || ""}
                            onChange={changeClientData}
                            className="form-control form-control-sm"
                            name="address"
                            rows={1}
                            placeholder={t("Manzilni kiriting....")}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">{t("Yullanma")}</label>
                    <div className="flex items-center gap-x-3">
                      <button
                        disabled={
                          auth.clinica?.connectorDoctor_client
                            ? false
                            : isAddHandler || isConnectorHandler
                        }
                        onClick={showNewCounterDoctor}
                        type="button"
                        className={`
                    ${
                      isAddHandler || isConnectorHandler
                        ? "cursor-not-allowed"
                        : ""
                    }
                    flex disabled:bg-green-700  justify-center items-center bg-green-700 rounded-md text-lg hover:bg-green-600 transition-all duration-200 w-[42px] h-[37px]   text-white font-semibold`}
                      >
                        {newCounterDoctor.visible ? (
                          <FontAwesomeIcon size="1xl" icon={faClose} />
                        ) : (
                          <FontAwesomeIcon size="1xl" icon={faPlus} />
                        )}
                      </button>
                      <Select
                        className="w-full"
                        onChange={changeCounterDoctor}
                        placeholder={t("Tanlang...")}
                        // styles={CustomStyle}
                        isDisabled={
                          auth.clinica?.connectorDoctor_client
                            ? false
                            : isAddHandler || isConnectorHandler
                        }
                        value={selectedDoctor}
                        options={[
                          {
                            label: t("Hammasi"),
                            value: "delete",
                          },
                          ...counterdoctors,
                        ]}
                        // isDisabled={isDisabled}
                        // placeholder={placeholder}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                      />
                    </div>
                    {newCounterDoctor.visible && (
                      <div className="mt-1">
                        <div className="form-group">
                          <label htmlFor="addreSs">{t("Familya  Ism")}</label>
                          <div className="input-group input-group-sm mb-3 gap-x-2">
                            <input
                              onChange={handleNewCounterDoctorInputChange}
                              value={newCounterDoctor.value}
                              type="text"
                              className="form-control"
                              placeholder="Familya Ism"
                            />
                            <button
                              onClick={handleNewCounterDoctorCreate}
                              type="button"
                              className="bg-green-700 rounded-md text-lg hover:bg-green-600 transition-all duration-200 px-2 h-[30px]  flex  justify-center items-center  text-white font-semibold"
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* <select
                                            onChange={changeCounterDoctor}
                                            className="form-control form-control-sm selectpicker"
                                            placeholder="Kontragentlarni tanlash"
                                        >
                                            <option value="delete">Tanlanmagan</option>
                                            {counterdoctors.map((counterdoctor, index) => {
                                                return (
                                                    <option
                                                        key={index}
                                                        value={counterdoctor._id}
                                                        id={counterdoctor.user}
                                                    >
                                                        {counterdoctor.lastname +
                                                            ' ' +
                                                            counterdoctor.firstname}
                                                    </option>
                                                )
                                            })}
                                        </select> */}
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="biO">{t("Reklama")}</label>
                    <select
                      onChange={changeAdver}
                      className="form-control form-control-sm selectpicker"
                      placeholder="Reklamalarni tanlash"
                    >
                      <option value="delete">{t("Tanlanmagan")}</option>
                      {advers.map((adver, index) => {
                        return (
                          <option key={index} value={adver._id}>
                            {adver.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-base mr-2">
                      {t("Ambulator karta raqami:")}
                    </h4>
                    <button
                      className="bg-gray-300 flex  justify-center items-center rounded-md text-lg hover:bg-gray-200 transition-all duration-200 px-3.5 h-[40px]  text-black font-semibold"
                      disabled={!isNewClient && client.card_number}
                      onClick={(e) => {
                        if (client?.card_number === null && !isNewClient) {
                          changeClientData({
                            ...e,
                            target: {
                              ...e.target,
                              name: "card_number",
                              value: +lastCardNumber + 1,
                            },
                          });
                        } else if (
                          client?.card_number === null &&
                          isNewClient
                        ) {
                          changeClientData({
                            ...e,
                            target: {
                              ...e.target,
                              name: "card_number",
                              value: +lastCardNumber + 1,
                            },
                          });
                        } else {
                          changeClientData({
                            ...e,
                            target: {
                              ...e.target,
                              name: "card_number",
                              value: null,
                            },
                          });
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faRotate} />
                    </button>
                  </div>
                  <h1 style={{ color: "green", fontSize: "22px" }}>
                    {client?.card_number}
                  </h1>
                </div>
              </div>
            </div>
            <div
              onClick={() => setIsVisible(!isVisible)}
              className="flex justify-end p-2"
            >
              <button className="ml-4 mb-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white">
                Tahrirlash
              </button>
            </div>
          </div>
        </div>
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
                      onChange={(event) => {
                        getServices(event.target.value);
                        setSelectedDepartament(event.target.value);
                      }}
                      value={selectedDepartament}
                    >
                      <option value="all">{t("Barcha bo'limlar")}</option>
                      {departments.map((department, index) => {
                        return (
                          <option key={index} value={department._id}>
                            {department.name}
                          </option>
                        );
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
                      placeholder={t("Tanlang...")}
                      filterOption={filterOption}
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
                      placeholder={t("Tanlang...")}
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
                        <th className="border bg-alotrade py-1">
                          {t("Narxi")}
                        </th>
                        <th className="border bg-alotrade py-1">{t("Soni")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newservices &&
                        newservices.map((service, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-1">{index + 1}</td>
                              <td className="py-1">{service?.service?.name}</td>
                              <td className="text-right py-1">
                                {service?.service?.price * service?.pieces}
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
                                      })
                                    )
                                  }
                                  className="text-right outline-none"
                                  style={{ maxWidth: "50px", outline: "none" }}
                                  defaultValue={service?.pieces}
                                  type="number"
                                />
                              </td>
                            </tr>
                          );
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
                                      })
                                    )
                                  }
                                  className="text-right outline-none"
                                  style={{ maxWidth: "50px", outline: "none" }}
                                  defaultValue={product.pieces}
                                  type="number"
                                />
                              </td>
                            </tr>
                          );
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
                            );
                          }, 0) +
                            newproducts.reduce((summa, product) => {
                              return (
                                summa +
                                product.product.price * parseInt(product.pieces)
                              );
                            }, 0)}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
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
                        onClick={() => {
                          checkData();
                          setIsVisible(false);
                        }}
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
