import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import Header from '../header';
import { listOfuser,deleteUser } from '../../actions/usermanagement'
import './UserManagementList.css'
import { Link } from 'react-router-dom';
import Pagination from './../Pagination/Pagination'
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

function UserManagementList() {
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useNavigate();
    const dispatch = useDispatch();

    const [search, setSearch] = useState("")
    const [isDeleted, setIsDeleted] = useState(false);
    const apiData = useSelector((state) => state.usermanagement);
    const requiredValues = ['a', 'e', 'd', 'v'];
    const reportsManagementObject = user.features.find(obj => obj.featurename === 'User Management');


    const usertype = user.groupname;
    const useraccessmask = user.features.filter((item) => item.featurename === 'User Management');
    let selectaccessmask;
    if (useraccessmask.length > 0) {
      selectaccessmask = [...useraccessmask[0].accessmask];
    }
  
  
    useEffect(() => {
      const editButtons = document.getElementsByClassName("fa-pen-to-square");
      const removeButtons = document.getElementsByClassName("fa-trash-can");
      const addingnewuser = document.getElementsByClassName("adding_new_user");
      const addingnewuserntothegroup = ['a'].every(value => selectaccessmask.includes(value));
      const allValuesExist = ['e'].every(value => selectaccessmask.includes(value));
      const allValuesExist3 = ['d'].every(value => selectaccessmask.includes(value));
    
      // Show or hide the edit buttons based on access mask
      Array.from(editButtons).forEach(button => {
        if (!allValuesExist) {
          button.style.pointerEvents = 'none';
          button.style.color = 'grey' // Disable pointer events if access mask does not have 'e'
      } else {
          button.style.pointerEvents = 'auto'; // Enable pointer events if access mask has 'e'
          button.style.display = 'inline'; // Show the button
      }
      });
      Array.from(addingnewuser).forEach(button => {
        if (!addingnewuserntothegroup) {
            button.style.display = 'none';  
      } else {
            button.style.display = 'inline';
      }
    });
  
    Array.from(removeButtons).forEach(button => {
        if (!allValuesExist3) {
          button.style.pointerEvents = 'none';
          button.style.color = 'grey' // Hide the button if access mask does not have 'e'
        } else {
          button.style.pointerEvents = 'auto'; // Enable pointer events if access mask has 'e'
          button.style.display = 'inline'; // Show the button if access mask has 'e'
        }
      });
  
    }, [selectaccessmask]);

    const handelclickgotoDashboard = () => {
        history('/hyphenview/Dashboard')
    }

    const handelclickAddNewReport = () => {
        history('/hyphenview/NewUser')
    }

    useEffect(() => {
        dispatch(listOfuser({ email: user.user_email_id, database_type: "mysql" },history))
    }, [])

    const listofalluser = apiData?.allUserDetail;

    let PageSize = 8

    const [currentPage, setCurrentPage] = useState(1)

    const table = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize
        const lastPageIndex = firstPageIndex + PageSize
        return listofalluser && listofalluser?.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, listofalluser])


    
    // Search filtering
    let results
    if (search) {
        results = listofalluser && listofalluser?.filter(item => {
            let found = false
            Object.entries(item).map(([key, value]) => {
                if (String(value).toLowerCase().includes(search.toLowerCase())) {
                    found = true
                }
            })
            return found
        })
        results.length = PageSize
    } else {
        results = table
    }


    const handelclicktoAssignation = () =>{
        // history('/AssignationAndFeature')
        history('/hyphenview/FeatureAssignpage')
    }

    const handelclickGroupupdate = () =>{
        history('/hyphenview/ReportAsination')
    }
    const handelclick = async(e) => {
        try {
            const userConfirmed = window.confirm("Are you sure you want to delete this user?");
    
            if (userConfirmed) {
                dispatch(deleteUser({ email: e, database_type: "mysql" }, history));
            } else {
                console.log("User canceled the operation.");
            }
        } catch (error) {
            console.error("Error removing user:", error);
        }
    }

        
        const exportToExcel = (tableId) => {
            const tableSelect = document.getElementById(tableId);
            const ws = XLSX.utils.table_to_sheet(tableSelect);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            XLSX.writeFile(wb, 'UserManagementList.xlsx');
          };
    
    
    return (
        <div>
            <div className="Header">
                <Header />
            </div>
            <div className="user_management_page">
                <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
                <span>/</span>
                <span> User Management </span>
                {requiredValues.every(value => reportsManagementObject.accessmask.includes(value)) ? <div class="dropdown"> 
          <Dropdown>
            <Dropdown.Toggle style={{ backgroundColor: "rgb(66,67,68)", border: "none", fontSize: "0.9rem",marginLeft:"5px" }} id="dropdown-basic">
              User Action
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {requiredValues.every(value => reportsManagementObject.accessmask.includes(value))
                ? <Dropdown.Item onClick={handelclicktoAssignation} id="createbutton" href="#">Access Features</Dropdown.Item> : null}
              {requiredValues.every(value => reportsManagementObject.accessmask.includes(value))
                ? <Dropdown.Item onClick={handelclickAddNewReport} id="modifybutton"  href="#">Add New User</Dropdown.Item> : null}
              {requiredValues.every(value => reportsManagementObject.accessmask.includes(value))
                ? <Dropdown.Item onClick={handelclickGroupupdate} id="deletebutton" href="#" >Group Assignation</Dropdown.Item> : null}
            </Dropdown.Menu>
          </Dropdown>
        </div> : null}
            </div>
            <div className='user_management_table_container'>
                <div className='user_export_search_cotainer'>
                    <div className='User_export_csv'><span><i class='fas fa-file-excel' onClick={() => exportToExcel('table-to-excel')} style={{ color: "green", fontWeight: "bold" }}></i></span></div>
                    <div class="form-group user-search user_report_search">
                        <span className="fa fa-search form-control-feedback"></span>
                        {/* <input type="text" className="form-control" placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /> */}
                        <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className='user_management_table_content'>
                    <table id='table-to-excel' className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                {/* <th>User Name</th> */}
                                <th>User Email Id</th>
                                <th>Group Name</th>
                                <th>Status</th>
                                <th>Created Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results && results?.map((userdata, index) => (
                                <tr key={index}>
                                    {/* <td>{userdata.groupname}</td> */}
                                    <td>{userdata.user_email_id}</td>
                                    <td>{userdata.groupname}</td>
                                    <td>{userdata.user_status}</td>
                                    <td>{userdata.user_creation_date.replace('T', ' ')}</td>
                                    <td>
                                    <Link to={`/ResetPassword?user_email_id=${userdata.user_email_id}`} className="fa-solid fa-pen-to-square"><span style={{fontSize:"15px",marginLeft:"3px"}}></span></Link><span>/</span>
                                    <i style={{ color: "#0d6efd",cursor:'pointer' }} className="fa-solid fa-trash-can" onClick={() => handelclick(userdata.user_email_id)}></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            <div>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={listofalluser ? listofalluser.length : 1}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                /></div>
        </div>
    )
}

export default UserManagementList