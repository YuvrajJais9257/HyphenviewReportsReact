import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PopupAddGroup from '../UserManagement/PopupAddGroup';
import { featureName } from '../../actions/auth';
import { listofgroup } from '../../actions/newgroup';
import { assignfeaturetothegroup, getfeatureaccessmask } from '../../actions/assignFeature';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '../globalCSS/Button/Button';
import Header from '../header';
import './FeatureAssign.css';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'

const ReportManagement = () => {
    const [features, setfeatures] = useState([]);
    const [popupaddateparameter, setpopupaddateparameter] = useState(false);
    const [search, setSearch] = useState("")
    const [expandedRows, setExpandedRows] = useState([]);
    const [addnewgroup, setaddnewgroup] = useState();
    const dispatch = useDispatch();
    const history = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const apiData = useSelector((state) => state);
    const listofallgroup = apiData?.newgroup.list_of_group;
    const listofallfeature = apiData?.auth.list_of_feature;
    const accessfeaturesss = apiData?.assignfeaturetothegroup.assignrespontoget;

    const requiredValues = ['a', 'e', 'd', 'v'];
    const reportsManagementObject = user.features.find(obj => obj.featurename === 'User Management');

    useEffect(() => {
        dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
        dispatch(featureName({ email: user.user_email_id, database_type: "mysql" }))
    }, []);


    useEffect(() => {
        if (listofallfeature) {
            const updatedReports = listofallfeature && listofallfeature.map(feature => ({
                name: feature.featurename,
                add: false,
                edit: false,
                delete: false,
                view: false,
                adminMode: false
            }));
            setfeatures(updatedReports);
        }
    }, [listofallfeature]);


    const [currentPage, setCurrentPage] = useState(1)

    let PageSize = 8
    const table = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * PageSize
      const lastPageIndex = firstPageIndex + PageSize
      return features && features?.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, features])
  
    // Search filtering
    let results
    if (search) {
      results = features?.filter(item => {
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


    const handleCheckboxChange = (index, key) => {
        setfeatures((prevReports) => {
            const updatedReports = prevReports.map((report, i) => {
                if (i === index) {
                    return { ...report, [key]: !report[key] };
                }
                return report;
            });
            if (key === "adminMode") {
                // If adminMode is checked, set all other checkboxes to true
                if (updatedReports[index].adminMode) {
                    updatedReports[index].add = true;
                    updatedReports[index].edit = true;
                    updatedReports[index].delete = true;
                    updatedReports[index].view = true;
                } else {
                    // If adminMode is unchecked, set all other checkboxes to false
                    updatedReports[index].add = false;
                    updatedReports[index].edit = false;
                    updatedReports[index].delete = false;
                    updatedReports[index].view = false;
                }
            } else {
                // Check if all checkboxes except adminMode are checked
                const allChecked = ["add", "edit", "delete", "view"].every(
                    (checkbox) => updatedReports[index][checkbox]
                );
                updatedReports[index].adminMode = allChecked;
            }
            return updatedReports;
        });
    };

    useEffect(() => {
        if (accessfeaturesss) {
            console.log("chek");
            const updatedReports = features.map(report => {
                const assignedReport = accessfeaturesss.find(item => item.featurename === report.name);
                console.log(assignedReport, "assignedReport");
                return {
                    ...report,
                    add: assignedReport?.accessmask.includes('a') || false,
                    edit: assignedReport?.accessmask.includes('e') || false,
                    delete: assignedReport?.accessmask.includes('d') || false,
                    view: assignedReport?.accessmask.includes('v') || false,
                    adminMode: assignedReport?.accessmask.includes('a') && assignedReport?.accessmask.includes('e') && assignedReport?.accessmask.includes('d') && assignedReport?.accessmask.includes('v') || false,
                    group_id: addnewgroup
                };
            });
            setfeatures(updatedReports);
        }
    }, [accessfeaturesss]);
    

    const handleSelectGroup = (e, groupid) => {
        dispatch(getfeatureaccessmask({ group_id: groupid, database_type: "mysql" }))
        setaddnewgroup(groupid)
    };

    const accessMap = {
        add: 'a',
        edit: 'e',
        delete: 'd',
        view: 'v'
    };

    const handelsavereport = () => {
        if (features[0].group_id != null) {
            const result = features.map(item => {
                const access = Object.keys(accessMap).filter(key => item[key]).map(key => accessMap[key]).join('');
                return { feature_names: item.name, access_masks: access };
            });
            if (result.length > 0) {
                let payloadform = {
                    group_id: features[0].group_id,
                    database_type: "mysql",
                    email: user.user_email_id,
                    feature_names: result.map((item) => item.feature_names),
                    access_masks: result.map(item => item.access_masks === '' ? 'null' : item.access_masks)
                }
                if (Object.keys(payloadform).length > 0) {
                    dispatch(assignfeaturetothegroup(payloadform, history))
                }

                console.log(payloadform, "payloadform")
            }
        } else {
            alert("can you plealse select any of the group");
        }
    }

    const handelclickgotoDashboard = () => {
        history('/Dashboard')
    }

    const handleRowToggle = () => {
        history('/TestQery')
    };

    const handelAddFeature = () => {
        history('/FeatureAssign')
    }

    console.log(features, "repo")

    return (
        <div>
            {popupaddateparameter && popupaddateparameter ? (<PopupAddGroup setpopupaddateparameter={setpopupaddateparameter} />) : undefined}
            <div className="Header"><Header /></div>
            <div className="feature_report_to_group">
                <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
                <span>/</span>
                <span>Assign Fetures And Reports To The Group</span>

            </div>
            <div className='feature_report_sub_container'>
                <div className='feature_report_button_cnt'>
                    <Button onClick={handelsavereport}>Save</Button>
                    {/* <Button>Reset</Button> */}
                </div>
                <div className='feature_button_cnt2'>
                    {requiredValues.every(value => reportsManagementObject.accessmask.includes(value)) ? <Button onClick={() => { setpopupaddateparameter(true) }}>Add New Group</Button> : null}
                    {requiredValues.every(value => reportsManagementObject.accessmask.includes(value)) ?<Button onClick={handelAddFeature}>Add New Feature</Button> : null}
                    {/* <Button onClick={handelAsignGroup}>Assign Report</Button> */}
                </div>
            </div>
            <div className='feature_report_displayed'>
                <div style={{ marginRight: "100px" }}>
                    {listofallgroup && listofallgroup.map((group, index) => (
                        <Button
                            key={index}
                            style={{backgroundColor: group.group_id === addnewgroup ? 'white' : '#424344',
                            color: group.group_id === addnewgroup ? '#424344' : 'white'}}
                            onClick={(e) => handleSelectGroup(e, group.group_id)}>
                            {group.groupname}
                        </Button>
                    ))}
                </div>
            </div>
            <div>

            </div>
            <div className='feature_report_table_container'>
                <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th><span className='feature_Report_search'>
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /></span></th>
                            <th style={{ textAlign: "center" }}>Add</th>
                            <th style={{ textAlign: "center" }}>Edit</th>
                            <th style={{ textAlign: "center" }}>Delete</th>
                            <th style={{ textAlign: "center" }}>View</th>
                            <th style={{ textAlign: "center" }}>Admin Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((feature, index) => (
                            <tr key={index}>
                                <td class='dropright'>
                                    <span>{feature.name}</span>
                                    <span>{feature.name === "Report Management" && <Link  to={`/TestQery?group_id=${addnewgroup}`} ><i style={{marginLeft:"5px", color:"black"}} class="fa-solid fa-caret-right"></i></Link>}</span>
                                    <span>{feature.name === "Dashboard Management" && <Link  to={`/DashboardManagement?group_id=${addnewgroup}`} ><i style={{marginLeft:"5px", color:"black"}} class="fa-solid fa-caret-right"></i></Link>}</span>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={feature.add}
                                        onChange={() => handleCheckboxChange(index, "add")}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={feature.edit}
                                        onChange={() => handleCheckboxChange(index, "edit")}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={feature.delete}
                                        onChange={() => handleCheckboxChange(index, "delete")}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={feature.view}
                                        onChange={() => handleCheckboxChange(index, "view")}
                                    />
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <input
                                        type="checkbox"
                                        checked={feature.adminMode}
                                        onChange={() => handleCheckboxChange(index, "adminMode")}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div></div>
        </div>
    );
};

export default ReportManagement;