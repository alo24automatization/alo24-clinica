import socketIOClient from "socket.io-client";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {AuthContext} from "../../../context/AuthContext";
import Navbar from "../components/Navbar";
import {useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useToast} from "@chakra-ui/react";
import {useHttp} from "../../../hooks/http.hook";

const DepartmentsTurns = () => {
    const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
    const departments_ids =
        JSON.parse(localStorage.getItem("selected_departments")) || [];
    const auth = useContext(AuthContext);
    const [turns, setTurns] = useState([]);
    const [onlineClients, setOnlineClients] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("_id");
    const {t} = useTranslation();
    const [lastTurnShow, setLastTurnShow] = useState(null);
    const [lastTurnData, setLastTurnData] = useState(null);

    const [onlineClientName, setOnlineClientName] = useState(
        localStorage.getItem("online_department_name") || ""
    );

    const storedOnlineClient = JSON.parse(
        localStorage.getItem("selected_online_clients") || "[]"
    );

    const [baseUrl, setBaseUrl] = useState();
    const {request} = useHttp();
    const toast = useToast();
    const videoRef = useRef(null);

    const notify = useCallback(
        (data) => {
            toast({
                title: data.title || "",
                description: data.description || "",
                status: data.status || "info",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });
        },
        [toast]
    );

    const getBaseUrl = useCallback(async () => {
        try {
            const data = await request("/api/baseurl", "GET", null);
            setBaseUrl(data.baseUrl);
        } catch (error) {
            notify({
                title: error.message,
                status: "error",
            });
        }
    }, [request, notify]);

    useEffect(() => {
        getBaseUrl();
        const socket = socketIOClient(ENDPOINT, {
            path: "/ws",
            withCredentials: true,
            transports: ["websocket"]
        });
        socket.on("departmentsData", (data) => {
            setTurns((prevTurns) => {
                const dataMap = new Map();
                data.forEach((dep) => {
                    dataMap.set(dep.dep_id, dep.data);
                    setLastTurnData(dep);
                });

                const updatedTurns = prevTurns
                    .map((turn) => {
                        const newData = dataMap.get(turn._id);
                        if (newData !== undefined) {
                            return {
                                ...turn,
                                data: newData,
                            };
                        }
                        return turn;
                    })
                    .filter((turn) => turn.data.length > 0);

                data.forEach((dep) => {
                    if (!prevTurns.some((turn) => turn._id === dep.dep_id)) {
                        if (dep.data.length > 0) {
                            updatedTurns.push({
                                _id: dep.dep_id,
                                data: dep.data,
                            });
                        }
                    }
                });

                return updatedTurns;
            });
        });

        socket.on("departmentsOnlineClientsData", (data) => {
            const filteredData = data.filter((item) => {
                const isDepartmentSelected = departments_ids.includes(item.department);
                const isStoredOnlineClient = storedOnlineClient.includes(
                    item.department
                );

                // return isDepartmentSelected || isStoredOnlineClient;
                return isStoredOnlineClient;
            });

            setOnlineClients((prevOnlineClients) => {
                const prevClientsMap = new Map(
                    prevOnlineClients.map((client) => [client._id, client])
                );

                filteredData.forEach((client) => {
                    prevClientsMap.set(client._id, client);
                });

                return Array.from(prevClientsMap.values());
            });
        });

        socket.on("error", (errorMessage) => {
            alert(errorMessage);
        });

        const fetchDepartments = () => {
            socket.emit("getDepartments", {
                clinicaId: auth?.clinica?._id,
                departments_ids,
            });
        };

        const fetchDepartmentsOnlineClients = () => {
            socket.emit("getDepartmentsOnline", {
                clinicaId: auth?.clinica?._id,
                departments_id: id || storedOnlineClient,
            });
        };

        fetchDepartmentsOnlineClients();

        fetchDepartments();
        return () => {
            localStorage.removeItem("spoken");
            socket.disconnect();
        };
    }, [auth?.clinica?._id]);

    const updatedTurns = [...turns.flatMap((turn) => turn.data)];
    useEffect(() => {
        const sortedTurns = [...updatedTurns].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        let lastTurn = sortedTurns[0];
        let emergencyTurn = updatedTurns.find((item) => item.emergency);
        if (emergencyTurn) {
            lastTurn = emergencyTurn;
        }

        const parsedDepartmentsNames = JSON.parse(
            localStorage.getItem("selected_departments_names")
        );

        if (parsedDepartmentsNames && parsedDepartmentsNames.length > 0) {
            const departmentMatch = parsedDepartmentsNames.some(
                (department) => department.departmentName === lastTurn?.name
            );

            if (departmentMatch && lastTurnData.dep_id === lastTurn._id) {
                setLastTurnShow(lastTurn);
            }
        }

        if (
            localStorage.getItem("spoken") !==
            lastTurn?.turn + lastTurn?.letter + lastTurn?.room ||
            lastTurn?.speak
        ) {
            setSeconds(10);
            speakTurn(lastTurn?.turn, lastTurn?.room, lastTurn?.letter);
        }
    }, [turns, auth?.clinica?._id, lastTurnData]);

    const speakTurn = (turn, room, letter) => {
        if (room && turn && letter) {
            const message = `Пациент ${letter} ${turn} прайдите в кабинет номер ${room}`;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = "ru-RU";
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
            localStorage.setItem("spoken", String(turn + letter + room));
        }
    };

    const allowedImageExtensions = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "bmp",
        "tiff",
        "webp",
        "svg",
        "heif",
        "heic",
    ];
    const [seconds, setSeconds] = useState(10);
    useEffect(() => {
        // Exit early if countdown is finished
        if (seconds <= 0) {
            return;
        }

        // Set up the timer
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);
    const fileExtension = auth?.clinica?.ad?.split(".").pop().toLowerCase();
    const isImage = allowedImageExtensions.includes(fileExtension);

    return (
        <div className="bg-white flex h-screen">
            <div className="w-[50%] h-screen overflow-y-auto border-r-2">
                <Navbar hasHead/>
                <ul>
                    {turns.length > 0 ? (
                        updatedTurns
                            ?.filter((e) => departments_ids?.includes(e?._id))
                            ?.map((item, index) => (
                                <li
                                    key={index}
                                    className={`border-2 border-r-0 ${
                                        index === 0 ? "border-t" : "border-t-0"
                                    } !grid grid-cols-3`}
                                >
                  <span className="text-blue-500 text-5xl p-4 text-center border-r-2 font-semibold">
                    {item?.letter + "-" + item?.turn}
                  </span>
                                    <span className="text-orange-500 text-5xl p-4 border-r-2 text-center font-semibold">
                    Xona-{item?.room}
                  </span>
                                    <span className="text-orange-500 text-5xl py-4 text-center font-semibold">
                    {item?.waiting}
                  </span>
                                </li>
                            ))
                    ) : (
                        <li className={"text-xl text-center font-semibold p-2"}>
                            {t("Mijozlar mavjud emas")}
                        </li>
                    )}
                </ul>
                {storedOnlineClient.length > 0 ? (
                    <div className={"border-t"}>
                        <div className={"bg-[#3b82f6]"}>
                            <h1
                                className={"text-3xl text-center text-white font-semibold py-2"}
                            >
                                {onlineClientName.replace(/^"|"$/g, "")}{" "}
                                {t("navbatiga yozilgan mijozlar ro'yxati")}
                            </h1>
                        </div>
                        <table className={"table border !border-x-0"}>
                            <thead>
                            <tr className={"text-xl bg-white text-black border"}>
                                <th className={"border"}>FIO</th>
                                <th className={"border"}>Navbat</th>
                                <th className={"border"}>Vaqt</th>
                            </tr>
                            </thead>
                            <tbody>
                            {onlineClients.length === 0 ? (
                                <tr
                                    className={
                                        "text-xl text-center text-black font-semibold p-2"
                                    }
                                >
                                    <td colSpan={3}>{t("Mijozlar mavjud emas")}</td>
                                </tr>
                            ) : null}
                            {onlineClients.map((client) => (
                                <tr key={client?._id} className={"text-xl font-semibold"}>
                                    <td className={"border"}>
                                        {client?.firstname + " " + client?.lastname}
                                    </td>
                                    <td className={"border"}>{client?.queue}</td>
                                    <td className={"border"}>{client.bronTime}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </div>
            {seconds !== 0 && turns.length > 0 ? (
                <div className="w-[50%] flex flex-col justify-center gap-y-3 items-center">
                    <div className="border-4 border-blue-500 w-[340px] py-2">
                        <h1 className="text-9xl font-semibold text-center text-blue-500">
                            {lastTurnShow?.letter + "-" + lastTurnShow?.turn}
                        </h1>
                    </div>
                    <h1 className="text-7xl font-semibold text-orange-500">
                        Xona-{lastTurnShow?.room}
                    </h1>
                </div>
            ) : (
                <div className="w-[50%]">
                    {auth && auth.clinica?.ad && baseUrl ? (
                        isImage ? (
                            <img
                                className="object-cover h-full w-full"
                                src={`${baseUrl}/api/upload/file/${auth.clinica?.ad}`}
                                alt="Uploaded content"
                            />
                        ) : (
                            <video
                                autoPlay
                                muted
                                loop={true}
                                src={`${baseUrl}/api/upload/file/${auth.clinica?.ad}`}
                                type={`video/${fileExtension}`}
                                ref={videoRef}
                                className="object-cover h-full w-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        )
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default DepartmentsTurns;
