import { Input, Select, useToast } from '@chakra-ui/react';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import Translaste from '../../translation/Translate';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { checkUserData } from '../loginAndRegister/checkData';
import PasswordInput from '../loginAndRegister/PasswordInput';

export const AdminLogin = ({ setIsAuthenticated, setUserData }) => {
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

    //====================================================================
    //====================================================================
    const [hour, setHour] = useState(new Date().toLocaleTimeString());

    const weekDays = [
        "Yakshanba",
        "Dushanba",
        "Seshanba",
        "Chorshanba",
        "Payshanba",
        "Juma",
        "Shanba",
    ];
    const monthNames = [
        "Yanvar",
        "Fevral",
        "Mart",
        "Aprel",
        "May",
        "Iyun",
        "Iyul",
        "Avgust",
        "Sentabr",
        "Oktabr",
        "Noyabr",
        "Dekabr",
    ];

    setTimeout(() => {
        setHour(new Date().toLocaleTimeString());
    }, 1000);
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const auth = useContext(AuthContext);
    const { loading, request } = useHttp();

    const [sections, setSections] = useState();
    const [user, setUser] = useState({
        type: 'Admin',
        password: null,
    });

    const getSections = useCallback(async () => {
        try {
            const data = await request("/api/sections", "GET", null);

            setSections(data);
        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    }, [request, notify]);

    const changeHandler = (e) => {
        setUser({ ...user, password: e.target.value });
    };

    const loginHandler = async () => {
        if (checkUserData(user)) {
            return notify(checkUserData(user));
        }
        try {
            const data = await request(`/api/admin/login`, "POST", { ...user });
            localStorage.setItem(
                'AdminData',
                JSON.stringify({
                    userId: data._id,
                    token: data.token,
                    user: data.user,
                }),
            )
            setUserData(data.user)
            setIsAuthenticated(!!data.token)
            notify({
                title: `Xush kelibsiz ${data.user.firstname + " " + data.user.lastname
                    }!`,
                description: "Kirish muvaffaqqiyatli amalga oshirildi",
                status: "success",
            });

        } catch (error) {
            notify({
                title: error,
                description: "",
                status: "error",
            });
        }
    };

    const keyPressed = (e) => {
        if (e.key === "Enter") {
            return loginHandler();
        }
    };
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    useEffect(() => {
        if (!auth.token) {
            getSections();
        }
    }, [getSections, auth]);
    //====================================================================
    //====================================================================

    //====================================================================
    //====================================================================
    const { t } = useTranslation();
    //====================================================================
    //====================================================================

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <div className="bg-white h-screen gradient">
                <div className="wrapper">
                    <Translaste />
                    <div className="authentication-lock-screen d-flex align-items-center justify-content-center">
                        <div className="bg-[#00c2cb] w-[400px] h-[400px] mt-[100px] rounded-full card shadow-2xl shadow-green-500">
                            <div className="card-body p-md-5 text-center">
                                <div className="text-white" style={{ fontSize: "2rem" }}>
                                    {hour}
                                </div>
                                <div className="text-white" style={{ fontSize: "1.25rem" }}>
                                    {t(weekDays[new Date().getDay()])},<span> </span>
                                    {new Date().getDate()}
                                    <span> </span>
                                    {t(monthNames[new Date().getMonth()])},<span> </span>
                                    {new Date().getFullYear()}
                                    <span> {t("yil")}</span>
                                </div>
                                <div className="">Mylogo</div>
                                {/* <p className="mt-2 text-white">Administrator</p> */}

                                <div className="mb-3 mt-3">
                                    <Input
                                        pr="4.5rem"
                                        placeholder="Parolni kiriting"
                                        size="sm"
                                        style={{ borderColor: "#eee", boxShadow: "none", background: "#fff" }}
                                        value={'Admin'}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="mb-3 mt-3">
                                    <PasswordInput
                                        keyPressed={keyPressed}
                                        name={"password"}
                                        changeHandler={changeHandler}
                                    />
                                </div>
                                <div className="d-grid">
                                    <button onClick={loginHandler} className="w-[200px] border-2 border-white tracking-wide bg-green-500 py-2 text-center rounded-lg font-bold text-white">
                                        KIRISH
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};