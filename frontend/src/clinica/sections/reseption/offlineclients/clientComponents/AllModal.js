import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { BsFillPrinterFill } from "react-icons/bs"
import { useReactToPrint } from "react-to-print"
import Print from "../../../doctor/components/Print"
import LabPrint from "../../../laborotory/components/Print"
import QRCode from "qrcode"


const AllModal = ({ services, client, connector, clinica, baseUrl, modal, doctor, setModal }) => {
    const { t } = useTranslation()
    const [acceptServices, setAcceptServices] = useState([])
    const [notAcceptServices, setNotAcceptServices] = useState([])

    const [printBody, setPrintBody] = useState([])
    const [printType, setPrintType] = useState([])

    useEffect(() => {
        const departments = [...services].reduce((prev, el) => {
            if (!el.refuse && el.accept && !prev.includes(String(el.department._id))) {
                prev.push(String(el.department._id))
            }
            return prev;
        }, [])
        const accepts = [...departments].reduce((prev, department) => {
            const s = [...services].filter(serv => !serv.refuse && serv.accept && String(serv.department._id) === department)
            prev.push({
                department: s[0].department?.name,
                services: s
            })
            return prev
        }, [])
        setAcceptServices(accepts)
        setNotAcceptServices([...services].filter(service => !service.refuse && !service.accept))
    }, [services])

    const [qr, setQr] = useState()

    useEffect(() => {
      if (connector && baseUrl) {
        QRCode.toDataURL(`${baseUrl}/clienthistory/laboratory/${connector._id}`)
          .then(data => {
            setQr(data)
          })
      }
    }, [connector, baseUrl])

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: client && client?.firstname + ' ' + client?.lastname,
    })

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
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <div>
                            <h3 className="text-[18px] font-bold text-green-700">{t("Tekshirilgan")}:</h3>
                            <div className="flex flex-col">
                                <table className="mb-2">
                                    {acceptServices.map((service, ind) => <>
                                        <thead>
                                            <tr>
                                                <th className="border-[2px] p-1 border-black" colSpan={2}>
                                                    <div className="flex justify-between">
                                                        {service?.department} <button onClick={() => {
                                                            setPrintBody(service.services)
                                                            setPrintType(service.services[0].department.probirka ? 'lab' : "doctor")
                                                            setTimeout(() => {
                                                                handlePrint()
                                                            }, 1000)
                                                        }} ><BsFillPrinterFill fontSize={18} color="blue" /></button>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {service.services && service.services.map((serv, i) =>
                                                <tr key={i}>
                                                    <td className="border-[2px] p-1 border-black">{i + 1}</td>
                                                    <td className="border-[2px] p-1 border-black">{serv?.service?.name}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </>)}
                                </table>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[18px] font-bold text-red-700">{t("Tekshirilmagan")}:</h3>
                            <div className="flex flex-col">
                                {notAcceptServices.map((service, ind) => <span className="text-[16px] font-semibold" key={ind}>{ind + 1}. {service?.service?.name}</span>)}
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
            <div className="d-none">
                <div
                    ref={componentRef}
                    className="px-[2cm] py-2"
                    style={{ fontFamily: "times" }}
                >
                    {printType === 'doctor' ? <Print
                        doctor={doctor}
                        connector={connector}
                        client={client}
                        sections={printBody}
                        clinica={clinica}
                        baseUrl={baseUrl}
                        qr={qr}
                    /> : <LabPrint
                        baseUrl={baseUrl}
                        clinica={clinica}
                        connector={connector}
                        client={client}
                        sections={printBody}
                        qr={qr}
                    />}
                </div>
            </div>
        </div>
    )
}

export default AllModal