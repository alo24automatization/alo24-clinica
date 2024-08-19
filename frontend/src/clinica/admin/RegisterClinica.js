import { useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook';
import { ClinicaRegister } from '../loginAndRegister/ClinicaRegister';
import { DirectorRegistor } from '../loginAndRegister/DirectorRegistor';
import { Modal } from '../sections/director/users/modal/Modal';
import { ClinicasTable } from './components/ClinicasTable';
 
const RegisterClinica = () => {

    //====================================================================
    //====================================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [countPage, setCountPage] = useState(10);

    const indexLastConnector = (currentPage + 1) * countPage;
    const indexFirstConnector = indexLastConnector - countPage;

    //====================================================================
    //====================================================================

    const [modal, setModal] = useState(false);
    const [clinicaId, setClinicaId] = useState(null);
    //====================================================================
    //====================================================================

    const toast = useToast();

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title && data.title,
                description: data.description && data.description,
                status: data.status && data.status,
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        []
    );

    //====================================================================
    //====================================================================

    const [clinicaData, setClinicaData] = useState({});
    const [directorData, setDirectorData] = useState({});

    //====================================================================
    //====================================================================

    const [registerType, setRegisterType] = useState('clinica');

    // RegisterPage
    const [visible, setVisible] = useState(false);
    const changeVisible = () => setVisible(!visible);


    const { request, loading } = useHttp();

    //=========================================================
    //=========================================================

    const setPageSize =
        (e) => {
            setCurrentPage(0);
            setCountPage(e.target.value);
            setClinicas(searchStorage.slice(0, e.target.value));
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            );
            setClinicas(searching.slice(0, countPage));
        }

    //=========================================================
    //=========================================================

    const deleteHandler = async () => {
        try {
            const data = await request(
                `/api/clinica/delete`,
                "POST",
                { clinicaid: clinicaId }
            );
            notify({
                title: data.name,
                description: " shifoxonani o'chirishni tasdiqlaymiz!",
                status: "success",
            });
            setModal(false);
            setClinicaId(null);
            getClinicas()
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    //=========================================================
    //=========================================================

    const changeIsCreateUser = async (id) => {
        try {
            const data = await request(
                `/api/clinica/is_create_user`,
                "POST",
                { id }
            );
            notify({
                title: data?.message,
                description: "",
                status: "success",
            });
            getClinicas()
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }

    //=========================================================
    //=========================================================

    const [clinicas, setClinicas] = useState([]);
    const [searchStorage, setSearchStrorage] = useState([]);

    const getClinicas = useCallback(
        async () => {
            try {
                const data = await request(
                    `/api/admin/clinica_list/get`,
                    "GET",
                    null
                );
                setSearchStrorage(data);
                setClinicas(
                    data.slice(indexFirstConnector, indexLastConnector)
                );
            } catch (error) {
                notify({
                    title: error,
                    description: "",
                    status: "error",
                });
            }
        },
        [request, indexFirstConnector, indexLastConnector]
    );

    const handleUploadBlanka=(e)=>{

    }
    useEffect(() => {
        getClinicas();
    }, [getClinicas])

    return (
        <div className="min-h-full">
            <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
                <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-12 text-end">
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "d-none" : ""
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                                <button
                                    className={`btn bg-alotrade text-white mb-2 w-100 ${visible ? "" : "d-none"
                                        }`}
                                    onClick={changeVisible}
                                >
                                    Registratsiya
                                </button>
                            </div>
                        </div>
                        <div className={` ${visible ? "" : "d-none"}`}>
                            {registerType === 'clinica' && <ClinicaRegister clinicaData={clinicaData} onFinishCreate={() => {
                                setRegisterType('director')
                                getClinicas()
                            }} onFinishUpdate={() => {
                                setVisible(false);
                                getClinicas()
                            }} />}
                            {registerType === 'director' && <DirectorRegistor directorData={directorData} onFinishCreate={() => {
                                getClinicas()
                                setRegisterType('clinica');
                                setVisible(false)
                            }} />}
                        </div>
                        <ClinicasTable
                            setClinicaId={setClinicaId}
                            setModal={setModal}
                            connectors={searchStorage}
                            countPage={countPage}
                            currentPage={currentPage}
                            currentConnectors={clinicas}
                            setCurrentConnectors={setClinicas}
                            setCurrentPage={setCurrentPage}
                            setPageSize={setPageSize}
                            searchFullname={searchFullname}
                            setClinicaData={setClinicaData}
                            setVisible={setVisible}
                            setDirectorData={setDirectorData}
                            setRegisterType={setRegisterType}
                            changeIsCreateUser={changeIsCreateUser}
                        />
                    </div>
                </div>
            </div>
            <Modal
                modal={modal}
                setModal={setModal}
                basic={""}
                text={"Shifoxonani o'chirishni tasdiqlaysizmi?"}
                handler={deleteHandler}
            />
        </div>
    );
}

export default RegisterClinica