import {
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import {
  faSave,
  faTrash,
  faTrashAlt,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import Select, { components } from "react-select";
import { AuthContext } from "../../../context/AuthContext";
import { useHttp } from "../../../hooks/http.hook";
import Print from "./Print";
import { useReactToPrint } from "react-to-print";
import TextEditor from "./TextEditor";
import LabPrint from "../../laborotory/components/Print";
import DoctorResult from "../conclusion/components/DoctorResult";
import QRCode from "qrcode";
import { useTranslation } from "react-i18next";
import AllServices from "./AllServices";
import ModalPrint from "./ModalPrint";
import ReactHtmlParser from "react-html-parser";
import CreatableSelect from "react-select/creatable";
import socketIOClient from "socket.io-client";

const CustomMenuWithInput = ({
  selectProps: { onHover, onChange, outHover },
  ...props
}) => {
  const { data } = props;
  return (
    <div
      className="hover:bg-sky-300 hover:bg-opacity-50 text-[16px] font-sans py-2 cursor-auto"
      onMouseLeave={() => outHover()}
      onMouseEnter={() => onHover(data)}
      onClick={() => onChange(data)}
    >
      {props.children}
    </div>
  );
};

const DoctorTemplate = ({
  client,
  connector,
  services,
  clientsType,
  baseUrl,
  allClients,
}) => {
  const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;
  const { t } = useTranslation();

  const { request, loading } = useHttp();
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
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
    [toast]
  );

  // const componentRef = useRef()
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: client && client?.firstname + ' ' + client?.lastname,

  // })
  const [complaints, setComplaints] = useState({});
  const getComplaints = async () => {
    try {
      const response = await request(
        `/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
        "GET",
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setComplaints(response);
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState();

  const getTemplates = useCallback(async () => {
    try {
      const data = await request(
        `/api/doctor/template/getall`,
        "POST",
        {
          clinica: auth && auth.clinica._id,
          doctor: auth && auth.user._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      setTemplates(
        data.map((el) => ({
          template: el.template,
          label: el.name,
          value: el.name,
        }))
      );
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, auth, notify]);

  const uploadFile = async (e, serviceid) => {
    const files = e.target.files[0];
    const data = new FormData();
    data.append("file", files);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const file = await res.json();
    setSections(
      [...sections].map((section) => {
        if (section._id === serviceid) {
          if (!section.files) {
            section.files = [`${baseUrl}/api/upload/file/${file.filename}`];
          } else {
            section.files.push(`${baseUrl}/api/upload/file/${file.filename}`);
          }
        }
        return section;
      })
    );
    notify({
      status: "success",
      description: "",
      title: "Surat muvaffaqqiyatli yuklandi",
    });
  };
  const [turnModalVisible, setTurnModalVisible] = useState(false);
  const nextTurn = allClients?.filter(
    (item) =>
      !item?.connector?.accept &&
      item?.client?._id !== client?._id &&
      item?.payments?.length > 0
  )[
    allClients?.filter(
      (item) =>
        !item?.connector?.accept &&
        item?.client?._id !== client?._id &&
        item?.payments?.length > 0
    ).length - 1
  ]?.services[0]?.turn;

  const handleSave = async () => {
    // I did it just to be safe
    setTimeout(async () => {
      if (clientsType === "offline") {
        await saveService();
      } else {
        await saveStatsionarService();
      }
    }, 400);
    if (nextTurn) {
      setTurnModalVisible(true);
    } else {
      callNextClient();
    }
  };
  const callNextClient = async () => {
    if (nextTurn) {
      await switchTurn(false);
    }
      fetchDepartmentsTurns(true, undefined);
  };
  const waitingAllClient = async () => {
    await switchTurn(true);
  };
  const switchTurn = async (active) => {
    try {
      const data = await request(
        `/api/services/department/switchTurn`,
        "PATCH",
        {
          clinica: auth?.clinica?._id,
          id: services[0]?.department?._id,
          active,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: data.message,
        description: "",
        status: "success",
      });
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };
  const saveService = async () => {
    try {
      const updatedSections = sections.map((section) => ({
        ...section,
        clientMoreDetails: { ...clientMoreDetails, _id: client?._id },
      }));
      const data = await request(
        `/api/doctor/clients/adopt`,
        "POST",
        {
          services: updatedSections,
          connector: connector._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t(data.message),
        description: "",
        status: "success",
      });
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };
  const fetchDepartmentsTurns = (next, clientId) => {
    const socket = socketIOClient(ENDPOINT, {
      path: "/ws",
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Socket connected!");
      socket.emit(
        "getDepartments",
        {
          clinicaId: auth?.clinica?._id,
          next,
          clientId,
          departments_ids: [services[0].department?._id],
        },
        (response) => {
          console.log("Socket response:", response);
          // Disconnect the socket after the operation
          socket.disconnect();
          console.log("Socket disconnected!");
        }
      );
    });
  };
  const saveStatsionarService = async () => {
    try {
      const data = await request(
        `/api/doctor/clients/statsionar/adopt`,
        "POST",
        {
          services: sections,
          connector: connector._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      notify({
        title: t(data.message),
        description: "",
        status: "success",
      });
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };

  const deleteFile = (file, serviceid) => {
    setSections(
      [...sections].map((section) => {
        if (section._id === serviceid) {
          const filterFile = [...section.files].filter((el) => el !== file);
          section.files = filterFile;
        }
        return section;
      })
    );
  };

  const handleAddTemplate = (template, serviceid) => {
    const newSections = sections.map((section) => {
      if (section.service._id === serviceid) {
        section.templates.push({
          template: template.template,
          name: template.label,
        });
      }
      return section;
    });
    setSections(newSections);
  };

  const handleChangeTemplate = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.template = e;
          }
          return template;
        });
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  };

  const handleChangeTemplateName = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.name = e;
          }
          return template;
        });
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  };

  const handleDeleteTemplate = (index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.filter(
          (_, ind) => ind !== index
        );
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  };

  const changeTransform = (e, index, serviceid) => {
    const newSections = [...sections].map((section) => {
      if (section._id === serviceid) {
        const newTemplates = section.templates.map((template, ind) => {
          if (ind === index) {
            template.transform = e ? false : true;
          }
          return template;
        });
        section.templates = newTemplates;
      }
      return section;
    });
    setSections(newSections);
  };

  useEffect(() => {
    setSections(
      [...services].filter(
        (service) =>
          service.department.probirka === false &&
          service.department._id === auth?.user?.specialty?._id
      )
    );
  }, [services]);

  const [qr, setQr] = useState();

  useEffect(() => {
    if (connector && baseUrl) {
      QRCode.toDataURL(
        `${baseUrl}/clienthistory/laboratory/${connector._id}`
      ).then((data) => {
        setQr(data);
      });
    }
  }, [connector, baseUrl]);

  useEffect(() => {
    getTemplates();
    getComplaints();
  }, [getTemplates]);

  //=====================================================================
  //=====================================================================

  const [templateModal, setTemplateModal] = useState(false);
  const [templateModalTitle, setTemplateModalTitle] = useState("");
  const [templateModalText, setTemplateModalText] = useState("");

  const handleOnHover = (data) => {
    setTemplateModal(true);
    setTemplateModalTitle(data?.label);
    setTemplateModalText(data?.template);
  };
  const [clientMoreDetails, setClientMoreDetails] = useState({});
  const onCreateComplaint = async (newValue, type) => {
    try {
      await request(
        `/api/doctor/complaint?clinica=${auth?.clinica?._id}&doctor=${auth?.userId}`,
        "POST",
        { type: type, name: newValue },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      getComplaints();
    } catch (error) {
      notify({
        title: t(`${error}`),
        description: "",
        status: "error",
      });
    }
  };
  const changeUserMoreDetails = (value, type) => {
    if (type === "complaints" || type === "diagnostics") {
      value = value.map((option) => option.value);
    }
    setClientMoreDetails((prev) => ({ ...prev, [type]: value }));
  };
  const formatCreateLabel = (inputValue) => `Yaratish "${inputValue}"`;
  const customStyles = {
    option: (provided, state) => {
      if (state.data.__isNew__) {
        return {
          ...provided,
          backgroundColor: "green",
          color: "white",
        };
      }
      return provided;
    },
  };
  return (
    <>
      <Modal
        isCentered
        isOpen={turnModalVisible}
        onClose={() => setTurnModalVisible(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className={"flex items-center justify-between"}>
              <div></div>
              <h1>
                {t("Keyingi mijoz №")} {nextTurn && nextTurn}
              </h1>
              <CloseButton onClick={() => setTurnModalVisible(false)} />
            </div>
          </ModalHeader>
          <ModalBody>
            <div className={"flex items-center justify-center gap-x-3"}>
              <Button
                onClick={callNextClient}
                colorScheme="green"
                className="focus:!shadow-none"
              >
                {t("Chaqirish")}
              </Button>
              <Button
                onClick={waitingAllClient}
                colorScheme="orange"
                className="focus:!shadow-none"
              >
                {t("Kutish rejimi")}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="container p-4 bg-white" style={{ fontFamily: "times" }}>
        <div className="px-4">
          {auth?.clinica?.ifud1 && (
            <div className="row" style={{ fontSize: "10pt" }}>
              <div
                className="col-4"
                style={{ border: "1px solid", textAlign: "center" }}
              >
                <p className="pt-2">{auth?.clinica?.ifud1}</p>
              </div>
              <div
                className="col-4"
                style={{
                  border: "1px solid",
                  textAlign: "center",
                  borderLeft: "none",
                }}
              >
                <p className="pt-2">{auth?.clinica?.ifud2}</p>
              </div>
              <div
                className="col-4"
                style={{
                  border: "1px solid",
                  textAlign: "center",
                  borderLeft: "none",
                }}
              >
                <p style={{ margin: "0" }}>{auth?.clinica?.ifud3}</p>
              </div>
            </div>
          )}
          <div
            className="flex justify-between items-center row"
            style={{ fontSize: "20pt" }}
          >
            {auth?.clinica?.blanka ? (
              <div className="py-2 w-full">
                <img
                  src={baseUrl + "/api/upload/file/" + auth?.clinica?.blanka}
                  className="w-full h-[4cm]"
                />
              </div>
            ) : (
              <>
                <div className="pt-2" style={{ textAlign: "center" }}>
                  <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                    {auth?.clinica?.name}
                  </pre>
                </div>
                <div className="pt-2" style={{ textAlign: "center" }}>
                  <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                    {auth?.clinica?.name2}
                  </pre>
                </div>
                <div className="" style={{ textAlign: "center" }}>
                  <p className="text-end m-0">
                    <img width="120" src={qr && qr} alt="QR" />
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: "0" }}>
              <table
                style={{
                  width: "100%",
                  border: "2px solid",
                  borderTop: "3px solid",
                }}
              >
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Mijozning F.I.SH")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    <h4>
                      {client && client.lastname + " " + client.firstname}
                    </h4>
                  </td>
                  <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                    <p className="fw-bold fs-5 m-0">
                      {t("TAHLIL")} <br /> {t("NATIJALARI")}
                    </p>
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Tug'ilgan yili")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && new Date(client.born).toLocaleDateString()}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Kelgan sanasi")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("NAMUNA")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector && connector.probirka}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Manzil")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.address}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("ID")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.id}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
            <span className="text-[14px] font-bold">
              {auth.clinica?.organitionName}
            </span>
            <span className="text-[14px] font-bold">
              {auth?.clinica?.license}
            </span>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-[20px] font-bold">
              {auth?.user?.signature}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4  gap-x-3 p-3">
          <FormControl>
            <FormLabel htmlFor="complaint_select">{t("Shikoyati")}</FormLabel>
            <CreatableSelect
              styles={customStyles}
              formatCreateLabel={formatCreateLabel}
              onChange={(value) => changeUserMoreDetails(value, "complaints")}
              isMulti
              isLoading={loading}
              onCreateOption={(newValue) =>
                onCreateComplaint(newValue, "complaints")
              }
              placeholder={"Shikoyat tanlang"}
              id="complaint_select"
              isClearable
              options={complaints?.complaints?.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="diagnostics_select">{t("Diagnoz")}</FormLabel>
            <CreatableSelect
              styles={customStyles}
              formatCreateLabel={formatCreateLabel}
              onChange={(value) => changeUserMoreDetails(value, "diagnostics")}
              isMulti
              isLoading={loading}
              onCreateOption={(newValue) =>
                onCreateComplaint(newValue, "diagnostics")
              }
              placeholder={"Diagnoz tanlang"}
              id="diagnostics_select"
              isClearable
              options={complaints?.diagnostics?.map((item) => ({
                value: item._id,
                label: item.name,
              }))}
            />
          </FormControl>
          {/* <FormControl>
            <FormLabel htmlFor="Operatsiya_select">{t("Operatsiya")}</FormLabel>
            <CreatableSelect styles={customStyles} formatCreateLabel={formatCreateLabel} isLoading={loading} placeholder={"Operatsiya"} id="Operatsiya_select" isClearable
            // options={complaints?.diagnostics?.map(item => ({ value: item._id, label: item.name }))}
            />
          </FormControl> */}
          <FormControl>
            <FormLabel htmlFor="complaint_select">{t("Nogironligi")}</FormLabel>
            <div className="btn-group gap-x-3 ">
              <Button
                onClick={() => changeUserMoreDetails(true, "isDisability")}
                variant={clientMoreDetails?.isDisability ? "solid" : "outline"}
                className="focus:!shadow-none"
              >
                {t("Bor")}
              </Button>
              <Button
                onClick={() => changeUserMoreDetails(false, "isDisability")}
                variant={!clientMoreDetails?.isDisability ? "solid" : "outline"}
                className="focus:!shadow-none"
              >
                {t("Yo'q")}
              </Button>
            </div>
          </FormControl>
        </div>
        <div className="pt-4 w-full">
          {sections.length > 0 &&
            sections.map((section, index) => (
              <div key={index} className={"w-full"}>
                <div className="w-full flex items-center mb-4">
                  <div className="w-[200px] mr-[20rem]">
                    <Select
                      id="template-select"
                      // ref={selectRef}
                      options={templates}
                      onChange={(e) => {
                        handleAddTemplate(e, section.service._id);
                        setTemplateModal(false);
                      }}
                      components={{ Option: CustomMenuWithInput }}
                      onHover={handleOnHover}
                      outHover={() => setTemplateModal(false)}
                      closeMenuOnSelect={true}
                    />
                  </div>
                  <h2 className="block text-[18px] font-bold">
                    {section?.service?.name}
                  </h2>
                </div>
                {section.templates &&
                  section.templates.length > 0 &&
                  section.templates.map((template, index) => (
                    <div
                      key={index}
                      className="p-[10px] w-full border border-black"
                    >
                      <div className="flex justify-between items-center py-2 px-4">
                        <div className="text-[18px] font-bold">
                          <input
                            value={template?.name}
                            placeholder={t("Shablon nomi kiritish")}
                            className="w-[200px] border outline-0 rounded-sm p-1"
                            onChange={(e) => {
                              handleChangeTemplateName(
                                e.target.value,
                                index,
                                section._id
                              );
                            }}
                          ></input>
                        </div>
                        <div className="flex justify-between items-center">
                          <FontAwesomeIcon
                            onClick={() =>
                              handleDeleteTemplate(index, section._id)
                            }
                            icon={faTrash}
                            style={{
                              cursor: "pointer",
                              fontSize: "18px",
                              color: "red",
                            }}
                          />
                        </div>
                      </div>
                      <div className="">
                        <TextEditor
                          changeTransform={() =>
                            changeTransform(
                              template?.transform,
                              index,
                              section._id
                            )
                          }
                          transform={template?.transform}
                          value={template?.template}
                          onChange={(data) =>
                            handleChangeTemplate(data, index, section._id)
                          }
                        />
                      </div>
                    </div>
                  ))}
                <div>
                  <div className="mt-4 mb-2">
                    <input
                      onChange={(e) => uploadFile(e, section._id)}
                      type="file"
                      className=""
                    />
                  </div>
                  <div className="">
                    {section.files &&
                      section.files.length > 0 &&
                      section.files.map((file) => (
                        <div className="w-[400px]">
                          <img src={file} alt="file" />
                          <div className="px-4 pt-2">
                            <button
                              className=""
                              onClick={() => deleteFile(file, section._id)}
                            >
                              <FontAwesomeIcon fontSize={16} icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
        {auth?.user.blanka ? (
          <div className="py-2 w-full">
            <img
              src={baseUrl + "/api/upload/file/" + auth?.user?.blanka}
              className="w-full h-[4cm]"
            />
          </div>
        ) : null}
        <div className="row">
          <div className="col-12 text-center my-4">
            <button className="btn btn-success px-4 mx-4" onClick={handleSave}>
              {" "}
              {t("Tasdiqlash")}
            </button>
            <button
              className="btn btn-info px-5"
              onClick={() => setModal(true)}
            >
              {t("Chop etish")}
            </button>
          </div>
        </div>
      </div>
      <ModalPrint
        doctor={auth.user}
        connector={connector}
        client={client}
        clinica={auth && auth.clinica}
        baseUrl={baseUrl}
        qr={qr}
        modal={modal}
        services={sections}
        setModal={setModal}
      />
      <div
        className={`${
          templateModal ? "fixed" : "hidden"
        } border-2 border-green-500 top-[50%] left-[30%] translate-y-[-50%] max-w-[800px] h-[600px] bg-white p-2 overflow-scroll`}
      >
        <h2 className="block text-center mb-4 text-[16px] font-bold">
          {templateModalTitle}
        </h2>
        <div className={`w-full text-[14px] mb-2 print_word`}>
          {ReactHtmlParser(templateModalText)}
        </div>
      </div>
    </>
  );
};

const LabTemplate = ({ client, connector, services, baseUrl }) => {
  const { t } = useTranslation();

  const { request } = useHttp();
  const auth = useContext(AuthContext);

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
    [toast]
  );

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [sections, setSections] = useState([]);

  const handleCheckAllAccept = (ind) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = [];
        const isAllTrue =
          section.services.filter(
            (s) =>
              s.tables.filter((table) => table.accept).length ===
              s.tables.length
          ).length === section.services.length;
        if (isAllTrue) {
          newServices = section.services.map((service) => {
            const newTables = [...service.tables].map((item) => {
              item.accept = false;
              return item;
            });
            service.tables = newTables;
            service.accept = false;
            return service;
          });
        } else {
          newServices = section.services.map((service) => {
            const newTables = [...service.tables].map((item) => {
              item.accept = true;
              return item;
            });
            service.tables = newTables;
            service.accept = true;
            return service;
          });
        }
        section.services = newServices;
      }
      return section;
    });
    setSections(filtered);
  };
  const handleCheckAccept = (ind, serviceid, tableind) => {
    const filtered = sections.map((section, index) => {
      if (index === ind) {
        let newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            let tables = [...service.tables].map((table, i) => {
              if (i === tableind) {
                table.accept = table.accept ? false : true;
              }
              return table;
            });
            service.tables = tables;
            service.accept = !service.accept;
          }
          return service;
        });
        section.services = newServices;
      }
      return section;
    });
    setSections(filtered);
  };

  const handleChangeTables = (e, sectionind, serviceid, tableind, prop) => {
    const newSections = [...sections].map((section, index) => {
      if (index === sectionind) {
        const newServices = section.services.map((service) => {
          if (service._id === serviceid) {
            const newTables = service.tables.map((table, ind) => {
              if (ind === tableind) {
                table[`${prop}`] = e.target.value;
              }
              return table;
            });
            service.tables = newTables;
          }
          return service;
        });
        section.services = newServices;
      }
      return section;
    });
    setSections(newSections);
  };

  //===========================================================
  //===========================================================

  const [qr, setQr] = useState();

  useEffect(() => {
    const servicetypesAll = services.reduce((prev, el) => {
      if (!prev.includes(el.serviceid.servicetype.name)) {
        prev.push(el.serviceid.servicetype.name);
      }
      return prev;
    }, []);
    let servicetypes = [];
    for (const type of servicetypesAll) {
      services.map((service) => {
        if (service.column && service.tables.length > 0) {
          if (
            service.serviceid.servicetype.name === type &&
            service.tables.length <= 2
          ) {
            const cols = Object.keys(service.column).filter(
              (c) => c.includes("col") && service.column[c]
            ).length;
            const isExist = servicetypes.findIndex(
              (i) => i.servicetype === type && i.cols === cols
            );
            if (isExist >= 0) {
              servicetypes[isExist].services.push(service);
            } else {
              servicetypes.push({
                column: service.column,
                servicetype: type,
                services: [service],
                cols: cols,
              });
            }
          }
        }
        return service;
      });
    }

    const servicesmore = [...servicetypesAll].reduce((prev, el) => {
      services.map((service) => {
        if (
          service.serviceid.servicetype.name === el &&
          service.tables.length > 2
        ) {
          prev.push({
            column: service.column,
            servicetype: service.service.name,
            services: [service],
          });
        }
        return service;
      });
      return prev;
    }, []);

    setSections([...servicetypes, ...servicesmore]);
  }, [services]);

  useEffect(() => {
    if (connector && baseUrl) {
      QRCode.toDataURL(
        `${baseUrl}/clienthistory/laboratory/${connector._id}`
      ).then((data) => {
        setQr(data);
      });
    }
  }, [connector, baseUrl]);

  return (
    <>
      <div className="d-none">
        <div
          ref={componentRef}
          className="container p-4"
          style={{ fontFamily: "times" }}
        >
          <LabPrint
            baseUrl={baseUrl}
            clinica={auth?.clinica}
            connector={connector}
            client={client}
            sections={sections}
            qr={qr}
          />
        </div>
      </div>
      <div
        className="container p-4 bg-white text-center"
        style={{ fontFamily: "times" }}
      >
        <div className="px-4">
          {auth?.clinica?.ifud1 && (
            <div className="row" style={{ fontSize: "10pt" }}>
              <div
                className="col-4"
                style={{ border: "1px solid", textAlign: "center" }}
              >
                <p className="pt-2">{auth?.clinica?.ifud1}</p>
              </div>
              <div
                className="col-4"
                style={{
                  border: "1px solid",
                  textAlign: "center",
                  borderLeft: "none",
                }}
              >
                <p className="pt-2">
                  {t("IFUD")}: {auth?.clinica?.ifud2}
                </p>
              </div>
              <div
                className="col-4"
                style={{
                  border: "1px solid",
                  textAlign: "center",
                  borderLeft: "none",
                }}
              >
                <p style={{ margin: "0" }}>{auth?.clinica?.ifud3}</p>
              </div>
            </div>
          )}
          <div className="row" style={{ fontSize: "20pt" }}>
            {auth?.clinica?.blanka ? (
              <div className="py-2 w-full">
                <img
                  src={baseUrl + "/api/upload/file/" + auth?.clinica?.blanka}
                  className="w-full h-[4cm]"
                />
              </div>
            ) : (
              <>
                <div className="col-6 pt-2" style={{ textAlign: "center" }}>
                  <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                    {auth?.clinica?.name}
                  </pre>
                </div>
                <div className="col-6 pt-2" style={{ textAlign: "center" }}>
                  <pre className="pt-3" style={{ fontFamily: "-moz-initial" }}>
                    {auth?.clinica?.name2}
                  </pre>
                </div>
                <div className="col-6" style={{ textAlign: "center" }}>
                  <p className="text-end m-0">
                    {/* <img width="120" src={qr && qr} alt="QR" /> */}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="row">
            <div className="col-12" style={{ padding: "0" }}>
              <table
                style={{
                  width: "100%",
                  border: "2px solid",
                  borderTop: "3px solid",
                }}
              >
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Mijozning F.I.SH")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    <h4>
                      {client && client.lastname + " " + client.firstname}
                    </h4>
                  </td>
                  <td rowSpan="2" colSpan={2} style={{ width: "33%" }}>
                    <p className="fw-bold fs-5 m-0">
                      {t("TAHLIL")} <br /> {t("NATIJALARI")}
                    </p>
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Tug'ilgan yili")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && new Date(client.born).toLocaleDateString()}
                  </td>
                </tr>
                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Kelgan sanasi")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector &&
                      new Date(connector.createdAt).toLocaleDateString()}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("NAMUNA")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "100px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {connector && connector.probirka}
                  </td>
                </tr>

                <tr style={{ textAlign: "center" }}>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("Manzil")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "33%",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.address}
                  </td>
                  <td
                    className="p-0 fw-bold"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                    }}
                  >
                    {t("ID")}
                  </td>
                  <td
                    className="p-0"
                    style={{
                      width: "200px",
                      backgroundColor: "white",
                      border: "1px solid #000",
                      fontSize: "20px",
                    }}
                  >
                    {client && client.id}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <div className="mt-2 px-2 py-1 bg-gray-400 flex justify-between items-center">
            <span className="text-[14px] font-bold">
              {auth.clinica?.organitionName}
            </span>
            <span className="text-[14px] font-bold">
              {auth?.clinica?.license}
            </span>
          </div>
        </div>
        <div className="pt-4 w-full text-center">
          {sections.length > 0 &&
            sections.map((section, index) => {
              if (
                section.services.filter(
                  (serv) => serv.column && serv.tables.length > 0
                ).length > 0
              ) {
                return (
                  <div key={index} className={"w-full mb-4 text-center"}>
                    <div className="w-full flex justify-center items-center mb-4">
                      <h2 className="block text-[18px] font-bold">
                        {section?.servicetype}
                      </h2>
                    </div>
                    <table className="w-full text-center">
                      <thead>
                        <tr>
                          <th className="border-2 bg-gray-400 border-black px-[10px] text-center">
                            {section?.column?.col1}
                          </th>
                          {section?.column?.col2 && (
                            <th className="border-2 bg-gray-400 border-black px-[10px] text-center">
                              {section?.column?.col2}
                            </th>
                          )}
                          {section?.column?.col3 && (
                            <th className="border-2 bg-gray-400 border-black px-[10px] py-[7px] text-center">
                              {section?.column?.col3}
                            </th>
                          )}
                          {section?.column?.col4 && (
                            <th className="border-2 bg-gray-400 border-black px-[10px] text-center">
                              {section?.column?.col4}
                            </th>
                          )}
                          {section?.column?.col5 && (
                            <th className="border-2 bg-gray-400 border-black px-[10px] text-center">
                              {section?.column?.col5}
                            </th>
                          )}
                          <th className="border-2 bg-gray-400 border-black  p">
                            <div className="custom-control custom-checkbox text-center">
                              <input
                                checked={
                                  section.services.filter(
                                    (s) =>
                                      s.tables.filter((t) => t.accept)
                                        .length === s.tables.length
                                  ).length === section.services.length
                                }
                                type="checkbox"
                                className="custom-control-input border border-dager"
                                id={`section${index}`}
                                onChange={() => handleCheckAllAccept(index)}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`section${index}`}
                              ></label>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section?.services.map((service, ind) => {
                          return (
                            <>
                              {service.tables &&
                                service.tables.length > 0 &&
                                service.tables.map((table, key, tabless) => (
                                  <tr key={key}>
                                    <td className="border-2 border-black p-[10px]">
                                      {" "}
                                      <textarea
                                        rows={2}
                                        className={
                                          "w-full border-none outline-none"
                                        }
                                        onChange={(e) =>
                                          handleChangeTables(
                                            e,
                                            index,
                                            service._id,
                                            key,
                                            "col1"
                                          )
                                        }
                                      >
                                        {table?.col1}
                                      </textarea>
                                    </td>
                                    <td className="border-2 border-black p-[10px] text-center">
                                      <textarea
                                        rows={2}
                                        className={
                                          "w-full border-none outline-none text-center focus:outline-2 focus:outline-emerald-600"
                                        }
                                        onChange={(e) =>
                                          handleChangeTables(
                                            e,
                                            index,
                                            service._id,
                                            key,
                                            "col2"
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "ArrowDown") {
                                            if (
                                              key ===
                                                service.tables.length - 1 &&
                                              ind !==
                                                section.services.length - 1 &&
                                              index !== sections.length - 1
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${index}-${
                                                    ind + 1
                                                  }-${0}`
                                                )
                                                .focus();
                                            } else if (
                                              index !== sections.length - 1 &&
                                              ind ===
                                                section.services.length - 1 &&
                                              key === service.tables.length - 1
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${index + 1}-${0}-${0}`
                                                )
                                                .focus();
                                            } else if (
                                              index === sections.length - 1 &&
                                              ind ===
                                                section.services.length - 1 &&
                                              key === service.tables.length - 1
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${0}-${0}-${0}`
                                                )
                                                .focus();
                                            } else {
                                              document
                                                .getElementById(
                                                  `result${index}-${ind}-${
                                                    key + 1
                                                  }`
                                                )
                                                .focus();
                                            }
                                          }
                                          if (e.key === "ArrowUp") {
                                            if (
                                              key === 0 &&
                                              ind === 0 &&
                                              index === 0
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${
                                                    sections.length - 1
                                                  }-${
                                                    sections[
                                                      sections.length - 1
                                                    ].services.length - 1
                                                  }-${
                                                    sections[
                                                      sections.length - 1
                                                    ].services[
                                                      sections[
                                                        sections.length - 1
                                                      ].services.length - 1
                                                    ].tables.length - 1
                                                  }`
                                                )
                                                .focus();
                                            } else if (
                                              key === 0 &&
                                              ind !== 0 &&
                                              index === 0
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${index}-${ind - 1}-${
                                                    sections[index].services[
                                                      ind - 1
                                                    ].tables.length - 1
                                                  }`
                                                )
                                                .focus();
                                            } else if (
                                              key === 0 &&
                                              ind !== 0 &&
                                              index !== 0
                                            ) {
                                              document
                                                .getElementById(
                                                  `result${index - 1}-${
                                                    sections[index - 1]
                                                      .services[
                                                      services.length - 1
                                                    ]
                                                  }-${
                                                    sections[index - 1]
                                                      .services[
                                                      services.length - 1
                                                    ].tables.length - 1
                                                  }`
                                                )
                                                .focus();
                                            } else {
                                              document
                                                .getElementById(
                                                  `result${index}-${ind}-${
                                                    key - 1
                                                  }`
                                                )
                                                .focus();
                                            }
                                          }
                                        }}
                                        id={`result${index}-${ind}-${key}`}
                                      >
                                        {table?.col2}
                                      </textarea>
                                    </td>
                                    <td className="border-2 border-black p-[10px]">
                                      <textarea
                                        rows={2}
                                        className={
                                          "w-full border-none outline-none text-center"
                                        }
                                        onChange={(e) =>
                                          handleChangeTables(
                                            e,
                                            index,
                                            service._id,
                                            key,
                                            "col3"
                                          )
                                        }
                                      >
                                        {table?.col3}
                                      </textarea>
                                    </td>
                                    {section?.column?.col4 && (
                                      <td className="border-2 border-black p-[10px]">
                                        <textarea
                                          rows={2}
                                          className={
                                            "w-full border-none outline-none text-center"
                                          }
                                          onChange={(e) =>
                                            handleChangeTables(
                                              e,
                                              index,
                                              service._id,
                                              key,
                                              "col4"
                                            )
                                          }
                                        >
                                          {table?.col4}
                                        </textarea>
                                      </td>
                                    )}
                                    {section?.column?.col5 && (
                                      <td className="border-2 border-black p-[10px]">
                                        <textarea
                                          rows={2}
                                          className={
                                            "w-full border-none outline-none text-center"
                                          }
                                          onChange={(e) =>
                                            handleChangeTables(
                                              e,
                                              index,
                                              service._id,
                                              key,
                                              "col5"
                                            )
                                          }
                                        >
                                          {table?.col5}
                                        </textarea>
                                      </td>
                                    )}
                                    <td
                                      className={`border-2 border-black p-[10px]`}
                                    >
                                      <div className="custom-control custom-checkbox text-center">
                                        <input
                                          checked={table?.accept}
                                          type="checkbox"
                                          className="custom-control-input border border-dager"
                                          id={`service${table._id}`}
                                          onChange={() =>
                                            handleCheckAccept(
                                              index,
                                              service._id,
                                              key
                                            )
                                          }
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor={`service${table._id}`}
                                        ></label>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              }
            })}
        </div>
        {auth?.user.blanka ? (
          <div className="py-2 w-full">
            <img
              src={baseUrl + "/api/upload/file/" + auth?.user?.blanka}
              className="w-full h-[4cm]"
            />
          </div>
        ) : null}
        <div className="row">
          <div className="col-12 text-center my-4">
            <button className="btn btn-info px-5" onClick={handlePrint}>
              {t("Chop etish")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const AdoptionTemplate = () => {
  const { t } = useTranslation();

  const { client, connector, services, clientsType, user, allClients } =
    useLocation()?.state || {};
  const connectorData = useLocation()?.state || {};
  const [modal, setModal] = useState(false);
  const [modalBody, setModalBody] = useState("all");

  const [type, setType] = useState("doctor");

  const { request } = useHttp();
  const auth = useContext(AuthContext);

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
    [toast]
  );

  const [baseUrl, setBaseUrl] = useState();

  const getBaseUrl = useCallback(async () => {
    try {
      const data = await request("/api/baseurl", "GET", null);
      setBaseUrl(data.baseUrl);
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  }, [request, notify]);

  useEffect(() => {
    getBaseUrl();
  }, [getBaseUrl]);
  return (
    <div className="container p-4 bg-white text-center">
      <div className="flex">
        <div className="w-[300px]">
          <Select
            options={[
              {
                label: t("Shifokor"),
                value: "doctor",
              },
              {
                label: t("Laboratoriya"),
                value: "laboratory",
              },
              {
                label: t("Xammasi"),
                value: "all",
              },
            ]}
            placeholder={t("Tanlang...")}
            onChange={(e) => setType(e.value)}
          />
        </div>
        <button
          onClick={() => {
            setModal(true);
            setModalBody("all");
          }}
          className="ml-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white"
        >
          Xizmatlar
        </button>
        <button
          onClick={() => {
            setModal(true);
            setModalBody("own");
          }}
          className="ml-4 block px-4 py-2 bg-alotrade text-center rounded-2 text-white"
        >
          Yullanma
        </button>
      </div>
      {type === "doctor" && (
        <DoctorTemplate
          user={user}
          clientsType={clientsType}
          baseUrl={baseUrl}
          client={client}
          connector={connector}
          services={services}
          allClients={allClients}
        />
      )}
      {type === "laboratory" && (
        <LabTemplate
          client={client}
          connector={connector}
          services={services}
          baseUrl={baseUrl}
        />
      )}
      {type === "all" && (
        <DoctorResult
          client={client}
          connector={connectorData}
          user={auth?.user}
          clinica={auth?.clinica}
          baseUrl={baseUrl}
        />
      )}
      <AllServices
        modal={modal}
        services={services || []}
        setModal={setModal}
        modalBody={modalBody}
        user={user}
      />
    </div>
  );
};

export default AdoptionTemplate;
