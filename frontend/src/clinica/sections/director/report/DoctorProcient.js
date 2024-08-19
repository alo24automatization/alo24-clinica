import { useToast } from '@chakra-ui/react';
import { faAngleDown, faAngleUp, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers';
import { Pagination } from '../components/Pagination';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useTranslation } from 'react-i18next';

const animatedComponents = makeAnimated()

const DoctorProcient = () => {

    const { t } = useTranslation()

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );


    //======================================================
    //======================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);

    const history = useHistory()

    //======================================================
    //======================================================

    const [clinicaDataSelect, setClinicaDataSelect] = useState({
        value: auth?.clinica?._id,
        label: auth?.clinica?.name,
    });
    const [clinicaValue, setClinicaValue] = useState(auth?.clinica?._id)

    //======================================================
    //======================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage

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

    const [doctors, setDoctors] = useState([])
    const [currentDoctors, setCurrentDoctors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getDoctorCleitns = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/doctor_procient/doctor/get`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setDoctors(data)
                setSearchStrorage(data)
                setCurrentDoctors(
                    data.slice(indexFirstConnector, indexLastConnector),
                )
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


    const [statsionarDoctors, setStatsionarDoctors] = useState([])

    const getStatsionar = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/doctor_procient/statsionar/get`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setStatsionarDoctors(data);
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

    //=======================================================
    //=======================================================



    //=======================================================
    //=======================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDoctorCleitns(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue);
        getStatsionar(beginDay, endDay, clinicaValue)
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getDoctorCleitns(beginDay, date, clinicaValue);
        getStatsionar(beginDay, date, clinicaValue)
    }

    //=======================================================
    //=======================================================

    const [type, setType] = useState('offline')

    const changeType = (e) => {
        if (e.target.value === 'offline') {
            setSearchStrorage(doctors);
            setType('offline')
            setCurrentDoctors([...doctors].slice(indexFirstConnector, indexLastConnector));
        } else {
            setType('statsionar')
            setSearchStrorage(statsionarDoctors);
            setCurrentDoctors([...statsionarDoctors].slice(indexFirstConnector, indexLastConnector));
        }
    }

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentDoctors(doctors.slice(0, e.target.value))
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.firstname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                item.lastname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
            setDoctors(searching)
            setCurrentDoctors(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    const [s, setS] = useState(0);

    useEffect(() => {
        if (!s) {
            setS(1)
            getDoctorCleitns(beginDay, endDay, clinicaValue)
            getStatsionar(beginDay, endDay, clinicaValue)
        }
    }, [getDoctorCleitns, s, beginDay, endDay, clinicaValue])

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className='flex justify-between items-center mb-4'>
                <Link to='/alo24/doctor_procient' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Kunduzgi shifokor ulushi")}
                </Link>
                <Link to='/alo24/statsionardoctors' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Statsionar ulushi")}
                </Link>
                <Link to='/alo24/directdoctors' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Yullanmadan ulushi")}
                </Link>
            </div>
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    {auth?.clinica?.mainclinica && auth?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
                        <Select
                            value={clinicaDataSelect}
                            onChange={(e) => {
                                setClinicaDataSelect(e)
                                setClinicaValue(e.value);
                                getDoctorCleitns(beginDay, endDay, e.value);
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
                    <div className="border-0 table-container">
                        <div className="border-0 table-container">
                            <div className="table-responsive">
                                <div className="bg-white flex gap-4 items-center p-2">
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
                                    <div>
                                        <input
                                            onChange={searchFullname}
                                            style={{ minWidth: "100px" }}
                                            type="search"
                                            className="w-100 form-control form-control-sm selectpicker"
                                            placeholder={t("F.I.O")}
                                        />
                                    </div>
                                    <div>
                                        <select
                                            className="form-control form-control-sm selectpicker"
                                            placeholder={t("Turini tanlang")}
                                            onChange={changeType}
                                            style={{ minWidth: "50px" }}
                                        >
                                            <option value='offline'>{t("Kunduzgi")}</option>
                                            <option value='statsionar'>{t("Statsionar")}</option>
                                        </select>
                                    </div>
                                    <div
                                        className="text-center ml-auto flex gap-2"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <DatePickers changeDate={changeStart} />
                                        <DatePickers changeDate={changeEnd} />
                                    </div>
                                    <div className="text-center ml-auto mr-4">
                                        <Pagination
                                            setCurrentDatas={setCurrentDoctors}
                                            datas={doctors}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={doctors.length}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <div className="btn btn-primary">
                                            <ReactHtmlTableToExcel
                                                id="reacthtmltoexcel"
                                                table="doctor_procient-table"
                                                sheet="Sheet"
                                                buttonText="Excel"
                                                filename={t("Shifokor ulushi")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="table m-0 table-sm">
                                    <thead>
                                        <tr>
                                            <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("F.I.O")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Bo'lim")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Umumiy narxi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Kounteragent ulushi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Kounterdoktor ulushi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Shifokor ulushi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDoctors.map((doctor, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td
                                                        className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                        style={{ maxWidth: "30px !important" }}
                                                    >
                                                        {currentPage * countPage + key + 1}
                                                    </td>
                                                    <td className="border py-1 text-[16px] font-weight-bold">
                                                        {doctor.lastname +
                                                            " " +
                                                            doctor.firstname}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {doctor?.specialty?.name}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.total}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor?.agent_profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor?.counterdoctor_profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.doctor_profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {loading ? (
                                                            <button className="btn btn-success" disabled>
                                                                <span class="spinner-border spinner-border-sm"></span>
                                                                Loading...
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    if (type === 'offline') {
                                                                        history.push('/alo24/doctor_procient_services', {
                                                                            doctor,
                                                                            startDate: beginDay,
                                                                            endDate: endDay
                                                                        })
                                                                    } else {
                                                                        history.push('/alo24/doctor_procient_statsionar', {
                                                                            doctor,
                                                                            startDate: beginDay,
                                                                            endDate: endDay
                                                                        })
                                                                    }
                                                                }}
                                                                type="button"
                                                                className="bg-alotrade rounded text-white font-semibold py-1 px-2"
                                                                style={{ fontSize: '75%' }}
                                                            >
                                                                {t("Batafsil")}
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td
                                                className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                style={{ maxWidth: "30px !important" }}
                                            >

                                            </td>
                                            <td className="border py-1 text-[16px] font-weight-bold">

                                            </td>
                                            <td className="border py-1 text-[16px] text-center">

                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {searchStorage.reduce((prev, el) => prev + el?.total, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {searchStorage.reduce((prev, el) => prev + el?.agent_profit, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {searchStorage.reduce((prev, el) => prev + el?.counterdoctor_profit, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {searchStorage.reduce((prev, el) => prev + el.doctor_profit, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-center">

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table m-0 table-sm d-none" id="doctor_procient-table">
                                    <thead>
                                        <tr>
                                            <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                F.I.O
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    a.client.fullname > b.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                        icon={faAngleUp}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faAngleDown}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Bo'lim
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    a.client.fullname > b.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                        icon={faAngleUp}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faAngleDown}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Umumiy narxi
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    a.client.fullname > b.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                        icon={faAngleUp}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faAngleDown}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                Shifokor ulushi
                                                <div className="btn-group-vertical ml-2">
                                                    <FontAwesomeIcon
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    a.client.fullname > b.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                        icon={faAngleUp}
                                                        style={{ cursor: "pointer" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faAngleDown}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() =>
                                                            setCurrentDoctors(
                                                                [...currentDoctors].sort((a, b) =>
                                                                    b.client.fullname > a.client.fullname ? 1 : -1
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchStorage.map((doctor, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td
                                                        className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                        style={{ maxWidth: "30px !important" }}
                                                    >
                                                        {currentPage * countPage + key + 1}
                                                    </td>
                                                    <td className="border py-1 text-[16px] font-weight-bold">
                                                        {doctor.lastname +
                                                            " " +
                                                            doctor.firstname}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {doctor?.specialty?.name}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.total}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {doctor.profit}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td
                                                className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                style={{ maxWidth: "30px !important" }}
                                            >

                                            </td>
                                            <td className="border py-1 text-[16px] font-weight-bold">

                                            </td>
                                            <td className="border py-1 text-[16px] text-center">

                                            </td>
                                            <td className="border py-1 text-[16px] text-right">

                                            </td>
                                            <td className="border py-1 text-[16px] text-right">

                                            </td>
                                            <td className="border py-1 text-[16px] text-center">
                                                {searchStorage.reduce((prev, el) => prev + el.profit, 0)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProcient