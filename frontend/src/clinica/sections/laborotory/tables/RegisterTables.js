import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ExcelUpload } from "./uploadExcel/ExcelUpload";
import { useTranslation } from 'react-i18next';

const RegisterTables = ({
    setImports,
    setModal2,
    loading,
    newTable,
    deleteHandler,
    service,
    setService,
    createColumn,
    deleteTable,
    updateHandler,
    changeNewTable,
    createHandler
}) => {

    const {t} = useTranslation()

    const changeTables = (e, index, col) => {
        let tables = [...service.tables]
        tables[index][col] = e.target.value
        setService({ ...service, tables: [...tables] })
    }

    const changeCols = (e, col) => {
        let column = { ...service.column }
        column[col] = e.target.value

        const newTables = [...service.tables].map(t => {
            if (!t[col]) {
                t[col] = ""
            }
            return t;
        })

        setService({ ...service, tables: [...newTables], column: column })
    }
    return (
        <div className="overflow-x-scroll">
            <table className="w-full">
                <thead>
                    <tr className="bg-alotrade">
                        <th className="p-2 text-white">№</th>
                        <th className="border p-2">
                            <input
                                placeholder={t("Ustun nomi")}
                                className="bg-alotrade outline-0 text-white text-center font-bold"
                                type="text"
                                value={service && service.column && service.column.col1 ? service.column.col1 : ''}
                                onChange={(e) => {
                                    changeCols(e, 'col1')
                                }}
                            />
                        </th>
                        <th className="border p-2">
                            <input
                                placeholder={t("Ustun nomi")}
                                className="bg-alotrade outline-0 text-white text-center font-bold"
                                type="text"
                                value={service && service.column && service.column.col2 ? service.column.col2 : ''}
                                onChange={(e) => {
                                    changeCols(e, 'col2')
                                }}
                            />
                        </th>
                        <th className="border p-2">
                            <input
                                placeholder={t("Ustun nomi")}
                                className="bg-alotrade outline-0 text-white text-center font-bold"
                                type="text"
                                value={service && service.column && service.column.col3 ? service.column.col3 : ''}
                                onChange={(e) => {
                                    changeCols(e, 'col3')
                                }}
                            />
                        </th>
                        <th className="border p-2">
                            <input
                                placeholder={t("Ustun nomi")}
                                className="bg-alotrade outline-0 text-white text-center font-bold"
                                type="text"
                                value={service && service.column && service.column.col4 ? service.column.col4 : ''}
                                onChange={(e) => {
                                    changeCols(e, 'col4')
                                }}
                            />
                        </th>
                        <th className="border p-2">
                            <input
                                placeholder={t("Ustun nomi")}
                                className="bg-alotrade outline-0 text-white text-center font-bold"
                                type="text"
                                value={service && service.column && service.column.col5 ? service.column.col5 : ''}
                                onChange={(e) => {
                                    changeCols(e, 'col5')
                                }}
                            />
                        </th>

                        {/* <th className="border p-2">
                            <button
                                className="bg-white text-alotrade px-3 "
                                onClick={createColumn}
                            >
                                <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                        </th> */}
                        <th className="border p-2 text-white">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white px-3 "
                                onClick={deleteTable}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white">
                        <td className="border"></td>
                        <td className="border">
                            <textarea
                                className="w-full h-full outline-0 px-2 m-0"
                                type="text"
                                value={newTable.col1 ? newTable.col1 : ''}
                                onChange={(e) => {
                                    changeNewTable(e, 'col1')
                                }}
                            ></textarea>
                        </td>
                        <td className="border">
                            <textarea
                                className="w-full h-full outline-0 px-2 m-0"
                                type="text"
                                value={newTable.col2 ? newTable.col2 : ''}
                                onChange={(e) => {
                                    changeNewTable(e, 'col2')
                                }}
                            ></textarea>
                        </td>
                        <td className="border">
                            <textarea
                                className="w-full h-full outline-0 px-2 m-0"
                                type="text"
                                value={newTable.col3 ? newTable.col3 : ''}
                                onChange={(e) => {
                                    changeNewTable(e, 'col3')
                                }}
                            ></textarea>
                        </td>
                        <td className="border">
                            <textarea
                                className="w-full h-full outline-0 px-2 m-0"
                                type="text"
                                value={newTable.col4 ? newTable.col4 : ''}
                                onChange={(e) => {
                                    changeNewTable(e, 'col4')
                                }}
                            ></textarea>
                        </td>
                        <td className="border">
                            <textarea
                                className="w-full h-full outline-0 px-2 m-0"
                                type="text"
                                value={newTable.col5 ? newTable.col5 : ''}
                                onChange={(e) => {
                                    changeNewTable(e, 'col5')
                                }}
                            ></textarea>
                        </td>
                        <td className="text-center border">
                            {/* <button
                                onClick={createHandler}
                                className="bg-teal-500 px-3 text-white font-bold rounded-sm py-1"
                            >
                                +
                            </button> */}
                        </td>
                    </tr>
                    {
                        service && service.tables.map((table, index) => {
                            return <tr key={index} className="bg-white">
                                <td className="border text-center font-bold">{index + 1}</td>
                                <td className="border">
                                    <textarea
                                        className="w-full h-full outline-0 px-2 m-0"
                                        type="text"
                                        value={table.col1}
                                        onChange={(e) => {
                                            changeTables(e, index, 'col1')
                                        }}
                                    >
                                    </textarea>
                                </td>
                                <td className="border">
                                    <textarea
                                        className="w-full h-full outline-0 px-2 m-0"
                                        type="text"
                                        value={table.col2}
                                        onChange={(e) => {
                                            changeTables(e, index, 'col2')
                                        }}
                                    >
                                    </textarea>
                                </td>
                                <td className="border">
                                    <textarea
                                        className="w-full h-full outline-0 px-2 m-0"
                                        type="text"
                                        value={table.col3}
                                        onChange={(e) => {
                                            changeTables(e, index, 'col3')
                                        }}
                                    >
                                    </textarea>
                                </td>
                                <td className="border">
                                    <textarea
                                        className="w-full h-full outline-0 px-2 m-0"
                                        type="text"
                                        value={table.col4 || ''}
                                        onChange={(e) => {
                                            changeTables(e, index, 'col4')
                                        }}
                                    >
                                    </textarea>
                                </td>
                                <td className="border">
                                    <textarea
                                        className="w-full h-full outline-0 px-2 m-0"
                                        type="text"
                                        value={table.col5 || ''}
                                        onChange={(e) => {
                                            changeTables(e, index, 'col5')
                                        }}
                                    >
                                    </textarea>
                                </td>
                                {/* <td className="text-center border">
                                    <button
                                        onClick={() => updateHandler(index)}
                                        className="bg-teal-500 hover:bg-teal-600 px-3 py-1 text-white font-bold rounded-sm"
                                    >
                                        <FontAwesomeIcon icon={faFloppyDisk} />
                                    </button>
                                </td> */}
                                <td className="text-center border">
                                    <button
                                        className="bg-red-500 hover:bg-red-600 px-3 py-1 text-white font-bold rounded-sm"
                                        onClick={() => deleteHandler(index)}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        })
                    }
                    <tr>

                    </tr>
                </tbody>
            </table>

        </div>
    );
};

export default RegisterTables;


