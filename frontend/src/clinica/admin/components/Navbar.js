import React, { useCallback, useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";

export const Navbar = ({ baseUrl, setIsAuthenticated, setUser }) => {
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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const { request } = useHttp();
  const auth = useContext(AuthContext);

  const { user } = JSON.parse(localStorage.getItem('AdminData'));

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================



  //====================================================================
  //====================================================================

  const [activePage, setActivePage] = useState(window.location.pathname)

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  return (<div>
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
          className="bg-[#00c2cb] collapse navbar-collapse justify-content-between"
          id="royalHospitalsNavbar"
        >
          <ul className="bg-[#00c2cb]  navbar-nav">
            <li className="nav-item mr-4 px-2">
              <span className="logo" style={{ fontSize: "26pt" }}>
                Alo24
              </span>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activePage === "/alotrade" ? "active-page" : ""
                  }`}
                to="/alotrade"
                onClick={() => setActivePage('/admin')}
                style={{ background: activePage === "/alotrade" || activePage === "/" ? "#F97316" : "" }}
              >
                <i className="icon-devices_other nav-icon" />
                Shifoxonalar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activePage === "/alotrade/users" ? "active-page" : ""
                  }`}
                to="/alotrade/users"
                onClick={() => setActivePage('/alotrade/users')}
                style={{ background: activePage === "/admin/users" || activePage === "/" ? "#F97316" : "" }}
              >
                <i className="icon-devices_other nav-icon" />
                Foydalanuvchilar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activePage === "/alotrade/filials" ? "active-page" : ""
                  }`}
                to="/alotrade/filials"
                onClick={() => setActivePage('/alotrade/filials')}
                style={{ background: activePage === "/alotrade/filials" || activePage === "/" ? "#F97316" : "" }}
              >
                <i className="icon-devices_other nav-icon" />
                Filiallar
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${activePage === "/alotrade/transfer_tables" ? "active-page" : ""
                  }`}
                to="/alotrade/transfer_tables"
                onClick={() => setActivePage('/alotrade/transfer_tables')}
                style={{ background: activePage === "/alotrade/transfer_tables" || activePage === "/" ? "#F97316" : "" }}
              >
                <i className="icon-devices_other nav-icon" />
                Shablon almashnuv
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
                  <img
                    className="circle d-inline"
                    src={
                      baseUrl && `${baseUrl}/api/upload/file/${user.image}`
                    }
                  />
                  <span className="status busy" />
                </span>
              </span>
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="userSettings"
              >
                <div className="header-profile-actions">
                  <button
                    onClick={() => {
                      localStorage.removeItem('AdminData');
                      setIsAuthenticated(null);
                      setUser(null);
                    }}
                  >
                    <i className="icon-log-out1" /> Chiqish
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>)
};
