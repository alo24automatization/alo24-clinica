import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkWarehouse, checkUploadWarehouses } from './checkData'
import { Modal } from './modal/Modal'
import { TableWarehouses } from './warehouseComponents/TableWarehouses'
import { InputWarehouse } from './warehouseComponents/InputWarehouse'
import { ExcelCols } from './warehouseComponents/ExcelCols'
import { useTranslation } from 'react-i18next'

export const Warehouses = () => {
  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastWarehouse = (currentPage + 1) * countPage
  const indexFirstWarehouse = indexLastWarehouse - countPage
  const [currentWarehouses, setCurrentWarehouses] = useState([])

  //====================================================================
  //====================================================================
  const {t} = useTranslation()
  //====================================================================
  //====================================================================
  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [remove, setRemove] = useState()

  const clearInputs = useCallback(() => {
    const inputs = document.getElementsByTagName('input')
    document.getElementsByTagName('select')[0].selectedIndex = 0
    for (const input of inputs) {
      input.value = ''
    }
  }, [])
  //====================================================================
  //====================================================================

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

  const [warehouse, setWarehouse] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [warehouses, setWarehouses] = useState([])
  const [imports, setImports] = useState([])
  const [searchStorage, setSearchStrorage] = useState([])
  const [changeImports, setChangeImports] = useState([])

  const sections = [
    { name: 'Shifoxona nomi', value: 'clinica' },
    { name: 'Mahsulot nomi', value: 'product' },
    { name: 'Soni', value: 'total' },
    { name: 'Narxi', value: 'price' },
    { name: 'Kelgan vaqti', value: 'dateofreciept' },
  ]

  const getWarehouses = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/warehouse/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )

      setWarehouses(data)
      setSearchStrorage(data)
      setCurrentWarehouses(data.slice(indexFirstWarehouse, indexLastWarehouse))
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [
    request,
    auth,
    notify,
    setCurrentWarehouses,
    indexLastWarehouse,
    indexFirstWarehouse,
    setSearchStrorage,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [products, setProducts] = useState([])

  const getProducts = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )

      setProducts(data)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/warehouse/register`,
        'POST',
        { ...warehouse },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} mahsuloti yaratildi!`,
        description: '',
        status: 'success',
      })
      getWarehouses()
      setWarehouse({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, getWarehouses, warehouse, notify, clearInputs])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/warehouse/update`,
        'PUT',
        { ...warehouse },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.product.name} mahsuloti yangilandi!`,
        description: '',
        status: 'success',
      })
      getWarehouses()
      setWarehouse({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      document.getElementsByTagName('select')[0].selectedIndex = 0
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, getWarehouses, warehouse, notify, clearInputs])

  const saveHandler = () => {
    if (checkWarehouse(warehouse)) {
      return notify(checkWarehouse(warehouse))
    }
    if (warehouse._id) {
      return updateHandler()
    } else {
      return createHandler()
    }
  }

  const keyPressed = (e) => {
    if (e.key === 'Enter') {
      return saveHandler()
    }
  }

  const uploadAllWarehouses = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/warehouse/registerall`,
        'POST',
        [...changeImports],
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('data', data)
      notify({
        title: `Barcha mahsulotlar yuklandi!`,
        description: '',
        status: 'success',
      })
      getWarehouses()
      setWarehouse({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      setModal2(false)
      document.getElementsByTagName('select')[0].selectedIndex = 0
    } catch (e) {
      notify({
        title: e,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, getWarehouses, notify, clearInputs, changeImports])

  const checkUploadData = () => {
    if (checkUploadWarehouses(auth.clinica, changeImports)) {
      return notify(checkUploadWarehouses(auth.clinica, changeImports))
    }
    uploadAllWarehouses()
  }

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/warehouse`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.product.name} mahsuloti o'chirildi!`,
        description: '',
        status: 'success',
      })
      getWarehouses()
      setWarehouse({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      setModal(false)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, remove, notify, getWarehouses, clearInputs])

  const deleteAll = useCallback(async () => {
    if (warehouses && warehouses.length === 0) {
      return notify({
        title: `Mahsulotlar mavjud emas`,
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/services/warehouse/deleteall`,
        'DELETE',
        { ...warehouse },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('delete', data)
      notify({
        title: `Barcha mahsulotlar o'chirildi!`,
        description: '',
        status: 'success',
      })
      getWarehouses()
      setModal1(false)
      setWarehouse({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, notify, getWarehouses, clearInputs, warehouse, warehouses])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const inputHandler = (e) => {
    if (e.target.name === 'dateofreciept') {
      setWarehouse({
        ...warehouse,
        [e.target.name]: {
          year: new Date(e.target.value).getFullYear(),
          month: new Date(e.target.value).getMonth(),
          day: new Date(e.target.value).getDate(),
        },
      })
    } else setWarehouse({ ...warehouse, [e.target.name]: e.target.value })
  }
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchProduct = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.product.name.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setWarehouses(searching)
      setCurrentWarehouses(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const setPageSize = useCallback(
    (e) => {
      setCurrentPage(0)
      setCountPage(e.target.value)
      setCurrentWarehouses(warehouses.slice(0, countPage))
    },
    [countPage, warehouses],
  )
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getProducts()
      getWarehouses()
    }
  }, [getWarehouses, getProducts, s])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <InputWarehouse
              products={products}
              setWarehouse={setWarehouse}
              warehouse={warehouse}
              keyPressed={keyPressed}
              inputHandler={inputHandler}
              saveHandler={saveHandler}
              loading={loading}
            />
            <TableWarehouses
              searchProduct={searchProduct}
              setImports={setImports}
              products={products}
              warehouses={warehouses}
              setRemove={setRemove}
              setModal={setModal}
              setWarehouses={setWarehouses}
              setWarehouse={setWarehouse}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentWarehouses={currentWarehouses}
              setCurrentWarehouses={setCurrentWarehouses}
              currentPage={currentPage}
              setPageSize={setPageSize}
              setModal1={setModal1}
              setModal2={setModal2}
              loading={loading}
            />
          </div>
        </div>
      </div>

      <Modal
        modal={modal}
        setModal={setModal}
        basic={remove && remove.name}
        text={t("mahsulotini o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={t('Barcha')}
        text={t("mahsulotlarni o'chirishni tasdiqlaysizmi?")}
        handler={deleteAll}
      />

      <Modal
        modal={modal2}
        setModal={setModal2}
        handler={checkUploadData}
        text={
          <ExcelCols
            createdData={changeImports}
            setData={setChangeImports}
            data={imports}
            sections={sections}
          />
        }
      />
    </>
  )
}
