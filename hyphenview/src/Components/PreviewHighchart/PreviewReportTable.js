import React, { useEffect, useMemo, useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {customPreviewChartData} from '../../actions/auth'
import { useReactToPrint } from "react-to-print";
import Pagination from './../Pagination/Pagination'
import { FiAlignJustify } from "react-icons/fi";
import './PreviewReportTable.css'
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
function PreviewReportTable() {

    const dispatch = useDispatch();
    const componentRef = useRef();
    const user = JSON.parse(localStorage.getItem('profile'))
    // const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
    const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
    const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'))
    console.log(selectedShemasection,CustomeDetailOfReport,"CustomeDetailOfReport_table");
    const [chartTypeStore, setchartTypeStore] = useState();
    const [search, setSearch] = useState("")
    
    const apiData = useSelector((state) => state?.auth);
  
    useMemo(() => {
    //   const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
    console.log("check")
      dispatch(customPreviewChartData({
        report_name: CustomeDetailOfReport.title,
        report_type: CustomeDetailOfReport.type,
        chart_type: CustomeDetailOfReport.chart_type,
        query: CustomeDetailOfReport.query,
        email: user.user_email_id,
        database_type: "mysql",
        connection_type: CustomeDetailOfReport.connection_type,
        schema: CustomeDetailOfReport.schema,
      }));
    }, [])
  
    const PreviewchartData = apiData?.custom_preview_table;
    console.log(PreviewchartData,"PreviewchartData")

    let PageSize = 10

    const [currentPage, setCurrentPage] = useState(1)

    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'report-stud',
        onAfterPrint: () => alert('print success')
      })

    const table = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize
        const lastPageIndex = firstPageIndex + PageSize
        return PreviewchartData && PreviewchartData?.data.slice(firstPageIndex, lastPageIndex)
    }, [currentPage,PreviewchartData])

    // Search filtering
    let results
    if (search) {
        results = PreviewchartData && PreviewchartData?.data.filter(item => {
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

  
  return (
    <div>
            <div className='PreviewPage_table_main_container'>
                <div className='PreviewPage_table_export_rearch'>
                    <div className="has-search report_search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className='PreviewPage_export_csv'  onClick={handleprint}><span><FiAlignJustify /></span></div>
                </div>
                <div className='PreviewPage_table_sub_container'>
                    <table className='table table-striped table-bordered table-hover' style={{ width: "100%", height: "100%" }} ref={componentRef}>
                        <thead>
                            <tr>
                                {/* <th></th> */}
                                {PreviewchartData && PreviewchartData?.column_names.length > 0 && PreviewchartData.column_names.map((colname, index) => (
                                    <th key={index}>{colname}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {results && results?.map((calind, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(calind).map((colname, colIndex) => (
                                        <td key={colIndex}>{colname}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                    <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={PreviewchartData ? PreviewchartData.data.length : 1}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                    />
                    </div>
                    
                </div>
                
            </div>
            {/* <div className='DashboardReport_table_button'>
                <button type='button'>Back</button>
                <button type='button' onClick={handelonsavetable}>Save</button>
            </div> */}
        </div>
  )
}

export default PreviewReportTable