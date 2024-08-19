import React from "react";
import { useTranslation } from "react-i18next";

export const InputProductConnector = ({
  services,
  setServices,
  departments,
  setProductConnector,
  productConnector,
  inputHandler,
  keyPressed,
  saveHandler,
  products,
  loading
}) => {
  const {t} = useTranslation()
  return (
    <div className="border-0 table-container">
      <div className="table-responsive">
        <table className="table m-0">
          <thead>
            <tr>
              <th className="bg-alotrade text-[16px]">{t("Bo'lim nomi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Xizmat nomi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Mahsulot nomi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Soni")}</th>
              <th className="bg-alotrade text-[16px]">{t("Saqlash")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <select
                  className="form-control form-control-sm selectpicker"
                  id="select"
                  onChange={(e) =>
                    setServices(departments[e.target.value].services)
                  }
                  placeholder={t("Bo'limni tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Bo'limni tanlang")}</option>
                  {departments &&
                    departments.map((department, index) => {
                      return (
                        <option key={index} value={index}>
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
                    setProductConnector({
                      ...productConnector,
                      service: e.target.value,
                    });
                  }}
                  placeholder={t("Xizmat nomini tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Xizmat nomini tanlang")}</option>
                  {services &&
                    services.map((service, index) => {
                      return (
                        <option key={index} value={service._id}>
                          {service.name}
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
                    setProductConnector({
                      ...productConnector,
                      product: e.target.value,
                    });
                  }}
                  placeholder={t("Mahsulot turini tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Mahsulot turini tanlang")}</option>
                  {products &&
                    products.map((product, index) => {
                      return (
                        <option key={index} value={product._id}>
                          {product.name}
                        </option>
                      );
                    })}
                </select>
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="pieces"
                  value={productConnector.pieces}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="pieces"
                  // placeholder={t("Mahsulot sonini kiriting")}
                />
              </td>
              <td>
                {loading ? <button className="btn btn-info" disabled>
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
