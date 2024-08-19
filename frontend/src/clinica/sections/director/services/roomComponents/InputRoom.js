import React from "react";
import { useTranslation } from "react-i18next";

export const InputRoom = ({
  room,
  inputHandler,
  keyPressed,
  saveHandler,
  loading
}) => {
  const {t} = useTranslation()
  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[16px]">{t("Xona turi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Xona raqami")}</th>
              <th className="bg-alotrade text-[16px]">{t("O'rin raqami")}</th>
              <th className="bg-alotrade text-[16px]">{t("Narxi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Shifokor ulushi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Hamshira ulushi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Saqlash")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="type"
                  value={room.type && room.type}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="type"
                  // placeholder={t("Xona turini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="number"
                  value={room.number && room.number}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="number"
                  // placeholder={t("Xona nomini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="place"
                  value={room.place}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="place"
                  // placeholder={t("Yotoq o'rnini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={room.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  // placeholder={t("Narxini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="doctorProcient"
                  value={room?.doctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="doctorProcient"
                  // placeholder={t("Narxini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="nurseProcient"
                  value={room?.nurseProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="nurseProcient"
                  // placeholder={t("Hamshira ulushini")}
                />
              </td>
              <td>
                {loading ?
                  <button
                    className="btn btn-info"
                    disabled
                  >
                    <span class="spinner-border spinner-border-sm"></span>
                    Loading...
                  </button>
                  :
                  <button
                    onClick={saveHandler}
                    className="btn btn-info py-1 px-4"
                  >
                    {t("Saqlash")}
                  </button>
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
