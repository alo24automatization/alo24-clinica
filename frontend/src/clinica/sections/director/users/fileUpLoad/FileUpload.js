import React from "react";
import cloudUpLoad from "./image/cloudUpLoad.png";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export const FileUpload = ({ imgUrl, img, handleImage, removeImage, load }) => {
  const { t } = useTranslation()
  const toast = useToast();
  return (
    <div className="container" style={{ marginTop: "30px" }}>
      <div className="wrapper">
        {img ? (
          <div className="image" style={{ zIndex: "1" }}>
            <img
              id="clinicaimg"
              src={imgUrl}
              alt="Fayl topilmadi"
              className="rounded-3"
            />
            <button id="cancel-btn" onClick={() => removeImage(img)}>
              <SmallCloseIcon />
            </button>
          </div>
        ) : (
          <div className="content">
            <div className="icon">
              <img
                src={imgUrl ? imgUrl : cloudUpLoad}
                style={{ width: "100px", margin: "auto" }}
                alt="Klinika logotipi yoki suratini yuklang"
              />
            </div>
            <div className="text text-primary text-center">{t("Surat yuklanmagan!")}</div>
          </div>
        )}
      </div>
      <input
        id="default-btn"
        type="file"
        className="d-none"
        onChange={handleImage}
      />
      {load ? (
        <button></button>
      ) : (
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => {
            if (!img) {
              document.getElementById("default-btn").click();
            } else {
              toast({
                title: "Diqqat! Surat avval yuklangan",
                description:
                  "Suratni qayta yulash uchun suratni ustiga bir marotaba bosib uni o'chiring!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right",
              });
            }
          }}
        >
          {t("Suratni yuklash")}
        </button>
      )}
    </div>
  );
};
