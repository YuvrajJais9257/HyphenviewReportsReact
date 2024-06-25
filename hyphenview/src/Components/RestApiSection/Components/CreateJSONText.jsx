import "../Components/CreateJSONText.css";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { Dropdown } from "react-bootstrap";
import TableComponent from "./Tables";

function CreateJSONText() {
  const [paramType, setParamType] = useState("none");
  const { jsonText, setJsonText } = useContext(DataContext);
  const { formBody, setFormBody, urlEncoded, setUrlEncoded } =
    useContext(DataContext);

  const onValueChange = (e) => {
    setJsonText(e.target.value);
  };

  const handleParamChange = (newParams) => {
    setParamType(newParams);
  };

  return (
    <>
      <div>
        <Dropdown className="param-dropdown-container">
          <Dropdown.Toggle
            style={{ width: "fit-content" }}
            variant="light"
            id="auth-method-dropdown"
            className="black-link"
          >
            {paramType}
          </Dropdown.Toggle>
          <Dropdown.Menu className="sharp-dropdown-menu">
            <Dropdown.Item
              onClick={() => handleParamChange("none")}
              href="#/none"
            >
              none
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleParamChange("form-data")}
              href="#/form-data"
            >
              form-data
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleParamChange("x-www-form-urlencoded")}
              href="#/x-www-form-urlencoded"
            >
              x-www-form-urlencoded
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleParamChange("raw")}
              href="#/raw"
            >
              raw
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleParamChange("binary")}
              href="#/binary"
            >
              binary
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => handleParamChange("GraphQL")}
              href="#/GraphQL"
            >
              GraphQL
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {paramType === "raw" && (
        <>
          <label htmlFor="jsonTextarea" mt={2} mb={2}>
            JSON
          </label>
          <div className="param-item">
            <textarea 
              className="Created_Json_textarea"
              id="jsonTextarea"
              value={jsonText}
              onChange={(e) => onValueChange(e)}
            ></textarea>
          </div>
        </>
      )}
      {paramType === "form-data" && (
        <TableComponent
          text="form-data"
          data={formBody}
          setData={setFormBody}
        />
      )}
      {paramType === "x-www-form-urlencoded" && (
        <TableComponent
          text="x-www-form-urlencoded"
          data={urlEncoded}
          setData={setUrlEncoded}
        />
      )}
    </>
  );
}

export default CreateJSONText;
