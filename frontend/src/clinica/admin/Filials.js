import { useToast } from '@chakra-ui/react'
import { faPenAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import RegisterFilial from './components/RegisterFilial'

const Filials = () => {

    //====================================================================
    //====================================================================

    const [modal, setModal] = useState(false)

    //====================================================================
    //====================================================================
    //AUTH
    const [load, setLoad] = useState(false)

    const { request, loading } = useHttp()

    //====================================================================
    //====================================================================
    // RegisterPage
    const [visible, setVisible] = useState(false)

    const changeVisible = () => setVisible(!visible)

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

    const [mainClinica, setMainClinica] = useState(null);
    const [mainClinicaValue, setMainClinicaValue] = useState(null)

    const [selectedFilial, setSelectedFilial] = useState([]);
    const [filialValues, setFilialValues] = useState([])

    const changeMainClinica = (e) => {
        setMainClinica(e)
        setMainClinicaValue(e.value);
    }

    const changeFilial = (e) => {
        setSelectedFilial(e)
        setFilialValues([...e].map(el => el.value))
    }

    //====================================================================
    //====================================================================

    const [clinicas, setClinicas] = useState([])

    const getAllClinica = useCallback(async () => {
        try {
            const data = await request('/api/clinica/getall', 'GET', null)
            setClinicas([...data].map(el => ({
                value: el._id,
                label: el.name
            })))
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

    //====================================================================
    //====================================================================

    const [mainclinicas, setMainclinicas] = useState([])

    const getMainClinicas = useCallback(async () => {
        try {
            const data = await request('/api/clinica/mainclinica/get', 'GET', null)
            setMainclinicas(data)
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }, [request, notify])

    //====================================================================
    //====================================================================

    const checkData = () => {
        if (!mainClinicaValue) {
            return notify({
                title: "Bosh shifoxona kiritilmagan!",
                description: '',
                status: 'error',
            })
        }
        if (!filialValues.length) {
            return notify({
                title: "Bosh shifoxona kiritilmagan!",
                description: '',
                status: 'error',
            })
        }
        return createHandler()
    }

    const createHandler = async () => {
        try {
            const data = await request(
                `/api/clinica/filials/create`,
                "POST",
                {
                    mainclinica: mainClinicaValue,
                    filials: filialValues
                }
            );
            notify({
                title: data.message,
                description: '',
                status: 'success',
            })
            getMainClinicas()
            setSelectedFilial([])
            setFilialValues([])
            setMainClinica(null);
            setMainClinicaValue(null);
        } catch (error) {
            notify({
                title: error,
                description: '',
                status: 'error',
            })
        }
    }

    //====================================================================
    //====================================================================

    const [t, setT] = useState()
    useEffect(() => {
        if (!t) {
            setT(1)
            getMainClinicas()
            getAllClinica()
        }
    }, [getMainClinicas, getAllClinica, t])

    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================

    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className='row'>
                            <div className="col-12 text-end">
                                <button
                                    className={`bg-alotrade border-0 btn text-white mb-2 w-100 ${visible ? 'd-none' : ''}`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                                <button
                                    className={`bg-alotrade border-0 btn text-white mb-2 w-100 ${visible ? '' : 'd-none'}`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? '' : 'd-none'}`}>
                            <RegisterFilial
                                changeFilial={changeFilial}
                                changeMainClinica={changeMainClinica}
                                mainClinica={mainClinica}
                                selectedFilial={selectedFilial}
                                clinicas={clinicas}
                                loading={loading}
                                checkData={checkData}
                            />
                        </div>
                        <div className="border-0 table-container">
                            <div className="border-0 table-container">
                                <div className="table-responsive">
                                    <table className="table m-0">
                                        <thead>
                                            <tr>
                                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">
                                                    Bosh shifoxona
                                                </th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>Filiallar soni</th>
                                                <th className='border py-1 bg-alotrade text-[16px]'>Filiallar</th>
                                                <th className="border py-1 bg-alotrade text-[16px]">Tahrirlash</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mainclinicas.map((item, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td
                                                            className="border py-1 font-weight-bold text-right"
                                                            style={{ maxWidth: '30px !important' }}
                                                        >
                                                            {key + 1}
                                                        </td>
                                                        <td className="border py-1 font-weight-bold text-[16px]">
                                                            {item?.name}
                                                        </td>
                                                        <td className="border py-1 text-right text-[16px]">
                                                            {item?.filials.length}
                                                        </td>
                                                        <td className="border py-1 text-right text-[16px]">
                                                            {item.filials && [...item.filials].map(el => <b>{el.name}; </b>)}
                                                        </td>
                                                        <td className="border py-1 text-center text-[16px]">
                                                            <button
                                                                className="btn btn-success py-0"
                                                                onClick={() => {
                                                                    setMainClinica({
                                                                        label: item.name,
                                                                        value: item._id
                                                                    });
                                                                    setMainClinicaValue(item._id);
                                                                    setFilialValues([...item.filials].map(el => el._id));
                                                                    setSelectedFilial([...item.filials].map(filial => ({
                                                                        label: filial.name,
                                                                        value: filial._id
                                                                    })));
                                                                    setVisible(true);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faPenAlt} />
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
        </div>
    )
}

export default Filials