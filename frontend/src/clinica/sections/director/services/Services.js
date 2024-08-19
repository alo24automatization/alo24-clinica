import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Loader } from '../../../loader/Loader'
import { useToast } from '@chakra-ui/react'
import { useHttp } from '../../../hooks/http.hook'
import { AuthContext } from '../../../context/AuthContext'
import { checkService, checkUploadServices } from './checkData'
import { Modal } from './modal/Modal'
import { TableServices } from './serviceComponents/TableServices'
import { InputService } from './serviceComponents/InputService'
import { ExcelCols } from './serviceComponents/ExcelCols'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const Services = () => {

    const location = useLocation()

    const { t } = useTranslation()

    //====================================================================
    //====================================================================
    // Pagenation
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastService = (currentPage + 1) * countPage
    const indexFirstService = indexLastService - countPage
    const [currentServices, setCurrentServices] = useState([])

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

    const [service, setService] = useState({
        clinica: auth.clinica && auth.clinica._id,
    })

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [services, setServices] = useState([])
    const [imports, setImports] = useState([])
    const [searchStorage, setSearchStrorage] = useState()
    const [changeImports, setChangeImports] = useState([])

    const sections = [
        { name: t('Shifoxona nomi'), value: 'clinica' },
        { name: t("Bo'lim nomi"), value: 'department' },
        { name: t('Xizmat turi'), value: 'servicetype' },
        { name: t('Xizmat nomi'), value: 'name' },
        { name: t('Qisqartma nomi'), value: 'shortname' },
        { name: t('Narxi'), value: 'price' },
        { name: t('Xizmat xonasi'), value: 'serviceroom' },
        { name: t('Shifokor ulushi'), value: 'doctorProcient' },
        { name: t('Kontragent ulushi'), value: 'counterAgentProcient' },
        { name: t("Yo'naltiruvchi shifokor ulushi"), value: 'counterDoctorProcient' },
    ]

    const getServices = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/service/getall`,
                'POST',
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setSearchStrorage(data)
            if (location?.state?.servicetype) {
                setCurrentServices([...data].filter(el => el.servicetype._id === location.state.servicetype).slice(indexFirstService, indexLastService))
                setServices([...data].filter(el => el.servicetype._id === location.state.servicetype))
            } else {
                setCurrentServices(data);
                setServices(data);
            }
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [
        request,
        auth,
        notify,
        setCurrentServices,
        indexLastService,
        indexFirstService,
        setSearchStrorage,
    ])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const [departments, setDepartments] = useState([])

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
    const [servicetypes, setServiceTypes] = useState([])
    const [servicetypesSelect, setServiceTypesSelect] = useState([])

    const getServiceTypes = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/servicetype/getall`,
                'POST',
                { clinica: auth.clinica._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setServiceTypes(data)
            setServiceTypesSelect(data);
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
                `/api/services/service/register`,
                'POST',
                { ...service },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t("xizmati yaratildi")}!`,
                description: '',
                status: 'success',
            })
            getServices()
            setService({
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
    }, [auth, request, getServices, service, notify, clearInputs])

    const updateHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/service/update`,
                'PUT',
                { ...service },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${t("Xizmati yangilandi")}!`,
                description: '',
                status: 'success',
            })
            if (departmentName) {
                setCurrentServices([...data].filter(el => el.department._id === departmentName).slice(indexFirstService, indexLastService));
            } else {
                setCurrentServices([...data].slice(indexFirstService, indexLastService));
            }
            setServices([...data]);
            setSearchStrorage([...data])
            setService({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
            document.getElementsByTagName('select')[0].selectedIndex = 0
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, getServices, service, notify, clearInputs])

    const saveHandler = () => {
        if (checkService(service, t)) {
            return notify(checkService(service, t))
        }
        if (service._id) {
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

    const uploadAllServices = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/service/registerall`,
                'POST',
                [...changeImports],
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            localStorage.setItem('data', data)
            notify({
                title: t(`Barha xizmatlar yuklandi!`),
                description: '',
                status: 'success',
            })
            getServices()
            setService({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
            setModal2(false)
            document.getElementsByTagName('select')[0].selectedIndex = 0
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, getServices, notify, clearInputs, changeImports])

    const checkUploadData = () => {
        if (
            checkUploadServices(
                departments,
                auth.clinica,
                changeImports,
                servicetypes,
            )
        ) {
            return notify(
                checkUploadServices(
                    departments,
                    auth.clinica,
                    changeImports,
                    servicetypes,
                ),
            )
        }
        uploadAllServices()
    }

    const deleteHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/services/service`,
                'DELETE',
                { ...remove },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            if (departmentName) {
                setCurrentServices([...data].filter(el => el.department._id === departmentName).slice(indexFirstService, indexLastService));
            } else {
                setCurrentServices([...data].slice(indexFirstService, indexLastService));
            }
            setServices([...data]);
            setSearchStrorage([...data])
            setService({
                clinica: auth.clinica && auth.clinica._id,
            })
            clearInputs()
            setModal(false)
            notify({
                title: `${data.name} ${t("xizmati o'chirildi")}!`,
                description: '',
                status: 'success',
            })
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, remove, notify, getServices, clearInputs])

    const deleteAll = useCallback(async () => {
        if (services && services.length === 0) {
            return notify({
                title: `Xizmatlar mavjud emas`,
                description: '',
                status: 'warning',
            })
        }
        try {
            const data = await request(
                `/api/services/service/deleteall`,
                'DELETE',
                { ...service },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            localStorage.setItem('delete', data)
            notify({
                title: t(`Barcha xizmatlar o'chirildi!`),
                description: '',
                status: 'success',
            })
            getServices()
            setModal1(false)
            setService({
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
    }, [auth, request, notify, getServices, clearInputs, service, services])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    const inputHandler = (e) => {
        setService({ ...service, [e.target.name]: e.target.value })
    }

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // SEARCH

    const [departmentName, setDepartmentName] = useState('')

    const searchDepartment = (e) => {
        if (e.target.value !== 'none') {
            setDepartmentName(e.target.value)
            setCurrentServices([...searchStorage].filter(el => el.department._id === e.target.value))
            setServices([...searchStorage].filter(el => el.department._id === e.target.value))
            setServiceTypesSelect([...servicetypes].filter(el => el.department._id === e.target.value))
        } else {
            setDepartmentName('')
            setCurrentServices(searchStorage)
            setServices(searchStorage)
            setServiceTypesSelect(servicetypes)
        }
    }

    const searchServiceType = (e) => {
        if (e.target.value !== 'none') {
            setServices([...searchStorage].filter(el => el.servicetype._id === e.target.value))
            setCurrentServices([...searchStorage].filter(el => el.servicetype._id === e.target.value))
        } else {
            setServices(searchStorage)
            setCurrentServices(searchStorage)
        }
    }

    const searchName =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.name.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setServices(searching)
            setCurrentServices(searching.slice(0, countPage))
        }
    //====================================================================
    //====================================================================
    const setPageSize = (e) => {
        if (e.target.value === 'all') {
            setCurrentPage(0)
            setCountPage(services.length)
            setCurrentServices(services)
        } else {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentServices(services.slice(0, e.target.value))
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
            getDepartments()
            getServices()
            getServiceTypes()
        }
    }, [getServices, getDepartments, getServiceTypes, s])
    //====================================================================
    //====================================================================

    return (
        <>
            {loading ? <Loader /> : ''}
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <InputService
                            servicetypes={servicetypes}
                            departments={departments}
                            setService={setService}
                            service={service}
                            keyPressed={keyPressed}
                            inputHandler={inputHandler}
                            saveHandler={saveHandler}
                            loading={loading}
                        />
                        <TableServices
                            servicetypes={servicetypes}
                            servicetypesSelect={servicetypesSelect}
                            searchName={searchName}
                            searchServiceType={searchServiceType}
                            searchDepartment={searchDepartment}
                            setImports={setImports}
                            departments={departments}
                            services={services}
                            setRemove={setRemove}
                            setModal={setModal}
                            setServices={setServices}
                            setService={setService}
                            setCurrentPage={setCurrentPage}
                            countPage={countPage}
                            setCountPage={setCountPage}
                            currentServices={currentServices}
                            setCurrentServices={setCurrentServices}
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
                text={t("xizmatini o'chirishni tasdiqlaysizmi?")}
                handler={deleteHandler}
            />

            <Modal
                modal={modal1}
                setModal={setModal1}
                basic={''}
                text={t("Barcha xizmatlarni o'chirishni tasdiqlaysizmi?")}
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
