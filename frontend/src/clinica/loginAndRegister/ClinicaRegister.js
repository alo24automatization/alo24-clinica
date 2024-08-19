import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHttp } from "../hooks/http.hook";
import {
  Input,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FileUpload } from "./fileUpLoad/FileUpload";
import { useToast } from "@chakra-ui/react";
import { checkClinicaData } from "./checkData";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseMedical } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "../loader/Loader";
import { FileUploadBlanka } from "./fileUpLoad/FileUploadBlanka";
import { t } from "i18next";
const storageName = "clinicaData";

const styleDefault = {
  border: "1.5px solid #eee",
  boxShadow: "none",
  height: "32px",
};

const styleGreen = {
  border: "1.5px solid #38B2AC",
  boxShadow: "none",
  height: "32px",
};

export const ClinicaRegister = ({ onFinishCreate, onFinishUpdate, clinicaData }) => {
  //====================================================================
  //====================================================================
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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [load, setLoad] = useState(false);

  const { request, loading } = useHttp();
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
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
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const [clinica, setClinica] = useState({
    image: null,
  });
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const handleImage = async (e) => {
    console.log("handleImage");
    if (clinica.image) {
      return notify({
        title: "Diqqat! Surat avval yuklangan",
        description:
          "Suratni qayta yulash uchun suratni ustiga bir marotaba bosib uni o'chiring!",
        status: "error",
      });
    }
    const files = e.target.files[0];
    const data = new FormData();
    data.append("file", files);
    setLoad(true);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const file = await res.json();
    setClinica({ ...clinica, image: file.filename });
    setLoad(false);
    notify({
      status: "success",
      description: "",
      title: "Surat muvaffaqqiyatli yuklandi",
    });
  };
  const [blankaImage, setBlankaImage] = useState(null);
  const cropperRef = useRef(null);
  const cmToPx = (cm) => Math.round(cm * 96 / 2.54);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBlankaImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCrop = async () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      width: cmToPx(30),
      height: cmToPx(4),
    });
    croppedCanvas.toBlob(async (blob) => {
      const data = new FormData();
      data.append("file", blob, "cropped_image.jpg");
      setLoad(true);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        const result = await res.json();
        setClinica({ ...clinica, blanka: result.filename });
        notify({
          status: "success",
          description: "",
          title: "Surat muvaffaqqiyatli yuklandi",
        });
      } catch (error) {
        notify({
          status: "error",
          description: "Fayl yuklash muvaffaqqiyatsiz tugadi",
          title: "Xato",
        });
      } finally {
        setLoad(false);
        setBlankaImage(null)
      }
    });
  };
  const removeImage = async (filename) => {
    try {
      const data = await request(`/api/upload/del`, "POST", { filename });
      setClinica({ ...clinica, image: null });
      document.getElementById("default-btn").value = null;
      notify({
        status: "success",
        description: "",
        title: data.accept,
      });
    } catch (error) {
      notify({
        status: "error",
        description: "",
        title: error,
      });
    }
  };
  const removeBlanka = async (filename) => {
    try {
      const data = await request(`/api/upload/del`, "POST", { filename });
      setClinica({ ...clinica, blanka: null });
      document.getElementById("default-btn").value = null;
      notify({
        status: "success",
        description: "",
        title: data.accept,
      });
    } catch (error) {
      notify({
        status: "error",
        description: "",
        title: error,
      });
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  const changeHandler = (e) => {
    setClinica({ ...clinica, [e.target.name]: e.target.value });
  };
  const onHandler = () => {
    if (clinica._id) {
      updatedHandler()
    } else {
      createHandler()
    }
  }

  const createHandler = async () => {
    if (checkClinicaData(clinica)) {
      return notify(checkClinicaData(clinica));
    }
    try {
      const data = await request("/api/clinica/register", "POST", {
        ...clinica,
      });
      localStorage.setItem(
        storageName,
        JSON.stringify({
          clinica: data,
        })
      );
      notify({
        title:
          "Tabriklaymiz! Klinikangiz 'Alo24' dasturida muvaffaqqiyatli ro'yxatga olindi ",
        description: "",
        status: "success",
      });
      onFinishCreate()
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };

  const updatedHandler = async () => {
    if (checkClinicaData(clinica)) {
      return notify(checkClinicaData(clinica));
    }
    try {
      const data = await request("/api/clinica/update", "PUT", {
        ...clinica,
      });
      localStorage.setItem(
        storageName,
        JSON.stringify({
          clinica: data,
        })
      );
      notify({
        title:
          "Tabriklaymiz! Klinikangiz malumotlari o'zgarildi!",
        description: "",
        status: "success",
      });
      onFinishUpdate()
    } catch (error) {
      notify({
        title: error,
        description: "",
        status: "error",
      });
    }
  };

  //====================================================================
  //====================================================================
  const keyPressed = (e) => {
    if (e.key === "Enter") {
      return onHandler();
    }
  };
  //====================================================================
  //====================================================================

  //====================================================================
  //====================================================================
  useEffect(() => {
    getBaseUrl();
  }, [getBaseUrl]);

  useEffect(() => {
    setClinica(clinicaData)
  }, [clinicaData]);
  //====================================================================
  //====================================================================

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="page-content container-fluid">
        <div className="row">
          <div className="col-xl-7 mx-auto">
            <div className="card " style={{ borderTop: "4px solid #38B2AC " }}>
              <div className="card-body p-5">
                <div
                  className="card-title d-flex align-items-center"
                  style={{ fontSize: "20pt", color: "#38B2AC" }}
                >
                  <div>
                    <FontAwesomeIcon icon={faHouseMedical} />
                  </div>
                  <h5 className="mb-0 fs-5 ml-2" style={{ fontWeight: "600" }}>
                    Shifoxona
                  </h5>
                </div>
                <hr />
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <FormControl isRequired>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Shifoxona nomi
                        </FormLabel>
                        <Textarea
                          className="is-valid"
                          placeholder="Shifoxona nomini kiriting"
                          size="sm"
                          style={
                            clinica.name && clinica.name.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.name && clinica.name}
                          onChange={changeHandler}
                          name="name"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl isRequired>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Название клиники
                        </FormLabel>
                        <Textarea
                          className="is-valid"
                          placeholder="Shifoxona nomini kiriting"
                          size="sm"
                          style={
                            clinica.name2 && clinica.name2.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.name2 && clinica.name2}
                          onChange={changeHandler}
                          name="name2"
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Tashkilot nomi
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Tashkilot nomini kiriting"
                          size="sm"
                          style={
                            clinica.organitionName &&
                              clinica.organitionName.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          name="organitionName"
                          defaultValue={clinica.organitionName && clinica.organitionName}
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Litsenziya
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Litsenziya kiriting"
                          size="sm"
                          style={
                            clinica.license &&
                              clinica.license.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          name="license"
                          defaultValue={clinica.license && clinica.license}
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Sayt
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Sayt nomini kiriting"
                          size="sm"
                          style={
                            clinica.site &&
                              clinica.site.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          name="site"
                          defaultValue={clinica.site && clinica.site}
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Telegram ID
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Telegram ID kiriting"
                          size="sm"
                          style={
                            clinica.telegramId &&
                              clinica.telegramId.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          name="telegramId"
                          defaultValue={clinica.telegramId && clinica.telegramId}
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Manzil
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Manzilni kiriting"
                          size="sm"
                          style={
                            clinica.address && clinica.address.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.address && clinica.address}
                          name="address"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Mo'ljal
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Mo'ljalni kiriting"
                          size="sm"
                          style={
                            clinica.orientation &&
                              clinica.orientation.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.orientation && clinica.orientation}
                          name="orientation"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Sms Api
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Sms Api"
                          size="sm"
                          style={
                            clinica.smsKey &&
                              clinica.smsKey.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.smsKey && clinica.smsKey}
                          name="smsKey"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl isRequired>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Telefon raqam1
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon
                            children="+998"
                            style={
                              clinica.phone1 && clinica.phone1.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                          />
                          <Input
                            onKeyUp={keyPressed}
                            type="tel"
                            placeholder="Telefon raqamni kiriting"
                            size="sm"
                            style={
                              clinica.phone1 && clinica.phone1.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                            defaultValue={clinica.phone1 && clinica.phone1}
                            name="phone1"
                            onChange={changeHandler}
                          />
                        </InputGroup>
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Telefon raqam2
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon
                            children="+998"
                            style={
                              clinica.phone2 && clinica.phone2.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                          />
                          <Input
                            onKeyUp={keyPressed}
                            type="tel"
                            placeholder="Telefon raqamni kiriting"
                            size="sm"
                            style={
                              clinica.phone2 && clinica.phone2.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                            defaultValue={clinica.phone2 && clinica.phone2}
                            name="phone2"
                            onChange={changeHandler}
                          />
                        </InputGroup>
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Telefon raqam3
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon
                            children="+998"
                            style={
                              clinica.phone3 && clinica.phone3.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                          />
                          <Input
                            onKeyUp={keyPressed}
                            type="tel"
                            placeholder="Telefon raqamni kiriting"
                            size="sm"
                            style={
                              clinica.phone3 && clinica.phone3.length > 0
                                ? styleGreen
                                : styleDefault
                            }
                            defaultValue={clinica.phone3 && clinica.phone3}
                            name="phone3"
                            onChange={changeHandler}
                          />
                        </InputGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Ifud1
                        </FormLabel>
                        <Textarea
                          onKeyUp={keyPressed}
                          placeholder="Ifud1 kiriting"
                          size="sm"
                          style={
                            clinica.ifud1 && clinica.ifud1.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.ifud1 && clinica.ifud1}
                          name="ifud1"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Ifud2
                        </FormLabel>
                        <Textarea
                          onKeyUp={keyPressed}
                          placeholder="Ifud2 kiriting"
                          size="sm"
                          style={
                            clinica.ifud2 && clinica.ifud2.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.ifud2 && clinica.ifud2}
                          name="ifud2"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Ifud3
                        </FormLabel>
                        <Textarea
                          onKeyUp={keyPressed}
                          placeholder="Ifud3 kiriting"
                          size="sm"
                          style={
                            clinica.ifud3 && clinica.ifud3.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.ifud3 && clinica.ifud3}
                          name="ifud3"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Bank nomi
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          placeholder="Bank nomini kiriting"
                          size="sm"
                          style={
                            clinica.bank && clinica.bank.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.bank && clinica.bank}
                          name="bank"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          INN
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          type="number"
                          placeholder="INN ni kiriting"
                          size="sm"
                          style={
                            clinica.inn && clinica.inn.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.inn && clinica.inn}
                          name="inn"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          Hisob raqam
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          type="number"
                          placeholder="Hisob raqamni kiriting"
                          size="sm"
                          style={
                            clinica.bankNumber && clinica.bankNumber.length > 0
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.bankNumber && clinica.bankNumber}
                          name="bankNumber"
                          onChange={changeHandler}
                        />
                      </FormControl>
                    </div>
                    <div className="col-md-12">
                      <FormControl>
                        <FormLabel
                          style={{ color: "#38B2AC", marginTop: "1rem" }}
                        >
                          O'chish sanasi
                        </FormLabel>
                        <Input
                          onKeyUp={keyPressed}
                          type="date"
                          placeholder="O'chish sanasini kiriting"
                          size="sm"
                          style={
                            clinica.close_date
                              ? styleGreen
                              : styleDefault
                          }
                          defaultValue={clinica.close_date && clinica.close_date}
                          name="close_date"
                          onChange={e => setClinica({ ...clinica, close_date: new Date(e.target.value).toISOString() })}
                        />
                      </FormControl>
                    </div>
                    <FormControl isRequired>
                      <FileUpload
                        removeImage={removeImage}
                        handleImage={handleImage}
                        load={load}
                        img={clinica.image}
                        imgUrl={
                          baseUrl &&
                          clinica.image &&
                          `${baseUrl}/api/upload/file/${clinica.image}`
                        }
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel
                        htmlFor="blanka_upload"
                        style={{ color: "#38B2AC", marginTop: "1rem" }}
                      >
                        Blanka
                      </FormLabel>
                      <FileUploadBlanka
                        removeImage={removeBlanka}
                        handleImage={handleImageChange}
                        load={load}
                        img={clinica?.blanka}
                        newAlt={"Blanka yuklang"}
                        imgUrl={
                          baseUrl &&
                          clinica?.blanka &&
                          `${baseUrl}/api/upload/file/${clinica?.blanka}`
                        }
                      />
                    </FormControl>
                    <Modal isOpen={!!blankaImage} onClose={() => setBlankaImage(null)}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>
                          {t("Suratni qirqish")}
                        </ModalHeader>
                          <ModalCloseButton />
                        <ModalBody>
                          {blankaImage && (
                            <Cropper
                              src={blankaImage}
                              style={{ height: 400, width: '100%' }}
                              initialAspectRatio={21 / 4}
                              aspectRatio={21 / 4}
                              viewMode={1} // restrict crop box to within the canvas
                              dragMode="move" // only allow moving the image
                              guides={false}
                              cropBoxResizable={false} // disable resizing of the crop box
                              cropBoxMovable={true} // allow moving the crop box
                              autoCropArea={1} // set the crop box to cover the entire image initially
                              ready={() => {
                                const cropper = cropperRef.current.cropper;
                                const requiredWidth = cmToPx(21);
                                const requiredHeight = cmToPx(4);
                                cropper.setCropBoxData({
                                  width: requiredWidth,
                                  height: requiredHeight,
                                  left: (cropper.getContainerData().width - requiredWidth) / 2,
                                  top: (cropper.getContainerData().height - requiredHeight) / 2,
                                });
                              }}
                              ref={cropperRef}
                            />
                          )}
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            colorScheme="teal"
                            variant="solid"
                            onClick={handleCrop}
                          >
                            {load ? 'Yuklanmoqda...' : 'Rasmni kesish va yuklash'}
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                  <div className="col-md-6 text-center mt-2">
                    {loading || load ? (
                      <Button
                        isLoading
                        colorScheme="teal"
                        variant="solid"
                      ></Button>
                    ) : (
                      <Button
                        colorScheme="teal"
                        variant="solid"
                        onClick={onHandler}
                      >
                        Registratsiya
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
