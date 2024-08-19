import React from "react";
import { FormControl,Modal, ModalBody, ModalFooter, Button, ModalCloseButton, ModalOverlay, FormLabel, ModalContent, ModalHeader } from "@chakra-ui/react";
import { FileUpload } from "./fileUpLoad/FileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { FileUploadBlanka } from "../../../loginAndRegister/fileUpLoad/FileUploadBlanka";
export const RegistorUser = ({
  auth,
  cmToPx,
  removeBlanka,
  blankaImage,
  cropperRef,
  handleCrop,
  handleImageChange,
  setBlankaImage,
  counteragents,
  removeImage,
  handleImage,
  load,
  user,
  baseUrl,
  changeHandler,
  keyPressed,
  setUser,
  sections,
  departments,
  createHandler,
  loading,
  clinicaList,
  getDepartments
}) => {
  const {t} = useTranslation()
  return (
    <div>
      {/* Row start */}
      <div className="row gutters">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="doctor-profile">
                <FormControl isRequired>
                  <FileUpload
                    removeImage={removeImage}
                    handleImage={handleImage}
                    load={load}
                    img={user.image}
                    imgUrl={
                      baseUrl &&
                      user.image &&
                      `${baseUrl}/api/upload/file/${user.image}`
                    }
                  />
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("Foydalanuvchi ma'lumotlari")}</div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="fullName">{t("Familiyasi")}</label>
                    <input
                      onChange={changeHandler}
                      onKeyUp={keyPressed}
                      type="text"
                      className="form-control"
                      id="lastname"
                      name="lastname"
                      placeholder={t("Familiyasi")}
                      defaultValue={user.lastname}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="inputEmail">{t("Ismi")}</label>
                    <input
                      onChange={changeHandler}
                      onKeyUp={keyPressed}
                      name="firstname"
                      type="text"
                      className="form-control"
                      id="firstname"
                      placeholder={t("Ismi")}
                      defaultValue={user.firstname}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="education">{t("Otasining ismi")}</label>
                    <input
                      onChange={changeHandler}
                      onKeyUp={keyPressed}
                      type="text"
                      className="form-control"
                      id="fathername"
                      name="fathername"
                      placeholder={t("Otasining ismi")}
                      defaultValue={user.fathername}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="inputSpeciality">{t("Telefon raqami")}</label>
                    <div className="input-group mb-2 mr-sm-2">
                      <div className="input-group-prepend">
                        <div className="input-group-text">+998</div>
                      </div>
                      <input
                        onChange={changeHandler}
                        onKeyUp={keyPressed}
                        type="number"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="971234567"
                        defaultValue={user.phone}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label htmlFor="signature">{t("Shifokorning imzosi")}</label>
                      <input
                        onChange={changeHandler}
                        onKeyUp={keyPressed}
                        type="signature"
                        className="form-control"
                        id="signature"
                        name="signature"
                        placeholder={t("Shifokorning imzosi")}
                        defaultValue={user?.signature}
                      />
                  </div>
                </div>
              </div>
            </div>
            {
              (user.type && user.type === "Doctor") ||
                (user.type && user.type === "Laborotory") ?
                <div className="card-footer col-md-12">
                  <FormControl className="w-full h-full">
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
                      img={user?.blanka}
                      newAlt={"Blanka yuklang"}
                      imgUrl={
                        baseUrl &&
                        user?.blanka &&
                        `${baseUrl}/api/upload/file/${user?.blanka}`
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
                </div> : null
            }
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">{t("Mutaxasisligi va paroli")}</div>
            </div>
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label htmlFor="addreSs">{t("Xodimning mustaxasisligi")}</label>
                    <select
                      onChange={(e) => {
                        setUser({ ...user, type: e.target.value });
                      }}
                      className="form-control form-control-sm selectpicker"
                      id="select"
                      placeholder={t("Bo'limni tanlang")}
                      style={{ minWidth: "70px" }}
                    >
                      <option>{t("Mutaxasisligi")}</option>
                      {sections &&
                        sections.map((section, index) => {
                          return (
                            <option key={index} value={section.type}>
                              {section.value}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                {(user.type && user.type === "Doctor") ||
                  (user.type && user.type === "Laborotory") ? (
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label htmlFor="addreSs">{t("Shifokorning ixtisosligi")}</label>
                      <select
                        onChange={(e) => {
                          setUser({ ...user, specialty: e.target.value });
                        }}
                        className="form-control form-control-sm selectpicker"
                        id="select"
                        placeholder={t("Bo'limni tanlang")}
                        style={{ minWidth: "70px" }}
                      >
                        <option>{t("Ixtisosligi")}</option>
                        {departments &&
                          departments.map((department, index) => {
                            return (
                              <option key={index} value={department._id}>
                                {department.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="statsionar_profit">{t("Statsionar ulushi")}</label>
                      <input
                        onChange={changeHandler}
                        onKeyUp={keyPressed}
                        type="number"
                        className="form-control"
                        id="statsionar_profit"
                        name="statsionar_profit"
                        placeholder="Statsionar ulushi"
                        defaultValue={user?.statsionar_profit || ""}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {user.type && user.type === "CounterDoctor" ? (
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="form-group">
                      <label htmlFor="addreSs">{t("Kounteragentni tanlang")}</label>
                      <select
                        onChange={(e) => {
                          setUser({ ...user, user: e.target.value });
                        }}
                        className="form-control form-control-sm selectpicker"
                        id="select"
                        placeholder={t("Bo'limni tanlang")}
                        style={{ minWidth: "70px" }}
                      >
                        <option>{t("Kontragentlar")}</option>
                        {counteragents &&
                          counteragents.map((counteragent, index) => {
                            if (counteragent.type === "CounterAgent") {
                              return (
                                <option key={index} value={counteragent._id}>
                                  {counteragent.lastname +
                                    " " +
                                    counteragent.firstname}
                                </option>
                              );
                            }
                            return "";
                          })}
                      </select>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label htmlFor="password">{t("Paroli")}</label>
                    <input
                      onChange={changeHandler}
                      onKeyUp={keyPressed}
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder={t("Parol")}
                    />
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="form-group">
                    <label htmlFor="rePassword">{t("Parolni qayta kiriting")}</label>
                    <input
                      onChange={changeHandler}
                      onKeyUp={keyPressed}
                      type="password"
                      className="form-control"
                      id="rePassword"
                      placeholder={t("Qayta kiritish")}
                      name="confirmPassword"
                    />
                  </div>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div>
                    {loading ? (
                      <button className="btn btn-success" disabled>
                        <span class="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          setUser({
                            type: null,
                            clinica: null,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={faRecycle} />
                      </button>
                    )}
                    {loading ? (
                      <button className="btn btn-primary" disabled>
                        <span class="spinner-border spinner-border-sm"></span>
                        Loading...
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary float-right"
                        onClick={createHandler}
                      >
                        {t("Yaratish")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
      {/* Row end */}
    </div>
  );
};
