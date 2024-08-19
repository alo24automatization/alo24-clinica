import {
  Button,
  Checkbox,
  CloseButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHttp } from "../../../hooks/http.hook";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";

const Departments = () => {
  const [modalState, setModalState] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();
  const notify = useCallback((data) => {
    toast({
      title: data.title && data.title,
      description: data.description && data.description,
      status: data.status && data.status,
      duration: 5000,
      isClosable: true,
      position: "top-right",
    });
  }, []);
  const { request } = useHttp();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [departmentsTurn, setDepartmentsTurn] = useState([]);

  const [departments, setDepartments] = useState([]);
  const getDepartments = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/turns/get`,
        "POST",
        { clinica: auth && auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      setDepartments(data);
    } catch (error) {
      notify({
        title: error.message || "Error",
        description: "",
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (auth && auth.clinica && auth.clinica._id && auth.token) {
      const timeoutId = setTimeout(() => {
        getDepartments();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [auth]);
  const getDepartmentsTurns = (floor) => {
    const filteredDepartments = departments.filter((d) => d.floor === floor);
    const addActiveFields = filteredDepartments.map((item) => ({
      ...item,
      active: false,
      online: false,
    }));
    setDepartmentsTurn(addActiveFields);
  };
  const handleClickTurnCard = (floor) => {
    setModalState(true);
    getDepartmentsTurns(floor);
  };
  const closeModal = () => {
    setModalState(false);
    const addActiveFields = departmentsTurn.map((item) => ({
      ...item,
      active: false,
    }));
    setDepartmentsTurn(addActiveFields);
  };
  const handleChangeActiveCheckbox = (e, index) => {
    departmentsTurn[index].active = e.target.checked;
    setDepartmentsTurn([...departmentsTurn]);
    saveLocalStorageSelectedDepartments();
  };
  const saveLocalStorageSelectedDepartments = () => {
    localStorage.setItem(
      "selected_departments",
      JSON.stringify(
        departmentsTurn.filter((item) => item.active).map((item) => item._id)
      )
    );
  };

  const handleChangeActiveCheckboxOnlineClients = (e, index) => {
    departmentsTurn[index].online = e.target.checked;
    setDepartmentsTurn([...departmentsTurn]);
    saveLocalStorageSelectedDepartmentsOnlineClients();
  };
  const saveLocalStorageSelectedDepartmentsOnlineClients = () => {
    localStorage.setItem(
      "onlineClient_ids",
      JSON.stringify(
        departmentsTurn
          .filter((item) => item.online)
          .map((item) => ({ id: item._id, name: item?.name }))
      )
    );
  };

  useEffect(() => {
    saveLocalStorageSelectedDepartments();
    saveLocalStorageSelectedDepartmentsOnlineClients();
  }, [departmentsTurn]);

  const handleOpenTurns = () => {
    history.push(`/alo24/turns`);
  };
  const groupedDepartments = departments.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.floor === item.floor)
  );
  return (
    <>
      <>
        <Navbar />
        <div className="bg-white">
          <div
            className={`grid grid-cols-${
              groupedDepartments.length > 1 ? "2" : "1"
            } w-full h-[calc(100vh-65px)] gap-2`}
          >
            {groupedDepartments.map((department, ind) => {
              return (
                <div
                  key={department?._id}
                  onClick={() => handleClickTurnCard(department.floor)}
                  className={
                    "bg-green-500 flex items-center cursor-pointer justify-center"
                  }
                >
                  <h1 className={"text-white font-bold text-6xl "}>
                    {department.floor}
                  </h1>
                </div>
              );
            })}
          </div>
        </div>
        <Modal size={"5xl"} isOpen={modalState} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <div className={"flex items-center justify-between"}>
                <div></div>
                <h1>{t("Shifokorlar")}</h1>
                <CloseButton onClick={closeModal} />
              </div>
            </ModalHeader>
            <ModalBody>
              <table className={"table border"}>
                <thead>
                  <tr className={"bg-white text-black"}>
                    <th className={"text-base border text-left"}>№</th>
                    <th className={"text-base border text-center"}>
                      {t("Bo'lim")}
                    </th>
                    <th className={"text-base border text-center"}>
                      {t("Shifokor")}
                    </th>
                    <th className={"text-base border text-center"}>
                      {t("Xonasi")}
                    </th>
                    <th className={"text-base border text-center"}>
                      {t("Bo'lim tanlash")}
                    </th>
                    <th className={"text-base border text-center"}>
                      {t("Online mijozlar tanlash")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {departmentsTurn.map((item, index) => (
                    <tr key={item?._id} className={"text-black"}>
                      <td className={"text-base border text-left"}>
                        {index + 1}
                      </td>
                      <td className={"text-base border text-center"}>
                        {item?.name}
                      </td>
                      <td className={"text-base border text-center"}>
                        {item.doctor
                          ? item?.doctor?.firstname +
                            " " +
                            item?.doctor?.lastname
                          : null}
                      </td>
                      <td className={"text-base border text-center"}>
                        {item.room}
                      </td>
                      <td className={"text-base border text-center"}>
                        <Checkbox
                          isChecked={item.active}
                          onChange={(e) => handleChangeActiveCheckbox(e, index)}
                        />
                      </td>
                      <td className={"text-base border text-center"}>
                        <Checkbox
                          isChecked={item?.online}
                          onChange={(e) =>
                            handleChangeActiveCheckboxOnlineClients(e, index)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ModalBody>
            <ModalFooter>
              <Button
                variant={"solid"}
                onClick={handleOpenTurns}
                className={"!bg-green-500 !hover: !focus:"}
                textColor={"white"}
                isDisabled={!departmentsTurn.some((item) => item.active)}
              >
                {t("Ochish")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};
export default Departments;
