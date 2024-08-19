import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"


const AllServices = ({ services, modal, setModal, modalBody, user }) => {
    const { t } = useTranslation()

    return (
        <div
            className={`modal fade show ${modal ? "" : "d-none"}`}
            id="customModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="customModalLabel"
            style={{ display: "block" }}
            aria-modal="true"
        >
            <div className="modal-dialog" style={{width: "400px", height: "700px"}} role="document">
                <div className="modal-content">
                    <div className="modal-body">
                            <div>
                                <h3 className="text-[18px] font-bold">{t("Xizmatlar")}:</h3>
                                <div className="flex flex-col">
                                    {services.map((service, ind) => modalBody === 'all' ? <span className="text-[16px] font-semibold" key={ind}>{ind+1}. {service?.service?.name}</span> : service?.reseption === user?._id && <span className="text-[16px] font-semibold" key={ind}>{ind+1}. {service?.service?.name}</span>)}
                                </div>
                            </div>
                    </div>
                    <div className="modal-footer custom">
                        <div className="left-side">
                            <button
                                className="btn btn-link danger w-100"
                                data-dismiss="modal"
                                onClick={() => setModal(false)}
                            >
                                {t("Bekor qilish")}
                            </button>
                        </div>
                        {/* <div className="divider" />
                        <div className="right-side">
                            <button onClick={handler} className="btn btn-link success w-100">
                                {t("Tasdiqlash")}
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllServices