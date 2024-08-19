import React from 'react'
import { useTranslation } from 'react-i18next'

const RegisterDoctor = ({ doctor, changeDoctorData, loading, checkData }) => {
    const { t } = useTranslation()
    return (
        <div className=''>
            <div className="w-full flex flex-col items-center bg-white p-2">
                <div className="card w-[50%]">
                    <div className="card-header">
                        <div className="card-title">{t("Yunaltiruvchi shifokor ma'lumotlari")}</div>
                    </div>
                    <div className="card-body">
                        <div className="row gutters">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="fullName">{t("Familiyasi")}</label>
                                    <input
                                        value={doctor.lastname || ''}
                                        onChange={changeDoctorData}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="lastname"
                                        name="lastname"
                                        placeholder={t("Familiyasi")}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="inputEmail">{t("Ismi")}</label>
                                    <input
                                        value={doctor?.firstname}
                                        onChange={changeDoctorData}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="firstname"
                                        name="firstname"
                                        placeholder={t("Ismi")}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="education">{t("Klinika")}</label>
                                    <input
                                        value={doctor?.clinica_name}
                                        onChange={changeDoctorData}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="fathername"
                                        name="clinica_name"
                                        placeholder={t("Ish joy")}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="addreSs">{t("Telefon raqami")}</label>
                                    <div className="input-group input-group-sm mb-3">
                                        <div className="input-group-prepend">
                                            <span
                                                className="input-group-text"
                                                id="inputGroup-sizing-sm"
                                            >
                                                +998
                                            </span>
                                        </div>
                                        <input
                                            defaultValue={doctor?.clinica_name}
                                            onChange={changeDoctorData}
                                            type="number"
                                            className="form-control"
                                            name="phone"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="statsionar_profit">{t("Statsionar ulushi")}</label>
                                    <input
                                        value={doctor?.statsionar_profit}
                                        onChange={changeDoctorData}
                                        type="number"
                                        className="form-control form-control-sm"
                                        id="statsionar_profit"
                                        name="statsionar_profit"
                                        placeholder={t("Statsionar ulushi")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[50%] bg-white">
                    <div className="text-right">
                        {loading ? (
                            <button className="bg-alotrade rounded text-white py-2 px-3" disabled>
                                <span className="spinner-border spinner-border-sm"></span>
                                Loading...
                            </button>
                        ) : (
                            <button onClick={checkData} className="bg-alotrade rounded text-white py-2 px-3">
                                {t("Saqlash")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterDoctor