import React, { useEffect, useState } from "react";
import { ReactDOM } from "react-dom";
import { Button } from "react-bootstrap";
import "./ConvertToCSV.css";
import { useLocation } from "react-router-dom";

const ConvertToCSV = () => {
  const [jsonData, setJsonData] = useState(null);
  const [dataDisplay, setDataDisplay] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [notCheckedItems, setNonCheckedItems] = useState({});
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const jsonDataParam = params.get("jsonData");
    if (jsonDataParam) {
      const decodedJsonData = decodeURIComponent(jsonDataParam);
      setJsonData(JSON.parse(decodedJsonData));
    }
  }, [location]);

  // Global variable to store selected checkboxes
  const [jsonInput, setJsonInput] = useState("");
  useEffect(() => {
    if (jsonData) {
      setDataDisplay(jsonData);
      setJsonInput(JSON.stringify(jsonData, null, 2));
    }
  }, [jsonData]);

  const handleCheckboxChange = (event, key) => {
    const isChecked = event.target.checked;
    const updatedCheckedItems = { ...checkedItems };
    const updatedNotCheckedItems = { ...notCheckedItems };

    const updateCheckedItems = (data, parentKey) => {
      Object.entries(data).forEach(([nestedKey, nestedValue]) => {
        const fullKey = parentKey ? `${parentKey}.${nestedKey}` : nestedKey;

        // Update checked status
        updatedCheckedItems[fullKey] = isChecked;

        // Recursively update nested items
        if (typeof nestedValue === "object") {
          updateCheckedItems(nestedValue, fullKey);
        }
      });
    };

    // Update checked status for the current key
    updatedCheckedItems[key] = isChecked;

    // If the current key has nested data, update its checked status
    const selectedData = dataDisplay[key];
    if (typeof selectedData === "object") {
      updateCheckedItems(selectedData, key);
    }

    // Remove unchecked items from updatedCheckedItems
    if (!isChecked) {
      updatedNotCheckedItems[key] = true;
      delete updatedCheckedItems[key];
    } else {
      delete updatedNotCheckedItems[key];
    }

    // Update state with the updated checked items
    setNonCheckedItems(updatedNotCheckedItems);
    setCheckedItems(updatedCheckedItems);
  };

  const createConfigFile = () => {
    const combinedKeys = [];
    const uniqueKeysSet = new Set();
    const attributeCounts = {};
    const configurations = [];
    const notCheckedEntries = [];
    const notCheckedNestedKeys = [];
    const notCheckedParentKeys = [];
    const filteredKeys = [];
    const bKeys = [];
    let aKeys = [];

    if (!dataDisplay) {
      return;
    }
    const notCheckedKeys = Object.keys(notCheckedItems);
    notCheckedKeys.forEach((key) => {
      const entries = key.split(".");
      notCheckedEntries.push(entries);
    });

    notCheckedEntries.forEach((entry) => {
      const nestedEntries = entry.slice(1, notCheckedEntries.length);
      notCheckedNestedKeys.push(nestedEntries);
    });

    notCheckedNestedKeys.forEach((nestedKey) => {
      const notCheckedParentKey = nestedKey.slice(0, 1);
      notCheckedParentKeys.push(notCheckedParentKey);
    });
    const cKeys = Object.keys(checkedItems);
    cKeys.forEach((cKey) => {
      const bKey = cKey.split(".").slice(1, cKeys.length);
      bKeys.push(bKey);
    });
    bKeys.forEach((bKey) => {
      const aKey = bKey.slice(0, 1);
      aKeys.push(aKey);
    });
    aKeys = aKeys.flatMap((keys) => keys);
    filteredKeys.push(
      ...notCheckedParentKeys.flatMap((keys) =>
        keys.filter((element) => !aKeys.includes(element))
      )
    );

    const uniqueFilteredKeys = [...new Set([...filteredKeys])];

    console.log(notCheckedKeys, "notCheckedKeys");
    console.log(notCheckedEntries, "notCheckedEntries");
    console.log(notCheckedNestedKeys, "notCheckedNestedKeys");
    console.log(notCheckedParentKeys, "notCheckedParentKeys");
    console.log(uniqueFilteredKeys, "filteredKeys");
    console.log(cKeys, "cKeys");

    Object.keys(checkedItems).forEach((key) => {
      if (!checkedItems[key]) {
        return;
      }

      const path = key.split(".");
      let current = dataDisplay;
      let currentPath = "";

      for (let i = 0; i < path.length; i++) {
        const subKey = path[i];

        if (!current.hasOwnProperty(subKey)) {
          console.error("Invalid path:", key);
          return;
        }

        currentPath += (currentPath ? "/" : "") + subKey;
        const currentData = current[subKey];

        if (typeof currentData === "object") {
          current = currentData;
        } else {
          const [currency, attribute] = currentPath.split("/").slice(0, 2);
          const combinedKey = currency + "." + attribute;
          combinedKeys.push(combinedKey);
          uniqueKeysSet.add(combinedKey);

          const attribute1 = currentPath.split("/").pop();

          if (attributeCounts[attribute1]) {
            attributeCounts[attribute1].count++;
          } else {
            attributeCounts[attribute1] = {
              path: currentPath,
              pathLength: currentPath.split("/").length,
              count: 1,
              base: currency,
            };
          }

          break;
        }
      }
    });

    Object.entries(attributeCounts).forEach(([attribute_name, value]) => {
      const categories =
        value.pathLength === 1
          ? value.base
          : `${value.base}.keys()![${uniqueFilteredKeys}]`;
      if (value.count == uniqueKeysSet.size) {
        configurations.push({
          chartName: `${value.base}`,
          categories: categories,
          chartData: {
            name:
              value.pathLength === 1
                ? `${value.base}/${attribute_name}`
                : `${value.base}.keys()/${attribute_name}`,
            data: [],
          },
        });
      }
    });
    console.log(notCheckedItems, "notCheckedItems");
    console.log(configurations, "ConfigFile");
    const fileName = "configFile.json";
    const json = JSON.stringify(configurations, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const renderData = (data, parentKey = "") => {
    if (!data || typeof data !== "object") {
      return null;
    }

    return (
      <ul>
        {Object.entries(data).map(([key, value]) => {
          const fullKey = parentKey ? `${parentKey}.${key}` : key;
          const isChecked = checkedItems[fullKey] || false;

          return (
            <li key={key}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleCheckboxChange(e, fullKey)}
              />
              {key} :{" "}
              {typeof value === "object" ? renderData(value, fullKey) : value}
            </li>
          );
        })}

        {console.log(checkedItems, "checkeditems")}
      </ul>
    );
  };

  return (
    <>
      <div className="container-fluid">
        <div className="json-contianer">
          <textarea
            name="json-input"
            id="json-input"
            placeholder="Enter JSON data here"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          ></textarea>
          <div className="button-container">
            <Button
              onClick={createConfigFile}
              className="covert_btn"
              id="createConfigFile"
              variant="dark"
            >
              Convert To Config
            </Button>
          </div>
          <div id="json-ui">{renderData(dataDisplay)}</div>
        </div>
      </div>
    </>
  );
};

export default ConvertToCSV;
