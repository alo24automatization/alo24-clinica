import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const Check = ({ baseUrl, clinica, connector, qr, user }) => {
  const { t } = useTranslation();

  const [departments, setDeparmtents] = useState([]);

  useEffect(() => {
    if (connector && connector.services && connector.services.length > 0) {
      let all = [];
      for (const service of connector?.services) {
        let isExist = [...all].findIndex(
          (item) => item?.department === service?.department?._id
        );
        if (isExist >= 0) {
          all[isExist].turn = service.turn;
        } else {
          all.push({
            department: service?.department?._id,
            name: service?.department?.name,
            turn: service?.turn,
            room: service?.department?.room,
            brondate: connector?.client?.was_online
              ? connector?.client?.brondate
              : null,
            bronTime: connector?.client?.was_online
              ? connector?.client?.bronTime
              : null,
          });
        }
      }
      setDeparmtents(all);
    }
  }, [connector]);
  return (
    <div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li
                      className="flex items-center mb-2"
                      style={{ fontSize: "11pt", fontFamily: "times" }}
                    >
                      <div className="mr-2">
                        <strong
                          style={{
                            color: "black",
                            fontSize: "11pt",
                            fontFamily: "times",
                          }}
                        >
                          {t("Manzil")}:{" "}
                        </strong>
                      </div>
                      <div style={{ color: "black" }}>
                        {clinica && clinica.address}
                      </div>
                    </li>
                    <li
                      className="flex items-center"
                      style={{ textAlign: "", fontSize: "11pt" }}
                    >
                      <div className="mr-2">
                        <strong
                          style={{
                            color: "black",
                            fontSize: "11pt",
                            fontFamily: "times",
                          }}
                        >
                          {t("Telefon raqami")}:{" "}
                        </strong>
                      </div>
                      <div style={{ color: "black" }}>{clinica?.phone1}</div>
                    </li>
                    <li
                      style={{
                        color: "black",
                        textAlign: "",
                        fontSize: "11pt",
                      }}
                    >
                      {connector.probirka && connector.probirka ? (
                        <h6
                          className="d-inline-block"
                          style={{ fontSize: "27pt", fontFamily: "times" }}
                        >
                          {t("NAMUNA")}: {connector.probirka}
                        </h6>
                      ) : (
                        ""
                      )}
                      <div className="ml-3 text-[14px] mt-4">
                        {t("Kelgan vaqti")}:{" "}
                        {connector &&
                          new Date(connector.createdAt).toLocaleDateString() +
                            " " +
                            new Date(connector.createdAt).toLocaleTimeString()}
                      </div>
                    </li>
                  </ul>
                </td>
                <td
                  className="text-center"
                  style={{ transform: "translateX(-100px)" }}
                >
                  <div className="w-full text-center">
                    <img
                      className="mx-auto"
                      width="200"
                      src={baseUrl + "/api/upload/file/" + clinica?.image}
                      alt="logo"
                    />
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: "11pt" }}>
                    {t("Ushbu QR kod faqat tahlil natijalarini olish uchun!")}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: "uppercase",
                  fontFamily: "times",
                  fontSize: "20px",
                }}
              >
                {t("ID")}: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("F.I.O")}: {connector.client && connector.client.lastname}{" "}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("Tug'ilgan yil")}:{" "}
                {new Date(
                  connector.client && connector.client.born
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("Tel")}: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>
          <div className="col-12">
            <table className="w-full py-2">
              <thead className="">
                <tr>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    {t("Bo'lim")}
                  </th>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    {t("Navbat")}
                  </th>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    {t("Xona")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, ind) => (
                  <tr key={ind}>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                      {d?.name}
                    </td>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                      {d?.bronTime ? d?.bronTime : d?.turn}
                    </td>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                      {d?.room}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full py-2">
            <h3 className="text-center text-[18px] font-bold text-uppercase">
              {t("Xizmatlar")}
            </h3>
          </div>
          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: "hidden", outline: "none" }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: "18px", fontFamily: "times" }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Nomi")}
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Soni")}
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Summasi")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      if (service.refuse === false) {
                        return (
                          <tr
                            key={index}
                            className="bg-white"
                            style={{ fontFamily: "times", fontSize: "18px" }}
                          >
                            <td className="py-0 border text-right font-weight-bold">
                              {index + 1}
                            </td>
                            <td className="py-0 border pl-2 font-weight-bold">
                              {service.service.name}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.pieces}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.service.price * service.pieces}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: "times", fontSize: "12pt" }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {((connector.services &&
                connector.services.some((s) => s.refuse)) ||
                (connector.products &&
                  connector.products.some((p) => p.refuse))) && (
                <h2 className="text-[21px] font-bold mt-4 mb-2">
                  {t("Qaytarilgan summa")}
                </h2>
              )}
              {((connector.services &&
                connector.services.some((s) => s.refuse)) ||
                (connector.products &&
                  connector.products.some((p) => p.refuse))) && (
                <table
                  className="table table-bordered text-dark mt-2"
                  style={{ fontSize: "11pt", fontFamily: "times" }}
                >
                  <thead className="text-dark">
                    <tr className="bg-white">
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        №
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Nomi")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Xona")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Navbat")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Soni")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Summasi")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {connector.services &&
                      connector.services.map((service, index) => {
                        console.log(service);
                        return (
                          service.refuse && (
                            <tr
                              key={index}
                              className="bg-white"
                              style={{ fontFamily: "times", fontSize: "12pt" }}
                            >
                              <td className="py-0 border text-right font-weight-bold">
                                {index + 1}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {service.service.name}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {service?.department?.room}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.turn}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.pieces}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.service.price * service.pieces}
                              </td>
                            </tr>
                          )
                        );
                      })}
                    {connector.products &&
                      connector.products.map((product, index) => {
                        console.log(product);

                        return (
                          product.refuse && (
                            <tr
                              key={index}
                              className="bg-white"
                              style={{ fontFamily: "times", fontSize: "12pt" }}
                            >
                              <td className="py-0 border text-right font-weight-bold">
                                {index + 1}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {product.product.name}
                              </td>
                              <td className="py-0 border pl-2 text-right"></td>
                              <td className="py-0 border pl-2 text-right">
                                {product.pieces}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {product.product.price * product.pieces}
                              </td>
                            </tr>
                          )
                        );
                      })}
                  </tbody>
                </table>
              )}
              <div className="my-4 flex justify-between items-center">
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Jami")}:{" "}
                  {connector.products &&
                    connector.services &&
                    connector.services.reduce((summ, service) => {
                      return (
                        summ +
                        (service.refuse === false
                          ? service.service.price * parseInt(service.pieces)
                          : 0)
                      );
                    }, 0) +
                      connector.products.reduce((summ, product) => {
                        return (
                          summ +
                          product.product.price * parseInt(product.pieces)
                        );
                      }, 0)}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Chegirma")}: {connector?.discount?.discount || 0}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Qaytarilgan summa")}:{" "}
                  {connector &&
                    connector.services &&
                    connector.products &&
                    connector.services.reduce(
                      (prev, el) =>
                        prev + ((el.refuse && el.service.price) || 0),
                      0
                    ) +
                      connector.products.reduce(
                        (prev, el) =>
                          prev + ((el.refuse && el.product.price) || 0),
                        0
                      )}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Qarz")}:{" "}
                  {(connector &&
                    connector.payments &&
                    connector.payments.reduce(
                      (prev, el) => prev + el.debt,
                      0
                    )) ||
                    0}
                </div>
                <div
                  colSpan={2}
                  className="text-right text-[16px] font-weight-bold"
                >
                  {t("To'langan")}:{" "}
                  {(connector &&
                    connector.payments &&
                    connector.payments.reduce(
                      (prev, el) => prev + el.payment,
                      0
                    )) ||
                    0}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[16px]" style={{ fontFamily: "Times" }}>
                  {t("Mijoz imzosi")}: ________________
                </div>
                <div className="text-[16px] font-bold">
                  {user?.firstname + " " + user?.lastname}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: "2px dashed black", margin: "50px 0" }}></div>
      <div className="container px-5">
        <div className="row">
          <table className="table ">
            <tbody>
              <tr>
                <td>
                  <ul className="list-unstyled  text-start ml-3 mb-0">
                    <li
                      className="flex items-center mb-2"
                      style={{ fontSize: "11pt", fontFamily: "times" }}
                    >
                      <div className="mr-2">
                        <strong
                          style={{
                            color: "black",
                            fontSize: "11pt",
                            fontFamily: "times",
                          }}
                        >
                          {t("Manzil")}:{" "}
                        </strong>
                      </div>
                      <div style={{ color: "black" }}>
                        {clinica && clinica.address}
                      </div>
                    </li>
                    <li
                      className="flex items-center"
                      style={{ textAlign: "", fontSize: "11pt" }}
                    >
                      <div className="mr-2">
                        <strong
                          style={{
                            color: "black",
                            fontSize: "11pt",
                            fontFamily: "times",
                          }}
                        >
                          {t("Telefon raqami")}:{" "}
                        </strong>
                      </div>
                      <div style={{ color: "black" }}>{clinica?.phone1}</div>
                    </li>
                    <li
                      style={{
                        color: "black",
                        textAlign: "",
                        fontSize: "11pt",
                      }}
                    >
                      {connector.probirka && connector.probirka ? (
                        <h6
                          className="d-inline-block"
                          style={{ fontSize: "27pt", fontFamily: "times" }}
                        >
                          {t("NAMUNA")}: {connector.probirka}
                        </h6>
                      ) : (
                        ""
                      )}
                      <div className="ml-3 text-[14px] mt-4">
                        {t("Kelgan vaqti")}:{" "}
                        {connector &&
                          new Date(connector.createdAt).toLocaleDateString() +
                            " " +
                            new Date(connector.createdAt).toLocaleTimeString()}
                      </div>
                    </li>
                  </ul>
                </td>
                <td
                  className="text-center"
                  style={{ transform: "translateX(-100px)" }}
                >
                  <div className="w-full text-center">
                    <img
                      className="mx-auto"
                      width="200"
                      src={baseUrl + "/api/upload/file/" + clinica?.image}
                      alt="logo"
                    />
                  </div>
                </td>
                <td className="text-right">
                  <img
                    width="140"
                    className="mr-3 d-inline "
                    src={qr && qr}
                    alt="QR"
                  />
                  <br />
                  <p className="pr-3 mr-1 mb-0 " style={{ fontSize: "11pt" }}>
                    {t("Bu yerni skanerlang")}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-2">
            <div className="invoice-from ps-4">
              <h6
                className="d-inline-block"
                style={{
                  textTransform: "uppercase",
                  fontFamily: "times",
                  fontSize: "20px",
                }}
              >
                {t("ID")}: {connector.client && connector.client.id}
              </h6>
            </div>
          </div>
          <div className="col-4">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("F.I.O")}: {connector.client && connector.client.lastname}{" "}
                {connector.client && connector.client.firstname}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-center">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("Tug'ilgan yil")}:{" "}
                {new Date(
                  connector.client && connector.client.born
                ).toLocaleDateString()}
              </h6>
            </div>
          </div>
          <div className="col-3">
            <div className="invoice-from text-right pr-4">
              <h6
                className="d-inline-block"
                style={{ fontSize: "20px", fontFamily: "times" }}
              >
                {t("Tel")}: +998{connector.client && connector.client.phone}
              </h6>
            </div>
          </div>
          <div className="col-12">
            <table className="w-full py-2">
              <thead className="">
                <tr>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    Bo'lim
                  </th>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    Navbat
                  </th>
                  <th className="border border-black-800 text-[16px] text-center w-[33%] font-bold">
                    Xona
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, ind) => (
                  <tr key={ind}>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                      {d?.name}
                    </td>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                    {d?.bronTime ? d?.bronTime : d?.turn}
                    </td>
                    <td className="border border-black-800 text-[16px] text-center font-bold">
                      {d?.room}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full py-2">
            <h3 className="text-center text-[18px] font-bold">
              {t("XIZMATLAR")}
            </h3>
          </div>
          <div className="col-lg-12">
            <div
              className="table-responsive"
              style={{ overflow: "hidden", outline: "none" }}
            >
              <table
                className="table table-bordered text-dark mt-2"
                style={{ fontSize: "18px", fontFamily: "times" }}
              >
                <thead className="text-dark">
                  <tr className="bg-white">
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      №
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Nomi")}
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Soni")}
                    </th>
                    <th
                      className="text-center text-black border py-0 "
                      style={{ fontSize: "18px", fontFamily: "times" }}
                    >
                      {t("Summasi")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {connector.services &&
                    connector.services.map((service, index) => {
                      if (service.refuse === false) {
                        return (
                          <tr
                            key={index}
                            className="bg-white"
                            style={{ fontFamily: "times", fontSize: "18px" }}
                          >
                            <td className="py-0 border text-right font-weight-bold">
                              {index + 1}
                            </td>
                            <td className="py-0 border pl-2 font-weight-bold">
                              {service.service.name}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.pieces}
                            </td>
                            <td className="py-0 border pl-2 text-right">
                              {service.service.price * service.pieces}
                            </td>
                          </tr>
                        );
                      }
                    })}
                  {connector.products &&
                    connector.products.map((product, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white"
                          style={{ fontFamily: "times", fontSize: "12pt" }}
                        >
                          <td className="py-0 border text-right font-weight-bold">
                            {index + 1}
                          </td>
                          <td className="py-0 border pl-2 font-weight-bold">
                            {product.product.name}
                          </td>
                          <td className="py-0 border pl-2 text-right"></td>
                          <td className="py-0 border pl-2 text-right">
                            {product.pieces}
                          </td>
                          <td className="py-0 border pl-2 text-right">
                            {product.product.price * product.pieces}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {((connector.services &&
                connector.services.some((s) => s.refuse)) ||
                (connector.products &&
                  connector.products.some((p) => p.refuse))) && (
                <h2 className="text-[21px] font-bold mt-4 mb-2">
                  {t("Qaytarilgan summa")}
                </h2>
              )}
              {((connector.services &&
                connector.services.some((s) => s.refuse)) ||
                (connector.products &&
                  connector.products.some((p) => p.refuse))) && (
                <table
                  className="table table-bordered text-dark mt-2"
                  style={{ fontSize: "11pt", fontFamily: "times" }}
                >
                  <thead className="text-dark">
                    <tr className="bg-white">
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        №
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Nomi")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Xona")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Navbat")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Soni")}
                      </th>
                      <th
                        className="text-center text-black border py-0 "
                        style={{ fontSize: "11pt", fontFamily: "times" }}
                      >
                        {t("Summasi")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {connector.services &&
                      connector.services.map((service, index) => {
                        return (
                          service.refuse && (
                            <tr
                              key={index}
                              className="bg-white"
                              style={{ fontFamily: "times", fontSize: "12pt" }}
                            >
                              <td className="py-0 border text-right font-weight-bold">
                                {index + 1}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {service.service.name}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {service?.department?.room}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.turn}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.pieces}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {service.service.price * service.pieces}
                              </td>
                            </tr>
                          )
                        );
                      })}
                    {connector.products &&
                      connector.products.map((product, index) => {
                        return (
                          product.refuse && (
                            <tr
                              key={index}
                              className="bg-white"
                              style={{ fontFamily: "times", fontSize: "12pt" }}
                            >
                              <td className="py-0 border text-right font-weight-bold">
                                {index + 1}
                              </td>
                              <td className="py-0 border pl-2 font-weight-bold">
                                {product.product.name}
                              </td>
                              <td className="py-0 border pl-2 text-right"></td>
                              <td className="py-0 border pl-2 text-right">
                                {product.pieces}
                              </td>
                              <td className="py-0 border pl-2 text-right">
                                {product.product.price * product.pieces}
                              </td>
                            </tr>
                          )
                        );
                      })}
                  </tbody>
                </table>
              )}
              <div className="my-4 flex justify-between items-center">
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Jami")}:{" "}
                  {connector.products &&
                    connector.services &&
                    connector.services.reduce((summ, service) => {
                      return (
                        summ +
                        (service.refuse === false
                          ? service.service.price * parseInt(service.pieces)
                          : 0)
                      );
                    }, 0) +
                      connector.products.reduce((summ, product) => {
                        return (
                          summ +
                          product.product.price * parseInt(product.pieces)
                        );
                      }, 0)}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Chegirma")}: {connector?.discount?.discount || 0}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Qaytarilgan summa")}:{" "}
                  {connector &&
                    connector.services &&
                    connector.products &&
                    connector.services.reduce(
                      (prev, el) =>
                        prev + ((el.refuse && el.service.price) || 0),
                      0
                    ) +
                      connector.products.reduce(
                        (prev, el) =>
                          prev + ((el.refuse && el.product.price) || 0),
                        0
                      )}
                </div>
                <div className="text-right text-[16px] font-weight-bold">
                  {t("Qarz")}:{" "}
                  {(connector &&
                    connector.payments &&
                    connector.payments.reduce(
                      (prev, el) => prev + el.debt,
                      0
                    )) ||
                    0}
                </div>
                <div
                  colSpan={2}
                  className="text-right text-[16px] font-weight-bold"
                >
                  {t("To'langan")}:{" "}
                  {(connector &&
                    connector.payments &&
                    connector.payments.reduce(
                      (prev, el) => prev + el.payment,
                      0
                    )) ||
                    0}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[16px]" style={{ fontFamily: "Times" }}>
                  {t("Mijoz imzosi")}: ________________
                </div>
                <div className="text-[16px] font-bold">
                  {user?.firstname + " " + user?.lastname}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
