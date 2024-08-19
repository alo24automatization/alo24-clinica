import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import ClientCard from "./components/ClientCard";
import ConclusionPage from "./components/ConclusionPage";
import ConclusionsTemp from "./components/ConclusionsTemp";
import DoctorResult from "./components/DoctorResult";


const Conclusion = () => {

    const {t} = useTranslation()

    const { connector } = useLocation().state

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
        []
    );

    //====================================================================
    //====================================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================================
    //====================================================================

    const [type, setType] = useState('')

    //====================================================================
    //====================================================================

    const [baseUrl, setBaseUrl] = useState()

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request('/api/baseurl', 'GET', null)
      setBaseUrl(data.baseUrl)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [request, notify])

    //====================================================================
    //====================================================================

    const [connectorInfo, setConnectorInfo] = useState()

    const getConnectorInfo = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/doctor/conclusion/client_info/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        connector: connector._id,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setConnectorInfo(data);
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

    useEffect(() => {
        getConnectorInfo()
    }, [getConnectorInfo])

    useEffect(() => {
        getBaseUrl()
    }, [getBaseUrl])


    // const saveClientCard = () => {
    //     const 
    // }

    //====================================================================
    //====================================================================

    return <div className="container p-4 bg-white">
        <div className="flex justify-between items-center">
            <button onClick={() => setType('clientcard')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">{t("BEMOR KARTASI")}</button>
            <button onClick={() => setType('doctorresult')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">{t("SHIFOKOR KURIGI")}</button>
            <button onClick={() => setType('conclusion_temp')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">{t("SHABLONLAR")}</button>
            {/* <button className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">Xarorat</button> */}
            <button onClick={() => setType('conclusion_page')} className="w-[200px] h-[100px] flex items-center justify-center bg-alotrade rounded-lg text-white text-[16px] font-medium text-uppercase">{t("XULOSA")}</button>
        </div>
        {type === 'clientcard' && <ClientCard  connector={connectorInfo} setConnector={setConnectorInfo}  />}
        {type === 'doctorresult' && <DoctorResult baseUrl={baseUrl} clinica={auth?.clinica} connector={connectorInfo} />}
        {type === 'conclusion_temp' && <ConclusionsTemp />}
        {type === 'conclusion_page' && <ConclusionPage baseUrl={baseUrl} clinica={auth?.clinica} connector={connectorInfo} setConnector={setConnectorInfo} />}
    </div>
}

export default Conclusion