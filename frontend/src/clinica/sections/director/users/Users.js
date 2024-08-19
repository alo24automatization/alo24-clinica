import { CloseButton, FormControl, FormLabel, ModalBody, ModalContent, ModalHeader, ModalOverlay, Switch, useToast } from '@chakra-ui/react'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useHttp } from '../../../hooks/http.hook'
import { Pagination } from '../components/Pagination'
import { Sort } from './components/Sort'
import { checkUserData } from './checkData/checkData'
import { Loader } from '../../../loader/Loader'
import { RegistorUser } from './RegistorUser'
import { Modal } from './modal/Modal'
import { Modal as ChakraModal } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { IoSettingsOutline } from "react-icons/io5";
export const Users = () => {
  //====================================================================
  //====================================================================
  const [modal, setModal] = useState(false)
  const [remove, setRemove] = useState()
  //====================================================================
  //====================================================================
  const { t } = useTranslation()
  //====================================================================
  //====================================================================
  // RegisterPage
  const [visible, setVisible] = useState(false)

  const changeVisible = () => setVisible(!visible)

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastUser = (currentPage + 1) * countPage
  const indexFirstUser = indexLastUser - countPage
  const [currentUsers, setCurrentUsers] = useState([])

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // TOAST
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
  // AUTH
  const [load, setLoad] = useState(false)

  const { request, loading } = useHttp()

  const auth = useContext(AuthContext)

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // DEPARTMENTS
  const [departments, setDepartments] = useState()

  const getDepartments = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/department/getall`,
        'POST',
        { clinica: auth?.clinica?._id },
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
  const [blankaImage, setBlankaImage] = useState(null);
  const cropperRef = useRef(null);
  const cmToPx = (cm) => Math.round(cm * 96 / 2.54);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBlankaImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCrop = async () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      width: cmToPx(30),
      height: cmToPx(3),
    });
    croppedCanvas.toBlob(async (blob) => {
      const data = new FormData();
      data.append("file", blob, "cropped_image.jpg");
      setLoad(true);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const result = await res.json();
        setUser({ ...user, blanka: result.filename });
        notify({
          status: "success",
          description: "",
          title: "Surat muvaffaqqiyatli yuklandi",
        });
      } catch (error) {
        notify({
          status: "error",
          description: "Fayl yuklash muvaffaqqiyatsiz tugadi",
          title: "Xato",
        });
      } finally {
        setLoad(false);
        setBlankaImage(null)
      }
    });
  };
  const removeBlanka = async (filename) => {
    try {
      const data = await request(`/api/upload/del`, "POST", { filename });
      setUser({ ...user, blanka: null });
      document.getElementById("default-btn").value = null;
      notify({
        status: "success",
        description: "",
        title: data.accept,
      });
    } catch (error) {
      notify({
        status: "error",
        description: "",
        title: error,
      });
    }
  };
  //====================================================================
  //====================================================================
  //SECTIONS
  const [user, setUser] = useState({
    type: null,
    clinica: auth?.clinica?._id,
  })
  const [sections, setSections] = useState([])

  const getSections = useCallback(async () => {
    try {
      const data = await request('/api/sections', 'GET', null)
      setSections(data)
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, notify])

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // BASE_URL
  const [baseUrl, setBaseUrl] = useState()

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request('/api/baseurl', 'GET', null)
      setBaseUrl(data.baseUrl)
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, notify])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // IMAGE
  const handleImage = async (e) => {
    if (user.image) {
      return notify({
        title: 'Diqqat! Surat avval yuklangan',
        description:
          "Suratni qayta yulash uchun suratni ustiga bir marotaba bosib uni o'chiring!",
        status: 'error',
      })
    }
    const files = e.target.files[0]
    const data = new FormData()
    data.append('file', files)
    setLoad(true)
    const res = await fetch('/api/upload', { method: 'POST', body: data })
    const file = await res.json()
    setUser({ ...user, image: file.filename })
    setLoad(false)
    notify({
      status: 'success',
      description: '',
      title: 'Surat muvaffaqqiyatli yuklandi',
    })
  }

  const removeImage = async (filename) => {
    try {
      const data = await request(`/api/upload/del`, 'POST', { filename })
      setUser({ ...user, image: null })
      document.getElementById('default-btn').value = null
      notify({
        status: 'success',
        description: '',
        title: data.accept,
      })
    } catch (error) {
      notify({
        status: 'error',
        description: '',
        title: t(`${error}`),
      })
    }
  }
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [users, setUsers] = useState([])
  const [searchStorage, setSearchStrorage] = useState()
  const [counteragents, setCounteragents] = useState([])

  const getUsers = useCallback(async () => {
    try {
      const data = await request(
        `/api/user/getall`,
        'POST',
        { clinica: auth?.clinica?._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setUsers(data)
      setCounteragents(data)
      setSearchStrorage(data)
      setCurrentUsers(data.slice(indexFirstUser, indexLastUser))
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [request, auth, notify, setSearchStrorage, indexFirstUser, indexLastUser])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const createHandler = async () => {
    if (checkUserData(user, t)) {
      return notify(checkUserData(user, t))
    }
    try {
      const data = await request(
        '/api/user/register',
        'POST',
        {
          ...user,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )

      localStorage.setItem(
        'user',
        JSON.stringify({
          user: data,
        }),
      )
      notify({
        title: data.message,
        description: '',
        status: 'success',
      })
      getUsers()
      setUser({
        type: null,
        password: null,
        clinica: auth.clinica._id,
      })
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/user/remove`,
        'POST',
        { userId: remove._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: data.message,
        description: '',
        status: 'success',
      })
      getUsers()
      setModal(false)
      setRemove()
      setUser({
        type: null,
        clinica: auth.clinica._id,
      })
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, remove, notify, getUsers])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // ONENTER
  const keyPressed = (e) => {
    if (e.key === 'Enter') {
      return createHandler()
    }
  }
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchName = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.lastname.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setUsers(searching)
      setCurrentUsers(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // Sort

  const sortType = useCallback(
    (e) => {
      if (e.target.value === 'all') {
        setUsers(searchStorage)
        setCurrentUsers(searchStorage.slice(0, countPage))
      } else if (e.target.value === 'Director') {
        setUsers([auth.user])
        setCurrentUsers([auth.user])
      } else {
        const searching = searchStorage.filter((item) =>
          item.type.includes(e.target.value),
        )
        setUsers(searching)
        setCurrentUsers(searching.slice(0, countPage))
      }
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
      setCurrentUsers(users.slice(0, countPage))
    },
    [countPage, users],
  )
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getSections()
      getUsers()
      getBaseUrl()
      getDepartments()
    }
  }, [getSections, getUsers, getBaseUrl, getDepartments, s])
  //====================================================================
  //====================================================================
  const [doctorSettingModalVisible, setDoctorSettingModalVisible] = useState(false)
  const [isClickedDoctor, setIsClickedDoctor] = useState(null)
  const toogleDoctorSettingModal = () => {
    setDoctorSettingModalVisible(!doctorSettingModalVisible)
  }
  const handleDoctorSettingClick = (user) => {
    toogleDoctorSettingModal()
    setIsClickedDoctor(user)
  }
  const handleChangeDoctorSetting = (value, key) => {
    if (key === "register_client") {
      changeAccessCreateClient(value)
    }
  }
  const changeAccessCreateClient = async (value) => {
    try {
      const response = await request(`/api/user/access/${isClickedDoctor?._id}`, "PUT", { accessCreateClient: value })
      notify({
        title: t(`${response?.message}`),
        description: '',
        status: 'success',
      })
      setIsClickedDoctor(null)
      getUsers()
      toogleDoctorSettingModal()
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: '',
        status: 'error',
      })
    }
  }
  if (loading) {
    return <Loader />
  }
  return (
    <div className="content-wrapper px-lg-5 px-3">
      <div className="row">
        <div className="col-12 text-end">
          <button
            className={`bg-alotrade border-0 btn text-white mb-2 w-100 ${visible ? 'd-none' : ''}`}
            onClick={changeVisible}
          >
            {t("Registratsiya")}
          </button>
          <button
            className={`bg-alotrade border-0 btn text-white mb-2 w-100 ${visible ? '' : 'd-none'}`}
            onClick={changeVisible}
          >
            {t("Registratsiya")}
          </button>
        </div>
      </div>
      <ChakraModal closeOnEsc isOpen={doctorSettingModalVisible} onClose={toogleDoctorSettingModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className='flex items-center justify-between'>
            Shifokor sozlamalari
            <CloseButton onClick={toogleDoctorSettingModal} />
          </ModalHeader>
          <ModalBody>
            <FormControl onChange={({ target }) => handleChangeDoctorSetting(target.checked, "register_client")} className='flex items-center gap-x-2'>
              <FormLabel>
                Mijoz qabul qila oladimi?
              </FormLabel>
              <Switch isChecked={isClickedDoctor?.accessCreateClient} />
            </FormControl>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
      <div className={` ${visible ? '' : 'd-none'}`}>
        <RegistorUser
          auth={auth}
          blankaImage={blankaImage}
          setBlankaImage={setBlankaImage}
          cropperRef={cropperRef}
          cmToPx={cmToPx}
          handleImageChange={handleImageChange}
          handleCrop={handleCrop}
          removeBlanka={removeBlanka}
          counteragents={counteragents}
          removeImage={removeImage}
          handleImage={handleImage}
          load={load}
          user={user}
          baseUrl={baseUrl}
          changeHandler={changeHandler}
          keyPressed={keyPressed}
          setUser={setUser}
          sections={sections}
          departments={departments}
          createHandler={createHandler}
          loading={loading}
        />
      </div>

      <div className="row gutters">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
          <div className="border-0 table-container">
            <div className="border-0 table-container">
              <div className="table-responsive">
                <table className="table m-0">
                  <thead className="bg-white">
                    <tr>
                      <th>
                        <select
                          className="form-control form-control-sm selectpicker"
                          placeholder={t("Bo'limni tanlang")}
                          onChange={setPageSize}
                          style={{ minWidth: '50px' }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </th>
                      <th>
                        <select
                          defaultValue="none"
                          className="form-control form-control-sm selectpicker"
                          placeholder={t("Bo'limni tanlang")}
                          onChange={sortType}
                          style={{ minWidth: '50px' }}
                        >
                          <option value="all">{t("Barchasi foydalanuvchilar")}</option>
                          {sections.map((section, index) => {
                            return (
                              <option value={section.type} key={index}>
                                {section.value}
                              </option>
                            )
                          })}
                        </select>
                      </th>
                      <th></th>
                      <th>
                        <input
                          onChange={searchName}
                          style={{ maxWidth: '100px', minWidth: '100px' }}
                          type="search"
                          className="w-100 form-control form-control-sm selectpicker"
                          placeholder={t("F.I.Sh")}
                        />
                      </th>
                      <th colSpan={2}>
                        <Pagination
                          setCurrentDatas={setCurrentUsers}
                          datas={users}
                          setCurrentPage={setCurrentPage}
                          countPage={countPage}
                          totalDatas={users.length}
                        />
                      </th>
                    </tr>
                  </thead>
                  <thead>
                    <tr>
                      <th className="border-right bg-alotrade text-[16px]">№</th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Xizmat turi")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Ixtisosligi")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("F.I.Sh")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px]">
                        {t("Tel")}
                      </th>
                      <th className="border-right bg-alotrade text-[16px] text-center">{t("Tahrirlash")}</th>
                      <th className="text-center bg-alotrade text-[16px]">{t("O'chirish")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-right text-[16px] font-weight-bold">
                            {key + 1}
                          </td>
                          <td className="border-right text-[16px]">
                            {sections.map((section) => {
                              if (section.type === user.type) {
                                return section.value
                              }
                              return ''
                            })}
                          </td>
                          <td className="border-right text-[16px]">
                            {user.specialty && user.specialty.name}
                          </td>
                          <td className="border-right text-[16px]">
                            {user.lastname +
                              ' ' +
                              user.firstname +
                              ' ' +
                              (user.fathername && user.fathername)}
                          </td>
                          <td className="border-right text-[16px]">
                            {'+998' + user.phone}
                          </td>
                          <td className="border-right text-[16px] text-center">
                            {loading ? (
                              <button className="btn btn-success" disabled>
                                <span class="spinner-border spinner-border-sm"></span>
                                Loading...
                              </button>
                            ) : (
                              <div className='flex items-center justify-around gap-x-2'>
                                {user?.type === "Doctor" ?
                                  <button onClick={() => handleDoctorSettingClick(user)} type='button' role='button'
                                    className="bg-gray-400 rounded text-white font-semibold py-1 px-2"
                                    style={{ fontSize: '100%' }}
                                  >
                                    <IoSettingsOutline />
                                  </button>
                                  : null
                                }
                                <button
                                  onClick={() => {
                                    if (user.type === 'Director') {
                                      setUser({ ...user, clinica: user.clinica._id })
                                    } else {
                                      setUser({ ...user })
                                    }
                                    setVisible(true)
                                  }}
                                  type="button"
                                  className="bg-alotrade rounded text-white font-semibold py-1 px-2"
                                  style={{ fontSize: '75%' }}
                                >
                                  {t("Tahrirlash")}
                                </button>
                              </div>
                            )}
                          </td>
                          <td className="text-center text-[16px]">
                            {loading ? (
                              <button className="btn btn-secondary" disabled>
                                <span class="spinner-border spinner-border-sm"></span>
                                Loading...
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setRemove(user)
                                  setModal(true)
                                }}
                                type="button"
                                className="bg-red-400 rounded text-white font-semibold py-1 px-2"
                                style={{ fontSize: '75%' }}
                              >
                                {t("O'chirish")}
                              </button>
                            )}
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
        basic={remove && remove.lastname + ' ' + remove.firstname}
        text={t("ismli foydalanuvchini o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />
    </div>
  )
}
