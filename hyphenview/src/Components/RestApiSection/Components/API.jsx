import axios from "axios";
import { getHeadersAndParams } from "./Utils";
import { DataContext } from "./DataProvider";
import { useContext } from "react";
import { object } from "prop-types";

export const getData = async (
  formData,
  jsonText,
  paramData,
  headerData,
  /*tableData, checkBoxData,*/ formBody,
  urlEncoded
) => {
  const apiType = formData.type.toLowerCase();
  const apiURl = formData.url;
  const apiHeaders = getHeadersAndParams(headerData);
  const apiParams = getHeadersAndParams(paramData);
  const apiFormBody = getHeadersAndParams(formBody);
  const apiUrlEncoded = getHeadersAndParams(urlEncoded);
  //if(checkBoxData&&(tableData.key&&tableData.value)){
  //    apiURl=`${apiURl}?${tableData.key}=${tableData.value}`;
  //}
  console.log(typeof(jsonText),typeof(formData), "formData");

  try {

    let config = {
      method: apiType,
      maxBodyLength: Infinity,
      url: apiURl,
      // headers: { 
      //   'Content-Type': 'application/json'
      // },
      headers: apiHeaders,
      data : jsonText,
      params: apiParams,
      formData: apiFormBody,
      dataUrlEncoded: apiUrlEncoded,

    };
    
   const respons = await axios.request(config)
   return respons
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    // })
    // console.log(typeof(apiType),typeof(apiURl),jsonText,"jsonText")
    // const value = `${apiType}.${apiURl}.${jsonText}`
    // console.log(value,"value")

    // const respon = await axios({
    //   method: apiType,
    //   url: apiURl,
    //   body: JSON.parse(jsonText),
    //   // headers: apiHeaders,
    //   // params: apiParams,
    //   // formData: apiFormBody,
    //   // dataUrlEncoded: apiUrlEncoded,
    // });
    // return respon
  } catch (error) {
    console.log("Error while calling getData API", error);
    return error;
  }
};
