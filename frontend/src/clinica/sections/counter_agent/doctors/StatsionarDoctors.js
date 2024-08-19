import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import Select from 'react-select'
import { Pagination } from '../../reseption/components/Pagination';
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers';

const StatsionarDoctors = () => {

    const { t } = useTranslation()

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;

    //====================================================
    //====================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    //====================================================
    //====================================================

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

    //====================================================
    //====================================================

    const [visible, setVisible] = useState(false);

    const changeVisible = () => setVisible(!visible);

    //====================================================
    //====================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    const [counterdoctor, setCounterdoctor] = useState('')

    //====================================================
    //====================================================

    //==============================================================
    //==============================================================

    const [counterdoctors, setCounterdoctors] = useState([]);
    const [searchStorage, setSearchStorage] = useState([]);

    const getCounterDoctorsService = useCallback(async (beginDay, endDay, counterdoctor) => {
        try {
            const data = await request(
                `/api/counter_agent/statsionar/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    counter_agent: auth.user._id,
                    counterdoctor,
                    beginDay,
                    endDay
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setSearchStorage(data);
            setCounterdoctors(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify, counterdoctor, beginDay, endDay, indexFirstConnector, indexLastConnector])

    //==============================================================
    //==============================================================

    const setPageSize = (e) => {
        if (e.target.value === 'all') {
            setCurrentPage(0);
            setCountPage(searchStorage.length);
            setCounterdoctors(searchStorage);
        } else {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCounterdoctors(searchStorage.slice(0, e.target.value));
        }
    }

    // ChangeDate

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getCounterDoctorsService(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, counterdoctor);
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
        getCounterDoctorsService(beginDay, date, counterdoctor);
    }

    //==============================================================
    //==============================================================

    const changeCounterDoctor = (e) => {
        if (e.value === 'none') {
            setCounterdoctor('')
            getCounterDoctorsService(beginDay, endDay, '')
        } else {
            setCounterdoctor(e.value)
            getCounterDoctorsService(beginDay, endDay, e.value)
        }
    }

    const searchClientName = (e) => {
        const searching = searchStorage.filter((item) =>
            (item.client.firstname + ' ' + item.client.firstname).toLowerCase().includes(e.target.value.toLowerCase())
        );
        setCounterdoctors(searching);
    }

    //==============================================================
    //==============================================================

    const [doctors, setDoctors] = useState([]);

    const getDoctorsList = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctorall/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    counter_agent: auth.user._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setDoctors(data)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify])

    useEffect(() => {
        getDoctorsList()
    }, [getDoctorsList])

    //==============================================================
    //==============================================================

    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getCounterDoctorsService(beginDay, endDay, counterdoctor);
        }
    }, [getCounterDoctorsService, auth, s]);

    //==============================================================
    //==============================================================

    const [selected, setSelected] = useState(null)


    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="border-0 table-container mt-6">
                            <div className="border-0 table-container">
                                <div className="bg-white flex gap-6 items-center py-2 px-2">
                                    <div>
                                        <select
                                            className="form-control form-control-sm selectpicker"
                                            placeholder="Bo'limni tanlang"
                                            onChange={setPageSize}
                                            style={{ minWidth: '50px' }}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={'all'}>{t("Barchasi")}</option>
                                        </select>
                                    </div>
                                    <div className='w-[300px]'>
                                        <Select
                                            value={selected}
                                            options={[
                                                {
                                                    label: t('Hammasi'),
                                                    value: "none"
                                                },
                                                ...[...doctors].map(item => ({
                                                    ...item,
                                                    value: item._id,
                                                    label: item.firstname + ' ' + item.lastname
                                                }))
                                            ]}
                                            onChange={(e) => {
                                                setSelected(e);
                                                changeCounterDoctor(e)
                                            }}
                                            placeholder={t("Tanlang...")}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            onChange={searchClientName}
                                            style={{ maxWidth: '200px', minWidth: '200px' }}
                                            type="search"
                                            className="w-100 form-control form-control-sm selectpicker"
                                            placeholder={t("Mijozning F.I.SH")}
                                        />
                                    </div>
                                    <div className="text-center ml-auto ">
                                        <Pagination
                                            setCurrentDatas={setCounterdoctors}
                                            datas={counterdoctors}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={searchStorage.length}
                                        />
                                    </div>
                                    <div
                                        className="text-center ml-auto flex gap-2"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <DatePickers changeDate={changeStart} />
                                        <DatePickers changeDate={changeEnd} />
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="table m-0">
                                        <thead>
                                            <tr>
                                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Mijoz")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Kelgan sa'nasi")}
                                                </th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Kuni")}</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Ulushi")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Yullanma")}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {counterdoctors.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className="border py-1 text-right"
                                                            style={{ maxWidth: '30px !important' }}
                                                        >
                                                            {currentPage * countPage + key + 1}
                                                        </td>
                                                        <td className="border py-1 text-[16px]">
                                                            {connector?.client?.lastname +
                                                                ' ' +
                                                                connector?.client?.firstname}
                                                        </td>
                                                        <td className="border py-1 text-[16px]">
                                                            {new Date(connector?.beginday).toLocaleDateString()}
                                                        </td>
                                                        <td className="border py-1 text-left text-[16px]">
                                                            {connector?.endday ?
                                                                Math.round((new Date(connector?.endday) - new Date(connector?.beginday)) / (60 * 60 * 24 * 1000)) :
                                                                Math.round((new Date() - new Date(connector?.beginday)) / (60 * 60 * 24 * 1000))
                                                            }
                                                        </td>
                                                        <td className="border py-1 text-left text-[16px]">
                                                            {connector?.counterdoctor?.statsionar_profit || 0}
                                                        </td>
                                                        <td className="border py-1 text-left text-[16px]">
                                                            {connector?.counterdoctor?.lastname +
                                                                ' ' +
                                                                connector?.counterdoctor?.firstname}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                            <tr>
                                                <td className="border py-1 font-weight-bold text-right">
                                                </td>
                                                <td className="border py-1 font-weight-bold text-[16px]"></td>
                                                <td className="border py-1 font-weight-bold text-[16px]"></td>
                                                <td className="border py-1 text-left text-[16px]"></td>
                                                <td className="border py-1 text-left text-[16px] font-bold">
                                                    {counterdoctors.reduce((prev, el) => prev + (el?.counterdoctor?.statsionar_profit || 0), 0)}
                                                </td>
                                                <td className="border py-1 text-left text-[16px]"></td>
                                            </tr>
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

export default StatsionarDoctors