import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import "./Table.css";

const AddRowComponent = ({ rowData, onAddRow, onUpdateRow, isLastRow }) => {
  const [isChecked, setIsChecked] = useState(rowData.isChecked);
  //const [rows, setRows] = useState([0]);
  //const {tableData, setTableData, checkBoxData, setCheckBoxData}=useContext(DataContext);
  const [key, setKey] = useState(rowData.key);
  const [value, setValue] = useState(rowData.value);

  useEffect(() => {
    onUpdateRow({ id: rowData.id, key, value, isChecked });
  }, [isChecked, key, value]);

  const handleCheck = () => {
    setIsChecked(!isChecked);
    // onUpdateRow({ id: rowData.id, key, value, isChecked });
    if (!isChecked && isLastRow) onAddRow();
  };

  const onKeyChange = (e) => {
    setKey(e.target.value);
    // onUpdateRow({ id: rowData.id, key, value, isChecked });
  };

  const onValueChange = (e) => {
    setValue(e.target.value);
    // onUpdateRow({ id: rowData.id, key, value, isChecked });
  };

  return (
    <tr>
      <td>
        <Form.Check
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleCheck(e)}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder="Key"
          name="key"
          value={key}
          onChange={(e) => onKeyChange(e)}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder="Value"
          name="value"
          value={value}
          onChange={(e) => onValueChange(e)}
        />
      </td>
    </tr>
  );
};

export default AddRowComponent;
