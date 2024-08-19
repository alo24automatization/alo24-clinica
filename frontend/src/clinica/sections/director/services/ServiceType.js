import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkServiceType } from './checkData'
import { Modal } from './modal/Modal'
import { Sort } from './serviceComponents/Sort'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const ServiceType = () => {
  //====================================================================
  //====================================================================

  const {t} = useTranslation()

  const location = useLocation()
  const history = useHistory()

  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
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

  const [servicetype, setServiceType] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [departments, setDepartments] = useState()

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
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [servicetypes, setServiceTypes] = useState()
  const [serviceTypeStorage, setServiceTypeStorage] = useState([]);

  const getServiceType = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/servicetype/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setServiceTypeStorage(data)
      if (location?.state?.department) {
        setServiceTypes([...data].filter(type => type.department._id === location?.state?.department))
      } else {
        setServiceTypes(data);
      }
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

  //====================================================================
  //====================================================================

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/servicetype/register`,
        'POST',
        { ...servicetype },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("xizmat turi yaratildi")}!`,
        description: '',
        status: 'success',
      })
      getServiceType()
      setServiceType({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify, getServiceType, servicetype, clearInputs])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/servicetype/update`,
        'PUT',
        { ...servicetype },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("xizmat turi yangilandi")}!`,
        description: '',
        status: 'success',
      })
      getServiceType()
      setServiceType({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify, getServiceType, servicetype, clearInputs])

  const saveHandler = () => {
    if (checkServiceType(servicetype, t)) {
      return notify(checkServiceType(servicetype, t))
    }
    if (servicetype._id) {
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

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/servicetype`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("nomli xizmat turi o'chirildi")}!`,
        description: '',
        status: 'success',
      })
      getServiceType()
      setModal(false)
      setServiceType({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, remove, notify, getServiceType, clearInputs])

  const deleteAll = useCallback(async () => {
    if (servicetypes && servicetypes.length === 0) {
      return notify({
        title: t(`Xizmat turlari mavjud emas`),
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/services/servicetype/deleteall`,
        'DELETE',
        { ...servicetype },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('delete', data)
      notify({
        title: t(`Barcha xizmat turlari o'chirildi!`),
        description: '',
        status: 'success',
      })
      getServiceType()
      setModal1(false)
      setServiceType({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [
    auth,
    request,
    notify,
    getServiceType,
    clearInputs,
    servicetype,
    servicetypes,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const checkHandler = (e) => {
    const value = e.target.value;
    if (value === 'none') {
      setServiceTypes(serviceTypeStorage);
    } else {
      setServiceTypes([...serviceTypeStorage].filter((type) => type.department._id === value));
    }
    setServiceType({ ...servicetype, department: value })
  }

  const inputHandler = (e) => {
    setServiceType({ ...servicetype, name: e.target.value })
  }

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getDepartments()
      getServiceType()
    }
  }, [getDepartments, getServiceType, s])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="border-0 table-container">
              <div className="table-responsive">
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className="w-25 bg-alotrade text-[16px]">{t("Bo'lim nomi")}</th>
                      <th className="w-25 bg-alotrade text-[16px]">{t("Xizmat turi")}</th>
                      <th className="w-25 bg-alotrade text-[16px]">{t("Saqlash")}</th>
                      <th className="w-25 bg-alotrade text-[16px]">{t("Barcha xizmatlarni o'chirish")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          style={{ minWidth: '70px', maxWidth: '200px' }}
                          className="text-[16px] form-control form-control-sm selectpicker"
                          placeholder="Bo'limni tanlang"
                          onChange={checkHandler}
                        >
                          <option value={'none'}>{t("Bo'limni tanlang")}</option>
                          {departments &&
                            departments.map((department, index) => {
                              return (
                                <option value={department._id}>
                                  {department.name}
                                </option>
                              )
                            })}
                        </select>
                      </td>
                      <td>
                        <input
                          style={{ minWidth: '70px' }}
                          name="name"
                          value={servicetype.name}
                          onKeyUp={keyPressed}
                          onChange={inputHandler}
                          type="text"
                          className="text-[16px] form-control w-75 py-0"
                          id="name"
                          // placeholder={t("Xizmat turini kiriting")}
                        />
                      </td>
                      <td>
                        {loading ? (
                          <button className="btn btn-info" disabled>
                            <span class="spinner-border spinner-border-sm"></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            onClick={saveHandler}
                            className="text-[16px] btn btn-info py-1 px-4"
                          >
                            {t("Saqlash")}
                          </button>
                        )}
                      </td>
                      <td>
                        {loading ? (
                          <button className="btn btn-danger" disabled>
                            <span class="spinner-border spinner-border-sm"></span>
                            Loading...
                          </button>
                        ) : (
                          <button
                            onClick={() => setModal1(true)}
                            className="text-[16px] btn btn-danger py-0 px-4 pt-1"
                          >
                            <span className="icon-trash-2"></span>
                          </button>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-0 table-container">
              <div className="table-responsive">
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className='text-[16px] bg-alotrade '>№</th>
                      <th className="text-[16px] bg-alotrade w-25">
                        {t("Bo'limi")}
                      </th>
                      <th className="text-[16px] bg-alotrade w-25">
                        {t("Xizmat turi")}
                      </th>
                      <th className="text-[16px] bg-alotrade w-25">{t("Barcha xizmatlar")}</th>
                      <th className="text-[16px] bg-alotrade w-25">{t("Tahrirlash")}</th>
                      <th className="text-[16px] bg-alotrade w-25">{t("O'chirish")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicetypes &&
                      servicetypes.map((s, key) => {
                        return (
                          <tr key={key}>
                            <td className="font-weight-bold text-[16px]">{key + 1}</td>
                            <td className='text-[16px]'>{s.department.name}</td>
                            <td className='text-[16px]'>{s.name}</td>
                            <td>
                              <button
                                onClick={() => history.push('/alo24/services', {
                                  servicetype: s._id
                                })}
                                className='text-[16px] bg-green-400 text-white font-semibold py-1 px-2'>
                                {t("Xizmatlar")}
                              </button>
                            </td>
                            <td className='text-[16px]'>
                              <button
                                onClick={() => {
                                  const index = departments.findIndex(
                                    (d) => s.department._id === d._id,
                                  )
                                  document.getElementsByTagName(
                                    'select',
                                  )[0].selectedIndex = index + 1
                                  setServiceType(s)
                                }}
                                type="button"
                                className="text-[16px] rounded bg-alotrade text-white py-1 px-2"
                                style={{ fontSize: '75%' }}
                              >
                                {t("Tahrirlash")}
                              </button>
                            </td>
                            <td className='text-[16px]'>
                              <button
                                onClick={() => {
                                  setRemove(s)
                                  setModal(true)
                                }}
                                type="button"
                                className="text-[16px] rounded bg-red-400 text-white py-1 px-2"
                                style={{ fontSize: '75%' }}
                              >
                                {t("O'chirish")}
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

      <Modal
        modal={modal}
        setModal={setModal}
        basic={remove && remove.name}
        text={t("xizmat turini o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={''}
        text={t("Barchasi xizmat turlarini o'chirishni tasdiqlaysizmi?")}
        handler={deleteAll}
      />
    </>
  )
}
