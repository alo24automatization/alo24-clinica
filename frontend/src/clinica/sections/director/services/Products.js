import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkProduct, checkUploadProducts } from './checkData'
import { Modal } from './modal/Modal'
import { TableProducts } from './productComponents/TableProducts'
import { InputProduct } from './productComponents/InputProduct'
import { ExcelCols } from './productComponents/ExcelCols'
import { useTranslation } from 'react-i18next'

export const Products = () => {

  const {t} = useTranslation()

  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastProduct = (currentPage + 1) * countPage
  const indexFirstProduct = indexLastProduct - countPage
  const [currentProducts, setCurrentProducts] = useState([])

  //====================================================================
  //====================================================================

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

  const [product, setProduct] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [products, setProducts] = useState([])
  const [imports, setImports] = useState([])
  const [searchStorage, setSearchStrorage] = useState()
  const [changeImports, setChangeImports] = useState([])

  const sections = [
    { name: t('Shifoxona nomi'), value: 'clinica' },
    { name: t('Mahsulot nomi'), value: 'name' },
    { name: t('Mahsulot narxi'), value: 'price' },
    { name: t("O'lchov birligi"), value: 'unit' },
    { name: t('Donasi'), value: 'total' },
  ]

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
      setSearchStrorage(data)
      setCurrentProducts(data.slice(indexFirstProduct, indexLastProduct))
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
    setCurrentProducts,
    indexLastProduct,
    indexFirstProduct,
    setSearchStrorage,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product/register`,
        'POST',
        { ...product },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} mahsuloti yaratildi!`,
        description: '',
        status: 'success',
      })
      getProducts()
      setProduct({
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
  }, [auth, request, getProducts, product, notify, clearInputs])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product/update`,
        'PUT',
        { ...product },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} mahsuloti yangilandi!`,
        description: '',
        status: 'success',
      })
      getProducts()
      setProduct({
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
  }, [auth, request, getProducts, product, notify, clearInputs])

  const saveHandler = () => {
    if (checkProduct(product)) {
      return notify(checkProduct(product))
    }
    if (product._id) {
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

  const uploadAllProducts = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product/registerall`,
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
      getProducts()
      setProduct({
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
  }, [auth, request, getProducts, notify, clearInputs, changeImports])

  const checkUploadData = () => {
    if (checkUploadProducts(auth.clinica, changeImports)) {
      return notify(checkUploadProducts(auth.clinica, changeImports))
    }
    uploadAllProducts()
  }

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/product`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} mahsuloti o'chirildi!`,
        description: '',
        status: 'success',
      })
      getProducts()
      setProduct({
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
  }, [auth, request, remove, notify, getProducts, clearInputs])

  const deleteAll = useCallback(async () => {
    if (products && products.length === 0) {
      return notify({
        title: `Mahsulotlar mavjud emas`,
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/services/product/deleteall`,
        'DELETE',
        { ...product },
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
      getProducts()
      setModal1(false)
      setProduct({
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
  }, [auth, request, notify, getProducts, clearInputs, product, products])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const inputHandler = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchName = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setProducts(searching)
      setCurrentProducts(searching.slice(0, countPage))
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
      setCurrentProducts(products.slice(0, countPage))
    },
    [countPage, products],
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
    }
  }, [getProducts, s])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <InputProduct
              setProduct={setProduct}
              product={product}
              keyPressed={keyPressed}
              inputHandler={inputHandler}
              saveHandler={saveHandler}
              loading={loading}
            />
            <TableProducts
              searchName={searchName}
              setImports={setImports}
              products={products}
              setRemove={setRemove}
              setModal={setModal}
              setProducts={setProducts}
              setProduct={setProduct}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentProducts={currentProducts}
              setCurrentProducts={setCurrentProducts}
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
        text={t("mahsulotini o'chirishni tasdiqlaysizmi?")}
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
