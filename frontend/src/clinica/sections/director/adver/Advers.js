import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkAdver } from './checkData'
import { Modal } from './modal/Modal'
import { Sort } from './Sort'
import { useTranslation } from 'react-i18next'

export const Advers = () => {
  //====================================================================
  //====================================================================
  const [modal, setModal] = useState(false)
  const [modal1, setModal1] = useState(false)
  const [remove, setRemove] = useState()

  const clearInputs = useCallback(() => {
    const inputs = document.getElementsByTagName('input')
    for (const input of inputs) {
      input.value = ''
    }
  }, [])
  //====================================================================
  //====================================================================
  const {t} = useTranslation()
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

  const [adver, setAdver] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [advers, setAdvers] = useState()

  const getAdvers = useCallback(async () => {
    try {
      const data = await request(
        `/api/adver/adver/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setAdvers(data)
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
        `/api/adver/adver/register`,
        'POST',
        { ...adver },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("reklamasi yaratildi")}!`,
        description: '',
        status: 'success',
      })
      getAdvers()
      setAdver({
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
  }, [request, auth, notify, getAdvers, adver, clearInputs])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/adver/adver`,
        'PUT',
        { ...adver },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("reklamasi yangilandi")}!`,
        description: '',
        status: 'success',
      })
      getAdvers()
      setAdver({
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
  }, [request, auth, notify, getAdvers, adver, clearInputs])

  const saveHandler = () => {
    if (checkAdver(adver)) {
      return notify(checkAdver(adver))
    }
    if (adver._id) {
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
        `/api/adver/adver`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} ${t("reklamalari o'chirildi")}!`,
        description: '',
        status: 'success',
      })
      getAdvers()
      setModal(false)
      setAdver({
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
  }, [auth, request, remove, notify, getAdvers, clearInputs])

  const deleteAll = useCallback(async () => {
    if (advers && advers.length === 0) {
      return notify({
        title: `Reklamalar mavjud emas`,
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/adver/adver/deleteall`,
        'DELETE',
        { ...adver },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('delete', data)
      notify({
        title: t(`Barcha reklamalar o'chirildi!`),
        description: '',
        status: 'success',
      })
      getAdvers()
      setModal1(false)
      setAdver({
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
  }, [auth, request, notify, getAdvers, clearInputs, adver, advers])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const inputHandler = (e) => {
    setAdver({ ...adver, name: e.target.value })
  }

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [state, setState] = useState({})
  localStorage.setItem('state', state)
  useEffect(() => {
    getAdvers()
    return () => {
      setState({}) // This worked for me
    }
  }, [getAdvers])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <div className="border-0 table-container">
              <div className="table-responsive">
                <table className="table m-0">
                  <thead>
                    <tr>
                      <th className="bg-alotrade text-[14px]">{t("Reklama nomini kiriting")}</th>
                      <th className="bg-alotrade text-[14px]">{t("Saqlash")}</th>
                      <th className="bg-alotrade text-[14px]">{t("O'chirish")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          style={{ minWidth: '70px' }}
                          value={adver.name}
                          onKeyUp={keyPressed}
                          onChange={inputHandler}
                          type="text"
                          className="form-control w-75"
                          id="inputName"
                          placeholder={t("Reklama nomini kiriting")}
                        />
                      </td>
                      <td>
                        {loading ? <button className='btn btn-info' disabled>
                          <span class="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                          :
                          <button
                            onClick={saveHandler}
                            className="btn btn-info py-1 px-4"
                          >
                            {t("Saqlash")}
                          </button>
                        }
                      </td>
                      <td>
                        {loading ? <button className='btn btn-danger' disabled>
                          <span class="spinner-border spinner-border-sm"></span>
                          Loading...
                        </button>
                          :
                          <button
                            onClick={() => setModal1(true)}
                            className="btn btn-danger py-0 px-4 pt-1"
                          >
                            <span className="icon-trash-2"></span>
                          </button>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-0 table-container">
              <div className="border-0 table-container">
                <div className="table-responsive">
                  <table className="table m-0">
                    <thead>
                      <tr>
                        <th className="border-right  text-[12px] bg-alotrade">№</th>
                        <th className="border-right  text-[12px] bg-alotrade">
                          {t("Nomi")}{'  '}
                          <Sort
                            data={advers}
                            setData={setAdvers}
                            property={'name'}
                          />
                        </th>
                        <th className="border-right text-center text-[12px] bg-alotrade">{t("Tahrirlash")}</th>
                        <th className="text-center text-[12px] bg-alotrade">{t("O'chirish")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {advers &&
                        advers.map((d, key) => {
                          return (
                            <tr key={key}>
                              <td className="border-right text-[16px] font-weight-bold">{key + 1}</td>
                              <td className='border-right text-[16px]'>{d.name}</td>
                              <td className='border-right text-center'>
                                <button
                                  onClick={() => setAdver(d)}
                                  id={`btn${key}`}
                                  type="button"
                                  className="text-white font-semibold bg-alotrade rounded py-1 px-2"
                                  style={{ fontSize: "75%" }}
                                >
                                  {t("Tahrirlash")}
                                </button>
                              </td>
                              <td className='border-right text-center'>
                                <button
                                  onClick={() => {
                                    setRemove(d)
                                    setModal(true)
                                  }}
                                  type="button"
                                  className="text-white font-semibold bg-red-400 rounded-lg py-1 px-2"
                                  style={{ fontSize: "75%" }}
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
      </div>

      <Modal
        modal={modal}
        setModal={setModal}
        basic={remove && remove.name}
        text={t("reklamani o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={''}
        text={t("Barcha reklamalarni o'chirishni tasdiqlaysizmi?")}
        handler={deleteAll}
      />
    </>
  )
}
