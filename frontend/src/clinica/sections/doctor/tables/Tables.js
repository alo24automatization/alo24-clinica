import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Modal } from "./../components/Modal";
import { useToast } from "@chakra-ui/react";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { ExcelCols } from "./uploadExcel/ExcelCols";
import TableServices from "./TableServices";
import RegisterTables from "./RegisterTables";
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
            setCurrentServices(data.slice(indexFirstService, indexLastService))
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
        { name: "1-ustun", value: 'col1' },
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
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, service, notify, newTable])

    const updateHandler = useCallback(async (index) => {
        try {
            const data = await request(
                `/api/doctor/table/table`,
                'POST',
                { table: { ...service.tables[index] } },
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
        } catch (error) {
            notify({
                title: error,
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
        } catch (error) {
            notify({
                title: error,
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
                title: t(`Ustun nomlari saqlandi.`),
                description: '',
                status: 'success',
            })
            setService({ ...service, column: data })
        } catch (error) {
            notify({
                title: error,
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
                title: t(`Jadval muvaffaqqiyatli o'chirildi.`),
                description: '',
                status: 'success',
            })
            setService(data)
        } catch (error) {
            notify({
                title: error,
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
                title: t(`Jadval muvaffaqqiyatli o'chirildi.`),
                description: '',
                status: 'success',
            })
            localStorage.setItem('data', data)
            let tables = [...service.tables]
            tables.splice(index, 1)
            setService({ ...service, tables: [...tables] })
        } catch (error) {
            notify({
                title: error,
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
        let servicess = [...services]
        servicess[index].place = e.target.value
        setServices(servicess)
    }

    const serviceVisible = (e, index) => {
        let servicess = [...services]
        servicess[index].visible = e.target.checked
        setServices(servicess)
    }

    const updateService = useCallback(async (index) => {
        try {
            const data = await request(
                `/api/doctor/table/serviceupdate`,
                'POST',
                { service: { ...services[index] } },
                {
                    Authorization: `Bearer ${auth.token}`,
                },
            )
            notify({
                title: `${data.name} xizmati yangilandi!`,
                description: '',
                status: 'success',
            })
            let servicess = [...services]
            servicess[index] = data
            setServices(servicess)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [auth, request, setServices, notify, services])

    //====================================================================
    //====================================================================
    // useEffect

    const [s, setS] = useState()
    useEffect(() => {
        if (!s) {
            setS(1)
            getServices()
        }
    }, [getServices, s])
    //====================================================================
    //====================================================================

    return (
        <div className="container">
            <div className={visible ? 'd-block mt-4' : 'd-none'}>
                <button
                    onClick={() => setVisible(false)}
                    className={visible ? "w-full bg-primary hover:bg-teal-900  text-white font-bold py-1" : 'd-none'}>
                    {t("Oynani yopish")}
                </button>
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
            </div>

            <div className='mt-4'>
                <TableServices
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
