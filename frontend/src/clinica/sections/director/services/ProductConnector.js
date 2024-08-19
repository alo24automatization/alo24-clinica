import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import {
  checkProductConnector,
  checkUploadProductConnectors,
} from './checkData'
import { Modal } from './modal/Modal'
import { TableProductConnectors } from './productConnectorComponents/TableProductConnectors'
import { InputProductConnector } from './productConnectorComponents/InputProductConnector'
import { ExcelCols } from './productConnectorComponents/ExcelCols'
import { useTranslation } from 'react-i18next'

export const ProductConnectors = () => {
  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastProductConnector = (currentPage + 1) * countPage
  const indexFirstProductConnector = indexLastProductConnector - countPage
  const [currentProductConnectors, setCurrentProductConnectors] = useState([])

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
    document.getElementsByTagName('select')[1].selectedIndex = 0
    document.getElementsByTagName('select')[2].selectedIndex = 0
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

  const [productConnector, setProductConnector] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [productConnectors, setProductConnectors] = useState([])
  const [imports, setImports] = useState([])
  const [searchStorage, setSearchStrorage] = useState([])
  const [changeImports, setChangeImports] = useState([])

  const sections = [
    { name: t('Shifoxona nomi'), value: 'clinica' },
    { name: t('Mahsulot nomi'), value: 'product' },
    { name: t('Xizmat nomi'), value: 'service' },
    { name: t('Soni'), value: 'pieces' },
  ]

  const getProductConnectors = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/productconnector/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setProductConnectors(data)
      setSearchStrorage(data)
      setCurrentProductConnectors(
        data.slice(indexFirstProductConnector, indexLastProductConnector),
      )
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
    setCurrentProductConnectors,
    indexLastProductConnector,
    indexFirstProductConnector,
    setSearchStrorage,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [departments, setDepartments] = useState([])
  const [services, setServices] = useState([])

  const getDepartments = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setDepartments(data)
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
        `/api/services/productconnector/register`,
        'POST',
        { ...productConnector },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `Bog'lanish yaratildi!`,
        description: '',
        status: 'success',
      })
      getProductConnectors()
      setProductConnector({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()

      localStorage.setItem('create', data)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [
    auth,
    request,
    getProductConnectors,
    productConnector,
    notify,
    clearInputs,
  ])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/productconnector/update`,
        'PUT',
        { ...productConnector },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `Boshlanish yangilandi!`,
        description: '',
        status: 'success',
      })
      localStorage.setItem('update', data)
      getProductConnectors()
      setProductConnector({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      document.getElementsByTagName('select')[0].selectedIndex = 0
      document.getElementsByTagName('select')[1].selectedIndex = 0
      document.getElementsByTagName('select')[2].selectedIndex = 0
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [
    auth,
    request,
    getProductConnectors,
    productConnector,
    notify,
    clearInputs,
  ])

  const saveHandler = () => {
    if (checkProductConnector(productConnector)) {
      return notify(checkProductConnector(productConnector))
    }
    if (productConnector._id) {
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

  const uploadAllProductConnectors = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/productconnector/registerall`,
        'POST',
        [...changeImports],
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('data', data)
      notify({
        title: `Barha bosg'lanishlar yuklandi!`,
        description: '',
        status: 'success',
      })
      getProductConnectors()
      setProductConnector({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      setModal2(false)
      document.getElementsByTagName('select')[0].selectedIndex = 0
      document.getElementsByTagName('select')[1].selectedIndex = 0
      document.getElementsByTagName('select')[2].selectedIndex = 0
    } catch (e) {
      notify({
        title: e,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, getProductConnectors, notify, clearInputs, changeImports])

  const checkUploadData = () => {
    if (
      checkUploadProductConnectors(departments, auth.clinica, changeImports)
    ) {
      return notify(
        checkUploadProductConnectors(departments, auth.clinica, changeImports),
      )
    }
    uploadAllProductConnectors()
  }

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/productconnector`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `Bog'lanish o'chirildi!`,
        description: '',
        status: 'success',
      })
      getProductConnectors()
      setProductConnector({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      setModal(false)
      localStorage.setItem('data', data)
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, remove, notify, getProductConnectors, clearInputs])

  const deleteAll = useCallback(async () => {
    if (productConnectors && productConnectors.length === 0) {
      return notify({
        title: `Bog'lanishlar mavjud emas`,
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/services/productconnector/deleteall`,
        'DELETE',
        { ...productConnector },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('delete', data)
      notify({
        title: `Barcha bog'lanishlar o'chirildi!`,
        description: '',
        status: 'success',
      })
      getProductConnectors()
      setModal1(false)
      setProductConnector({
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
  }, [
    auth,
    request,
    notify,
    getProductConnectors,
    clearInputs,
    productConnector,
    productConnectors,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const inputHandler = (e) => {
    setProductConnector({
      ...productConnector,
      [e.target.name]: e.target.value,
    })
  }

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchService = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.service.name.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setProductConnectors(searching)
      setCurrentProductConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  const searchProduct = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.product.name.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setProductConnectors(searching)
      setCurrentProductConnectors(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  //====================================================================
  //====================================================================
  const setPageSize = useCallback(
    (e) => {
      setCurrentPage(0)
      setCountPage(e.target.value)
      setCurrentProductConnectors(productConnectors.slice(0, countPage))
    },
    [countPage, productConnectors],
  )
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getDepartments()
      getProductConnectors()
      getProducts()
    }
  }, [getProductConnectors, getDepartments, getProducts, s])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <InputProductConnector
              services={services}
              setServices={setServices}
              departments={departments}
              setProductConnector={setProductConnector}
              productConnector={productConnector}
              keyPressed={keyPressed}
              inputHandler={inputHandler}
              saveHandler={saveHandler}
              products={products}
              loading={loading}
            />
            <TableProductConnectors
              searchProduct={searchProduct}
              searchService={searchService}
              setImports={setImports}
              departments={departments}
              productConnectors={productConnectors}
              setRemove={setRemove}
              setModal={setModal}
              setProductConnectors={setProductConnectors}
              setProductConnector={setProductConnector}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentProductConnectors={currentProductConnectors}
              setCurrentProductConnectors={setCurrentProductConnectors}
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
        basic={remove && remove.product.name + ' va ' + remove.service.name}
        text={"bog'lanishini o'chirishni tasdiqlaysizmi?"}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={'Barcha'}
        text={"bog'lanishlarni o'chirishni tasdiqlaysizmi?"}
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
