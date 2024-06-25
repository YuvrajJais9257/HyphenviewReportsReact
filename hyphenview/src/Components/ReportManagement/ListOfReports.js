import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import './ListOfReports.css'
import { getreporttitlefromondashbaord, removereport } from '../../actions/reportmanagement';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from './../Pagination/Pagination'
import { Button } from './../globalCSS/Button/Button';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

function ListOfReports() {
  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("")
  const apiData = useSelector((state) => state);
  const reportdetail = apiData?.reportmanagement?.allReportDetail;
 
  // Get user access mask from localStorage
  const user = JSON.parse(localStorage.getItem('profile'));
  const useraccessmask = user.features.filter((item) => item.featurename === 'Report Management');
  let selectaccessmask;
  if (useraccessmask.length > 0) {
    selectaccessmask = [...useraccessmask[0].accessmask];
  }
  

 // Hide or show "New Report" button based on user access mask
  useEffect(() => {
    const createreportproperty = document.getElementsByClassName("newReport_create_access");
    const addingnewreport = ['a'].every(value => selectaccessmask.includes(value));
    Array.from(createreportproperty).forEach(button => {
      if (!addingnewreport) {
        button.style.display = 'none';
      } else {
        button.style.display = 'inline';
      }
    });

  }, [selectaccessmask]);

   // Fetch report titles on component mount
  useEffect(() => {
    dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }));
  }, []);

   // Navigate to Dashboard
  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }

  const handelclickAddNewReport = () => {
    history('/hyphenview/ApexChart')
  }

  let PageSize = 8

  const [currentPage, setCurrentPage] = useState(1)
  
  // Memoized table data based on current page
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return reportdetail && reportdetail?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, reportdetail])


  // Search filtering
  let results
  if (search) {
    results = reportdetail && reportdetail?.filter(item => {
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
  
  // Remove report
  const handelremoveReport = async (event) => {
    try {
      dispatch(removereport({ report_id: event, database_type: "mysql",customer_id:user.customer_id }, history));
    } catch (error) {
      console.error("Error removing report:", error);
    }
  }
  
  // Export table data to Excel
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
      <div className='Report_Management_List'><span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span><span>/</span>Report Management
        <Button className='newReport_create_access' onClick={handelclickAddNewReport}>New Report</Button>
      </div>
      <div>
        <div className='List_Report_table_export_rearch'>
          <div className='List_export_csv'><span><i class='fas fa-file-excel' onClick={() => exportToExcel('table-to-excel')} style={{ color: "green", fontWeight: "bold" }}></i></span></div>
          <div class="form-group List_has-search List_report_search">
            <span className="fa fa-search form-control-feedback"></span>
            <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className='List_table_sub_container'>
          <table id='table-to-excel' className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Report Type</th>
                <th>Chart Type</th>
                <th>Drildown</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { results && results?.map((reportdata, index) => (
                <tr key={index}>
                  <td>{reportdata.report_name}</td>
                  <td>{reportdata.report_type}</td>
                  <td>{reportdata.chart_type}</td>
                  <td>{reportdata.drilldown}</td>
                  <td >
                    {(reportdata.report_type === 'Table' || reportdata.report_type === 'Merged') ? <span> <Link id={`customeidwithtable${reportdata.report_id}`} to={`/hyphenview/UpdateReportPage?report_id=${reportdata.report_id}`} style={{ fontWeight: "20px", pointerEvents: ['e'].every(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none', color: ['e'].every(value => [...reportdata.access_mask].includes(value)) ? 'none' : 'grey' }} className="fa-solid fa-pen-to-square"><span style={{ fontSize: "15px", marginLeft: "3px" }}></span></Link><span>/</span>

                      <Link to={`/hyphenview/GenerateReport?report_id=${reportdata.report_id}`} id={`customeidgeneratewithtable${reportdata.report_id}`} style={{ fontWeight: "20px", pointerEvents: ['p', 'v'].some(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none', color: ['p', 'v'].some(value => [...reportdata.access_mask].includes(value)) ? 'none' : 'grey' }} className="fa-solid fa-download"><span style={{ fontSize: "13px", marginLeft: "3px" }}></span></Link><span>/</span>

                      <i style={{ cursor: 'pointer', marginLeft: "5px", pointerEvents: ['d'].every(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none',color: ['d'].every(value => [...reportdata.access_mask].includes(value)) ? '#0d6efd' : 'grey' }} id={`customeidremovewithtable${reportdata.report_id}`} onClick={() => handelremoveReport(reportdata.report_id)} className="fa-solid fa-trash-can"></i></span> :

                      <span><Link id={`customeidwithchart${reportdata.report_id}`} to={`/hyphenview/UpdateReportPage?report_id=${reportdata.report_id}`} style={{ fontWeight: "20px", pointerEvents: ['e'].every(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none', color : ['e'].every(value => [...reportdata.access_mask].includes(value)) ? 'none' : 'grey' }} className="fa-solid fa-pen-to-square"><span style={{ fontSize: "15px", marginLeft: "3px" }}></span></Link><span>/</span>

                        {reportdata.report_type === 'Chart' ? <Link id={`customeidwithchart${reportdata.report_id}`} to={`/hyphenview/ShowChartReport?report_id=${reportdata.report_id}&access_mask=${reportdata.access_mask}`} style={{ fontWeight: "20px", textDecoration: 'none', pointerEvents: ['v', 'p'].some(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none',color: ['v', 'p'].some(value => [...reportdata.access_mask].includes(value)) ? 'none' : 'grey' }} class="fa-solid fa-eye" > <span style={{ fontSize: "15px", marginLeft: "3px" }}></span></Link> : 
                        <Link id={`customeidwithbox${reportdata.report_id}`} to={`/hyphenview/ShowBoxchart?report_id=${reportdata.report_id}&access_mask=${reportdata.access_mask}`} style={{ fontWeight: "20px", textDecoration: 'none', pointerEvents: ['v', 'p'].some(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none', color: ['v', 'p'].some(value => [...reportdata.access_mask].includes(value)) ? 'none' : 'grey' }} class="fa-solid fa-eye" > <span style={{ fontSize: "15px", marginLeft: "3px" }}></span></Link>}<span>/</span>

                        <i style={{ marginLeft: "5px", cursor: 'pointer', pointerEvents: ['d'].every(value => [...reportdata.access_mask].includes(value)) ? 'auto' : 'none',color: ['d'].every(value => [...reportdata.access_mask].includes(value)) ? '#0d6efd' : 'grey' }} id={`customeidremovewithchart${reportdata.report_id}`} onClick={() => handelremoveReport(reportdata.report_id)} className="fa-solid fa-trash-can"></i></span>}
                    {/* <i style={{ color: "#00d2ff" }} onClick={history('/CustomQuery',{state: reportdata.report_id})} className="fa-solid fa-pen-to-square">/</i> */}
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
            totalCount={reportdetail ? reportdetail.length : 1}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)}
          /></div>
      </div>
    </div>
  )
}

export default ListOfReports