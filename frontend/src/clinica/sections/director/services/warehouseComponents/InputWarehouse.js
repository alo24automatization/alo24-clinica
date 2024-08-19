import React from "react";
import { useTranslation } from "react-i18next";

export const InputWarehouse = ({
  products,
  setWarehouse,
  warehouse,
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
              <th className="bg-alotrade text-[16px]">{t("Mahsulot nomi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Mahsulot soni")}</th>
              <th className="bg-alotrade text-[16px]">{t("Narxi")}</th>
              <th className="bg-alotrade text-[16px]">{t("Keltirilgan vaqti")}</th>
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
                    setWarehouse({
                      ...warehouse,
                      product: e.target.value,
                    })
                  }
                  placeholder={t("Bo'limni tanlang")}
                  style={{ minWidth: "70px" }}
                >
                  <option>{t("Mahsulotni tanlang")}</option>
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
                  name="total"
                  value={warehouse.total}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="total"
                  // placeholder={t("Mahsulot sonini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="price"
                  value={warehouse.price}
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="number"
                  className="form-control w-75"
                  id="price"
                  // placeholder={t("Mahsulot narxini kiriting")}
                />
              </td>
              <td>
                <input
                  style={{ minWidth: "70px" }}
                  name="dateofreciept"
                  onKeyUp={keyPressed}
                  onChange={inputHandler}
                  type="date"
                  className="form-control w-75"
                  id="dateofreciept"
                  // placeholder={t("Keltirilgan vaqtini kiriting")}
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
