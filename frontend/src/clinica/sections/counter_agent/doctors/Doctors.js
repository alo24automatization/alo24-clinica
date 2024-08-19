import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import RegisterDoctor from './components/RegisterDoctor';
import Table from './components/Table';

const Doctors = () => {

    const {t} = useTranslation()

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
                `/api/counter_agent/doctors_services/get`,
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
            item.client.firstname
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
            item.client.lastname
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
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


    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <Table
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            endDay={endDay}
                            beginDay={beginDay}
                            changeCounterDoctor={changeCounterDoctor}
                            counterDoctorsList={doctors}
                            connectors={searchStorage}
                            setCurrentConnectors={setCounterdoctors}
                            currentConnectors={counterdoctors}
                            currentPage={currentPage}
                            countPage={countPage}
                            setPageSize={setPageSize}
                            searchClientName={searchClientName}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Doctors