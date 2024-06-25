import React, { createContext, useState } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
  const [formData, setFormData] = useState({ url: "", type: "GET" });
  const [paramData, setParamData] = useState([
    { id: 0, key: "", value: "", isChecked: false },
  ]);
  const [headerData, setHeaderData] = useState([
    { id: 0, key: "", value: "", isChecked: false },
  ]);
  const [jsonText, setJsonText] = useState("");
  //const [tableData, setTableData] = useState({key:'',value:''});
  //const [checkBoxData, setCheckBoxData]=useState(false);
  const [formBody, setFormBody] = useState([]);
  const [urlEncoded, setUrlEncoded] = useState([]);
  const [dataSource, setDataSource] = useState("");
  const [authMethod, setAuthMethod] = useState("none");
  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [bearer, setBearer] = useState("");
  const [id, setId] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [scopeEntry, setScopeEntry] = useState("");

  return (
    <DataContext.Provider
      value={{
        formData,
        setFormData,
        paramData,
        setParamData,
        headerData,
        setHeaderData,
        jsonText,
        setJsonText,
        //tableData,
        //setTableData,
        //checkBoxData,
        //setCheckBoxData,
        formBody,
        setFormBody,
        urlEncoded,
        setUrlEncoded,
        dataSource,
        setDataSource,
        authMethod,
        setAuthMethod,
        userName,
        setUserName,
        pass,
        setPass,
        bearer,
        setBearer,
        id,
        setId,
        secret,
        setSecret,
        token,
        setToken,
        refreshToken,
        setRefreshToken,
        scopeEntry,
        setScopeEntry,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
