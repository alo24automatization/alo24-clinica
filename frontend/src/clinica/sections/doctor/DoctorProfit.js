import { useToast } from '@chakra-ui/react';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';
import { DatePickers } from '../reseption/offlineclients/clientComponents/DatePickers';
import { Pagination } from './components/Pagination';

const DoctorProfit = () => {
    //======================================================
    //======================================================

    const { t } = useTranslation()

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);


    const [beginDay, setBeginDay] = useState(new Date(new Date().setUTCHours(0, 0, 0, 0)));
    const [endDay, setEndDay] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));


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

    const [services, setServices] = useState([])
    const [currentServices, setCurrentServices] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])
    const [searchedServices, setSearchedServices] = useState([])

    const getDoctorServices = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/doctor_procient/get`,
                    "POST",
                    { department: auth?.user?.specialty._id, beginDay: beginDay, endDay: endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setServices(data)
                setSearchStrorage(data)
                setCurrentServices(
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

    //=======================================================
    //=======================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDoctorServices(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getDoctorServices(beginDay, date);
    }

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentServices(services.slice(0, e.target.value))
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.firstname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                item.client.lastname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
            setServices(searching)
            setSearchedServices(searching)
            setCurrentServices(searching.slice(0, countPage))
        }

    const searchService =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.service.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
            setServices(searching)
            setSearchedServices(searching)
            setCurrentServices(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    useEffect(() => {
        getDoctorServices(beginDay, endDay)
    }, [getDoctorServices])

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className='flex justify-between items-center mb-4'>
                <Link to='/alo24/doctor_profit' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Kunduzgi shifokor ulushi")}
                </Link>
                <Link to='/alo24/doctor_statsionar_profit' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Statsionar ulushi")}
                </Link>
                <Link to='/alo24/direct_profit' className="block px-4 py-2 rounded-xl text-[#fff] text-[21px] hover:text-[#fff] font-bold bg-alotrade">
                    {t("Yullanmadan ulushi")}
                </Link>
            </div>
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
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
                                        <input
                                            onChange={searchService}
                                            style={{ minWidth: "100px" }}
                                            type="search"
                                            className="w-100 form-control form-control-sm selectpicker"
                                            placeholder={t("Xizmatlar")}
                                        />
                                    </div>
                                    <div
                                        className="text-center ml-auto flex gap-2"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <DatePickers value={new Date(beginDay).toISOString().slice(0, 10)} changeDate={changeStart} />
                                        <DatePickers value={new Date(endDay).toISOString().slice(0, 10)} changeDate={changeEnd} />
                                    </div>
                                    <div className="text-center ml-auto mr-4">
                                        <Pagination
                                            setCurrentDatas={setCurrentServices}
                                            datas={services}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={services.length}
                                        />
                                    </div>
                                    <div className="texte-center">
                                        <div className="btn btn-primary">
                                            <ReactHtmlTableToExcel
                                                id="reacthtmltoexcel"
                                                table="doctor_service-table"
                                                sheet="Sheet"
                                                buttonText="Excel"
                                                filename={t("Shifokor ulushi")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="table m-0 table-sm" id='doctor_service-table'>
                                    <thead>
                                        <tr>
                                            <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Mijoz")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Xizmat nomi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Soni")}
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentServices.map((service, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td
                                                        className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                        style={{ maxWidth: "30px !important" }}
                                                    >
                                                        {currentPage * countPage + key + 1}
                                                    </td>
                                                    <td className="border py-1 text-[16px] font-weight-bold">
                                                        {service.client.lastname +
                                                            " " +
                                                            service.client.firstname}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-center">
                                                        {service?.service?.name}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.pieces}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.totalprice}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.agent_profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.counterdoctor_profit}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.doctor_profit}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <td
                                                className={`border py-1 font-weight-bold text-right text-[16px]`}
                                                style={{ maxWidth: "30px !important" }}
                                            ></td>
                                            <td className="border py-1 text-[16px] font-weight-bold"></td>
                                            <td className="border py-1 text-[16px] text-center"></td>
                                            <td className="border py-1 text-[16px] text-center"></td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {(searchedServices.length !== 0 ? searchedServices : searchStorage).reduce((prev, el) => prev + el?.totalprice, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {(searchedServices.length !== 0 ? searchedServices : searchStorage).reduce((prev, el) => prev + el?.agent_profit, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {(searchedServices.length !== 0 ? searchedServices : searchStorage).reduce((prev, el) => prev + el?.counterdoctor_profit, 0)}
                                            </td>
                                            <td className="border py-1 text-[16px] text-right font-bold">
                                                {(searchedServices.length !== 0 ? searchedServices : searchStorage).reduce((prev, el) => prev + el?.doctor_profit, 0)}
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

export default DoctorProfit