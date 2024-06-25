// import React, { useState, useEffect } from 'react';
// import './Response.css';
// import { useContext } from 'react';
// import { DataContext } from './DataProvider';
// import { Button } from '../../globalCSS/Button/Button';
// import { useDispatch } from 'react-redux';
// import {restapidetailsave} from '../../../actions/restapi'
// import { useNavigate } from 'react-router-dom';
// const Response=({data})=>{
//     const { formData, jsonText, paramData, headerData, tableData, checkBoxData, formBody, urlEncoded, dataSource, authMethod, userName, pass,bearer, id, secret,token, refreshToken, scopeEntry } = useContext(DataContext);
//     const user = JSON.parse(localStorage.getItem('profile'));
//     let obj = data;
//     let readableObj = '{\n';
  
//     const dispatch = useDispatch();
//     const history = useNavigate()
//     const dataEntries={
//         DataSource: dataSource,
//         customer_id : user.customer_id,
//         RequestType:formData.type,
//         ApiURL:formData.url,
//         ...(authMethod !== 'none' && { "AuthenticationType": authMethod }),
//         ...(authMethod === 'Basic Auth' && {"Username":userName,"Password": pass}),
//         ...(authMethod === 'Bearer Token' && {"bearerToken":bearer}),
//         ...(authMethod === 'OAuth2.0' && {"clientId": id, "clientSecret": secret, "tokenUrl": token, "refreshTokenUrl":refreshToken, "scope": scopeEntry}),
//         jsonText,
//     };

//     for (let [key, value] of Object.entries(obj)) {
//         readableObj += ` ${typeof value === 'string' ? `'${value}'` : JSON.stringify(value)},\n`;
//     }

//     readableObj += '}';

//     const onSave=()=>{
//         dispatch(restapidetailsave({api_details : dataEntries},history))
//     }

//     return(
//         <>
//         <div className='output-container params-container'>
//       <label>Output</label>
//       <div className='param-item'>
//           <textarea
//             placeholder=''
//             readOnly
//             className="textarea-no-list-style"
//             value={readableObj}
//             disabled
//           ></textarea>
//         </div>
//         {obj && Object.keys(obj).length > 0 && (
//                 <div className="btn-save">
//                     <Button className='btn btn-success' onClick={onSave}>Save</Button>
//                 </div>
//             )}
//     </div>
//         </>
//     )
// }

// export default Response;



import React, { useState, useEffect } from "react";
import "./Response.css";
import { useContext } from "react";
import { DataContext } from "./DataProvider";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restapidetailsave } from "../../../actions/restapi";
import { Button } from '../../globalCSS/Button/Button';
 
const Response = ({ data }) => {
  const {
    formData,
    jsonText,
    paramData,
    headerData,
    tableData,
    checkBoxData,
    formBody,
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
 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(33);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
 
  let obj = data;
  let readableObj = "{\n";
 
  const onProceed = () => {
    console.log(JSON.stringify(dataEntries, null, 2), "dataEntries");
    console.log(data, "data");
    const currentPageData = Object.fromEntries(currentItems);
    const queryString = encodeURIComponent(JSON.stringify(currentPageData));
 
    // Use useNavigate hook for navigation
 
    navigate(`/json-to-ui?jsonData=${queryString}`);
  };
  const dispatch = useDispatch();
  const history = useNavigate();
  const dataEntries = {
    DataSource: dataSource,
    customer_id : user.customer_id,
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
 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Object.entries(obj).slice(
    indexOfFirstItem,
    indexOfLastItem
  );
 
  for (let [key, value] of currentItems) {
    readableObj += ` ${
      typeof value === "string" ? `'${value}'` : JSON.stringify(value)
    },\n`;
  }
 
  readableObj += "}";
  const totalPages = Math.ceil(Object.keys(obj).length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
 
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
 
  const onSave = () => {
    dispatch(restapidetailsave({ api_details: dataEntries }, history));
  };
 
  const renderPagination = () => {
    let pages = [];
 
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (pages.at(-1) !== "...") {
        // Only push "..." once, when transitioning away from the range
        pages.push("...");
      }
    }
    return pages.map((number) =>
      number === "..." ? (
        <span key={number} className="pagination-ellipsis">
          {number}
        </span>
      ) : (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={currentPage === number ? "active" : "inactive"}
        >
          {number}
        </button>
      )
    );
  };
 
  return (
    <>
      <div className="output-container params-container">
        <label>Output</label>
        <div className="param-item">
          <textarea
            placeholder=""
            readOnly
            className="textarea-no-list-style"
            id="textarea-output-display"
            value={readableObj}
            disabled
          ></textarea>
        </div>
        {obj && Object.keys(obj).length > 0 && (
          <>
            <div className="pagination">
              {currentPage > 1 && (
                <button
                  id="previous-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Prev
                </button>
              )}
              {renderPagination()}
              {currentPage < totalPages && (
                <button
                  id="next-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              )}
            </div>
            <div className="btn-save">
              <Button 
                style={{marginRight:"5px"}}
                onClick={onProceed}
              >
                Proceed
              </Button>
              <Button onClick={onSave}>
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
 
export default Response;