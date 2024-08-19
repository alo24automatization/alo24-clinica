import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkRoom, checkUploadRooms } from './checkData'
import { Modal } from './modal/Modal'
import { TableRooms } from './roomComponents/TableRooms'
import { InputRoom } from './roomComponents/InputRoom'
import { ExcelCols } from './roomComponents/ExcelCols'
import { useTranslation } from 'react-i18next'

export const Rooms = () => {

  const {t} = useTranslation()

  //====================================================================
  //====================================================================
  // Pagenation
  const [currentPage, setCurrentPage] = useState(0)
  const [countPage, setCountPage] = useState(10)

  const indexLastRoom = (currentPage + 1) * countPage
  const indexFirstRoom = indexLastRoom - countPage
  const [currentRooms, setCurrentRooms] = useState([])

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

  const [room, setRoom] = useState({
    clinica: auth.clinica && auth.clinica._id,
  })

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [rooms, setRooms] = useState([])
  const [imports, setImports] = useState([])
  const [searchStorage, setSearchStrorage] = useState()
  const [changeImports, setChangeImports] = useState([])

  const sections = [
    { name: t('Shifoxona'), value: 'clinica' },
    { name: t('Xona turi'), value: 'type' },
    { name: t('Xona raqami'), value: 'number' },
    { name: t("O'rin raqami"), value: 'place' },
    { name: t('Narxi'), value: 'price' },
  ]

  const getRooms = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/room/getall`,
        'POST',
        { clinica: auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      setRooms(data)
      setSearchStrorage(data)
      setCurrentRooms(data.slice(indexFirstRoom, indexLastRoom))
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
    setCurrentRooms,
    indexLastRoom,
    indexFirstRoom,
    setSearchStrorage,
  ])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const createHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/room/register`,
        'POST',
        { ...room },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.number} xona ${data.place} o'rin yaratildi!`,
        description: '',
        status: 'success',
      })
      getRooms()
      setRoom({
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
  }, [auth, request, getRooms, room, notify, clearInputs])

  const updateHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/room/update`,
        'PUT',
        { ...room },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.number} xona ${data.place} o'rin yangilandi!`,
        description: '',
        status: 'success',
      })
      getRooms()
      setRoom({
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
  }, [auth, request, getRooms, room, notify, clearInputs])

  const saveHandler = () => {
    if (checkRoom(room)) {
      return notify(checkRoom(room))
    }
    if (room._id) {
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


  const uploadAllRooms = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/room/registerall`,
        'POST',
        [...changeImports],
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('data', data)
      notify({
        title: `Barha xonalar yuklandi!`,
        description: '',
        status: 'success',
      })
      getRooms()
      setRoom({
        clinica: auth.clinica && auth.clinica._id,
      })
      clearInputs()
      setModal2(false)
      document.getElementsByTagName('select')[0].selectedIndex = 0
    } catch (error) {
      notify({
        title: error,
        description: '',
        status: 'error',
      })
    }
  }, [auth, request, getRooms, notify, clearInputs, changeImports])

  const checkUploadData = () => {
    if (checkUploadRooms(auth.clinica, changeImports)) {
      return notify(checkUploadRooms(auth.clinica, changeImports))
    }
    uploadAllRooms()
  }

  const deleteHandler = useCallback(async () => {
    try {
      const data = await request(
        `/api/services/room`,
        'DELETE',
        { ...remove },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      notify({
        title: `${data.name} xonasi o'chirildi!`,
        description: '',
        status: 'success',
      })
      getRooms()
      setRoom({
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
  }, [auth, request, remove, notify, getRooms, clearInputs])

  const deleteAll = useCallback(async () => {
    if (rooms && rooms.length === 0) {
      return notify({
        title: `Xonalar mavjud emas`,
        description: '',
        status: 'warning',
      })
    }
    try {
      const data = await request(
        `/api/services/room/deleteall`,
        'DELETE',
        { ...room },
        {
          Authorization: `Bearer ${auth.token}`,
        },
      )
      localStorage.setItem('delete', data)
      notify({
        title: `Barcha xonalar o'chirildi!`,
        description: '',
        status: 'success',
      })
      getRooms()
      setModal1(false)
      setRoom({
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
  }, [auth, request, notify, getRooms, clearInputs, room, rooms])
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================

  const inputHandler = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value })
  }

  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  // SEARCH

  const searchNumber = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.number.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setRooms(searching)
      setCurrentRooms(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )

  const searchType = useCallback(
    (e) => {
      const searching = searchStorage.filter((item) =>
        item.type.toLowerCase().includes(e.target.value.toLowerCase()),
      )
      setRooms(searching)
      setCurrentRooms(searching.slice(0, countPage))
    },
    [searchStorage, countPage],
  )
  //====================================================================
  //====================================================================
  const setPageSize = (e) => {
    if (e.target.value === 'all') {
      setCurrentPage(0)
      setCountPage(rooms.length)
      setCurrentRooms(rooms)
    } else {
      setCurrentPage(0)
      setCountPage(e.target.value)
      setCurrentRooms(rooms.slice(0, countPage))
    }
  }
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [s, setS] = useState()
  useEffect(() => {
    if (!s) {
      setS(1)
      getRooms()
    }
  }, [getRooms, s])
  //====================================================================
  //====================================================================

  return (
    <>
      {loading ? <Loader /> : ''}
      <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
        <div className="row gutters">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
            <InputRoom
              room={room}
              keyPressed={keyPressed}
              inputHandler={inputHandler}
              saveHandler={saveHandler}
              loading={loading}
            />
            <TableRooms
              searchType={searchType}
              searchNumber={searchNumber}
              setImports={setImports}
              rooms={rooms}
              setRemove={setRemove}
              setRooms={setRooms}
              setRoom={setRoom}
              setCurrentPage={setCurrentPage}
              countPage={countPage}
              setCountPage={setCountPage}
              currentRooms={currentRooms}
              setCurrentRooms={setCurrentRooms}
              currentPage={currentPage}
              setPageSize={setPageSize}
              setModal={setModal}
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
        basic={remove && remove.type}
        text={t("xonasini o'chirishni tasdiqlaysizmi?")}
        handler={deleteHandler}
      />

      <Modal
        modal={modal1}
        setModal={setModal1}
        basic={t('Barcha')}
        text={t("xonalarni o'chirishni tasdiqlaysizmi?")}
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
