import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header';
import './GenerateReport.css'
import { useDispatch, useSelector } from 'react-redux';
import { generateReportId } from '../../actions/reportmanagement';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { Button } from './../globalCSS/Button/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Pagination from './../Pagination/Pagination'
import * as XLSX from 'xlsx';

function GenerateReport() {
  const location = useLocation(); // Get location from useLocation hook
  const history = useNavigate(); // Get navigate function from useNavigate hook
  const dispatch = useDispatch();
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem("profile"))

  const [search, setSearch] = useState(""); // State for search input value
  const queryParameters = new URLSearchParams(window.location.search); // Get query parameters from URL
  const report_id = queryParameters.get('report_id'); // Get report ID from query parameters
  const apiData = useSelector((state) => state); // Get data from Redux store

  // Memoized effect to generate report ID
  useMemo(() => {
    dispatch(generateReportId({ report_id: report_id, email: user.user_email_id, database_type: "mysql" }))
  }, [report_id])


  const generatreportdetail = apiData?.reportmanagement.generate_report_id;

  let PageSize = 8; // Number of items per page

  const [currentPage, setCurrentPage] = useState(1)
  
  // Memoized table data based on current page number
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return generatreportdetail && generatreportdetail?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, generatreportdetail])


  // apply search
  let results
  if (search) {
    // Filter results based on search input
    results = generatreportdetail && generatreportdetail?.filter(item => {
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

  // Function to export table data to Excel
  const exportToExcel = (tableId) => {
    const tableSelect = document.getElementById(tableId);
    const ws = XLSX.utils.table_to_sheet(tableSelect);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    XLSX.writeFile(wb, 'DetailGenerateReport.xlsx');
  };
  
  // Function to handle exporting to PDF
  const handleExportPDF = () => {
    const input = document.getElementById('table-to-excel');

    html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('table-export.pdf');
        });
};




  return (
    <div>
      <div className='Generate_table_header'>
        <Header />
      </div>
      <div className='Generate_table_main_container'>
        <div className='Generate_table_export_rearch'>
          <div className='export_csv'><span><i class='fas fa-file-excel' onClick={() => exportToExcel('table-to-excel')} style={{ color: "green", fontWeight: "bold" }}></i></span></div>
          <div class="form-group Generate_has-search Generate_report_search">
            <span className="fa fa-search form-control-feedback"></span>
            <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className='Generate_table_sub_container'>
          <table id='table-to-excel' className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                {/* <th></th> */}
                {generatreportdetail && generatreportdetail[0]?.map((colname, index) => (
                  <th key={index}>{colname}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* <td></td> */}
              {results && results.slice(1).slice(0,-1)?.map((calind, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(calind).map((colname, colIndex) => (
                    <td key={colIndex}>{colname}</td>
                  ))}
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
            totalCount={generatreportdetail ? generatreportdetail.length : 1}
            pageSize={PageSize}
            onPageChange={page => setCurrentPage(page)}
          /></div>
      <div className='Generate_table_button'>
        <Button type='button' onClick={() => {history(-1)}}>Back</Button>
        <Button type='button' className='download' onClick={handleExportPDF}>DownLoad PDF</Button> 
        <Button type='button' className='download' onClick={() => exportToExcel('table-to-excel')} >DownLoad XLSX</Button> 
      </div>
    </div>
  )
}

export default GenerateReport