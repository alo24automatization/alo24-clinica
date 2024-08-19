import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { Pagination } from '../components/Pagination'

const CounterDoctors = () => {

    //===================================================================
    //===================================================================
    const {t} = useTranslation()
    //===================================================================
    //===================================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0)),
    )
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1)),
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false)

    const changeVisible = () => setVisible(!visible)

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage

    //=====================================================================
    //=====================================================================

    const toast = useToast()

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: 'top-right',
            })
        },
        [],
    )

    //=====================================================================
    //=====================================================================

    //====================================================================
    //====================================================================

    const { request, loading } = useHttp()
    const auth = useContext(AuthContext)

    //====================================================================
    //====================================================================

    const [connectors, setConnectors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getDoctorsList = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctorall/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setSearchStrorage(data);
            setConnectors(
                data.slice(indexFirstConnector, indexLastConnector)
            );
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify])

    //====================================================================
    //====================================================================

    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setConnectors(searchStorage.slice(0, countPage))
        },
        [countPage, connectors],
    )

    //====================================================================
    //====================================================================

    const [s, setS] = useState(0)
    useEffect(() => {
        if (!s) {
            setS(1);
            getDoctorsList();
        }
    }, [s, getDoctorsList]);

    //====================================================================
    //====================================================================

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
                                                setCurrentDatas={setConnectors}
                                                datas={searchStorage}
                                                setCurrentPage={setCurrentPage}
                                                countPage={countPage}
                                                totalDatas={searchStorage.length}
                                            />
                                        </div>
                                    </div>
                                    <table className="table m-0 table-sm">
                                        <thead>
                                            <tr>
                                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Agent")}</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Shifokor")}</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Shifoxona")}</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>{t("Telefon raqami")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {connectors.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className="border py-1 font-weight-bold text-right"
                                                            style={{ maxWidth: '30px !important' }}
                                                        >
                                                            {currentPage * countPage + key + 1}
                                                        </td>
                                                        <td className="border py-1 text-left font-weight-bold text-[16px]">
                                                            {connector?.counter_agent?.lastname +
                                                                ' ' +
                                                                connector?.counter_agent?.firstname}
                                                        </td>
                                                        <td className="border py-1 text-left font-weight-bold text-[16px]">
                                                            {connector?.lastname +
                                                                ' ' +
                                                                connector?.firstname}
                                                        </td>
                                                        <td className="border py-1 text-left font-weight-bold text-[16px]">
                                                            {connector?.clinica_name}
                                                        </td>
                                                        <td className="border py-1 text-right font-weight-bold text-[16px]">
                                                            {connector?.phone && "+998" + connector?.phone}
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

export default CounterDoctors