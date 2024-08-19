import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { useToast } from "@chakra-ui/react";
import AloLogo from "../../../../clinica_logo.jpg";
import { useTranslation } from "react-i18next";

export const Navbar = () => {
  const history = useHistory();
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

  const [activePage, setActivePage] = useState(window.location.pathname);
  //====================================================================
  //====================================================================
  const { t } = useTranslation();
  //====================================================================
  //====================================================================

  const { request } = useHttp();
  const auth = useContext(AuthContext);

  const user = auth.user;
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [baseUrl, setBaseUrl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
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

  //====================================================================
  //====================================================================
  const [s, setS] = useState();
  useEffect(() => {
    if (!s) {
      setS(1);
      getBaseUrl();
    }
  }, [getBaseUrl, s]);
  //====================================================================
  //====================================================================

  return (
    <div>
      <div className="container-fluid p-0">
        <nav className="navbar navbar-expand-lg custom-navbar">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#royalHospitalsNavbar"
            aria-controls="royalHospitalsNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">
              <i />
              <i />
              <i />
            </span>
          </button>
          <div
            className="bg-[#00c2cb] collapse navbar-collapse  justify-content-between"
            id="royalHospitalsNavbar"
          >
            <ul className="navbar-nav py-2">
              <li className="nav-item px-2">
                <img src={AloLogo} alt="logo" className="w-[100px]" />
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24" || activePage === "/"
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24");
                  }}
                  to="/alo24"
                  style={{
                    background:
                      activePage === "/alo24" || activePage === "/"
                        ? "#F97316"
                        : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Mijozlar")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/templates" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/templates");
                  }}
                  to="/alo24/templates"
                  style={{
                    background:
                      activePage === "/alo24/templates" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Shablonlar")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/conclusionclients"
                      ? "active-page"
                      : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/conclusionclients");
                  }}
                  to="/alo24/conclusionclients"
                  style={{
                    background:
                      activePage === "/alo24/conclusionclients"
                        ? "#F97316"
                        : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Xulosa berish")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/doctor_profit" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/doctor_profit");
                  }}
                  to="/alo24/doctor_profit"
                  style={{
                    background:
                      activePage === "/alo24/doctor_profit" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Shifokor ulushi")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/onlineclients" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/onlineclients");
                  }}
                  to="/alo24/onlineclients"
                  style={{
                    background:
                      activePage === "/alo24/onlineclients" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Online")}
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/statsionar_room" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/statsionar_room");
                  }}
                  to="/alo24/statsionar_room"
                  style={{
                    background:
                      activePage === "/alo24/statsionar_room" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-devices_other nav-icon" />
                  {t("Statsionar ulushi")}
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    activePage === "/alo24/settings" ? "active-page" : ""
                  }`}
                  onClick={() => {
                    setActivePage("/alo24/settings");
                  }}
                  to="/alo24/settings"
                  style={{
                    background:
                      activePage === "/alo24/settings" ? "#F97316" : "",
                  }}
                >
                  <i className="icon-settings nav-icon" />
                  {t("Sozlamalar")}
                </Link>
              </li>
            </ul>
            <ul className="header-actions py-1 mr-2">
              <li className="dropdown">
                <span
                  id="userSettings"
                  className="user-settings"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                >
                  <span className="user-name">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="avatar md">
                    {baseUrl ? (
                      <img
                        className="circle d-inline"
                        src={
                          baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                        }
                        alt={user.firstname + user.lastname}
                      />
                    ) : (
                      user.firstname + user.lastname
                    )}

                    <span className="status busy" />
                  </span>
                </span>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="userSettings"
                >
                  <div className="header-profile-actions">
                    <div className="header-user-profile">
                      <div className="header-user">
                        <img
                          src={
                            baseUrl &&
                            `${baseUrl}/api/upload/file/${user.image}`
                          }
                          alt={user.firstname + user.lastname}
                        />
                      </div>
                      {user.firstname} {user.lastname}
                      <p>Reseption</p>
                    </div>
                    <button
                      onClick={() => {
                        auth.logout();
                        history.push("/");
                      }}
                    >
                      <i className="icon-log-out1" /> {t("Chiqish")}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};
