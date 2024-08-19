import { useToast } from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import { useHttp } from "../../hooks/http.hook";
import { Pagination } from "./components/Pagination";
import { DatePickers } from "./doctorclients/clientComponents/DatePickers";

const StatsionarRoom = () => {

    // const { doctor, startDate, endDate } = useLocation().state
    //======================================================
    //======================================================

    const [beginDay, setBeginDay] = useState(
        new Date(new Date().setUTCHours(0, 0, 0, 0))
      );
      const [endDay, setEndDay] = useState(
        new Date(new Date().setDate(new Date().getDate() + 1))
      );

    //======================================================
    //======================================================

    const { request, loading } = useHttp();
    const auth = useContext(AuthContext);


    //======================================================
    //======================================================
    const {t} = useTranslation()
    //======================================================
    //======================================================
    // Pagination
    const [currentPage, setCurrentPage] = useState(0)
    const [countPage, setCountPage] = useState(10)

    const indexLastConnector = (currentPage + 1) * countPage
    const indexFirstConnector = indexLastConnector - countPage

    //======================================================
    //======================================================

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

    //======================================================
    //======================================================

    const [doctors, setDoctors] = useState([])
    const [currentDoctors, setCurrentDoctors] = useState([])
    const [searchStorage, setSearchStrorage] = useState([])

    const getDirectDoctors = useCallback(
        async (beginDay, endDay) => {
            try {
                const data = await request(
                    `/api/doctor/statsionardoctors/room/get`,
                    "POST",
                    { doctor: auth?.user?._id, beginDay: beginDay, endDay: endDay },
                    {
                        Authorization: `Bearer ${auth.token}`,
                    }
                );
                setDoctors(data)
                setSearchStrorage(data)
                setCurrentDoctors(
                    data.slice(indexFirstConnector, indexLastConnector),
                )
            } catch (error) {
                notify({
                    title: t(`${error}`),
                    description: "",
                    status: "error",
                });
            }
        },
        [request, auth, notify]
    );

    //=======================================================
    //=======================================================

    //=======================================================
    //=======================================================

    const changeStart = (e) => {
        setBeginDay(new Date(new Date(e).setUTCHours(0, 0, 0, 0)));
        getDirectDoctors(new Date(new Date(e).setUTCHours(0, 0, 0, 0)), endDay);
    };

    const changeEnd = (e) => {
        const date = new Date(new Date(e).setUTCHours(23, 59, 59, 59))

        setEndDay(date);
        getDirectDoctors(beginDay, date);
    }

    //=======================================================
    //=======================================================

    //=======================================================
    //=======================================================

    const setPageSize =
        (e) => {
            if (e.target.value === 'all') {
                setCurrentPage(0)
                setCountPage(doctors.length)
                setCurrentDoctors(doctors)
            } else {
                setCurrentPage(0)
                setCountPage(e.target.value)
                setCurrentDoctors(doctors.slice(0, e.target.value))
            }
        }

    const searchFullname =
        (e) => {
            const searching = searchStorage.filter((item) =>
                item.client.fullname
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()))
            setDoctors(searching)
            setCurrentDoctors(searching.slice(0, countPage))
        }

    //=======================================================
    //=======================================================

    // const [t, setT] = useState(0);

    // useEffect(() => {
    //     if (!t) {
    //         setT(1)
    //         getDirectDoctors(beginDay, endDay)
    //         getDepartments()
    //     }
    // }, [getDirectDoctors, getDepartments, t, beginDay, endDay])

    useEffect(() => {
        getDirectDoctors(beginDay, endDay)
    }, [getDirectDoctors, beginDay, endDay])


    return (
        <div className="bg-slate-100 content-wrapper px-lg-5 px-3">
            <div className="border-0 table-container">
                <div className="border-0 table-container">
                    <div className="bg-white flex gap-4 items-center p-2">
                        <div>
                            <select
                                className="form-control form-control-sm selectpicker"
                                placeholder="Bo'limni tanlang"
                                onChange={setPageSize}
                                style={{ minWidth: "50px" }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={'all'}>Barchasi</option>
                            </select>
                        </div>
                        {/* <div>
                            <h2 className="text-[16px] font-bold">{doctor.firstname + ' ' + doctor.lastname}</h2>
                        </div> */}
                        <div>
                            <input
                                onChange={searchFullname}
                                style={{ minWidth: "100px" }}
                                type="search"
                                className="w-100 form-control form-control-sm selectpicker"
                                placeholder={t("Mijoz")}
                            />
                        </div>
                        <div
                            className="text-center ml-auto flex gap-2"
                            style={{ overflow: 'hidden' }}
                        >
                            <DatePickers value={new Date(beginDay).toISOString().slice(0, 10)} changeDate={changeStart} />
                            <DatePickers value={new Date(endDay).toISOString().slice(0, 10)} changeDate={changeEnd} />
                        </div>
                        <div className="text-center ml-auto mr-4">
                            <Pagination
                                setCurrentDatas={setCurrentDoctors}
                                datas={doctors}
                                setCurrentPage={setCurrentPage}
                                countPage={countPage}
                                totalDatas={doctors.length}
                            />
                        </div>
                        <div className="text-center">
                            <div className="btn btn-primary">
                                <ReactHtmlTableToExcel
                                    id="reacthtmltoexcel"
                                    table="directservices"
                                    sheet="Sheet"
                                    buttonText="Excel"
                                    filename="Yunaltiruvchi shifokor"
                                />
                            </div>
                        </div>
                    </div>
                    <table className="table m-0 table-sm" id="directservices">
                        <thead>
                            <tr>
                                <th className="border py-1 bg-alotrade text-[16px]">№</th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Mijoz")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Kelgan vaqti")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Ketgan vaqti")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Kuni")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Xona")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Umumiy narxi")}
                                </th>
                                <th className="border py-1 bg-alotrade text-[16px]">
                                    {t("Shifokor ulushi")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDoctors.map((el, key) => {
                                return (
                                    <tr key={key}>
                                        <td
                                            className={`border py-1 font-weight-bold text-right text-[16px]`}
                                            style={{ maxWidth: "30px !important" }}
                                        >
                                            {currentPage * countPage + key + 1}
                                        </td>
                                        <td className="border py-1 text-[16px] font-weight-bold">
                                            {el?.client?.fullname}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {new Date(el?.room?.beginday).toLocaleDateString()}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {new Date(el?.room?.endday).toLocaleDateString()}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(Math.round(
                                                Math.abs(
                                                    (new Date(el?.room?.beginday).getTime()
                                                        -
                                                        new Date(el?.room?.endday).getTime())
                                                    /
                                                    (24 * 60 * 60 * 1000)
                                                )
                                            ))}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {el?.room?.room?.number}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {(Math.round(
                                                Math.abs(
                                                    (new Date(el?.room?.beginday).getTime()
                                                        -
                                                        new Date(el?.room?.endday).getTime())
                                                    /
                                                    (24 * 60 * 60 * 1000)
                                                )
                                            ) * el?.room?.room?.price)}
                                        </td>
                                        <td className="border py-1 text-[16px] text-right">
                                            {el?.room?.doctor_profit <= 100 ? ((Math.round(
                                                Math.abs(
                                                    (new Date(el?.room?.beginday).getTime()
                                                        -
                                                        new Date(el?.room?.endday).getTime())
                                                    /
                                                    (24 * 60 * 60 * 1000)
                                                )
                                            ) * el?.room?.room?.price) / 100) * el?.room?.doctor_profit : el?.room?.doctor_profit}
                                        </td>
                                    </tr>
                                );
                            })}
                            <tr>
                                <td
                                    className={`border py-1 font-weight-bold text-right text-[16px]`}
                                    style={{ maxWidth: "30px !important" }}
                                >
                                </td>
                                <td className="border py-1 text-[16px] font-weight-bold"></td>
                                <td className="border py-1 text-[16px] text-center"></td>
                                <td className="border py-1 text-[16px] text-right"></td>
                                <td className="border py-1 text-[16px] text-center"></td>
                                <td className="border py-1 text-[16px] text-center"></td>
                                <td className="border py-1 text-[16px] text-right font-bold">
                                    {searchStorage.reduce((prev, el) => prev + ((Math.round(
                                        Math.abs(
                                            (new Date(el?.room?.beginday).getTime()
                                                -
                                                new Date(el?.room?.endday).getTime())
                                            /
                                            (24 * 60 * 60 * 1000)
                                        )
                                    ) * el?.room?.room?.price)), 0)}
                                </td>
                                <td className="border py-1 text-[16px] text-right font-bold">
                                    {searchStorage.reduce((prev, el) => prev + el?.room?.doctor_profit <= 100 ? ((Math.round(
                                        Math.abs(
                                            (new Date(el?.room?.beginday).getTime()
                                                -
                                                new Date(el?.room?.endday).getTime())
                                            /
                                            (24 * 60 * 60 * 1000)
                                        )
                                    ) * el?.room?.room?.price) / 100) * el?.room?.doctor_profit : el?.room?.doctor_profit, 0)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StatsionarRoom;