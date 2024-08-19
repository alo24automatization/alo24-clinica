import React from "react";
// import { DatePickers } from "./DatePickers";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

export const RegisterClient = ({
  inputPayment,
  totalpayment,
  checkPayment,
  debtComment,
  changeDebt,
  serviceComment,
  productComment,
  discountComment,
  discount,
  changeDiscount,
  setPayment,
  changeProduct,
  changeService,
  payments,
  payment,
  client,
  index,
  services,
  products,
  setSetvices,
  setProducts,
  loading,
  connector,
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {t("Mijozning shaxsiy ma'lumotlari")}
              </div>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="border py-1 bg-alotrade"></th>
                    <th scope="col" className="border py-1 bg-alotrade"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 border">{t("Familiyasi")}</td>
                    <td className="py-1 border">{client.lastname}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Ismi")}</td>
                    <td className="py-1 border">{client.firstname}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Otasining ismi")}</td>
                    <td className="py-1 border">{client.fathername}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Tug'ilgan sanasi")}</td>
                    <td className="py-1 border">
                      {client.born &&
                        new Date(client.born).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Telefon raqami")}</td>
                    <td className="py-1 border">+998{client.phone}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("ID")}</td>
                    <td className="py-1 border">{client.id}</td>
                  </tr>
                  <tr>
                    <td className="py-1 border">{t("Probirka")}</td>
                    <td className="py-1 border">{connector.probirka}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                {t("Xizmat va tolovlar bilan ishlash bo'limi")}
              </div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-12">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th className="border py-1 bg-alotrade">№</th>
                        <th className="border py-1 bg-alotrade">{t("Nomi")}</th>
                        <th className="border py-1 bg-alotrade">
                          {t("Narxi")}
                        </th>
                        <th className="border py-1 bg-alotrade">{t("Soni")}</th>
                        <th className="border py-1 bg-alotrade">
                          {t("To'lov")}
                        </th>
                        <th className="border py-1 bg-alotrade">{t("Izoh")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services &&
                        services.map((service, index) => {
                          return (
                            <tr key={index}>
                              <td
                                className={`${service?.isPayment
                                    ? "bg-green-400"
                                    : "bg-red-400"
                                  } py-1 border`}
                              >
                                {index + 1}
                              </td>
                              <td className="py-1 border">
                                {service.service.name}
                              </td>
                              <td className="text-right py-1 border">
                                {service.service.price * service.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                {service.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    defaultChecked={!service.refuse}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`service${index}`}
                                    onChange={(e) => changeService(e, index)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`service${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td className="text-right py-1 border">
                                {/* {service.refuse ? (
                                  <input
                                    onChange={(e) => serviceComment(e, index)}
                                    defaultValue={service.comment}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="comment"
                                    name="comment"
                                    placeholder={t("Izoh")}
                                  />
                                ) : ( */}
                                {service?.addUser}
                                {/* )} */}
                              </td>
                            </tr>
                          );
                        })}
                      <tr></tr>
                      {products &&
                        products.map((product, index) => {
                          return (
                            <tr key={index}>
                              <td className="py-1 border">{index + 1}</td>
                              <td className="py-1 border">
                                {product.product.name}
                              </td>
                              <td className="text-right py-1 border">
                                {product.product.price * product.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                {product.pieces}
                              </td>
                              <td className="text-right py-1 border">
                                <div className="custom-control custom-checkbox text-center">
                                  <input
                                    defaultChecked={!product.refuse}
                                    type="checkbox"
                                    className="custom-control-input border border-dager"
                                    id={`product${index}`}
                                    onChange={(e) => changeProduct(e, index)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`product${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td className="text-right py-1 border">
                                {product.refuse && (
                                  <input
                                    onChange={(e) => productComment(e, index)}
                                    defaultValue={product.comment}
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="comment"
                                    name="comment"
                                    placeholder={t("Izoh")}
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      <tr className="bg-white">
                        <td
                          className="border py-1 font-bold text-right text-teal-600 text-sm "
                          colSpan={2}
                        >
                          {" "}
                          {t("Jami")}
                        </td>
                        <td
                          className="border py-1 font-bold  text-teal-600 text-sm"
                          colSpan={4}
                        >
                          {" "}
                          {totalpayment}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
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
                      {totalpayment -
                        payments -
                        discount.discount -
                        payment.debt}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("To'lov qabul qilish")}</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Chegirma")}
                        </span>
                      </div>
                      {discount.procient ? (
                        <input
                          onChange={changeDiscount}
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "Chegirma foizi yoki summasini kiriting"
                          )}
                          defaultValue={discount.discount}
                        />
                      ) : (
                        <input
                          onChange={changeDiscount}
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "Chegirma foizi yoki summasini kiriting"
                          )}
                          value={discount.discount || ""}
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend w-25">
                        <label
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          htmlFor="inputGroupSelect01"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Izoh")}
                        </label>
                      </div>
                      <select
                        onChange={discountComment}
                        className="custom-select"
                        id="inputGroupSelect01"
                      >
                        <option value="delete">{t("Tanlang...")}</option>
                        <option value="Kam ta'minlangan">
                          {t("Kam ta'minlangan")}
                        </option>
                        <option value="Direktor tanishi">
                          {t("Direktor tanishi")}
                        </option>
                        <option value="Nogironligi mavjud">
                          {t("Nogironligi mavjud")}
                        </option>
                        <option value="Doimiy mijoz">
                          {t("Doimiy mijoz")}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Qarz")}
                        </span>
                      </div>
                      <input
                        onChange={changeDebt}
                        type="number"
                        className="form-control"
                        placeholder={t("Qarz summasini kiriting")}
                        value={payment.debt || ""}
                      />
                    </div>
                  </div>
                  <div className="form-group m-0 mb-3">
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-alotrade text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Izoh")}
                        </span>
                      </div>
                      <input
                        onChange={debtComment}
                        type="text"
                        className="form-control"
                        placeholder={t("Qarz izohini kiriting")}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 ">
                  <div
                    className="btn-group mb-3 w-100"
                    role="group"
                    aria-label="Basic example"
                  >
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "cash",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                          cash:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                          card: 0,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white  ${payment.type === "cash" ? "bg-amber-500" : "bg-alotrade"
                        }`}
                    >
                      {t("Naqt")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "card",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                          cash: 0,
                          card:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${payment.type === "card" ? "bg-amber-500" : "bg-alotrade"
                        }`}
                    >
                      {t("Plastik")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "transfer",
                          payment:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                          cash: 0,
                          card: 0,
                          transfer:
                            totalpayment -
                            payments -
                            discount.discount -
                            payment.debt,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${payment.type === "transfer"
                          ? "bg-amber-500"
                          : "bg-alotrade"
                        }`}
                    >
                      {t("O'tkazma")}
                    </button>
                    <button
                      onClick={() => {
                        setPayment({
                          ...payment,
                          type: "mixed",
                          cash: 0,
                          card: 0,
                          transfer: 0,
                        });
                      }}
                      type="button"
                      className={`btn btn-sm py-1 text-white ${payment.type === "mixed"
                          ? "bg-amber-500"
                          : "bg-alotrade"
                        }`}
                    >
                      {t("Aralash")}
                    </button>
                  </div>
                  {(payment.type === "cash" || payment.type === "mixed") && (
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-primary text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Naqt")}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("Naqt to'lov")}
                        value={payment.cash || ""}
                        name="cash"
                        onChange={inputPayment}
                      />
                    </div>
                  )}
                  {(payment.type === "card" || payment.type === "mixed") && (
                    <div className="input-group input-group-sm mb-3">
                      <div className="input-group-prepend w-25">
                        <span
                          className="w-100 input-group-text bg-primary text-white font-weight-bold"
                          id="inputGroup-sizing-sm"
                          style={{ fontSize: "9pt" }}
                        >
                          {t("Plastik")}
                        </span>
                      </div>
                      <input
                        type="number"
                        className="form-control"
                        placeholder={t("Karta orqali to'lov")}
                        value={payment.card || ""}
                        name="card"
                        onChange={inputPayment}
                      />
                    </div>
                  )}
                  {(payment.type === "transfer" ||
                    payment.type === "mixed") && (
                      <div className="input-group input-group-sm mb-3">
                        <div className="input-group-prepend w-25">
                          <span
                            className="w-100 input-group-text bg-primary text-white font-weight-bold"
                            id="inputGroup-sizing-sm"
                            style={{ fontSize: "9pt" }}
                          >
                            {t("O'tkazma")}
                          </span>
                        </div>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={t("O'tkazma to'lov")}
                          value={payment.transfer || ""}
                          name="transfer"
                          onChange={inputPayment}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mb-3">
              <div className="text-right">
                {loading ? (
                  <button className="btn btn-warning" disabled>
                    <span className="spinner-border spinner-border-sm"></span>
                    Loading...
                  </button>
                ) : (
                  <button
                      onClick={checkPayment}
                    className="btn btn-warning w-100"
                  >
                    {t("Qabul qilish")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Row end */}
    </>
  );
};
