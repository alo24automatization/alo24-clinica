import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useToast } from '@chakra-ui/react';
import { useHttp } from '../../../hooks/http.hook';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdverChart = () => {

    // const [beginDay, setBeginDay] = useState(
    //     new Date(
    //         new Date().setMonth(new Date().getMonth() - 3)
    //     )
    // );
    // const [endDay, setEndDay] = useState(
    //     new Date()
    // );

    //======================================================
    //======================================================

    const {t} = useTranslation()

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

    const [colors, setColors] = useState([]);

    const getRandomColor = (num) => {
        let count = 1;
        let colors = []
        while (count <= num) {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            colors.push(color);
            count++;
        }
        setColors(colors)
    }

    //======================================================
    //======================================================

    const [clients, setClients] = useState(0);
    const [counterClients, setCounterClients] = useState(0);

    const getStatistics = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/adver/adver/clients_statistics/get`,
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
                setClients(data.clients)
                setCounterClients(data.counteragent_clients)
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

    const [adverLabels, setAdverLabels] = useState([]);
    const [adverClients, setAdverClients] = useState([]);

    const getAdvers = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/adver/adver/adver_statistics/get`,
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
                setAdverLabels(data.advernames)
                setAdverClients(data.adverclients)
                getRandomColor(data.advernames.length)
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


    //=====================================================
    //=====================================================

    const [s, setS] = useState(0);
    useEffect(() => {
        if (!s) {
            const beginDay = new Date(
                new Date().setMonth(new Date().getMonth() - 1)
            )
            const endDay = new Date()
            setS(1);
            getStatistics(beginDay, endDay)
            getAdvers(beginDay, endDay)
        }
    }, [s, getStatistics, getAdvers])

    //======================================================
    //======================================================

    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className='flex justify-evenly items-center mb-6'>
                <Link to='/alo24/advers' className='bg-purple-500 flex justify-center items-center py-2 px-4 w-[300px] h-[150px] rounded-xl text-[20px] text-white shadow-2xl font-bold text-uppercase'>{t("REKLAMALAR")}</Link>
                <Link to='/alo24/counter_doctors' className='bg-green-500 flex justify-center items-center py-2 px-4 w-[300px] h-[150px] text-[20px] rounded-xl shadow-2xl text-white font-bold text-uppercase'>{t("AGENTLAR")}</Link>
                <Link to='/alo24/popular_services' className='bg-sky-500 flex justify-center items-center py-2 px-4 w-[300px] h-[150px] text-[20px] rounded-xl shadow-2xl text-white font-bold text-uppercase'>{t("AKTUAL XIZMATLAR")}</Link>
            </div>
            <div className='flex justify-evenly items-center'>
                <div>
                    <h2 className='text-center text-[28px] text-uppercase font-bold mb-4'>{t("Reklama")}</h2>
                    <Doughnut data={{
                        labels: adverLabels,
                        datasets: [
                            {
                                label: '',
                                data: adverClients,
                                backgroundColor: colors
                            }
                        ]
                    }} />
                </div>
                <div>
                    <h2 className='text-center text-[28px] text-uppercase font-bold mb-4'>{t("Mijozlar")}</h2>
                    <Doughnut data={{
                        labels: [t('Agent mijozlari'), t('Oddiy mijozlar')],
                        datasets: [
                            {
                                label: '',
                                data: [counterClients, clients],
                                backgroundColor: [
                                    'Red',
                                    'Blue',
                                ]
                            }
                        ]
                    }} />
                </div>
            </div>
        </div>
    )
}

export default AdverChart