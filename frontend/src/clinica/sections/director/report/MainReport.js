import { useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { Modal } from '../../cashier/components/Modal'
import { CheckModal } from '../../cashier/components/ModalCheck'
import { checkData } from '../../cashier/offlineclients/checkData/checkData'
import { TableClients } from '../../cashier/offlineclients/clientComponents/TableClients'
import { MainReportTable } from './components/MainReportTable'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useTranslation } from 'react-i18next'

const animatedComponents = makeAnimated()


const MainReport = () => {

  const {t} = useTranslation()

  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0)),
  )
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1)),
  )
  //====================================================================
  //====================================================================
  // MODAL
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false)
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
  const [currentConnectors, setCurrentConnectors] = useState([])

  //====================================================================
  //====================================================================
  const [check, setCheck] = useState({});
  //====================================================================
  //====================================================================
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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const { request, loading } = useHttp()
  const auth = useContext(AuthContext)
  //====================================================================
  //====================================================================

  const [clinicaDataSelect, setClinicaDataSelect] = useState({
    value: auth?.clinica?._id,
    label: auth?.clinica?.name,
  });
  const [clinicaValue, setClinicaValue] = useState(auth?.clinica?._id)

  //====================================================================
  //====================================================================
  // getConnectors 
  const [connectors, setConnectors] = useState([])
  const [searchStorage, setSearchStrorage] = useState([])

  const getConnectors = useCallback(
    async (beginDay, endDay, clinica) => {
      try {
        const data = await request(
          `/api/cashier/offline/payments/getall`,
          'POST',
          { clinica: clinica, beginDay, endDay },
          {
            Authorization: `Bearer ${auth.token}`,
          },
        )
        setConnectors(data)
        setSearchStrorage(data)
        setCurrentConnectors(
          data.slice(indexFirstConnector, indexLastConnector),
        )
      } catch (error) {
        notify({
          title: t(`${error}`),
          description: '',
          status: 'error',
        })
      }
    },
    [request, auth, notify, indexFirstConnector, indexLastConnector],
  )
  //====================================================================
  //====================================================================

  const [expenseTotal, setExpenseTotal] = useState(0)
  const [expenses, setExpenses] = useState([])

  const getExpenseTotal = useCallback(async (beginDay, endDay, clinica) => {
    try {
      const data = await request(
        `/api/cashier/expense/total/get`,
        'POST',
        { clinica: clinica, beginDay, endDay },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setExpenseTotal(data.total);
      setExpenses(data.expenses)
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify])

  //====================================================================
  //====================================================================

  const [baseUrl, setBaseurl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request(`/api/baseurl`, "GET", null);
      setBaseurl(data.baseUrl);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  //====================================================================
  //====================================================================
  // SEARCH
  const searchFullname = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.fullname
          .toLowerCase()
          .includes(e.target.value.toLowerCase()),
      )
      setConnectors(searching)
      setCurrentConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  const searchId = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.id.toString().includes(e.target.value),
      )
      setConnectors(searching)
      setCurrentConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  const searchProbirka = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.probirka.toString().includes(e.target.value),
      )
      setConnectors(searching)
      setCurrentConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  const searchPhone = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.client.phone.toString().includes(e.target.value),
      )
      setConnectors(searching)
      setCurrentConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const setPageSize = (e) => {
      if (e.target.value === 'all') {
        setCurrentPage(0)
        setCountPage(100)
        setCurrentConnectors(connectors)
      } else {
        setCurrentPage(0)
        setCountPage(e.target.value)
        setCurrentConnectors(connectors.slice(0, e.target.value))
      }
    }

  //====================================================================
  //====================================================================
  // CLIENT

  const [client, setClient] = useState({
    clinica: auth.clinica && auth.clinica._id,
    reseption: auth.user && auth.user._id,
  })
  const [connector, setConnector] = useState({
    clinica: auth.clinica && auth.clinica._id,
    probirka: 0,
  })

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // ChangeDate

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)))
    getConnectors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue)
    getExpenseTotal(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay, clinicaValue)
  }

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

    setEndDay(date)
    getConnectors(beginDay, date, clinicaValue)
    getExpenseTotal(beginDay, date, clinicaValue)
  }

  //====================================================================
  //====================================================================
  // Payment

  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])
  const [index, setIndex] = useState()

  const [payments, setPayments] = useState(0)
  const [totalpayment, setTotalPayment] = useState(0)
  const [payment, setPayment] = useState({
    payment: 0,
    card: 0,
    cash: 0,
    transfer: 0,
    debt: 0,
    type: '',
  })
  const [discount, setDiscount] = useState({
    discount: 0,
  })

  const changeClient = useCallback((connector, index) => {
    setIndex(index)
    let total = 0
    let services = []
    let products = []
    let servs = JSON.parse(JSON.stringify(connector.services))
    for (const serv of servs) {
      if (!serv.payment && !serv.refuse) {
        services.push(serv._id)
        serv.payment = true
      }
      if (serv.payment) {
        total += serv.service.price * serv.pieces
      }
    }
    let prods = JSON.parse(JSON.stringify(connector.products))
    for (const prod of prods) {
      if (!prod.payment && !prod.refuse) {
        products.push(prod._id)
        prod.payment = true
      }
      if (prod.payment) {
        total += prod.product.price * prod.pieces
      }
    }

    setServices(servs)
    setProducts(prods)

    setClient(JSON.parse(JSON.stringify(connector.client)))
    setConnector({ ...connector })

    let payments = connector.payments.reduce((summa, payment) => {
      return summa + payment.payment
    }, 0)

    setPayments(payments)

    setPayment({
      total: total,
      payment: 0,
      clinica: connector.clinica,
      client: connector.client._id,
      connector: connector._id,
      card: 0,
      cash: 0,
      transfer: 0,
      debt: 0,
      services: [...services],
      products: [...products]
    })
    setTotalPayment(total)

    if (connector.discount) {
      setDiscount(connector.discount)
    } else {
      setDiscount({
        total: total,
        discount: 0,
        clinica: connector.clinica,
        client: connector.client._id,
        connector: connector._id,
      })
    }
  }, [])

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // useEffect

  const [s, setS] = useState(0)

  useEffect(() => {
    if (auth.clinica && !s) {
      setS(1)
      getConnectors(beginDay, endDay, clinicaValue)
      getExpenseTotal(beginDay, endDay, clinicaValue)
      getBaseUrl()
    }
  }, [auth, getConnectors, getBaseUrl, s, beginDay, endDay])

  //====================================================================
  //====================================================================
  return (
    <div>
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            {auth?.clinica?.mainclinica && auth?.clinica?.filials.length > 0 && <div className="w-[300px] mb-2">
              <Select
                value={clinicaDataSelect}
                onChange={(e) => {
                  setClinicaDataSelect(e)
                  setClinicaValue(e.value);
                  getConnectors(beginDay, endDay, e.value);
                  getExpenseTotal(beginDay, endDay, e.value);
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
            <MainReportTable
              setVisible={setVisible}
              modal1={modal1}
              setModal1={setModal1}
              setCheck={setCheck}
              changeStart={changeStart}
              changeEnd={changeEnd}
              searchPhone={searchPhone}
              changeClient={changeClient}
              setConnector={setConnector}
              searchFullname={searchFullname}
              searchId={searchId}
              connectors={connectors}
              searchStorage={searchStorage}
              searchProbirka={searchProbirka}
              setConnectors={setConnectors}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentConnectors={currentConnectors}
              setCurrentConnectors={setCurrentConnectors}
              currentPage={currentPage}
              setPageSize={setPageSize}
              // setModal2={setModal2}
              loading={loading}
              expenseTotal={expenseTotal}
              beginDay={beginDay}
              endDay={endDay}
              expenses={expenses}
            />
          </div>
        </div>
      </div>
      <CheckModal
        baseUrl={baseUrl}
        connector={check}
        clinica={auth && auth.clinica}
        modal={modal1}
        setModal={setModal1}
      />
    </div>
  )
}

export default MainReport
