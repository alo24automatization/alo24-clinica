import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkProduct, checkUploadProducts } from './checkData'
import { useTranslation } from 'react-i18next'
import { Pagination } from '../components/Pagination'
import { ExcelUpload } from './productComponents/ExcelUpload'
import { DatePickers } from '../../reseption/offlineclients/clientComponents/DatePickers'

export const ProductsReport = () => {

  const { t } = useTranslation()

  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastProduct = (currentPage + 1) * countPage
  const indexFirstProduct = indexLastProduct - countPage
  const [currentProducts, setCurrentProducts] = useState([])

  const [beginDay, setBeginDay] = useState(
    new Date(new Date().setUTCHours(0, 0, 0, 0))
  );
  const [endDay, setEndDay] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [remove, setRemove] = useState()
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

  const [searchStorage, setSearchStrorage] = useState([])
  const [products, setProducts] = useState([])

  const getProducts = useCallback(async (beginDay, endDay) => {
    try {
      const data = await request(
        `/api/services/product/getproducts`,
        'POST',
        { clinica: auth.clinica._id, beginDay, endDay },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setSearchStrorage(data)
      setProducts(data.slice(indexFirstProduct, indexLastProduct))
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
    indexLastProduct,
    indexFirstProduct,
    setSearchStrorage,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchName = (e) => {
    const searching = searchStorage.filter((item) =>
      item.product.name.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setProducts(searching.slice(0, countPage))
  }

  //====================================================================
  //====================================================================

  const setPageSize = (e) => {
    setCurrentPage(0)
    setCountPage(e.target.value)
    setProducts(products.slice(0, countPage))
  }
  //====================================================================
  //====================================================================

  const changeStart = (e) => {
    setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
    getProducts(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
  };

  const changeEnd = (e) => {
    const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

    setEndDay(date);
    getProducts(beginDay, date);
  }

  //====================================================================
  //====================================================================

  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getProducts(beginDay, endDay)
    }
  }, [getProducts, s])

  //====================================================================
  //====================================================================

  return (
    <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
      <div className="row gutters">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="border-0 shadow-lg table-container">
            <div className="border-0 table-container">
              <div className="table-responsive">
                <div className='flex gap-4 items-center py-2 px-1'>
                  <div>
                    <select
                      className="form-control form-control-sm selectpicker"
                      placeholder={t("Bo'limni tanlang")}
                      onChange={setPageSize}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className='w-[200px]'>
                    <input
                      onChange={searchName}
                      type="search"
                      className="w-100 form-control form-control-sm selectpicker"
                      placeholder={t("Maxsulot nomini kiriting")}
                    />
                  </div>
                  <div className='ml-auto'>
                    <Pagination
                      setCurrentDatas={setProducts}
                      datas={products}
                      setCurrentPage={setCurrentPage}
                      countPage={countPage}
                      totalDatas={searchStorage.length}
                    />
                  </div>
                  <div
                    className="text-center ml-auto flex gap-2"
                    style={{ overflow: 'hidden' }}
                  >
                    <DatePickers changeDate={changeStart} />
                    <DatePickers changeDate={changeEnd} />
                  </div>
                </div>
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className="border-right bg-alotrade text-[16px]">№</th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Nomi")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Sa'na")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Soni")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Narxi")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Umumiy narxi")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Xizmat")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-right font-weight-bold text-[16px]">
                            {currentPage * countPage + key + 1}
                          </td>
                          <td className="border-right text-[16px]">{product?.product?.name}</td>
                          <td className="border-right text-[16px]">{new Date(product?.createdAt).toLocaleDateString()}</td>
                          <td className="border-right text-[16px]">{product?.pieces}</td>
                          <td className="border-right text-[16px]">{product?.product?.price}</td>
                          <td className="border-right text-[16px]">{product?.pieces * product?.product?.price}</td>
                          <td className="border-right text-[16px]">{product?.service ? product?.service?.service?.name : product?.reseption?.firstname + ' ' + product?.reseption?.lastname}</td>
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

  )
}
