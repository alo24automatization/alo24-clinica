import React from "react";
import { useTranslation } from "react-i18next";

export const InputService = ({
  departments,
  setService,
  service,
  inputHandler,
  keyPressed,
  saveHandler,
  servicetypes,
  loading
}) => {

  const {t} = useTranslation()

  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[14px]">{t("Bo'lim nomi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Xizmat turi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Xizmat nomi")}</th>
              {/* <th className="bg-alotrade text-[14px]">{t("Qisqartma nomi")}</th> */}
              {/* <th className="bg-alotrade text-[14px]">{t("Xizmat xonasi")}</th> */}
              <th className="bg-alotrade text-[14px]">{t("Narxi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Doktor ulushi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Kounteragent ulushi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Kounterdoktor ulushi")}</th>
              <th className="bg-alotrade text-[14px]">{t("Saqlash")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select
                  className="text-[14px] form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) =>
                    setService({
                      ...service,
                      department: e.target.value,
                    })
                  }
                  placeholder={t("Bo'limni tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Bo'limni tanlang")}</option>
                  {departments &&
                    departments.map((department, index) => {
                      return (
                        <option key={index} value={department._id}>
                          {department.name}
                        </option>
                      );
                    })}
                </select>
              </td>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) => {
                    if (e.target.value === "delete") {
                      let k = { ...service };
                      delete k.servicetype;
                      setService({
                        ...k,
                      });
                    } else {
                      setService({
                        ...service,
                        servicetype: e.target.value,
                      });
                    }
                  }}
                  placeholder={t("Xizmat turini tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Tanlang...")}</option>
                  {servicetypes &&
                    servicetypes.map((servicetype, index) => {
                      if (
                        service.department &&
                        (service.department === servicetype.department._id ||
                          (service.department._id &&
                            service.department._id ===
                            servicetype.department._id))
                      ) {
                        return (
                          <option key={index} value={servicetype._id}>
                            {servicetype.name}
                          </option>
                        );
                      }
                      return "";
                    })}
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="name"
                  value={service.name}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="name"
                  // placeholder={t("Xizmat nomini kiriting")}
                />
              </td>
              {/* <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="shortname"
                  value={service.shortname && service.shortname}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="text"
                  className="form-control w-75"
                  id="shortname"
                  // placeholder={t("Qisqartma nomini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="serviceroom"
                  value={service.serviceroom && service.serviceroom}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="shortname"
                  // placeholder={t("Xizmat xonasini kiriting")}
                />
              </td> */}
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={service.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  // placeholder={t("Xizmat narxini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="doctorProcient"
                  value={service.doctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="doctorProcient"
                  // placeholder={t("Shifokor ulushini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="counterAgentProcient"
                  value={service.counterAgentProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="counterAgentProcient"
                  // placeholder={t("Kontragent ulushini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="counterDoctorProcient"
                  value={service.counterDoctorProcient}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="counterDoctorProcient"
                  // placeholder={t("Yo'naltiruvchi shifokor ulushini kiriting")}
                />
              </td>
              <td>
                {loading ? <button
                  className="btn btn-info"
                  disabled
                >
                  <span class="spinner-border spinner-border-sm"></span>
                  Loading...
                </button> : <button
                  onClick={saveHandler}
                  className="btn btn-info py-1 px-4"
                >
                  {t("Saqlash")}
                </button>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
