import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import DailyCircle from '../components/DailyCircle'
import LineChart from '../components/LineChart'

export const HomePage = () => {

  const { request, loading } = useHttp()
  const auth = useContext(AuthContext)


  const {t} = useTranslation()

  //=======================================
  //=======================================

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

  //=======================================
  //=======================================

  const months = [
    t('Yanvar'),
    t('Fevral'),
    t('Mart'),
    t('Aprel'),
    t('May'),
    t('Iyun'),
    t('Iyul'),
    t('Avgust'),
    t('Sentabr'),
    t('Oktabr'),
    t('Noyabr'),
    t('Dekabr')
  ]

  const [monthlyReport, setMonthlyReport] = useState({
    clients: [],
    totalsum: []
  })

  const getMonthlyReport = useCallback(async () => {
    try {
      const data = await request(
        `/api/offline/monthly/get`,
        'POST',
        { clinica: auth && auth?.clinica?._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setMonthlyReport(data);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [auth, notify, request])

  //=============================================
  //=============================================

  const [dailyReport, setDailyReport] = useState({
    clients: 0,
    services: 0,
    payments: 0,
    expense: 0
  })

  const getDailyReport = useCallback(async () => {
    try {
      const data = await request(
        `/api/offline/daily/get`,
        'POST',
        { clinica: auth && auth?.clinica?._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setDailyReport({
        clients: data.clients,
        services: data.services,
        payments: data.payments,
        expense: data.expense
      });
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '', 
        status: 'error',
      })
    }
  }, [auth, notify, request])


  //=============================================
  //=============================================

  // const [t, setT] = useState(0)

  // useEffect(() => {
  //   if (!t) {
  //     setT(1)
  //     getMonthlyReport()
  //     getDailyReport()
  //   }
  // }, [t, getMonthlyReport, getDailyReport]);

  useEffect(() => {
    getMonthlyReport()
  }, [getMonthlyReport])

  useEffect(() => {
    getDailyReport()
  }, [getDailyReport])

  return (
    <section
      className={
        'pl-[2.5rem] py-[1.25rem] pr-[2.5rem] flex flex-col gap-[5rem] overflow-y-auto overflow-x-hidden'
      }
    >
      <div className={'flex items-center justify-around gap-[3.1rem]'}>
        <DailyCircle
          text={dailyReport.clients}
          label={t('Mijozlar soni')}
        />
        <DailyCircle
          nth={1}
          text={dailyReport.services}
          label={t("Ko'rsatilgan xizmatlar")}
        />
        <DailyCircle
          nth={2}
          text={dailyReport.payments}
          label={t('Tushumlar')}
        />
        <DailyCircle
          nth={3}
          text={dailyReport.expense}
          label={t('Xarajatlar')}
        />
      </div>
      <div className={'h-[25rem]'}>
        <LineChart
          label={[
            t('Oylik mijoz soni'),
            `${months[new Date().getMonth()]} : ${monthlyReport?.clients.length > 0
              ? monthlyReport.clients[
              monthlyReport.clients.length - 1
              ]
              : 0
            } ${t('ta')}`,
          ]}
          arr={monthlyReport?.clients}
        />
      </div>
      <div className={'h-[25rem]'}>
        <LineChart
          label={[
            t('Oylik daromad'),
            `${months[new Date().getMonth()]} : ${monthlyReport?.totalsum.length > 0
              ? monthlyReport.totalsum[
              monthlyReport.totalsum.length - 1
              ]
              : 0
            }`,
          ]}
          arr={monthlyReport?.totalsum}
        />
      </div>
    </section>
  )
}
