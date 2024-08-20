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
  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [departmentsTurn, setDepartmentsTurn] = useState([]);
  const [onlineDepartmentsTurn, setOnlineDepartmentsTurn] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedOnlineClientIndex, setSelectedOnlineClientIndex] =
    useState(null);

  const getDepartments = async () => {
    try {
      const data = await request(
        `/api/offlineclient/client/turns/get`,
        "POST",
        { clinica: auth && auth.clinica._id },
        {
          Authorization: `Bearer ${auth.token}`,
        },
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
    localStorage.removeItem("selected_departments");
    localStorage.removeItem("selected_department_names");
    localStorage.removeItem("selected_online_clients");
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
      onlineActive: false, // Add a separate state for online checkbox
    }));
    setDepartmentsTurn(addActiveFields);
    setOnlineDepartmentsTurn(addActiveFields);
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
      onlineActive: false, // Reset both checkboxes when closing modal
    }));
    setDepartmentsTurn(addActiveFields);
    setOnlineDepartmentsTurn(addActiveFields);
    localStorage.removeItem("selected_online_clients");
  };

  const handleChangeActiveCheckbox = (e, index) => {
    const updatedDepartmentsTurn = [...departmentsTurn];
    updatedDepartmentsTurn[index].active = e.target.checked;
    setDepartmentsTurn(updatedDepartmentsTurn);
    saveLocalStorageSelectedDepartments();
  };

  const handleOnlineClientsCheckbox = (e, index) => {
    const isChecked = e.target.checked;

    // Update the state to ensure only one checkbox can be checked at a time
    const updatedDepartmentsTurn = departmentsTurn.map((item, i) => ({
      ...item,
      onlineActive: i === index ? isChecked : false,
    }));

    setDepartmentsTurn(updatedDepartmentsTurn);

    // Update selected index based on checked state
    setSelectedOnlineClientIndex(isChecked ? index : null);

    // Save to localStorage using the updated departmentsTurn
    saveLocalStorageSelectedOnlineClients(updatedDepartmentsTurn);
  };

  const saveLocalStorageSelectedOnlineClients = (updatedDepartmentsTurn) => {
    // Find the single selected online client
    const selectedClient = updatedDepartmentsTurn.find(
      (item) => item.onlineActive,
    );

    // Save the selected client ID to localStorage
    localStorage.setItem(
      "selected_online_clients",
      JSON.stringify(selectedClient ? [selectedClient._id] : []),
    );
  };

  const saveLocalStorageSelectedDepartments = () => {
    localStorage.setItem(
      "selected_departments",
      JSON.stringify(
        departmentsTurn.filter((item) => item.active).map((item) => item._id),
      ),
    );
    localStorage.setItem(
      "selected_department_names",
      JSON.stringify(
        departmentsTurn
          .filter((item) => item.active)
          .map((item) => {
            return { departmentName: item.name };
          }),
      ),
    );
  };

  useEffect(() => {
    saveLocalStorageSelectedDepartments();
  }, [departmentsTurn]);

  const handleOpenTurns = () => {
    if (
      departmentsTurn.filter((item) => item.active).map((item) => item._id)
        .length === 1
    ) {
      history.push(
        `/alo24/turns?_id=${
          departmentsTurn
            .filter((item) => item.active)
            .map((item) => item._id)[0]
        }`,
      );
    } else {
      history.push(`/alo24/turns`);
    }
  };

  const groupedDepartments = departments.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.floor === item.floor),
  );

  return (
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
                    {t("Tanlash")}
                  </th>
                  <th className={"text-base border text-center"}>
                    {t("Online mijozlar")}
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
                        ? item?.doctor?.firstname + " " + item?.doctor?.lastname
                        : null}
                    </td>
                    <td className={"text-base border text-center"}>
                      {item.room}
                    </td>
                    <td className={"text-base border text-center"}>
                      <Checkbox
                        isChecked={departmentsTurn[index]?.active}
                        onChange={(e) => handleChangeActiveCheckbox(e, index)}
                      />
                    </td>
                    <td className={"text-base border text-center"}>
                      <Checkbox
                        isChecked={departmentsTurn[index]?.onlineActive} // Ensure this reflects the state
                        onChange={(e) => handleOnlineClientsCheckbox(e, index)}
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
  );
};

export default Departments;
