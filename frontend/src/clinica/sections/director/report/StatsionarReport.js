import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { StatsionarReportTable } from "./components/StatsionarReportTable";
import { useTranslation } from "react-i18next";
import { CheckModalStatsionar } from "../../reseption/components/ModalCheckStatsionar";

const animatedComponents = makeAnimated();

export const StatsionarReport = () => {
  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setHours(23, 59, 59, 59))
  );

  const [check, setCheck] = useState({});

  //====================================================================
  //====================================================================
  // MODAL
  const [modal1, setModal1] = useState(false);
  //====================================================================
  //====================================================================
  const [type, setType] = useState("today");
  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false);

  //====================================================================
  //====================================================================
  const { t } = useTranslation();
  //====================================================================
  //====================================================================
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [countPage, setCountPage] = useState(200);

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

  const [clinicaDataSelect, setClinicaDataSelect] = useState({
    value: auth?.clinica?._id,
    label: auth?.clinica?.name,
  });
  const [clinicaValue, setClinicaValue] = useState(auth?.clinica?._id);

  //====================================================================
  //====================================================================
  // getConnectors
  const [connectors, setConnectors] = useState([]);
  const [searchStorage, setSearchStrorage] = useState([]);
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

  useEffect(() => {
    getBaseUrl();
  }, []);

  const getConnectors = useCallback(
    async (beginDay, endDay, clinica, type) => {
      try {
        const data = await request(
          `/api/cashier/statsionar/getall`,
          "POST",
          { clinica: clinica, beginDay, endDay, type },
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
    [request, notify, indexFirstConnector, indexLastConnector]
  );
  //====================================================================
  //====================================================================+

  //====================================================================
  //====================================================================
  // SEARCH
  const searchFullname = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.fullname
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
      setCountPage(200);
      setCurrentConnectors(connectors);
    } else {
      setCurrentPage(0);
      setCountPage(e.target.value);
      setCurrentConnectors(connectors.slice(0, e.target.value));
    }
  };

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    // getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue)
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59));

    setEndDay(date);
    // getConnectors(beginDay, date, clinicaValue)
  };

  //====================================================================
  //====================================================================
  const changeType = (e) => {
    setConnectors([]);
    setSearchStrorage([]);
    setCurrentConnectors([]);

    if (e.target.value === "todayPayments" || e.target.value === "today")
      setBeginDay(
        (() => {
          const curr = new Date();
          curr.setDate(new Date().getDate() - 1);
          curr.setUTCHours(23, 59, 59, 59);
          return curr;
        })()
      );
    else {
      setBeginDay(
        (() => {
          const curr = new Date();
          curr.setTime(curr.getTime() - (90 * 24 * 60 * 60 * 1000)) //subtract 90 days or 3 months
          curr.setUTCHours(23, 59, 59, 59);
          return curr;
        })()
      );
    }

    setType(e.target.value);
  };
  //====================================================================
  //====================================================================
  // useEffect

  useEffect(() => {
    getConnectors(beginDay, endDay, clinicaValue, type);
  }, [getConnectors, beginDay, endDay, clinicaValue, type]);

  //====================================================================
  //====================================================================
  return (
    <div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            {auth?.clinica?.mainclinica &&
              auth?.clinica?.filials.length > 0 && (
                <div className="w-[300px] mb-2">
                  <Select
                    value={clinicaDataSelect}
                    onChange={(e) => {
                      setClinicaDataSelect(e);
                      setClinicaValue(e.value);
                      getConnectors(beginDay, endDay, e.value);
                    }}
                    components={animatedComponents}
                    options={[
                      {
                        value: auth?.clinica?._id,
                        label: auth?.clinica?.name,
                      },
                      ...[...auth?.clinica?.filials].map((el) => ({
                        value: el._id,
                        label: el.name,
                      })),
                    ]}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      padding: 0,
                      height: 0,
                    })}
                  />
                </div>
              )}
            <StatsionarReportTable
              setVisible={setVisible}
              modal1={modal1}
              setModal1={setModal1}
              setCheck={setCheck}
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchPhone={searchPhone}
              // changeClient={changeClient}
              // setConnector={setConnector}
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
              changeType={changeType}
              type={type}
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
    </div>
  );
};
