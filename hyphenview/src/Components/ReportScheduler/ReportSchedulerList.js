import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../header';
import './ReportSchedulerList.css'
import { Button } from './../globalCSS/Button/Button';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { listofSchedulereport,removeschedulereport } from '../../actions/reportscheduler';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from './../Pagination/Pagination';
import * as XLSX from 'xlsx';
function ReportSchedulerList() {

  const history = useNavigate();
  const location = useLocation();
  console.log(location,"location")
  const dispatch = useDispatch();
  const [search, setSearch] = useState("")

  // get the schedule reports throught the reduler
  const apiData = useSelector((state) => state);
  const schedulereportdetail = apiData?.reportscheduler.allScheduleReportDetail;
  console.log(schedulereportdetail,"schedulereportdetail")
  const user = JSON.parse(localStorage.getItem('profile'));
   
    // this useEffect help to dispatch the list of schedule reports
    useEffect(() => {
        // const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'));
        dispatch(listofSchedulereport({ database_type: "mysql", customer_id: user.customer_id }));
      }, []);

    let PageSize = 5

  const [currentPage, setCurrentPage] = useState(1)

  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return schedulereportdetail && schedulereportdetail?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, schedulereportdetail])

  // Search filtering
  let results
  if (search) {
    results = schedulereportdetail?.filter(item => {
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

  // const usertype = user.groupname;
  const useraccessmask = user.features.filter((item) => item.featurename === 'Report Scheduler');
  let selectaccessmask;
  if (useraccessmask.length > 0) {
    selectaccessmask = [...useraccessmask[0].accessmask];
  }

  console.log(selectaccessmask,"selectaccessmask")


  useEffect(() => {
    const editButtons = document.getElementsByClassName("fa-pen-to-square");
    const removeButtons = document.getElementsByClassName("fa-trash-can");
    const addingnewschedulereport = document.getElementsByClassName("adding_new_schedule_report");
    const addingnewuserntothegroup = ['a'].every(value => selectaccessmask.includes(value));
    const allValuesExist = ['e'].every(value => selectaccessmask.includes(value));
    const allValuesExist3 = ['d'].every(value => selectaccessmask.includes(value));
  
    // Show or hide the edit buttons based on access mask
    Array.from(editButtons).forEach(button => {
      if (!allValuesExist) {
        button.style.pointerEvents = 'none';
        button.style.color = 'grey' // Hide the button if access mask does not have 'e'
      } else {
        button.style.pointerEvents = 'auto'; // Enable pointer events if access mask has 'e'
        button.style.display = 'inline'; // Show the button // Show the button if access mask has 'e'
      }
    });

    Array.from(addingnewschedulereport).forEach(button => {
      if (!addingnewuserntothegroup) {
        button.style.display = 'none'; // Hide the button if access mask does not have 'e'
      } else {
        button.style.display = 'inline'; // Show the button if access mask has 'e'
      }
  });

    Array.from(removeButtons).forEach(button => {
      if (!allValuesExist3) {
        button.style.pointerEvents = 'none';
        button.style.color = 'grey'// Hide the button if access mask does not have 'e'
      } else {
        button.style.pointerEvents = 'auto'; // Enable pointer events if access mask has 'e'
        button.style.display = 'inline';  // Show the button if access mask has 'e'
      }
    });
  }, [selectaccessmask]);


  // export the schedule reports in excel formate
  const exportToExcel = (tableId) => {
    const tableSelect = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(tableSelect);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, 'ListOfScheduleReport.xlsx');
  };


  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }
  
  // it help to handel the remove schedule report 
  const handelremoveReport = (schedulerid) =>{
    try {
      dispatch(removeschedulereport({scheduleid:schedulerid,customer_id:user.customer_id}))
    } catch (error) {
      console.error("Error removing Schedule report:", error);
    }
  }


    return (
        <div>
            <div className="Header">
                <Header />
            </div>
            <div className="Report_scheduler_page">
                <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
                <span>/</span><span>Scheduled Reports for Dashboard</span>
                <Button className='adding_new_schedule_report' onClick={() => history('/hyphenview/ReportSchedulerNew')}>New Scheduler for DashBoard Report</Button>
                {/* <span style={{ fontStyle: "italic", fontSize: "18px" }}>New Database</span> */}
            </div>
            <div className='Report_scheduler_container'>
            <div className='Report_scheduler_search_cotainer'>
                <div className='ScheduledReportsforDashboard'>
                    <div className='Report_scheduler_export_csv'><span><i class='fas fa-file-excel' onClick={() => exportToExcel('table-to-excel')} style={{ color: "green", fontWeight: "bold" }}></i></span></div>
                </div>
                <div class="form-group Report_scheduler-search">
                    <span className="fa fa-search form-control-feedback"></span>
                    <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>
                <div className='Report_scheduler_table_content'>
                    <table id='table-to-excel' className='table table-striped table-bordered table-hover'>
                        <thead>
                            <tr>
                                <th>Report Title</th>
                                <th>Scheduled Report</th>
                                <th>Scheduler Period</th>
                                <th>Email To</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {results && results?.map((schedulertpid, index) => (
                            <tr>
                                <td>{schedulertpid.reportTitle}</td>
                                <td>{schedulertpid.scheduledtime.replace('T', ' ')}</td>
                                <td>{schedulertpid.SchedulerPeriod}</td>
                                <td>{schedulertpid.emailid.slice(1, -1).split(',').map(email => email.trim().replace(/"/g, '')).join(', ')}</td>
                                <td>
                                <Link to={`/ReportSchedulerUpdate?scheduleid=${schedulertpid.scheduleid}`} className="fa-solid fa-pen-to-square"><span style={{fontSize:"15px",marginLeft:"3px"}}></span></Link><span>/</span>
                                <i style={{ color: "#0d6efd",cursor:'pointer' }} onClick={() => handelremoveReport(schedulertpid.scheduleid)} class="fa-solid fa-trash-can"></i>
                                </td>
                            </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={schedulereportdetail ? schedulereportdetail.length : 1}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)}
          /></div>
        </div>
    )
}

export default ReportSchedulerList