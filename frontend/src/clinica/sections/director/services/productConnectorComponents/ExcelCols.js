import React, { useEffect, useState } from "react";

export const ExcelCols = ({ sections, data, setData, createdData }) => {
  const [cols, setCols] = useState([]);

  const changeHanler = (value, val) => {
    let k = [...createdData];
    for (const d in data) {
      if (data[d][val]) {
        k[d][value] = data[d][val];
      } else {
        delete k[d][value];
      }
    }
    setData(k);
  };

  useEffect(() => {
    let s = [];
    let k = [];
    for (const d of data) {
      k.push({});
      for (const [key, value] of Object.entries(d)) {
        s.push(key);
        localStorage.setItem("del", value);
      }
    }
    setCols(s.filter((v, i) => s.indexOf(v) === i));
    setData(k);
  }, [data, setData]);
  return (
    <div>
      {sections.map((section, index) => {
        return (
          <div className="row my-2" key={index}>
            <div className="col-6 ">
              <span className="form-control form-control-sm text-right">
                {section.name}
              </span>
            </div>
            <div className="col-6 ">
              <select
                className="form-control form-control-sm selectpicker"
                onChange={(e) => {
                  changeHanler(section.value, e.target.value);
                }}
              >
                <option value="delete">Bo'limni belgilang</option>
                {cols.map((col, index) => {
                  return (
                    <option key={index} value={col}>
                      {col}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};
