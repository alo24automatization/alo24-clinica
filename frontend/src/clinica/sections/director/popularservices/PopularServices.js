import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers';
import { Sort } from '../../reseption/offlineclients/clientComponents/Sort';
import { Pagination } from '../components/Pagination';

const PopularServices = () => {

    const [beginDay, setBeginDay] = useState(
        new Date(
            new Date().setHours(0, 0, 0, 0)
        )
    );
    const [endDay, setEndDay] = useState(
        new Date()
    );

    const {t} = useTranslation()
    //======================================================
    //======================================================

    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;

    //======================================================
    //======================================================

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

    //======================================================
    //======================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //======================================================
    //======================================================

    //======================================================
    //======================================================

    const [services, setServices] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getServices = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/services/service/popular/get`,
                    "POST",
                    {
                        clinica: auth && auth.clinica._id,
                        beginDay,
                        endDay,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setSearchStrorage(data);
                setServices(
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
        [request, auth, notify]
    );


    //=====================================================
    //=====================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getServices(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(
            new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
                0,
                0,
                0,
                0
            )
        );

        setEndDay(date);
        getServices(beginDay, date);
    }

    //=====================================================
    //=====================================================

    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setServices(searchStorage.slice(0, countPage))
        },
        [countPage, services],
    )

    //=====================================================
    //=====================================================

    const [s, setS] = useState(0);
    useEffect(() => {
        if (!s) {
            setS(1)
            getServices(beginDay, endDay)
        }
    }, [s, getServices])

    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <div className="bg-white flex items-center justify-between py-2 px-2">
                                        <div>
                                            <select
                                                className="form-control form-control-sm selectpicker"
                                                placeholder={t("Bo'limni tanlang")}
                                                onChange={setPageSize}
                                                style={{ minWidth: "50px" }}
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </select>
                                        </div>
                                        <div className="text-center">
                                            <Pagination
                                                setCurrentDatas={setServices}
                                                datas={searchStorage}
                                                setCurrentPage={setCurrentPage}
                                                countPage={countPage}
                                                totalDatas={searchStorage.length}
                                            />
                                        </div>
                                        <div
                                            className="text-center flex gap-2"
                                            style={{ maxWidth: "200px", overflow: "hidden" }}
                                        >
                                            <DatePickers changeDate={changeStart} />
                                            <DatePickers changeDate={changeEnd} />
                                        </div>
                                    </div>
                                    <table className="table m-0 table-sm">
                                        <thead>
                                            <tr>
                                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Bo'lim")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Xizmat")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Soni")}
                                                    <Sort
                                                        data={services}
                                                        setData={setServices}
                                                        property={"total"}
                                                    />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {services.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                            style={{ maxWidth: "30px !important" }}
                                                        >
                                                            {currentPage * countPage + key + 1}
                                                        </td>
                                                        <td className="border py-1 text-[20px] font-weight-bold">
                                                            {connector?.department?.name}
                                                        </td>
                                                        <td className="border py-1 text-[20px] text-left">
                                                            {connector?.name}
                                                        </td>
                                                        <td className="border py-1 text-[20px] font-bold text-center">
                                                            {connector?.total}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopularServices