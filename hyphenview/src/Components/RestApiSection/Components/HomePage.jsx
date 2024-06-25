import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import "../Components/Home.css";
import FormComponent from "./Forms";
import TabComponent from "./Tabs";
import Response from "./Response";
import ErrorScreen from "./ErrorScreen";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { checkParams } from "./Utils";
import SnackBarComponent from "./SnackBar";
import { getData } from "./API";
import Header from "../../header";
const HomePage = () => {
  const {
    formData,
    jsonText,
    paramData,
    headerData,
    /*tableData, checkBoxData,*/ formBody,
    urlEncoded,
    dataSource,
    authMethod,
    userName,
    pass,
    bearer,
    id,
    secret,
    token,
    refreshToken,
    scopeEntry,
  } = useContext(DataContext);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorResponse, setErrorResponse] = useState(false);
  const [apiResponse, setApiResponse] = useState({});

  const dataEntries = {
    DataSource: dataSource,
    RequestType: formData.type,
    ApiURL: formData.url,
    ...(authMethod !== "none" && { AuthenticationType: authMethod }),
    ...(authMethod === "Basic Auth" && { Username: userName, Password: pass }),
    ...(authMethod === "Bearer Token" && { bearerToken: bearer }),
    ...(authMethod === "OAuth2.0" && {
      clientId: id,
      clientSecret: secret,
      tokenUrl: token,
      refreshTokenUrl: refreshToken,
      scope: scopeEntry,
    }),
    InputJSON: jsonText,
  };

  const onSendClick = async () => {
    // console.log(JSON.stringify(dataEntries, null, 2));
    if (
      !checkParams(
        formData,
        jsonText,
        paramData,
        headerData,
        formBody,
        urlEncoded,
        setErrorMessage
      )
    ) {
      setError(true);
      return false;
    }
    let response = await getData(
      formData,
      jsonText,
      paramData,
      headerData,
      /*tableData,*/ formBody,
      urlEncoded /*checkBoxData*/
    );
    if (response === "error") {
      setErrorResponse(true);
      return;
    }
    if (response.status === 200) {
      setErrorResponse(false);
      setApiResponse(response.data);
    } else {
      console.log("error", response);
    }
  };

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="home">

        <FormComponent onSendClick={onSendClick} />
        <TabComponent />
        {errorResponse ? <ErrorScreen /> : <Response data={apiResponse} />}
        {error && (
          <SnackBarComponent
            error={error}
            setError={setError}
            errorMessage={errorMessage}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
