
import React, { useEffect, useMemo, useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { savereportTemplate } from '../../actions/auth';
import { useReactToPrint } from "react-to-print";
import './DashboardReport.css';
import Pagination from './../Pagination/Pagination'
import { FiAlignJustify } from "react-icons/fi";

function DashboardReport({ TableData }) {
    const [search, setSearch] = useState("")
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'report-stud',
        onAfterPrint: () => alert('print success')
      })
    // Pagination
    let PageSize = 8

    const [currentPage, setCurrentPage] = useState(1)

    const table = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize
        const lastPageIndex = firstPageIndex + PageSize
        return TableData && TableData.data.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, TableData])

    // Search filtering
    let results
    if (search) {
        results = TableData?.data.filter(item => {
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
            <div className='DashboardReport_table_main_container'>
                <div className='DashboardReport_table_export_rearch'>
                    <div className="has-search report_search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className="form-control" placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className='Report_export_csv'  onClick={handleprint}><span><FiAlignJustify /></span></div>
                </div>
                <div className='DashboardReport_table_sub_container'>
                    <table className='table table-striped table-bordered table-hover'   ref={componentRef}>
                        <thead>
                            <tr>
                                {/* <th></th> */}
                                {TableData?.column_names.map((colname, index) => (
                                    <th key={index}>{colname}</th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {/* <td></td> */}
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
                    totalCount={TableData ? TableData.data.length : 1}
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

export default DashboardReport