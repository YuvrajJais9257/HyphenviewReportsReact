import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getreportdetailwithaccessforassignreport } from '../../actions/reportmanagement';
import { getReportDetailonbasisOFgroupid } from '../../actions/assignReport';
import { listofgroup } from '../../actions/newgroup'
import { useNavigate } from "react-router-dom";
import { Button } from './../globalCSS/Button/Button';
import Pagination from './../Pagination/Pagination';
import Header from '../header';
import './TestFolder.css';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { assignreporttothegroup } from '../../actions/assignReport'

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const apiData = useSelector((state) => state);
  const reportdetail = apiData?.reportmanagement.getreportdetalwithaccess;
  const reportdetailofgroupId = apiData?.assignreporttothegroup.getreportdetailonbasisofgroupId;
  const listofallgroup = apiData?.newgroup.list_of_group;
  console.log(reportdetail, reportdetailofgroupId,reports, "reportdetailofgroupId")

  const queryParameters = new URLSearchParams(window.location.search);
  const group_id = queryParameters.get('group_id');


  useEffect(() => {
    dispatch(getreportdetailwithaccessforassignreport({ database_type: "mysql", email: user.user_email_id }));
    dispatch(getReportDetailonbasisOFgroupid({ customer_id: user.customer_id, database_type: "mysql" }));
    dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }));
  }, []);


  useEffect(() => {
    if (reportdetail) {
      const updatedReports = reportdetail.map(report => ({
        name: report.report_name,
        report_id: report.report_id,
        export: false,
        edit: false,
        delete: false,
        view: false,
        adminMode: false
      }));
      setReports(updatedReports);
      setIsLoading(true)
    }
  }, [reportdetail]);

  useEffect(() => {
    if (!reports || reports.length === 0) {
      return;
    }
    const selectButtonAtIndex1 = () => {
      const buttonAtIndex1 = document.getElementById(group_id);
      console.log(buttonAtIndex1, "buttonAtIndex1");

      if (buttonAtIndex1) {
        buttonAtIndex1.click();
      }
    };

    // Function to handle loading and executing the button click
    const executeButtonSelection = () => {
      if (document.readyState === 'complete') {
        setTimeout(selectButtonAtIndex1, 100); // Set delay here
      } else {
        window.onload = selectButtonAtIndex1;
      }
    };

    if (reportdetail) {
      executeButtonSelection();
    }
  }, [group_id, reportdetail, isLoading]); 

  const [currentPage, setCurrentPage] = useState(1)
  let PageSize = 8
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return reports && reports?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, reports])

  // Search filtering
  let results
  if (search) {
    results = reports?.filter(item => {
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

  console.log(results,reports,"sadaskfm")

  const handleCheckboxChange = (indexInResults, key) => {

    const indexInReports = (currentPage - 1) * PageSize + indexInResults;
    setReports(prevReports => {
      const updatedReports = [...prevReports];
      updatedReports[indexInReports] = { ...updatedReports[indexInReports], [key]: !updatedReports[indexInReports][key] };
      if (key === "adminMode") {
        updatedReports[indexInReports].export = updatedReports[indexInReports].edit = updatedReports[indexInReports].delete = updatedReports[indexInReports].view = updatedReports[indexInReports].adminMode;
      } else {
        updatedReports[indexInReports].adminMode = ["export", "edit", "delete", "view"].every(checkbox => updatedReports[indexInReports][checkbox]);
      }
      return updatedReports;
    });
  };
  
  

  const handleSelectGroup = (groupid) => {
    console.log(typeof(groupid),reportdetailofgroupId,reports,"groupid..")
    setSelectedGroup(groupid)
    dispatch(getReportDetailonbasisOFgroupid({ customer_id:user.customer_id,database_type: "mysql" }));
    if (reportdetailofgroupId) {
      const assignedReports = reportdetailofgroupId?.filter(item => item.group_id === groupid);
      const updatedReports = reports.map(report => {
        const assignedReport = assignedReports.find(item => item.report_id === report.report_id);
        return {
          ...report,
          edit: assignedReport?.access_mask.includes('e') || false,
          delete: assignedReport?.access_mask.includes('d') || false,
          export: assignedReport?.access_mask.includes('p') || false,
          view: assignedReport?.access_mask.includes('v') || false,
          adminMode: assignedReport?.access_mask.includes('p') && assignedReport?.access_mask.includes('e') && assignedReport?.access_mask.includes('d') && assignedReport?.access_mask.includes('v') || false,
          group_id: groupid
        };
      });
      setReports(updatedReports);
    }
    // else if(group_id && reportdetailofgroupId ){

    // }
  };

  const accessMap = {
    export: 'p',
    edit: 'e',
    delete: 'd',
    view: 'v'
  };

  const handelsavereport = () => {
    if (reports[0].group_id != null) {
      const result = reports.map(item => {
        const access = Object.keys(accessMap).filter(key => item[key]).map(key => accessMap[key]).join('');
        return { report_id: item.report_id, access: access };
      });
      if (result.length > 0) {
        let payloadform = {
          group_id: reports[0].group_id,
          database_type: "mysql",
          email: user.user_email_id,
          report_ids: result.map((item) => item.report_id),
          access_masks: result.map(item => item.access === '' ? 'null' : item.access)
        }
        if (Object.keys(payloadform).length > 0) {
          console.log(payloadform,"payloadform")
          dispatch(assignreporttothegroup(payloadform, history))
        }

        // console.log(payloadform, "payloadform")
      }
    }else{
      alert("can you plealse select any of the group");
     }
  }


  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }

  console.log(reports,"repo")

  return (
    <div>
      <div className="Header"><Header /></div>
      <div className="Test_report_to_group">
        <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
        <span>/</span>
        <span>Assign Reports To Group</span>

      </div>
      <div className='Test_report_sub_container'>
        <div className='Test_report_button_cnt'>
          <Button onClick={handelsavereport}>Save</Button>
          {/* <Button>Reset</Button> */}
        </div>
      </div>
      <div className='Test_report_displayed'>
        <div style={{ marginRight: "100px" }}>
          {listofallgroup && listofallgroup.map((group, index) => (
            <Button
              id={group.group_id}
              key={index}
              style={{backgroundColor: group.group_id === selectedGroup ? 'white' : '#424344',
              color: group.group_id === selectedGroup ? '#424344' : 'white'}}
              onClick={() => handleSelectGroup(group.group_id)}>
              {group.groupname}
            </Button>
          ))}
        </div>
      </div>
      <div>

      </div>
      <div className='Test_report_table_container'>
        <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
          <thead>
            <tr>
              <th><span className='Test_Report_search'>
                <span className="fa fa-search form-control-feedback"></span>
                <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /></span></th>
              <th style={{ textAlign: "center" }}>Edit</th>
              <th style={{ textAlign: "center" }}>Delete</th>
              <th style={{ textAlign: "center" }}>Export</th>
              <th style={{ textAlign: "center" }}>View</th>
              <th style={{ textAlign: "center" }}>Admin Mode</th>
            </tr>
          </thead>
          <tbody>
            {results.map((report, index) => (
              <tr key={index}>
                <td>{report.name}</td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={report.edit}
                    onChange={() => handleCheckboxChange(index, "edit")}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={report.delete}
                    onChange={() => handleCheckboxChange(index, "delete")}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={report.export}
                    onChange={() => handleCheckboxChange(index, "export")}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={report.view}
                    onChange={() => handleCheckboxChange(index, "view")}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={report.adminMode}
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
                    totalCount={reports ? reports.length : 1}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
                </div>
    </div>
  );
};

export default ReportManagement;
