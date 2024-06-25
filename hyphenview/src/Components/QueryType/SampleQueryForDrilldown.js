import React, { useEffect, useState } from 'react'
import Header from '../header'
import './SampleQueryForDrilldown.css'
import { Button } from './../globalCSS/Button/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { getreporttitlefromondashbaord } from '../../actions/reportmanagement';
import { getlistofcolumnformappingfirst, getlistofcolumnformappingsecond } from '../../actions/reportmanagement';

function SampleQueryForDrilldown({formdata}) {
    console.log(formdata,"hhh")
    const user = JSON.parse(localStorage.getItem('profile'));
    const selectedShemasection = JSON.parse(localStorage.getItem('SelectedSchema'))
    console.log(selectedShemasection,"selectedShemasection")
    const insitialval = {
        title: "",
        query: "",
    }
    const dispatch = useDispatch();
    const apiData = useSelector((state) => state);
    const reportdetail = apiData?.reportmanagement?.allReportDetail;
    const columndetail = apiData?.reportmanagement?.getlistofcolumfirst;
    console.log(reportdetail,columndetail, "reportdetail")

    useEffect(() => {
        dispatch(getreporttitlefromondashbaord({ database_type: "mysql", email: user.user_email_id, customer_id: user.customer_id, group_id: user.group_id }))
    }, []);

    // useEffect(() => {
    //     if (validationQuery?.status_code === 200) {

    //         console.log("Status code is 200");
    //     }
    // }, [validationQuery?.status_code]); 

    const handelSelectReportNamedropfirst = (e) => {

        // if (e.target.value != null) {
            dispatch(getlistofcolumnformappingfirst({customer_id:user?.customer_id,connection_type:selectedShemasection?.databasename,schema:selectedShemasection?.selectedSchema,for_master_report:"no",query:formdata.query,report_title:formdata.title}))
        // } else {
            alert("please select any of the report")
        // }
    }

    const handelSelectReportNamedropsecond = (e) => {
        if (e.target.value != null) {
            dispatch(getlistofcolumnformappingsecond())
        } else {
            alert("please select any of the report")
        }
    }




    return (
        <div>
            <div>
                <div className='sampledrilldownquery'>
                    <div className='sampledrilldownquery-ssub-cnt'></div>
                    <div className='sampledrilldownquery-sub-cnt'>
                        <form className='sampledrilldownquery-well form-horizon'>
                            <div className='custome-container-column'>
                                <Form.Select style={{ width: "48%" }} aria-label="Default select example" onChange={handelSelectReportNamedropfirst}>
                                    <option>Select report name</option>
                                    {reportdetail && reportdetail?.map((report, index) => (
                                        <option key={index} value={report.report_name}>
                                            {report.report_name}
                                        </option>
                                    ))}
                                </Form.Select>

                                <Form.Group style={{ width: "48%"}} controlId="formBasicEmail">
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>

                            </div>
                            

                        </form>

                        <div>
                                <Button onChange={handelSelectReportNamedropfirst}>Tag</Button>
                            </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default SampleQueryForDrilldown