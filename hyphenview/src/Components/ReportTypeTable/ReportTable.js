import React,{useEffect,useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import {savereportTemplate} from '../../actions/auth';
import Header from '../header';
import './ReportTable.css';
function ReportTable() {

    const insitialstateofcomp = {
        report_name: "",
        report_type: "",
        chart_type: "",
        query: "",
        enable_drilldown: "",
        auto_update_interval: "",
        time_period: "",
        start_date: "",
        end_date: "",
        show_in_dashboard: "",
        email: "",
        database_type: "",
        schema: "",
        display_order: 1
      }
    
      const [reportDetail, setreportDetail] = useState(insitialstateofcomp);
      const dispatch = useDispatch();

      useEffect(() => {
        const user = JSON.parse(localStorage.getItem('profile'))
        const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'))
        const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'))
       
        if (CustomeDetailOfReport != null && selectedShemasection != null) {
          const newstateofcomp = {
            report_name: CustomeDetailOfReport.title,
            report_type: CustomeDetailOfReport.type,
            chart_type: CustomeDetailOfReport.chart_type,
            query: CustomeDetailOfReport.query,
            enable_drilldown: CustomeDetailOfReport.enable_drildown,
            // auto_update_interval: CustomeDetailOfReport.update_interval,
            auto_update_interval: 2,
            time_period:CustomeDetailOfReport.time_period,
            start_date: CustomeDetailOfReport.start_date,
            end_date: CustomeDetailOfReport.end_date,
            show_in_dashboard: CustomeDetailOfReport.show_dashboard,
            email: user.user_email_id,
            database_type: selectedShemasection.databasename,
            schema: selectedShemasection.selectedSchema,
            display_order: 1
    
          }
          setreportDetail(newstateofcomp);
        }
        console.log(CustomeDetailOfReport, user, selectedShemasection, "CustomeDetailOfReport")
        // localStorage.removeItem("customeDetailOfReport");
        console.log(CustomeDetailOfReport, user, "CustomeDetailOfReport")
    
      }, [])

      const handelonsavetable = () =>{
        dispatch(savereportTemplate(reportDetail));
      }

    return (
        <div>
            <div className='Report_table_header'>
                <Header />
            </div>
            <div className='Report_table_main_container'>
                <div className='Report_table_export_rearch'>
                    <div className='export_csv'><span><i class='fas fa-file-excel' style={{ color: "green", fontWeight: "bold" }}></i></span></div>
                        <div class="form-group has-search report_search">
                            <span className="fa fa-search form-control-feedback"></span>
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                </div>
                <div className='Report_table_sub_container'>
                    <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Report Name</th>
                                <th>Report Type</th>
                                <th>Chart Type</th>
                                <th>Drildown</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
            <div className='Report_table_button'>
                <button type='button'>Back</button>
                <button type='button' onClick={handelonsavetable}>Save</button>
            </div>
        </div>
    )
}

export default ReportTable