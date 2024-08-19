import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./css/util.css"
import "./css/main.css"
import Logo from './images/img-01.png'
import { Tilt } from 'react-tilt'
import { useTranslation } from "react-i18next"
import Translaste from "../../../translation/Translate"
import { useState } from "react"

export const LoginPage = ({ sections, setSection, changeHandler, loginHandler }) => {

    const { t } = useTranslation()

    const [passwordType, setPasswordType] = useState(false)

    const defaultOptions = {
        reverse: false,  // reverse the tilt direction
        max: 35,     // max tilt rotation (degrees)
        perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.1,    // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000,   // Speed of the enter/exit transition
        transition: true,   // Set a transition on enter/exit.
        axis: null,   // What axis should be disabled. Can be X or Y.
        reset: true,    // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    }

    return (
        <div className="limiter">
            <Translaste />
            <div className="container-login100">
                <div className="wrap-login100">
                    <Tilt options={defaultOptions} className="login100-pic">
                        <img src={Logo} alt="IMG" />
                    </Tilt>

                    <form className="login100-form validate-form">
                        <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                            {/* <input className="input100" type="text" name="email" placeholder="Email"/> */}
                            <select onChange={e => setSection(e)} className="input100" style={{ outline: "none", appearance: 'none' }}>
                                <option>{t("Tanlang...")}</option>
                                {sections && sections.map((section, key) =>
                                    <option key={key} value={section.type}>{t(section.label)}</option>
                                )}
                            </select>
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <i className="fa fa-user" aria-hidden="true"></i>
                                {/* <i className="fa fa-envelope" ></i> */}
                            </span>
                        </div>

                        <div className="wrap-input100 validate-input" data-validate="Password is required">
                            <input className="input100 input" type={!passwordType ? "password" : "text"} onChange={changeHandler} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    return loginHandler()
                                }
                            }} name="pass" placeholder={t("Parolni kiriting")} />
                            <span className="focus-input100"></span>
                            <span className="symbol-input100">
                                <button onClick={(e) => {
                                        e.preventDefault()
                                        setPasswordType(!passwordType)
                                    }}>
                                    {!passwordType ? <i className="fa fa-eye-slash" aria-hidden="true"></i> : <i className="fa fa-eye" aria-hidden="true"></i>}
                                </button>
                            </span>
                        </div>

                        <div className="container-login100-form-btn">
                            <button onClick={(e) => {
                                e.preventDefault()
                                loginHandler()
                            }} className="login100-form-btn button">
                                {t("KIRISH")}
                            </button>
                        </div>

                        <div className="text-center p-t-12">
                            <span className="txt1">

                            </span>
                            <a className="txt2" href="#">

                            </a>
                        </div>

                        <div className="text-center p-t-136">
                            <a className="txt2" href="#">

                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}