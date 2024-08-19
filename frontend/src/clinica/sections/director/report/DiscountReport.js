import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import { TableClients } from "../../cashier/discountclients/clientComponents/TableClients";
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useTranslation } from "react-i18next";

const animatedComponents = makeAnimated()


export const DiscountReport = () => {
    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );
    //====================================================================
    //====================================================================
    // MODAL
    // const [modal, setModal] = useState(false);

    //====================================================================
    //====================================================================
        const {t} = useTranslation()
    //====================================================================
    //====================================================================
    // RegisterPage
    // const [visible, setVisible] = useState(false);

    // const changeVisible = () => setVisible(!visible);

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
    const { request } = useHttp();
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
    // getConnectors
    const [connectors, setConnectors] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);
    const [offlineDiscounts, setOfflineDiscounts] = useState([]);
    const [statsionarDiscounts, setStatsionarDiscounts] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [selectedCommentsDiscounts, setSelectedCommentsDiscounts] = useState(
        []
    );

    const [commentSelect, setCommentSelect] = useState([]);

    // const getDiscounts = () => {
    //   let discounts = [];
    //   if (offlineDiscounts.length > 0 || statsionarDiscounts.length > 0) {
    //     discounts = offlineDiscounts.concat(statsionarDiscounts);
    //   } else {
    //     discounts = [];
    //   }
    //   setCurrentConnectors(discounts);
    //   setConnectors(discounts);
    //   setSearchStrorage(discounts.slice(indexFirstConnector, indexLastConnector));
    // };

    const getComments = (data) => {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            if (!arr.includes(el.comment)) {
                arr.push(el.comment);
            }
        }
        setCommentSelect(arr);
    };

    const getOfflineDiscounts = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    ` /api/cashier/offline/discounts`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setOfflineDiscounts(data);
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

    const getStatsionarDiscounts = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    ` /api/cashier/statsionar/discounts`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setStatsionarDiscounts(data);
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
        let discounts;
        if (offlineDiscounts.length > 0 || statsionarDiscounts.length > 0) {
            discounts = [...offlineDiscounts, ...statsionarDiscounts];
        } else {
            discounts = [];
        }
        setCurrentConnectors(
            discounts.slice(indexFirstConnector, indexLastConnector)
        );
        setConnectors(discounts);
        setSearchStrorage(discounts);
        setDiscounts(discounts);
        setSelectedCommentsDiscounts(discounts);
        getComments(discounts);
        return () => { };
    }, [
        offlineDiscounts,
        statsionarDiscounts,
        indexFirstConnector,
        indexLastConnector,
    ]);

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

    const sortComment = (e) => {
        let sortEl = [];
        if (e.target.value === "none") {
            sortEl = [...selectedCommentsDiscounts];
        } else {
            sortEl = [...selectedCommentsDiscounts].filter((item) => {
                return item.comment === e.target.value;
            });
        }
        setSearchStrorage(sortEl);
        setCurrentConnectors(sortEl.slice(0, countPage));
    };

    const sortDiscounts = (e) => {
        let sortEl = [];
        if (e.target.value === "none") {
            sortEl = [...discounts];
        } else if (e.target.value === "statsionar") {
            sortEl = [...statsionarDiscounts];
        } else {
            sortEl = [...offlineDiscounts];
        }
        setSelectedCommentsDiscounts(sortEl);
        setSearchStrorage(sortEl);
        setCurrentConnectors(sortEl.slice(0, countPage));
        getComments(sortEl);
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

    // const [connector, setConnector] = useState({
    //   clinica: auth.clinica && auth.clinica._id,
    //   probirka: 0,
    // });

    // const [services, setServices] = useState([]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // PRODUCTS
    // const [products, setProducts] = useState([]);

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // CLIENT

    // const [client, setClient] = useState({
    //   clinica: auth.clinica && auth.clinica._id,
    //   reseption: auth.user && auth.user._id,
    // });

    //====================================================================
    //====================================================================
    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getOfflineDiscounts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay,
            clinicaValue);
        getStatsionarDiscounts(
            new Date(new Date(e).setUTCHours(0, 0, 0, 0)),
            endDay,
            clinicaValue
        );
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getOfflineDiscounts(beginDay, date, clinicaValue);
        getStatsionarDiscounts(beginDay, date, clinicaValue);
    };

    //===================================================================
    //===================================================================
    //CreateHandler

    // const createHandler = useCallback(async () => {
    //   try {
    //     const data = await request(
    //       `/api/cashier/offline/payment`,
    //       "POST",
    //       {
    //         payment: { ...payment, payment: payCount },
    //       },
    //       {
    //         Authorization: `Bearer ${auth.token}`,
    //       }
    //     );
    //     localStorage.setItem("data", data);
    //     setModal(false);
    //     setVisible(false);
    //     setPayCount("");
    //     notify({
    //       title: "To'lov muvaffaqqiyatli amalga oshirildi.",
    //       description: "",
    //       status: "success",
    //     });
    //   } catch (error) {
    //     notify({
    //       title: error,
    //       description: "",
    //       status: "error",
    //     });
    //   }
    // }, [auth, payment, request, notify]);

    //===================================================================
    //===================================================================

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState(0);

    useEffect(() => {
        if (!s) {
            setS(1);
            getOfflineDiscounts(beginDay, endDay, clinicaValue);
            getStatsionarDiscounts(beginDay, endDay, clinicaValue);
        }
    }, [
        auth,
        getOfflineDiscounts,
        getStatsionarDiscounts,
        // getAdvers,
        s,
        // getProducts,
        // getCounterDoctors,
        // getDepartments,
        clinicaValue,
        beginDay,
        endDay,
    ]);

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
                                    getOfflineDiscounts(beginDay, endDay, e.value);
                                    getStatsionarDiscounts(beginDay, endDay, e.value);
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
                            currentConnectors={currentConnectors}
                            setCurrentConnectors={setCurrentConnectors}
                            searchFullname={searchFullname}
                            searchId={searchId}
                            setPageSize={setPageSize}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            currentPage={currentPage}
                            sortComment={sortComment}
                            commentSelect={commentSelect}
                            sortDiscounts={sortDiscounts}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};