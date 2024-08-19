import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { TableClients } from "../../cashier/debtclients/clientComponents/TableClients";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useTranslation } from "react-i18next";

const animatedComponents = makeAnimated()

export const DebtReport = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(
            new Date().setMonth(new Date().getMonth() - 3)
        )
    );
    const [endDay, setEndDay] = useState(
        new Date()
    );
    //====================================================================
    //====================================================================
    // MODAL
    const [modal, setModal] = useState(false);

    //====================================================================
    //====================================================================
    const {t} = useTranslation()
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
    const [currentConnectors, setCurrentConnectors] = useState([]);

    //====================================================================
    //====================================================================

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
        []
    );
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
    const [clinicaValue, setClinicaValue] = useState(auth?.clinica?._id)

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);
    const [offlineDebts, setOfflineDebts] = useState([]);
    const [statsionarDebts, setStatsionarDebts] = useState([]);
    const [debts, setDebts] = useState([]);

    const getOfflineDebts = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/cashier/offline/debts`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setOfflineDebts(data);
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    const getStatsionarDebts = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/cashier/statsionar/debts`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setStatsionarDebts(data);
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    useEffect(() => {
        let debts;
        if (offlineDebts.length > 0 || statsionarDebts.length > 0) {
            debts = [...offlineDebts, ...statsionarDebts];
        } else {
            debts = [];
        }
        setDebts(debts);
        setCurrentConnectors(debts.slice(indexFirstConnector, indexLastConnector));
        setConnectors(debts);
        setSearchStrorage(debts);
    }, [offlineDebts, statsionarDebts, indexFirstConnector, indexLastConnector]);

    //====================================================================
    //====================================================================

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

    const sortDebts = (e) => {
        let sortEl = [];
        if (e.target.value === "none") {
            sortEl = [...debts];
        } else if (e.target.value === "statsionar") {
            sortEl = [...statsionarDebts];
        } else {
            sortEl = [...offlineDebts];
        }
        setSearchStrorage(sortEl);
        setCurrentConnectors(sortEl.slice(0, countPage));
    };

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCurrentConnectors(connectors.slice(0, countPage));
        },
        [countPage, connectors]
    );


    //====================================================================
    //====================================================================
    // PRODUCTS
    // const [products, setProducts] = useState([]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLIENT

    const [client, setClient] = useState({
        clinica: auth.clinica && auth.clinica._id,
        reseption: auth.user && auth.user._id,
    });

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getOfflineDebts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue);
        getStatsionarDebts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getOfflineDebts(beginDay, date, clinicaValue);
        getStatsionarDebts(beginDay, date, clinicaValue);
    };

    //===================================================================
    //===================================================================

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);

    useEffect(() => {
        if (!s) {
            setS(1);
            getOfflineDebts(beginDay, endDay, clinicaValue);
            getStatsionarDebts(beginDay, endDay, clinicaValue);
        }
    }, [getOfflineDebts, getStatsionarDebts, s, beginDay, endDay, clinicaValue]);

    //====================================================================
    //====================================================================
    return (
        <div>
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        {auth?.clinica?.mainclinica && auth?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
                            <Select
                                value={clinicaDataSelect}
                                onChange={(e) => {
                                    setClinicaDataSelect(e)
                                    setClinicaValue(e.value);
                                    getOfflineDebts(beginDay, endDay, e.value);
                                    getStatsionarDebts(beginDay, endDay, e.value);
                                }}
                                components={animatedComponents}
                                options={[
                                    {
                                        value: auth?.clinica?._id,
                                        label: auth?.clinica?.name,
                                    },
                                    ...[...auth?.clinica?.filials].map(el => ({
                                        value: el._id,
                                        label: el.name
                                    }))]}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 0,
                                    padding: 0,
                                    height: 0,
                                })}
                            />
                        </div>}
                        <TableClients
                            setVisible={setVisible}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            client={client}
                            setClient={setClient}
                            searchFullname={searchFullname}
                            searchId={searchId}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            loading={loading}
                            connectors={connectors}
                            //   payment={payment}
                            //   setPayment={setPayment}
                            sortDebts={sortDebts}
                        //   getPayment={getPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// 913385289
