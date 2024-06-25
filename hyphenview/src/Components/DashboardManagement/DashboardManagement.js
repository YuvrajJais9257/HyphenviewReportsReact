import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { listofgroup } from '../../actions/newgroup';
import { useDispatch, useSelector } from 'react-redux';
import './DashboardManagement.css'
import { useNavigate } from 'react-router-dom';
import { Button } from '../globalCSS/Button/Button';
import { listofdashboardframenamewithdistiinct, listofaccessmask, updateaccessofdashboard } from '../../actions/canvascreation'
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import Pagination from '../Pagination/Pagination';

// Auther:- Ashish Kumar 
function DashboardManagement() {

  const dispatch = useDispatch();
  const history = useNavigate();

  // Local state variables
  const [addnewgroup, setaddnewgroup] = useState();
  const [search, setSearch] = useState("")
  const [listofframe, setFramedetail] = useState()
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch user data from local storage
  const user = JSON.parse(localStorage.getItem('profile'));

  // Fetch data from Redux store
  const apiData = useSelector((state) => state);
  const listofallgroup = apiData?.newgroup.list_of_group;
  const listofdashboardsname = apiData?.canvascreation?.listofdashboardcanvasframewithdisnict?.dashboards;
  const listofdash = apiData?.canvascreation?.listofdashboardcanvasaccess?.frame;


  // Initialize frame details based on dashboards name list
  useEffect(() => {
    if (listofdashboardsname) {
      const updatedReports = listofdashboardsname && listofdashboardsname.map(dashboardname => ({
        name: dashboardname.dashboard_report_name,
        read: false,
        write: false,
        adminMode: false
      }));
      setFramedetail(updatedReports);
    }
  }, [listofdashboardsname]);

  
  // Filter and paginate the table data
  let PageSize = 8
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return listofframe && listofframe?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, listofframe])

  // Search filtering
  let results
  if (search) {
    results = listofframe?.filter(item => {
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

  const accessMap = {
    read: 'r',
    write: 'w',
  };
  

   // Handle checkbox change for read, write, and admin mode
  const handleCheckboxChange = (index, key) => {
    setFramedetail((prevReports) => {
      const updatedReports = prevReports.map((report, i) => {
        if (i === index) {
          return { ...report, [key]: !report[key] };
        }
        return report;
      });
      if (key === "adminMode") {
        // If adminMode is checked, set all other checkboxes to true
        if (updatedReports[index].adminMode) {
          updatedReports[index].read = true;
          updatedReports[index].write = true;
        } else {
          // If adminMode is unchecked, set all other checkboxes to false
          updatedReports[index].read = false;
          updatedReports[index].write = false;
        }
      } else {
        // Check if all checkboxes except adminMode are checked
        const allChecked = ["read", "write"].every(
          (checkbox) => updatedReports[index][checkbox]
        );
        updatedReports[index].adminMode = allChecked;
      }
      return updatedReports;
    });
  };
  
  // Update frame details based on access list
  useEffect(() => {
    if (listofdash) {
      const updatedReports = listofframe?.map(report => {
        const assignedReport = listofdash?.find(item => item.dashboard_report_name === report.name);
        console.log(assignedReport, "assignedReport")
        return {
          ...report,
          read: assignedReport?.access.includes('r') || false,
          write: assignedReport?.access.includes('w') || false,
          adminMode: assignedReport?.access.includes('r') && assignedReport?.access.includes('w') || false,
          group_id: addnewgroup
        };
      });
      setFramedetail(updatedReports);
    }
  }, [listofdash]);


  // Fetch initial data for groups and dashboard frames
  useEffect(() => {
    dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
    dispatch(listofdashboardframenamewithdistiinct({ customer_id: user.customer_id }))
  }, []);


  // Handle group selection
  const handleSelectGroup = async (e, groupid) => {
    dispatch(listofaccessmask({ customer_id: user.customer_id, group_id: groupid }))
    setaddnewgroup(groupid)
    console.log(groupid, "groupid")
  };

  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }
  
   // Handle save report action
  const handelsavereport = async () => {
    const result = listofframe.reduce((acc, item) => {
      const access = Object.keys(accessMap)
        .filter(key => item[key])
        .map(key => accessMap[key])
        .join('');

      acc[item.name] = access;
      return acc;
    }, {});
    if (Object.keys(result).length > 0) {
      let payloadform = {
        group_id: listofframe[0].group_id,
        database_type: "mysql",
        dashboard_access: result,
        customer_id: user.customer_id
      }
      if (Object.keys(payloadform).length > 0) {
        console.log(payloadform,"payloadform")
        dispatch(updateaccessofdashboard(payloadform, history))
      }
    }
  }


  return (
    <div>
      <div className="Header"><Header />
        <div className="DashboardManagement_report_to_group">
          <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
          <span>/</span>
          <span>Assign Dashboard To The Group</span>
        </div>
        <div className='DashboardManagement_report_sub_container'>
          <div className='DashboardManagement_report_button_cnt'>
            <Button onClick={handelsavereport}>Save</Button>
          </div>
        </div>
        <div className='DashboardManagement_report_displayed'>
          <div style={{ marginRight: "100px" }}>
            {listofallgroup && listofallgroup?.map((group, index) => (
              <Button
                key={index}
                style={{
                  backgroundColor: group.group_id === addnewgroup ? 'white' : '#424344',
                  color: group.group_id === addnewgroup ? '#424344' : 'white'
                }}
                onClick={(e) => handleSelectGroup(e, group.group_id)}>
                {group.groupname}
              </Button>
            ))}
          </div>
        </div>
        <div className='DashboardManagement_report_table_container'>
          <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
            <thead>
              <tr>
                <th><span className='DashboardManagement_Report_search'>
                  <span className="fa fa-search form-control-feedback"></span>
                  <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /></span></th>
                <th style={{ textAlign: "center" }}>Read</th>
                <th style={{ textAlign: "center" }}>Read/Write</th>
                <th style={{ textAlign: "center" }}>Admin Mode</th>
              </tr>
            </thead>
            <tbody>
              {results && results?.map((dashboard, index) => (
                <tr key={index}>
                  <td class='dropright'>
                    <span>{dashboard.name}</span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={dashboard.read}
                      onChange={() => handleCheckboxChange(index, "read")}
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={dashboard.write}
                      onChange={() => handleCheckboxChange(index, "write")}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={dashboard.adminMode}
                      onChange={() => handleCheckboxChange(index, "adminMode")}
                    />
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

export default DashboardManagement