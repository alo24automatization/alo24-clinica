import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHttp } from '../../hooks/http.hook';
import { AuthContext } from '../../context/AuthContext';
import Select from 'react-select'
import { Pagination } from '../reseption/components/Pagination';
import { DatePickers } from '../reseption/offlineclients/clientComponents/DatePickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenAlt } from '@fortawesome/free-solid-svg-icons';

const VisitPage = () => {
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;

    //====================================================
    //====================================================

    const { t } = useTranslation()

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

    const changeVisible = () => {
        setVisible(!visible)
        setSelected(null)
    }

    //==============================================================
    //==============================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCounterdoctors(searchStorage.slice(0, e.target.value));
        }

    //==============================================================
    //==============================================================

    const [visit, setVisit] = useState({
        clinica: auth?.clinica?._id,
        counter_agent: auth?.user?._id,
        counter_doctor: '',
        comment: ""
    })

    const createVisit = async () => {
        try {
            const data = await request(
                `/api/counter_agent/visit/create`,
                "POST",
                { ...visit },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: `${t("Tashrif etildi!")}`,
                description: "",
                status: "success",
            });
            setVisit({
                clinica: auth?.clinica?._id,
                counter_agent: auth?.user?._id,
                counter_doctor: '',
                comment: ""
            })
            setSelected(null)
            getVisits(beginDay, endDay, counterDoctor)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const editVisit = async () => {
        try {
            const data = await request(
                `/api/counter_agent/visit/edit`,
                "POST",
                { ...visit },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            notify({
                title: `${t("Tashrif etildi!")}`,
                description: "",
                status: "success",
            });
            setVisit({
                clinica: auth?.clinica?._id,
                counter_agent: auth?.user?._id,
                counter_doctor: '',
                comment: ""
            })
            setSelected(null)
            getVisits(beginDay, endDay, counterDoctor)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    const checkVisitData = () => {
        if (!visit.counter_doctor || visit.counter_doctor === 'none') {
            return notify({
                title: t("Shifokorni nomi tanlang!"),
                description: "",
                status: "warning"
            })
        }
        // if (!visit.comment) {
        //     return notify({
        //         title: t("Izoh kiriting!"),
        //         description: "",
        //         status: "warning"
        //     })
        // }
        if (visit._id) {
            editVisit()
        } else {
            createVisit()
        }
    }

    //==============================================================
    //==============================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
    );
    const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
    );

    const [counterDoctor, setCounterDoctor] = useState('')


    const [currentDatas, setCurrentDatas] = useState([])
    const [searchStorage, setSearchStorage] = useState([]);

    const getVisits = useCallback(async (beginDay, endDay, counterdoctor) => {
        try {
            const data = await request(
                `/api/counter_agent/visit/get`,
                "POST",
                {
                    clinica: auth && auth.clinica._id,
                    counter_agent: auth.user._id,
                    counter_doctor: counterdoctor,
                    beginDay,
                    endDay
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setSearchStorage(data);
            setCurrentDatas(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify])

    const [n, setN] = useState(0);

    useEffect(() => {
        if (auth.clinica && !n) {
            setN(1);
            getVisits(beginDay, endDay, counterDoctor);
        }
    }, [getVisits, auth, n]);

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getVisits(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, counterDoctor)
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
        getVisits(beginDay, date, counterDoctor)
    }

    const changeCounterDoctor = (e) => {
        setCounterDoctor(e)
        getVisits(beginDay, endDay, e)
    }

    //==============================================================
    //==============================================================

    const [counterdoctors, setCounterdoctors] = useState([]);

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
            setCounterdoctors(
                data
            );
        } catch (error) {
            notify({
                title: t(error),
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify])


    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
            getDoctorsList()
        }
    }, [getDoctorsList, auth, s]);

    //==============================================================
    //==============================================================

    const [selected, setSelected] = useState(null)

    //==============================================================
    //==============================================================


    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-12 text-end">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    {t("Registratsiya")}
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            <div className="w-full flex flex-col items-center bg-white p-2">
                                <div className="card md:w-[50%]">
                                    <div className="card-header">
                                        <div className="card-title">{t("Yunaltiruvchi shifokor ma'lumotlari")}</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row gutters">
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="fullName">{t("Yunaltiruvchi shifokor")}</label>
                                                    <Select
                                                        value={selected}
                                                        options={[
                                                            {
                                                                label: t('Hammasi'),
                                                                value: "none"
                                                            },
                                                            ...[...counterdoctors].map(item => ({
                                                                ...item,
                                                                value: item._id,
                                                                label: item.firstname + ' ' + item.lastname
                                                            }))
                                                        ]}
                                                        onChange={(e) => {
                                                            setSelected(e)
                                                            setVisit({ ...visit, counter_doctor: e.value })
                                                        }}
                                                        placeholder={t("Tanlang...")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail">{t("Izoh")}</label>
                                                    <input
                                                        value={visit?.comment}
                                                        onChange={(e) => setVisit({ ...visit, comment: e.target.value })}
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        id="comment"
                                                        name="comment"
                                                        placeholder={t("Izoh")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-[50%] bg-white">
                                    <div className="text-right">
                                        {loading ? (
                                            <button className="bg-alotrade rounded text-white py-2 px-3" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button onClick={checkVisitData} className="bg-alotrade rounded text-white py-2 px-3">
                                                {t("Saqlash")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-0 table-container mt-6">
                            <div className="border-0 table-container">
                                <div className="bg-white flex gap-6 flex-wrap md:flex-nowrap items-center py-2 px-2">
                                    {/* <div>
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
                                    </div> */}
                                    <div className='w-[300px]'>
                                        <Select
                                            options={[
                                                {
                                                    label: t('Hammasi'),
                                                    value: ""
                                                },
                                                ...[...counterdoctors].map(item => ({
                                                    ...item,
                                                    value: item._id,
                                                    label: item.firstname + ' ' + item.lastname
                                                }))
                                            ]}
                                            onChange={(e) => {
                                                changeCounterDoctor(e.value)
                                            }}
                                            placeholder={t("Tanlang...")}
                                        />
                                    </div>
                                    {/* <div className="text-center ml-auto ">
                                        <Pagination
                                            setCurrentDatas={setCurrentDatas}
                                            datas={currentDatas}
                                            setCurrentPage={setCurrentPage}
                                            countPage={countPage}
                                            totalDatas={searchStorage.length}
                                        />
                                    </div> */}
                                    <div
                                        className="flex gap-2 w-[300px]"
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
                                                    {t("Yunaltiruvchi shifokor")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Sa'na")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Vaqti")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    {t("Izoh")}
                                                </th>
                                                <th className="border py-1 bg-alotrade text-[16px]">

                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDatas.map((connector, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className="border py-1 font-weight-bold text-right"
                                                            style={{ maxWidth: '30px !important' }}
                                                        >
                                                            {currentPage * countPage + key + 1}
                                                        </td>
                                                        <td className="border py-1 font-weight-bold text-[16px]">
                                                            {connector?.counter_doctor?.lastname +
                                                                ' ' +
                                                                connector?.counter_doctor?.firstname}
                                                        </td>
                                                        <td className="border py-1 font-weight-bold text-[16px]">
                                                            {new Date(connector?.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="border py-1 font-weight-bold text-[16px]">
                                                            {new Date(connector?.createdAt).toLocaleTimeString()}
                                                        </td>
                                                        <td className="border py-1 text-left text-[16px]">
                                                            {connector?.comment}
                                                        </td>
                                                        <td className="border py-1 text-center text-[16px]">
                                                            <button
                                                                className="btn btn-success py-0"
                                                                onClick={() => {
                                                                    setVisit({
                                                                        ...visit,
                                                                        counter_doctor: connector.counter_doctor._id,
                                                                        comment: connector.comment,
                                                                        _id: connector._id
                                                                    })
                                                                    setSelected({
                                                                        value: connector.counter_doctor._id,
                                                                        label: connector.counter_doctor.firstname + ' ' + connector.counter_doctor.lastname
                                                                    })
                                                                    setVisible(true)
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faPenAlt} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
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

export default VisitPage