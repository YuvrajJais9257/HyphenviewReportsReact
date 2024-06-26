import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import './ListOfDashboardCanvas.css'
import { listofdashboardframename, deletecanvashframe } from '../../actions/canvascreation'
import { useDispatch, useSelector } from 'react-redux';
import Pagination from './../Pagination/Pagination'
import { Button } from './../globalCSS/Button/Button';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

// Auther:- ASHISH KUMAR
function ListOfDashboardCanvas() {
  // Hooks for navigation and location
  const history = useNavigate();
  const location = useLocation();


  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch();

  // Local state for search input
  const [search, setSearch] = useState("")
  const apiData = useSelector((state) => state);
  const listofdashboardsname = apiData?.canvascreation?.listofdashboardcanvasframe;
  console.log(listofdashboardsname, "listofdashboardsname")
  
  // Fetch user profile from localStorage
  const user = JSON.parse(localStorage.getItem('profile'));
  const requiredValues = ['a', 'e', 'd', 'v'];
  const reportsManagementObject = user.features.find(obj => obj.featurename === 'Dashboard Management');

  // Fetch dashboard frame names on component mount
  useEffect(() => {
    dispatch(listofdashboardframename({ customer_id: user.customer_id }))
  }, []);

  // Handlers for navigation
  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }

  const handelclickCreateCanvash = () => {
    history('/hyphenview/SplitView')
  }

  const handelclickModifiedCanvash = () => {
    history('/hyphenview/ModifiedCanvasPage')
  }


  // Handler for deleting a dashboard frame
  const handelremoveDashboardframe = (value,group_id,groupname) => {
    try {
      const userConfirmed = window.confirm("Are you sure you want to delete this Canvas?");

      if (userConfirmed) {
        dispatch(deletecanvashframe({ customer_id: user.customer_id, frame_name: value,groupname:groupname, group_id: group_id, database_type: "mysql" }, history));
      } else {
        console.log("User canceled the operation.");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }


  // Pagination setup
  let PageSize = 8
  const [currentPage, setCurrentPage] = useState(1)

  // Memoized value for paginated data
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return listofdashboardsname && listofdashboardsname?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, listofdashboardsname])


  // Filter results based on search input
  let results
  if (search) {
    results = listofdashboardsname && listofdashboardsname?.filter(item => {
      let found = false
      Object.entries(item).map(([key, value]) => {
        console.log(value, "data is coming are not")
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


  // Function to export table to Excel
  const exportToExcel = (tableId) => {
    const tableSelect = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(tableSelect);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, 'ListOfReports.xlsx');
  };

  return (
    <div>
      <div className='Header'>
        <Header />
      </div>
      <div className='Dashboard_Management_List'><span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span><span>/</span>Dashboard Management

        {requiredValues.every(value => reportsManagementObject.accessmask.includes(value)) ?
          <div class="dropdown">
            <Dropdown>
              <Dropdown.Toggle style={{ backgroundColor: "rgb(66,67,68)", border: "none", fontSize: "0.9rem", marginLeft: "5px" }} id="dropdown-basic">
                Canvas
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handelclickCreateCanvash} id="createbutton" href="#">Create</Dropdown.Item>
                {/* {requiredValues.every(value => reportsManagementObject.accessmask.includes(value))
                  ? <Dropdown.Item onClick={handelclickModifiedCanvash} id="modifybutton" href="#">Modify</Dropdown.Item> : null} */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          : null}
      </div>

      <div>
        <div className='List_Dashboard_table_export_rearch'>
          <div className='Dashboard_List_export_csv'><span><i class='fas fa-file-excel' onClick={() => exportToExcel('table-to-excel')} style={{ color: "green", fontWeight: "bold" }}></i></span></div>
          <div class="form-group Dashboard_List_has-search Dashboard_List_report_search">
            <span className="fa fa-search form-control-feedback"></span>
            <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className='List_table_sub_container'>
          <table id='table-to-excel' className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Group Name</th>
                <th>Dashboard Description</th>
                <th>Action</th>

              </tr>
            </thead>
            <tbody>
              {results && results?.map((reportdata, index) => (
                <tr key={index}>
                  <td>{reportdata.dashboard_report_name}</td>
                  <td>{reportdata.groupname}</td>
                  <td>{reportdata.dashboard_description}</td>
                  <td >
                    {<span><i style={{ marginLeft: "5px", cursor: 'pointer', color: '0d6efd', pointerEvents: ['d'].every(value => reportsManagementObject.accessmask.includes(value)) ? 'auto' : 'none', color: ['d'].every(value => reportsManagementObject.accessmask.includes(value)) ? '#0d6efd' : 'grey' }} onClick={() => handelremoveDashboardframe(reportdata.dashboard_report_name,reportdata.group_id,reportdata.groupname)} className="fa-solid fa-trash-can"></i><span style={{ fontSize: "15px", marginLeft: "3px" }}></span><span>/</span>
                      <Link id={`dashboardframemovefy${reportdata.group_id}`} to={`/hyphenview/ModifiedCanvasPage?group_id=${reportdata.group_id}&dashboardreportname=${reportdata.dashboard_report_name}&groupname=${reportdata.groupname}`} style={{ fontWeight: "20px", pointerEvents: ['w'].every(value => [...reportdata.access].includes(value)) ? 'auto' : 'none', color: ['w'].every(value => [...reportdata.access].includes(value)) ? '#0d6efd' : 'grey' }} className="fa-solid fa-pen-to-square"></Link></span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={listofdashboardsname ? listofdashboardsname.length : 1}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)}
          /></div>
      </div>
    </div>
  )
}

export default ListOfDashboardCanvas