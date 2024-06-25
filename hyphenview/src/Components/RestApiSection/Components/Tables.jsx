import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import AddRowComponent from "./Rows";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import "./Table.css";

function TableComponent({
  text,
  data,
  setData /*tableData, setTableData, checkboxData, setCheckBoxData*/,
}) {
  //const [rows, addRows] = useState([...data,{id:data.length,isChecked:false}]);

  const handleAddRow = () => {
    setData((prev) => [
      ...prev,
      { id: prev.length, key: "", value: "", isChecked: false },
    ]);
  };

  const handleUpdateRow = (rowUpdatedData) => {
    setData((prev) =>
      prev.map((currData) =>
        currData.id === rowUpdatedData.id ? rowUpdatedData : currData
      )
    );
  };

  console.log(data);

  return (
    <div>
      <label>{text}</label>
      <table
        style={{ minWidth: "100%", border: "1px solid rgba(224, 224, 224, 1)" }}
        aria-label="simple table"
      >
        <thead>
          <th></th>
          <th className="key">Key</th>
          <th className="value">Value</th>
        </thead>
        <tbody>
          {data.map((rowData, index) => (
            <AddRowComponent
              //={addRows}
              key={index}
              rowData={rowData}
              onAddRow={handleAddRow}
              onUpdateRow={handleUpdateRow}
              isLastRow={index === data.length - 1}
              /*tableData={tableData}
              setTableData={setTableData}
              checkboxData={checkboxData}
              setCheckBoxData={setCheckBoxData}
              */
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
