import React from 'react'
import { useTranslation } from 'react-i18next'
import Select from 'react-select'

const VisitRegister = ({ visit, setVisit, counterdoctors, loading, checkData }) => {
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
                                    <label htmlFor="fullName">{t("Yunaltiruvchi shifokor")}</label>
                                    <Select
                                        options={[
                                            {
                                                label: t('Hammasi'),
                                                value: "none"
                                            },
                                            ...[...counterdoctors].map(item => ({
                                                ...item,
                                                value: item._id,
                                                label: item.firstname + ' ' + item.lastname
                                            }))
                                        ]}
                                        onChange={(e) => {
                                            setVisit({ ...visit, counter_doctor: e.value })
                                        }}
                                        placeholder={t("Tanlang...")}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                <div className="form-group">
                                    <label htmlFor="inputEmail">{t("Izoh")}</label>
                                    <input
                                        value={visit?.comment}
                                        onChange={(e) => setVisit({...visit, comment: e.target.value})}
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="comment"
                                        name="comment"
                                        placeholder={t("Izoh")}
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

export default VisitRegister