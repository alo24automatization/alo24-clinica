import { useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useHttp } from "../hooks/http.hook"
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { Modal } from "../sections/director/users/modal/Modal"

const animatedComponents = makeAnimated()


const TransferLabTables = () => {

    const { request, loading } = useHttp()


    const [modal, setModal] = useState(false)

    //=====================================================
    //=====================================================

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

    //=====================================================
    //=====================================================

    const [clinicaList, setClinicaList] = useState([])
    const [filialList, setFilialList] = useState([])


    const getMainClinicas = useCallback(async () => {
        try {
            const data = await request('/api/admin/clinica_list/get', 'GET', null)
            const filtered = [...data].map(el => ({
                label: el.name,
                value: el._id
            }))
            setClinicaList(filtered)
            setFilialList(filtered)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

    //=====================================================
    //=====================================================


    const [clinica, setClinica] = useState()
    const [filialClinica, setFilialClinica] = useState()

    const [selectedClinica, setSelectedClinica] = useState({})
    const [selectedFilial, setSelectedFilial] = useState({})

    const handleTransfer = async () => {
        try {
            const data = await request(
                `/api/doctor/table/filialtransfer`,
                "POST",
                {
                    clinica: clinica,
                    filialClinica: filialClinica
                }
            );
            notify({
                title: data.message,
                description: '',
                status: 'success',
            })
            setSelectedClinica({})
            setSelectedFilial({})
            setClinica()
            setFilialClinica()
            setModal(false)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }


    const checkData = () => {
        if (!clinica) {
            return notify({
                title: 'Bosh klinika tanlanmagan!',
                description: '',
                status: 'error',
            })
        }
        if (!filialClinica) {
            return notify({
                title: 'Filial tanlanmagan!',
                description: '',
                status: 'error',
            })
        }
        setModal(true)
    }

    //=====================================================
    //=====================================================

    useEffect(() => {
        getMainClinicas()
    }, [getMainClinicas])

    //=====================================================
    //=====================================================
  

    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row gutters">
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title">Filiallarni bog'lash</div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row gutters">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="fullName">Bosh shifoxona</label>
                                                    <Select
                                                        value={selectedClinica}
                                                        onChange={(e) => {
                                                            setSelectedClinica(e)
                                                            setClinica(e.value)
                                                        }}
                                                        components={animatedComponents}
                                                        options={clinicaList}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            padding: 0,
                                                            height: 0,
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label htmlFor="inputEmail">Filiallar</label>
                                                    <Select
                                                        value={selectedFilial}
                                                        onChange={(e) => {
                                                            setSelectedFilial(e)
                                                            setFilialClinica(e.value)
                                                        }}
                                                        components={animatedComponents}
                                                        options={filialList}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            borderRadius: 0,
                                                            padding: 0,
                                                            height: 0,
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="text-right">
                                                    {loading ? (
                                                        <button className="bg-alotrade rounded text-white py-2 px-3" disabled>
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                            Loading...
                                                        </button>
                                                    ) : (
                                                        <button onClick={checkData} className="bg-alotrade rounded text-white py-2 px-3">
                                                            Saqlash
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                modal={modal}
                setModal={setModal}
                basic={`${selectedClinica?.label} dan ${selectedFilial?.label} ga`}
                text={"shablonlarni ko'chirishni tasdiqlaysizmi?"}
                handler={handleTransfer}
            />
        </div>
    )
}

export default TransferLabTables