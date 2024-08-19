import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { DatePickers } from "../doctorclients/clientComponents/DatePickers";
import { useTranslation } from "react-i18next";

const animatedComponents = makeAnimated()

export const Conclusion = () => {

  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

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
  const {t} = useTranslation()
  //====================================================================
  //====================================================================
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);

  //====================================================================
  //====================================================================

  const [clinicaDataSelect, setClinicaDataSelect] = useState({
    value: auth?.user?.clinica?._id,
    label: auth?.user?.clinica?.name,
    ...auth.user.clinica
  });
  const [clinicaValue, setClinicaValue] = useState(auth?.user?.clinica?._id)

  //====================================================================
  //====================================================================

  const [serviceType, setServiceType] = useState(null)
  const [serviceTypes, setServiceTypes] = useState([]);
  const [servicesColumn, setServicesColumn] = useState([])
  const getServiceTypes = useCallback(
    async (clinica) => {
      try {
        const data = await request(
          `/api/labaratory/servicetype/get`,
          "POST",
          {
            clinica: clinica,
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        setServiceTypes([...data].map((el => ({
          value: el._id,
          label: el.name,
          services: el.services
        }))))
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

  // ====================================================================
  // ====================================================================

  const [serviceClients, setServiceClietns] = useState([])

  const getClientsServices =
    async (servicetype, colservices, beginDay, endDay) => {
      try {
        const data = await request(
          `/api/labaratory/clients/result`,
          "POST",
          {
            clinica: clinicaValue,
            servicetype,
            beginDay,
            endDay
          },
          {
            Authorization: `Bearer ${auth.token}`,
          }
        );
        sortData(data, colservices);
      } catch (error) {
        notify({
          title: error,
          description: "",
          status: "error",
        });
      }
    }


  const sortData = (currentData, colservices) => {
    const data = []
    let columns = [...colservices].filter(col => col.visible).sort((a, b) => a?.place - b?.place)
    if (currentData.length > 0) {
      for (const client of currentData) {
        let services = []
        for (const column of columns) {
            let currentService = [...client.services].filter(service => service.service._id === column._id)
            if (currentService.length > 0) {
              services.push(...currentService)
            }
            else {
              services.push({
                tables: [],
                service: []
              })
            }
          
        }
        data.push({
          ...client, services: [...services]
        })
      }
    }

    setServiceClietns(data);
  }
  //=========================================================
  //=========================================================
  const handleChangeServiceType = (e) => {
    setServicesColumn([...e.services].filter(service => service.visible).sort((a, b) => a.place - b.place))
    getClientsServices(e.value, e.services, beginDay, endDay)
    setServiceType(e);
  }

  const handleChangeServiceClient = (e, index, serviceid) => {
    const current = [...serviceClients].map((client, ind) => {
      if (ind === index) {
        const newServices = client.services.map((service) => {
          if (service._id === serviceid) {
            service.tables = [...service.tables].map((table) => ({ ...table, col2: e.target.value, accept: e.target.value ? true : false }))
            if (e.target.value.length > 0) {
              service.accept = true;
            } else {
              service.accept = false;
            }
          }
          return service;
        })
        client.services = newServices
      }
      return client;
    })
    setServiceClietns(current)
  }

  const isExistColumn = (serviceid) => {
    return servicesColumn.some(el => el._id === serviceid)
  }
  // ======================================
  // ======================================

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getClientsServices(serviceType.value, serviceType.services, new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay)
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

    setEndDay(date);
    getClientsServices(serviceType.value, serviceType.services, beginDay, date)
  };

  // ======================================
  // ======================================

  const handleConclusion = async () => {
    const send = serviceClients.reduce((prev, el) => {
      let service = el.services.filter(item => item.tables.length > 0)
      prev.push(...service);
      return prev;
    }, [])
    try {
      const data = await request(
        `/api/labaratory/conclusion/save`,
        "POST",
        {
          services: send
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: data.message,
        description: "",
        status: "success",
      });
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }

  // ======================================
  // ======================================

  const addTrow = (servicelength) => {

    if ((servicesColumn.length - servicelength) > 0) {
      let ind = 0;
      while (ind < (servicesColumn.length - servicelength)) {
        ind += 1;
        return <td className="border py-1 text-right text-[16px]"></td>
      }
    }
  }

  const isDone = (services) => {
    const done = services.filter(service => service.tables.length > 0)
      .filter(service => !service.tables[0].col2)
    if (done.length > 0) {
      return 'bg-red-600'
    } else {
      return ""
    }
  }

  // ======================================
  // ======================================

  // const [t, setT] = useState(0);
  useEffect(() => {
    // if (!t) {
      // setT(1);
      getServiceTypes(clinicaValue)
    // }
  }, [getServiceTypes])

  return <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
    <div className="flex justify-between mb-2">
      {auth?.user?.clinica?.mainclinica && auth?.user?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
        <Select
          value={clinicaDataSelect}
          onChange={(e) => {
            setClinicaDataSelect(e)
            setClinicaValue(e.value);
            getServiceTypes(e.value);
            setServiceClietns([]);
            setServiceType(null)
          }}
          components={animatedComponents}
          options={[
            {
              value: auth?.user?.clinica?._id,
              label: auth?.user?.clinica?.name,
              ...auth.user.clinica
            },
            ...[...auth?.user?.clinica?.filials].map(el => ({
              value: el._id,
              label: el.name,
              ...el
            }))]}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            padding: 0,
            height: 0,
          })}
        />
      </div>}
      <div className="w-[300px]">
        <Select
          value={serviceType}
          options={serviceTypes}
          onChange={e => handleChangeServiceType(e)}
          placeholder={t("Tanlang...")}
        />
      </div>
      <div className="flex items-center gap-2">
        <DatePickers changeDate={changeStart} />
        <DatePickers changeDate={changeEnd} />
      </div>
    </div>
    <div className="row gutters">
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="shadow-lg border-alotrade table-container">
          <div className="table-responsive">
            <table className="w-full block overflow-scroll table m-0" style={{display: "block", maxHeight: "400px"}}>
              <thead className="" style={{position: "sticky", top: "0"}}>
                <tr>
                  <th className="border bg-alotrade py-1 text-[14px]">№</th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    {t("Probirka")}
                  </th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    {t("F.I.O")}
                  </th>
                  <th className="border bg-alotrade py-1 text-[14px]">
                    {t("Tug'ilgan yili")}
                  </th>
                  {servicesColumn.length > 0 && servicesColumn.map((col, ind) =>
                    <th className="border bg-alotrade py-1 text-[14px]" key={ind}>
                      {col.shortname}
                    </th>)}
                </tr>
              </thead>
              <tbody>
                {serviceClients.map((service, ind) => (
                  <tr key={ind}>
                    <td
                      className={`${isDone(service.services)} border py-1 font-weight-bold text-right text-[16px]`}
                      style={{ maxWidth: "30px !important" }}
                    >
                      {ind + 1}
                    </td>
                    <td
                      className="border py-1 font-weight-bold text-right text-[18px]"
                    >
                      {service.connector.probirka}
                    </td>
                    <td className="border py-1 font-weight-bold text-[16px]">
                      {service.client.firstname} {service.client.lastname}
                    </td>
                    <td className="border py-1 text-right text-[16px]">
                      {new Date(service.client.born).toLocaleDateString()}
                    </td>
                    {service.services.map((s, index) => <td key={index} className="border py-1 font-weight-bold text-[16px]">
                      {isExistColumn(s.service._id) ? s.tables && s.tables.length > 0 && <div>
                        <input className="max-w-[80px] outline-none border-[1px] border-black px-2 " value={s?.tables[0]?.col2} onChange={e => handleChangeServiceClient(e, ind, s._id)} />
                      </div> : <td></td>}
                    </td>
                    )}
                    {addTrow(service.services.length)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div className="flex justify-center">
      <button className="rounded-lg font-semibold text-white px-4 py-2 bg-alotrade" onClick={() => handleConclusion()}>
        Saqlash
      </button>
    </div>
  </div>
};
