import React from "react";
import { Tooltip } from "@chakra-ui/react";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as XLSX from "xlsx";

export const ExcelUpload = ({ setData, setModal, loading }) => {
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
        setData(d);
        setModal(true)
    });
  };

  return (
    <>
      <input
        className="d-none"
        id="excelLoader"
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <Tooltip hasArrow label="Barcha xizmatlarni import qilish" bg="green.400">
        {loading ? <button className="btn btn-success" disabled>
          <span class="spinner-border spinner-border-sm"></span>
          Loading...
        </button>
        :
        <button
          onClick={() => {
            document.getElementById("excelLoader").click();
          }}
          className="btn btn-success py-0 px-3 pt-1 align-middle"
        >
          <FontAwesomeIcon style={{ fontSize: "12pt" }} icon={faFileExcel} />
        </button>
        }
      </Tooltip>
    </>
  );
};
