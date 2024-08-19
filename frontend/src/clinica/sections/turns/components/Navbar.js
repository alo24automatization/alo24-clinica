import {Button} from "@chakra-ui/react";
import React, {useContext, useTransition} from "react";
import {AuthContext} from "../../../context/AuthContext";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

const BackIcon = ({color}) => (<svg
    fill="#fff"
    width="30px"
    height="30px"
    viewBox="0 0 24 24"
    id="left"
    data-name="Flat Color"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        id="primary"
        d="M21,11H5.41l5.3-5.29A1,1,0,1,0,9.29,4.29l-7,7a1,1,0,0,0,0,1.42l7,7a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L5.41,13H21a1,1,0,0,0,0-2Z"
        style={{fill: color}}
    />
</svg>);
const Navbar = ({hasHead}) => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const {t} = useTranslation();
    const logOut = () => {
        if (history.location.pathname === "/alo24") {
            history.push("/");
            auth.logout();
        } else {
            history.push("/alo24");
        }
    }
    const flex = `flex items-center bg-blue-500 py-1`
    return <div className={`${hasHead ? flex : "bg-white py-1"} sticky top-0`}>
        <div className={"p-2"}>
            <Button onClick={logOut}>
                <BackIcon color={hasHead?"#3b82f6":"#000"}/>
            </Button>
        </div>
        {hasHead ? <div className={"grid grid-cols-3 w-full font-semibold pr-3"}>
            <h1 className={"text-4xl text-white text-center !mr-[60px] "}>{t("Navbat")}</h1>
            <h1 className={"text-4xl text-white text-center  !mr-[20px]"}>{t("Xona")}</h1>
            <h1 className={"text-4xl text-white text-center  !mr-[20px]"}>{t("Kutmoqda")}</h1>
        </div> : null}
    </div>
}
export default Navbar