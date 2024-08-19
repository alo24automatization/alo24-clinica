import { Button, useToast } from '@chakra-ui/react'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { t } from 'i18next'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Loader } from "../../loader/Loader";

const DoctorComplaint = () => {
    const [columnsType, setColumnsType] = useState("complaints");
    const [data, setData] = useState({})
    const auth = useContext(AuthContext)
    const { request, loading } = useHttp();
    const [inputValue, setInputValue] = useState("")
    const [editingID, setEditingID] = useState(null)
    useEffect(() => {
        getData()
    }, [])
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
    const getData = async () => {
        try {
            const response = await request(`/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
                "GET",
                null, {
                Authorization: `Bearer ${auth.token}`,
            });
            setData(response)
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }
    const changeColumnsType = (type) => setColumnsType(type);
    const handleCreate = async (isUpdate) => {
        if (inputValue === "") {
            return notify({
                title: t(`Ma'lumot kiriting!`),
                description: "",
                status: "error",
            });
        }
        try {
            await request(`/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
                "POST",
                {
                    type: columnsType, name: inputValue, _id: isUpdate ? editingID : undefined
                }, {
                Authorization: `Bearer ${auth.token}`,
            });
            getData()
            setEditingID(null)
            setInputValue("")
        } catch (error) {
            notify({
                title: t(`${error}`),
                description: "",
                status: "error",
            });
        }
    }
    const handleUpdate = (item) => {
        setInputValue(item.name)
        setEditingID(item._id)
    }
    return (
        <div className='bg-slate-100 content-wrapper px-lg-5 px-3 '>
            <div>
                <div className='flex items-center gap-x-3'>
                    <Button onClick={() => changeColumnsType("complaints")} variant={columnsType === "complaints" ? "solid" : "outline"} colorScheme='green' className='focus:!shadow-none' >
                        {t("Shikoyat turlari")}
                    </Button>
                    <Button onClick={() => changeColumnsType("diagnostics")} variant={columnsType === "diagnostics" ? "solid" : "outline"} colorScheme='green' className='focus:!shadow-none'>
                        {t("Diagnoz turlari")}
                    </Button>
                </div>
                <div className='mt-3 w-[400px] flex items-center gap-x-3'>
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={columnsType === "complaints" ? t("Yangi shikoyat turi yaratish") : t("Yangi diagnoz turi yaratish")} className='form-control form-control-sm' />
                    <Button
                        disabled={editingID !== null}
                        onClick={() => handleCreate()}
                        colorScheme='green' className='focus:!shadow-none'
                    ><FontAwesomeIcon className='text-base font-bold' icon={faPlus} /></Button>
                </div>
            </div>
            <ul className='mt-4 h-[calc()] overflow-y-auto'>
                {
                    loading ? <Loader /> :
                        data && data[columnsType]?.map((item, index) => <li key={`${item}_${item._id}`}>
                            <div className={` flex items-center justify-between gap-x-3`}>
                                <div className={`border-2 flex items-center  ${index !== 0 ? "border-t-0" : ""} w-[70%]`}>
                                    <span className='border-r-2 !w-[60px] flex items-center justify-center h-[57px] '>{index + 1}</span>
                                    <span className='pl-2'> {item.name}</span>
                                </div>
                                <div className="flex justify-start w-[30%] gap-x-3">
                                    <Button
                                        onClick={() => handleUpdate(item)}
                                        className='focus:!shadow-none text-white !bg-[#F97316]'
                                    >{t("Tahrirlash")}</Button>
                                    {editingID === item._id ? <Button
                                        onClick={() => handleCreate("update")}
                                        colorScheme='green' className='focus:!shadow-none'
                                    >{t("Saqlash")}</Button> : null}
                                </div>
                            </div>
                        </li>)
                }
            </ul>

        </div>
    )
}

export default DoctorComplaint