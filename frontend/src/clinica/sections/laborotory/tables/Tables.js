import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal } from "./../components/Modal";
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { ExcelCols } from "./uploadExcel/ExcelCols";
import TableServices from "./TableServices";
import RegisterTables from "./RegisterTables";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { ExcelUpload } from './uploadExcel/ExcelUpload';
import { useTranslation } from 'react-i18next';
// import {checkServices} from "./uploadExcel/checkData";

const Tables = () => {
    //====================================================================
    //====================================================================
    // Pagenation
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastService = (currentPage + 1) * countPage
    const indexFirstService = indexLastService - countPage
    const [currentServices, setCurrentServices] = useState([])
    const [searchStorage, setSearchStrorage] = useState()

    //====================================================================
    //====================================================================
    const {t} = useTranslation()
    //====================================================================
    //====================================================================
    const [modal2, setModal2] = useState(false)
    const [visible, setVisible] = useState(false)
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
    const [departmentName, setDepartmentName] = useState('')
    const [serviceName, setServiceName] = useState('')
    //====================================================================
    //====================================================================
    const { request, loading } = useHttp()
    const auth = useContext(AuthContext)

    const [services, setServices] = useState([])
    const [service, setService] = useState()

    const getServices = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/table/services`,
                'POST',
                { clinica: auth.clinica._id, doctor: auth.user },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            setServices(data)
            setSearchStrorage(data)
            setCurrentServices(data)
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
        setCurrentServices,
        indexLastService,
        indexFirstService,
        setSearchStrorage,
    ])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // New table
    const [newTable, setNewTable] = useState({})


    const changeNewTable = (e, col) => {
        setNewTable({ ...newTable, [col]: e.target.value })
    }

    //====================================================================
    //====================================================================
  
    //====================================================================
    //====================================================================
    const [imports, setImports] = useState([])
    const [changeImports, setChangeImports] = useState([])
    const sections = [
        { name: '1-ustun', value: 'col1' },
        { name: "2-ustun", value: 'col2' },
        { name: "3-ustun", value: 'col3' },
        { name: "4-ustun", value: 'col4' },
        { name: "5-ustun", value: 'col5' }
    ]
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const setPageSize = useCallback(
        (e) => {
            setCurrentPage(0)
            setCountPage(e.target.value)
            setCurrentServices(services.slice(0, e.target.value))
        },
        [services],
    )
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Handlers

    const createHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/table/table`,
                'POST',
                {
                    table: {
                        ...newTable,
                        service: service._id,
                        clinica: auth.clinica._id,
                        doctor: auth.user._id
                    }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Jadval muvaffaqqiyatli saqlandi!`),
                description: '',
                status: 'success',
            })
            let tables = [...service.tables]
            tables.push(data)
            setService({ ...service, tables: [...tables] })
            setNewTable({})
            getServices()
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify, newTable])

    const updateHandler = useCallback(async (index) => {
        try {
            const data = await request(
                `/api/doctor/table/update`,
                'POST',
                { tables: service.tables, service: service._id },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Jadval muvaffaqqiyatli saqlandi!`),
                description: '',
                status: 'success',
            })
            localStorage.setItem("data", data)
            getServices()
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify])

    const createAllHandler = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/table/createall`,
                'POST',
                {
                    tables: [...changeImports],
                    clinica: auth.clinica._id,
                    doctor: auth.user._id,
                    service: service._id
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Shablonlar yaratildi!`),
                description: '',
                status: 'success',
            })
            let tables = [...(service.tables)]
            tables.push(...data)
            setService({ ...service, tables: [...tables] })
            setModal2(false)
            getServices()
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, notify, changeImports, service])

    const createColumn = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/table/column`,
                'POST',
                {
                    column: {
                        ...service.column,
                        service: service._id,
                        clinica: auth.clinica._id,
                        doctor: auth.user._id
                    }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Ustun nomlari saqlandi!`),
                description: '',
                status: 'success',
            })
            setService({ ...service, column: data })
            getServices()
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify])

    const deleteTable = useCallback(async () => {
        try {
            const data = await request(
                `/api/doctor/table/delete`,
                'POST',
                {
                    service: { ...service }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Jadval muvaffaqqiyatli o'chirildi!`),
                description: '',
                status: 'success',
            })
            setService(data)
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify])

    const deleteHandler = useCallback(async (index) => {
        try {
            const data = await request(
                `/api/doctor/table/tabledelete`,
                'POST',
                {
                    table: { ...service.tables[index] }
                },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: t(`Jadval muvaffaqqiyatli o'chirildi!`),
                description: '',
                status: 'success',
            })
            localStorage.setItem('data', data)
            let tables = [...service.tables]
            tables.splice(index, 1)
            setService({ ...service, tables: [...tables] })
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify])
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // SEARCH

    const searchService = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.name.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setServices(searching)
            setCurrentServices(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )

    const searchServiceType = useCallback(
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.servicetype.name.toLowerCase().includes(e.target.value.toLowerCase()),
            )
            setServices(searching)
            setCurrentServices(searching.slice(0, countPage))
        },
        [searchStorage, countPage],
    )

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    // Service place visible

    const servicePlace = (e, index) => {
        let servicess = [...currentServices]
        servicess[index].place = e.target.value
        setCurrentServices(servicess)
    }

    const serviceVisible = (e, index) => {
        // let servicess = [...currentServices]
        // servicess[index].visible = e.target.checked
        setCurrentServices([...currentServices].map((service, ind) => {
            if (ind === index) {
                service.visible = e.target.checked
            }
            return service
        }))
    }
    const updateService = async (index) => {
        try {
            const data = await request(
                `/api/doctor/table/serviceupdate`,
                'POST',
                { service: { ...currentServices[index]  }, doctor: auth.user },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} ${t('xizmati yangilandi!')}`,
                description: '',
                status: 'success',
            })
            // let servicess = [...services]
            // servicess[index] = data
            // setServices(servicess)
            // getServices()
            setServices(data)
            setSearchStrorage(data)
            if (departmentName) {
                if (serviceName) {
                    setCurrentServices([...data].filter(service => service.servicetype._id === departmentName).filter(s => s.name.toLowerCase().includes(serviceName.toLowerCase())))
                } else {
                    setCurrentServices([...data].filter(service => service.servicetype._id === departmentName))
                }
            } else {
                setCurrentServices(data)
            }
        } catch (error) {
            notify({
                title: t(error),
                description: '',
                status: 'error',
            })
        }
    }

    //====================================================================
    //====================================================================

    const [serviceTypes, setServiceTypes] = useState([]);

    const getServiceTypes = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/labaratory/servicetype/get`,
                    "POST",
                    {
                        clinica: auth.clinica._id,
                    },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setServiceTypes([...data].map((el => ({
                    value: el._id,
                    label: el.name,
                }))))
            } catch (error) {
                notify({
                    title: t(error),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    //====================================================================
    //====================================================================

    const searchName = (e) => {
        const newS = [...searchStorage].filter(s => s.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setCurrentServices(newS)
        setServiceName(e.target.value.toLowerCase())
    }

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState()
    useEffect(() => {
        if (!s) {
            setS(1)
            getServices()
            getServiceTypes()
        }
    }, [getServices, getServiceTypes, s])
    //====================================================================
    //====================================================================

    return (
        <div className="container">
            <div className={visible ? 'd-block mt-4' : 'd-none'}>
                <div className='w-full flex justify-between items-center mb-2 py-2'>
                    <button
                        onClick={() => setVisible(false)}
                        className={visible ? "w-[150px] rounded bg-orange-400 hover:bg-teal-900  text-white font-bold py-1" : 'd-none'}>
                        {t("Oynani yopish")}
                    </button>
                    <div className='font-bold text-[18px]'>
                        {service?.name || ""}
                    </div>
                    <div className='flex items-center gap-2'>
                        <ExcelUpload setData={setImports} setModal={setModal2} loading={loading} />
                        <button className='py-2 px-4 rounded bg-alotrade text-white font-semibold' onClick={() => {
                            createColumn()
                            updateHandler()
                        }} >
                            <FontAwesomeIcon icon={faFloppyDisk} /> {t("Saqlash")}
                        </button>
                    </div>
                </div>
                <RegisterTables
                    setModal2={setModal2}
                    loading={loading}
                    setImports={setImports}
                    newTable={newTable}
                    deleteHandler={deleteHandler}
                    createHandler={createHandler}
                    createColumn={createColumn}
                    service={service}
                    setService={setService}
                    deleteTable={deleteTable}
                    updateHandler={updateHandler}
                    changeNewTable={changeNewTable}
                />
                <div className='w-full flex justify-end items-center gap-4'>
                    <button className='py-2 px-4 text-white font-semibold rounded bg-alotrade' onClick={createHandler} >
                        {t("+ Qo'shish")}
                    </button>
                </div>
            </div>

            <div className='mt-4 py-4'>
                <TableServices
                    serviceTypes={serviceTypes}
                    setVisible={setVisible}
                    searchServiceType={searchServiceType}
                    updateService={updateService}
                    serviceVisible={serviceVisible}
                    servicePlace={servicePlace}
                    setService={setService}
                    services={services}
                    currentServices={currentServices}
                    setCurrentServices={setCurrentServices}
                    countPage={countPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setPageSize={setPageSize}
                    searchService={searchService}
                    searchName={searchName}
                    setDepartmentName={setDepartmentName}
                />
            </div>


            <Modal
                modal={modal2}
                setModal={setModal2}
                handler={createAllHandler}
                text={
                    <ExcelCols
                        createdData={changeImports}
                        setData={setChangeImports}
                        data={imports}
                        sections={sections}
                    />
                }
            />

            {/*<Modal*/}
            {/*    modal={modal}*/}
            {/*    setModal={setModal}*/}
            {/*    handler={deleteHandler}*/}
            {/*    text=" shablonini ochirishni tasdiqlaysizmi?"*/}
            {/*    basic={remove && remove.name}*/}
            {/*/>*/}
        </div>
    );
};

export default Tables;
