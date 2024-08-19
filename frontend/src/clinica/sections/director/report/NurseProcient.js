import { useToast } from '@chakra-ui/react';
import { faAngleDown, faAngleUp, faPrint } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers';
import { Pagination } from '../components/Pagination';
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { useTranslation } from 'react-i18next';

const animatedComponents = makeAnimated()

const NurseProcient = () => {

    const {t} = useTranslation()

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

    const [nurseProfit, setNurseProfit] = useState([])
    const [currentProfit, setCurrentProfit] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getNurseProfit = useCallback(
        async (beginDay, endDay, clinica) => {
            try {
                const data = await request(
                    `/api/statsionarclient/nurse_procient/get`,
                    "POST",
                    { clinica: clinica, beginDay, endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setNurseProfit(data)
                setSearchStrorage(data)
                setCurrentProfit(
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
        getNurseProfit(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getNurseProfit(beginDay, date, clinicaValue);
    }

    //=======================================================
    //=======================================================

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentProfit(nurseProfit.slice(0, e.target.value))
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
            setNurseProfit(searching)
            setCurrentProfit(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    const [s, setS] = useState(0);

    useEffect(() => {
        if (!s) {
            setS(1)
            getNurseProfit(beginDay, endDay, clinicaValue)
        }
    }, [getNurseProfit, s, beginDay, endDay, clinicaValue])

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    {auth?.clinica?.mainclinica && auth?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
                        <Select
                            value={clinicaDataSelect}
                            onChange={(e) => {
                                setClinicaDataSelect(e)
                                setClinicaValue(e.value);
                                getNurseProfit(beginDay, endDay, e.value);
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
                                    <div
                                        className="text-center ml-auto flex gap-2"
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <DatePickers changeDate={changeStart} />
                                        <DatePickers changeDate={changeEnd} />
                                    </div>
                                    <div className="text-center ml-auto mr-4">
                                        <Pagination
                                            setCurrentDatas={setCurrentProfit}
                                            datas={nurseProfit}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={nurseProfit.length}
                                        />
                                    </div>
                                    <div className="texte-center">
                                        <div className="btn btn-primary">
                                            <ReactHtmlTableToExcel
                                                id="reacthtmltoexcel"
                                                table="nurseprocient-table"
                                                sheet="Sheet"
                                                buttonText="Excel"
                                                filename={t("Xamshira ulushi")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <table className="table m-0 table-sm" id="nurseprocient-table">
                                    <thead>
                                        <tr>
                                            <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Mijoz")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Xona")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Kuni")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Umumiy narxi")}
                                            </th>
                                            <th className="border py-1 bg-alotrade text-[16px]">
                                                {t("Xamshira ulushi")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentProfit.map((service, key) => {
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
                                                        {service?.room?.room?.type} {service?.room?.room?.number}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.days}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.total}
                                                    </td>
                                                    <td className="border py-1 text-[16px] text-right">
                                                        {service?.profit}
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
                                            <td className="border py-1 text-[16px] text-right font-bold">
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

export default NurseProcient