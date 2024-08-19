import React, {useCallback, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleUp,
    faAngleDown,
    faPenAlt,
    faPrint,
    faPlus,
    faSearch,
    faArrowsUpDown,
    faRotate,
    faClose,
} from "@fortawesome/free-solid-svg-icons";
import {Sort} from "./Sort";
import {Pagination} from "../../components/Pagination";
import {DatePickers} from "./DatePickers";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {useHistory} from "react-router-dom";
import Select from "react-select";
import makeAnimated from 'react-select/animated'
import {Modal} from "../../../reseption/components/Modal";
import {useTranslation} from "react-i18next";
import {
    ModalOverlay,
    Modal as ChakraModal,
    ModalBody,
    ModalContent,
    FormControl,
    FormLabel,
    Stack,
    RadioGroup,
    Radio,
    ModalFooter,
    Button,
    useToast
} from "@chakra-ui/react";
import {faBell} from "@fortawesome/free-solid-svg-icons/faBell";

const animatedComponents = makeAnimated()

export const TableClients = ({
                                 changeStart,
                                 changeEnd,
                                 searchId,
                                 handleFilterClients,
                                 searchFullname,
                                 doctorClients,
                                 setCurrentPage,
                                 countPage,
                                 currentDoctorClients,
                                 setCurrentDoctorClients,
                                 currentPage,
                                 setPageSize,
                                 handlePrint,
                                 loading,
                                 setClient,
                                 setConnector,
                                 setVisible,
                                 clientsType,
                                 changeClientsType,
                                 getClientsByBorn,
                                 changeAccept,
                                 user,
                                 getClientsByName,
                                 getClientsById,
                                 sortData,
                                 setIsAddConnector,
                                 setSelectedServices,
                                 setNewServices,
                                 setNewProducts,
                                 complaints,
                                 updatedCliets,
                                 callClient
                             }) => {

    const {t} = useTranslation()

    const history = useHistory();
    const [clientBorn, setClientBorn] = useState('')

    const [modal, setModal] = useState(false)
    const [debt, setDebt] = useState(0)
    const [sort, setSort] = useState(false)

    const isDebt = (payments) => {
        const debt = payments.reduce((prev, item) => prev + item.debt, 0)
        if (debt > 0) {
            return 'bg-red-400'
        } else {
            return ""
        }
    }
    const [startedFilter, setStaredFiltered] = useState(false)
    const [openFilterModal, setOpenFilterModal] = useState(false)
    const closeFilterModal = () => {
        setOpenFilterModal(false)
        setClientFilterData({})
        setStaredFiltered(false)
    }
    const [clientFilterData, setClientFilterData] = useState({});
    const handleChangeFilter = (value, type) => {
        setClientFilterData(prev => ({...prev, [type]: value}))
    }

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
        [toast]
    );

    const clients = startedFilter ? updatedCliets : currentDoctorClients;
    const handleStartFilter = (data) => {
        handleFilterClients(data);
        setOpenFilterModal(false)
        setStaredFiltered(true)
    }
    return (
        <div className="border-0 shadow-lg table-container">
            <div className="border-0 table-container">
                <div className="table-responsive">
                    <div className="bg-white flex gap-6 items-center py-2 px-2">
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={setPageSize}
                                style={{minWidth: "50px"}}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div>
                            <input
                                onChange={searchFullname}
                                style={{maxWidth: "100px", minWidth: "100px"}}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder={t("F.I.O")}
                                onKeyDown={(e) => e.key === 'Enter' && getClientsByName()}
                            />
                        </div>
                        <div>
                            <input
                                onChange={searchId}
                                style={{maxWidth: "60px"}}
                                type="search"
                                className="form-control form-control-sm selectpicker"
                                placeholder={t("ID")}
                                onKeyDown={(e) => e.key === 'Enter' && getClientsById()}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                onKeyDown={(e) => e.key === 'Enter' && getClientsByBorn(e.target.value)}
                                type="date"
                                name="born"
                                onChange={(e) => setClientBorn(e.target.value)}
                                className="form-control inp"
                                placeholder=""
                                style={{color: '#999'}}
                            />
                            <button onClick={() => getClientsByBorn(clientBorn)}>
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    style={{cursor: "pointer"}}
                                />
                            </button>
                        </div>
                        <div className="text-center">
                            <Pagination
                                setCurrentDatas={setCurrentDoctorClients}
                                datas={doctorClients}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={doctorClients.length}
                            />
                        </div>
                        <div
                            className="flex items-center gap-2 justify-center"
                            style={{maxWidth: "200px", overflow: "hidden"}}
                        >
                            <DatePickers changeDate={changeStart}/>
                            <DatePickers changeDate={changeEnd}/>
                        </div>
                        <div
                            className="text-center"
                            style={{maxWidth: "200px", overflow: "hidden"}}
                        >
                            <div className="btn btn-primary">
                                <ReactHTMLTableToExcel
                                    id="reacthtmltoexcel"
                                    table="discount-table"
                                    sheet="Sheet"
                                    buttonText="Excel"
                                    filename="Chegirma"
                                />
                            </div>
                        </div>
                        <div
                            className="text-center"
                            style={{maxWidth: "200px"}}
                        >
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Mijozalar"
                                onChange={changeClientsType}
                            >
                                <option value="offline">{t("Kunduzgi")}</option>
                                <option value="statsionar">{t("Statsionar")}</option>
                            </select>
                        </div>
                        {/* <div
              className="text-center"
              style={{ maxWidth: "200px" }}
            >
              <select
                className="form-control form-control-sm selectpicker"
                placeholder="Mijozalar"
                onChange={changeAccept}
                defaultValue={'not'}
              >
                <option value="all">{t("Xammasi")}</option>
                <option value="accept">{t("Tasdiqlangan")}</option>
                <option value="not">{t("Tasdiqlanmagan")}</option>
              </select>
            </div> */}
                        <button onClick={() => {
                            if (!startedFilter) {
                                setOpenFilterModal(true)
                            } else {
                                setStaredFiltered(false)
                                setClientFilterData({})
                            }
                        }}
                                className=" bg-alotrade py-1.5 text-white rounded-sm px-5 font-semibold text-base flex items-center justify-center">
                            {startedFilter ?
                                <FontAwesomeIcon icon={faClose}/> :
                                t("Filtr")
                            }
                        </button>

                        <ChakraModal size="4xl" isOpen={openFilterModal} onClose={closeFilterModal}>
                            <ModalOverlay/>
                            <ModalContent>
                                <ModalBody>
                                    <div className="space-y-3 pt-2">
                                        <div className="grid grid-cols-2 gap-x-4">
                                            {/* <span className="border border-black font-medium text-lg p-1">Shikoyat</span> */}
                                            <Select isMulti
                                                    onChange={(value) => handleChangeFilter(value, "complaints")}
                                                    options={complaints?.complaints?.map(item => ({
                                                        value: item._id,
                                                        label: item.name
                                                    }))} placeholder="Shikoyat"/>
                                            <Select isMulti
                                                    onChange={(value) => handleChangeFilter(value, "diagnostics")}
                                                    options={complaints?.diagnostics?.map(item => ({
                                                        value: item._id,
                                                        label: item.name
                                                    }))} placeholder="Diagnoz"/>
                                            {/* <span className="border border-black font-medium text-lg p-1">Diagnoz</span> */}
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-3">
                                            <FormControl>
                                                <FormLabel>
                                                    {t("Yosh tanlang")}
                                                </FormLabel>
                                                <div className="flex items-center gap-x-2">
                                                    <input
                                                        onChange={(e) => handleChangeFilter(e.target.value, "from_age")}
                                                        className="form-control" placeholder="Yosh dan"/>
                                                    <input
                                                        onChange={(e) => handleChangeFilter(e.target.value, "to_age")}
                                                        className="form-control" placeholder="Yosh gacha"/>
                                                </div>
                                            </FormControl>
                                            <FormControl onChange={(e) => handleChangeFilter(e.target.value, "gender")}>
                                                <FormLabel>
                                                    {t("Jinsi")}
                                                </FormLabel>
                                                <RadioGroup>
                                                    <Stack direction='row'>
                                                        <Radio value='man'>Erkak</Radio>
                                                        <Radio value='woman'>Ayol</Radio>
                                                    </Stack>
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <FormControl
                                                onChange={(e) => handleChangeFilter(e.target.value, "national")}>
                                                <FormLabel>
                                                    {t("Millati")}
                                                </FormLabel>
                                                <RadioGroup>
                                                    <Stack direction='row'>
                                                        <Radio value='uzb'>O'zbek</Radio>
                                                        <Radio value='foreigner'>Chet el fuqarosi</Radio>
                                                    </Stack>
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            {/* <FormControl>
                        <FormLabel>
                          {t("Operatsiya")}
                        </FormLabel>
                        <RadioGroup >
                          <Stack direction='row'>
                            <Radio value='uzbek'>Bo'lgan</Radio>
                            <Radio value='other'>Bo'lmagan</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl> */}
                                            <FormControl
                                                onChange={(e) => handleChangeFilter(e.target.value, "isDisability")}>
                                                <FormLabel>
                                                    {t("Nogironligi")}
                                                </FormLabel>
                                                <RadioGroup>
                                                    <Stack direction='row'>
                                                        <Radio value='true'>Mavjud</Radio>
                                                        <Radio value="false">Mavjud emas</Radio>
                                                    </Stack>
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                        {/* <div className="grid grid-cols-2">
                      <FormControl>
                        <FormLabel>
                          {t("Operatsiya turi")}
                        </FormLabel>
                        <input className="form-control" />
                      </FormControl>
                    </div> */}
                                    </div>
                                </ModalBody>
                                <ModalFooter className=" gap-x-3">
                                    <Button onClick={closeFilterModal} colorScheme='red'>{t("Bekor qilish")}</Button>
                                    <Button
                                        className=" !bg-alotrade py-1.5 text-white rounded-sm px-5 font-semibold text-base flex items-center justify-center"
                                        onClick={() => handleStartFilter(clientFilterData)}>{t("Qiridish")}</Button>
                                </ModalFooter>
                            </ModalContent>
                        </ChakraModal>
                    </div>
                    <table className="table m-0" id="discount-table">
                        <thead>
                        <tr>
                            <th className="border bg-alotrade text-[16px] py-1">№</th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("F.I.O")}
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("Kelgan vaqti")}
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("Navbat")}
                                <button onClick={() => sortData(sort, setSort)} className="ml-2">
                                    <FontAwesomeIcon icon={faArrowsUpDown}/>
                                </button>
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("ID")}
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("Telefon raqami")}
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("Tug'ilgan yili")}
                            </th>
                            {clientsType === 'statsionar' && <th className="border bg-alotrade text-[16px] py-1">
                                {t("Kelgan vaqti")}
                            </th>}
                            {clientsType === 'statsionar' && <th className="border bg-alotrade text-[16px] py-1">
                                {t("Xonasi")}
                            </th>}
                            <th className="border bg-alotrade text-[16px] py-1">
                                {t("Tasdiqlangan")}
                            </th>
                            <th className="border bg-alotrade text-[16px] py-1 w-[12%]">
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {clients.map((connector, key) => {
                            return (
                                <tr key={key}
                                    className={`${![...connector?.services].some(service => service.client === connector.client._id && service.payment) ? "!bg-gray-400" : ""}`}>
                                    <td
                                        className={`${isDebt(connector.payments)} border text-[16px] py-1 font-weight-bold text-right`}
                                        style={{maxWidth: "30px !important"}}
                                        onClick={() => {
                                            const debt = connector.payments.reduce((prev, item) => prev + item.debt, 0)
                                            if (debt > 0) {
                                                setDebt(debt)
                                                setModal(true)
                                            }
                                        }}
                                    >
                                        {currentPage * countPage + key + 1}
                                    </td>
                                    <td className="border text-[16px] py-1 font-weight-bold">
                                        {connector.client.firstname} {connector.client.lastname}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {new Date(connector?.connector?.createdAt).toLocaleDateString('ru-RU')} {new Date([...connector?.services].filter(service => service.department._id === user.specialty._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt).toLocaleTimeString('ru-RU')}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector.client.bronTime ? connector.client.bronTime : [...connector?.services].filter(service => service.department._id === user.specialty._id)[0].turn}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector.client.id}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {connector.client.phone}
                                    </td>
                                    <td className="border text-[16px] py-1 text-right">
                                        {new Date(connector.client.born).toLocaleDateString()}
                                    </td>
                                    {clientsType === 'statsionar' && <td className="border text-[16px] py-1 text-right">
                                        {new Date(connector?.connector?.createdAt).toLocaleDateString()} {new Date(connector?.connector?.createdAt).toLocaleTimeString().slice(0, 5)}
                                    </td>}
                                    {clientsType === 'statsionar' && <td className="border text-[16px] py-1 text-right">
                                        {connector?.connector?.room?.room?.type} {connector?.connector?.room?.room?.number} {connector?.connector?.room?.room?.place}
                                    </td>}
                                    <td className="border text-[16px] py-1 text-right">
                                        <div className="custom-control custom-checkbox text-center">
                                            <input
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment)}
                                                checked={connector?.services?.filter(service => service.department._id === user?.specialty?._id && !service.department.probirka && service.accept).length > 0 ? true : false}
                                                type="checkbox"
                                                className="custom-control-input border border-dager"
                                                id={`product${key}`}
                                            />
                                            <label className="custom-control-label"
                                                   htmlFor={`product${key}`}></label>
                                        </div>
                                    </td>
                                    <td className="border text-[16px] py-1 text-center flex gap-[4px] items-center">
                                        {loading ? (
                                            <button className="btn btn-success" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment&&!service.accept)}
                                                onClick={() =>
                                                    callClient(connector?.client?._id,connector?.services[0]?.department._id)
                                                }
                                                className="btn btn-danger py-0"
                                            >
                                                <FontAwesomeIcon icon={faBell}/>
                                            </button>
                                        )}
                                        {loading ? (
                                            <button className="btn btn-success" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment)}
                                                onClick={() => {
                                                    setClient(connector.client)
                                                    setConnector(connector.connector)
                                                    setVisible(true)
                                                    setIsAddConnector(true)
                                                    setSelectedServices(null)
                                                    setNewServices([])
                                                    setNewProducts([])
                                                }}
                                                className="btn btn-success bg-orange-500 border-orange-500 py-0"
                                            >
                                                <FontAwesomeIcon icon={faRotate}/>
                                            </button>
                                        )}
                                        {loading ? (
                                            <button className="btn btn-success" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment)}
                                                onClick={() =>
                                                    history.push("/alo24/adoption", {
                                                        ...connector,
                                                        clientsType,
                                                        user,
                                                        allClients:clients
                                                    })
                                                }
                                                className="btn btn-primary py-0"
                                            >
                                                <FontAwesomeIcon icon={faPenAlt}/>
                                            </button>
                                        )}
                                        {loading ? (
                                            <button className="btn btn-success" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment)}

                                                onClick={() => {
                                                    setClient(connector.client)
                                                    setConnector(connector.connector)
                                                    setIsAddConnector(false)
                                                    setVisible(true)
                                                    setSelectedServices(null)
                                                    setNewServices([])
                                                    setNewProducts([])
                                                }}
                                                className="btn btn-success py-0"
                                            >
                                                <FontAwesomeIcon icon={faPlus}/>
                                            </button>
                                        )}
                                        {loading ? (
                                            <button className="ml-2 btn btn-success" disabled>
                                                <span className="spinner-border spinner-border-sm"></span>
                                                Loading...
                                            </button>
                                        ) : (
                                            <button
                                                disabled={![...connector?.services].some(service => service.client === connector.client._id && service.payment)}
                                                onClick={() =>
                                                    handlePrint(connector)
                                                }
                                                className="btn btn-success py-0"
                                            >
                                                <FontAwesomeIcon icon={faPrint}/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal
                modal={modal}
                text={""}
                setModal={setModal}
                basic={debt}
            />
        </div>
    );
};
