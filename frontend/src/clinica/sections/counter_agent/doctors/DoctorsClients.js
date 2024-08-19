import { useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../context/AuthContext';
import { useHttp } from '../../../hooks/http.hook';
import DoctorClientsTable from './components/DoctorClientsTable';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

const DoctorsClients = () => {

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

    const [counterdoctorClients, setCounterdoctorClients] = useState([]);
    const [searchStorage, setSearchStorage] = useState([]);


    //==============================================================
    //==============================================================

    const setPageSize = (e) => {
        if (e.target.value === 'all') {
            setCurrentPage(0);
            setCountPage(searchStorage.length);
            setCounterdoctorClients(searchStorage);
        } else {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setCounterdoctorClients(searchStorage.slice(0, e.target.value));
        }
    }

    // ChangeDate
    const parseDateString = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return new Date(Date.UTC(year, month - 1, day));
    };
    const changeStart = (e, type) => {
        if (type === "onLoad") {
            setBeginDay(parseDateString(e))
        } else {
            setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        }

    };

    const changeEnd = (e, type) => {
        let date;
        if (type === "onLoad") {
            date = parseDateString(e);
        } else {
            date = new Date(
                new Date(new Date().setDate(new Date(e).getDate() + 1)).setUTCHours(
                    0,
                    0,
                    0,
                    0
                )
            );
        }

        setEndDay(date);
    }

    //==============================================================
    //==============================================================

    const changeCounterDoctor = (e) => {
        if (e.value === 'none') {
            setCounterdoctor('')
        } else {
            setCounterdoctor(e.value)
        }
    }

    const searchClientName = (e) => {
        const searching = searchStorage.filter((item) =>
            item.firstname
                .toLowerCase()
                .includes(e.target.value.toLowerCase()) ||
            item.lastname
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setCounterdoctorClients(searching);
    }

    //==============================================================
    //==============================================================

    const [doctors, setDoctors] = useState([]);

    const { id: doctor_id } = useParams();
    const getDoctorsClients = useCallback(async () => {
        try {
            const data = await request(
                `/api/counter_agent/counterdoctor_clients/${doctor_id}`,
                "POST",
                {
                    beginDay,
                    endDay,
                    clinica: auth && auth.clinica._id,
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                }
            );
            setCounterdoctorClients(data)
            setSearchStorage(data)
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [auth, request, notify, beginDay, endDay])

    useEffect(() => {
        getDoctorsClients()
    }, [getDoctorsClients])

    //==============================================================
    //==============================================================

    const [s, setS] = useState(0);

    useEffect(() => {
        if (auth.clinica && !s) {
            setS(1);
        }
    }, [auth, s]);



    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <DoctorClientsTable
                            changeStart={changeStart}
                            changeEnd={changeEnd}
                            beginDay={beginDay}
                            endDay={endDay}
                            connectors={searchStorage}
                            setCurrentConnectors={setCounterdoctorClients}
                            currentConnectors={counterdoctorClients}
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

export default DoctorsClients