import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header';
import './AssignationAndFeature.css'
import PopupAddGroup from './PopupAddGroup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {featureName } from '../../actions/auth'
import { listofgroup} from '../../actions/newgroup'
import { assignfeaturetothegroup,getfeatureaccessmask } from '../../actions/assignFeature'
import { assignreporttothegroup } from '../../actions/assignReport'
import { ExpendableButton } from "../ExpendableButton/ExpendableButton";
import useOpenController from "../Hooks/useOpenController";
import TableRow from './TableRow';
import { Button } from './../globalCSS/Button/Button';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
export default function AssignationAndFeature() {

    const user = JSON.parse(localStorage.getItem('profile'));

    console.log(user,"*******")
    const [search, setSearch] = useState("")
    const dispatch = useDispatch();
    const history = useNavigate();
    const apiData = useSelector((state) => state);
    const { isOpen, toggle } = useOpenController(false);

    const [featurewitheccessmask, setfeaturewitheccessmask] = useState();
    const initialstate = {
        group_id : "",
        featurelist:[]
    }

    const initialstate2 = {
        group_id : "",
        allreportId:[]
    }

    console.log(featurewitheccessmask,"featurewitheccessmask")

    const [popupaddateparameter, setpopupaddateparameter] = useState(false);
    const [listofReportId, setlistofReportId] = useState(initialstate);
    const [listofreport, setlistofreport] = useState(initialstate2);
    const accessfeaturesss = apiData?.assignfeaturetothegroup.assignrespontoget;
    console.log(listofReportId,"listofReportId")

    const listofallgroup = apiData?.newgroup.list_of_group;
    const listofallfeature = apiData?.auth.list_of_feature;
    console.log(listofallfeature,"listofallfeature")


    

    useMemo(() => {
        dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
        dispatch(featureName({ email: user.user_email_id, database_type: "mysql" }))
    }, [])
   
    const accessmask = [
        { value: "Add", lable: "Add" },
        { value: "Edit", lable: "Edit" },
        { value: "Delete", lable: "Delete" },
        { value: "View", lable: "View" },
        { value: "Export", lable: "Export" },
        { value: "Admin Mode(access to all record)", lable: "Admin Mode(access to all record)" }
    ]
    
    const [expandedRows, setExpandedRows] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [reportcheckboxStates, setreportcheckboxStates] = useState({});
   

    const handleRowToggle = (index) => {
        if (expandedRows.includes(index)) {
            setExpandedRows(expandedRows.filter((rowIndex) => rowIndex !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };


    const handleSelectGroup = (e,groupid) => {
        setCheckboxStates([])
        // const findgroupid = listofallgroup?.group_names.map((groupitem)=>groupitem.groupid === groupid)
        dispatch(getfeatureaccessmask({ group_id: groupid, database_type: "mysql" }))
        setlistofReportId((prev) => {
            if (prev.group_id === groupid) {
                return prev;
            }
            const updatedCheckboxStates = {};
            // setCheckboxStates(updatedCheckboxStates)
            setCheckboxStates(updatedCheckboxStates)
            return { ...prev, group_id: groupid,featurelist : []};
        });

        setlistofreport((prev) => {
            if (prev.group_id === groupid) {
                return prev;
            }
            const updatedCheckboxStates = {};
            // setCheckboxStates(updatedCheckboxStates)
            setreportcheckboxStates(updatedCheckboxStates)
            return { ...prev, group_id: groupid, allreportId: []};
        });
    };

    const handelAddFeature = () =>{
        history('/FeatureAssign')
    }

    useEffect(() => {
        console.log(accessfeaturesss, "///");
        accessfeaturesss && accessfeaturesss.forEach((item) => {
            const feature = item.featurename;
            const newFeatureList = [];
    
            for (let i = 0; i < item.accessmask.length; i++) {
                const ch = item.accessmask.charAt(i);
                const accessmask = mapAccessreversed(ch);
    
                setCheckboxStates(prevCheckboxStates => ({
                    ...prevCheckboxStates,
                    [`${feature}_${accessmask}`]: true
                }));
    
                newFeatureList.push({ feature, accessmask });
            }
    
            setlistofReportId(prev => ({
                ...prev,
                featurelist: [...prev.featurelist, ...newFeatureList]
            }));
        });
    }, [accessfeaturesss]);
    




    
 
    const handelresponjsonforfeature = (result,group_id,user) =>{
        const featurelist = result?.map((item)=>item.feature)
        const accessallowes = result?.map((item)=>item.accessmask)
        const featuresendpayload = listofallfeature.map((feitem)=>
        {
            if(!featurelist.includes(feitem.featurename)){
                featurelist.push(feitem.featurename);
                accessallowes.push('null')
            }
        })
        
        // console.log(featuresendpayload,featurelist,accessallowes)
        if(featurelist.length>0&&accessallowes.length>0){
            const payloadform = {
                group_id : group_id,
                database_type : "mysql",
                email : user.user_email_id,
                feature_names : featurelist,
                access_masks : accessallowes,
            }
            return payloadform;
        }
        
        
    }

    const handelresponjsonforreport = (reportdetailresult,group_id,user) =>{

        const payloadform = {
            group_id : group_id,
            database_type : "mysql",
            email : user.user_email_id,
            report_ids : reportdetailresult?.map((item)=>item.reportId),
            access_masks : reportdetailresult?.map((item)=>item.accessmask),
        }
        return payloadform;
       
    }


    const handelsavefeature = async() =>{

        const group_id = listofReportId.group_id;
        if(group_id!=null){
        
        const result = processData1(listofReportId);
        const reportdetailresult = processData2(listofreport);
        console.log(reportdetailresult,"reportdetailresult")
        if(result.length>0){
            const getrespodn1 =  handelresponjsonforfeature(result,group_id,user)
            if(Object.keys(getrespodn1).length > 0){
                 dispatch(assignfeaturetothegroup(getrespodn1,history))
            }
            console.log(getrespodn1,"getrespodn1")
        }
        if(reportdetailresult.length>0){
            const getrespodn2 = handelresponjsonforreport(reportdetailresult,group_id,user)
            if(Object.keys(getrespodn2).length > 0){
                 dispatch(assignreporttothegroup(getrespodn2,history))
            }
            console.log(getrespodn2,"getrespodn2")
        }
       }else{
        alert("can you plealse select any of the group");
       }
    
    }

    const mapAccessMask = (accessmask) => {
        switch (accessmask) {
            case 'Add':
                return 'a';
            case 'Delete':
                return 'd';
            case 'Edit':
                return 'e';
            case 'View':
                return 'v';
            case 'Export':
                return 'p';
            case 'Admin Mode(access to all record)':
                return 'adve';
            default:
                return '';
        }
    };

    const processData1 = (data) => {
        // Group data by feature
        const groupedData = data.featurelist.reduce((result, entry) => {
            const key = entry.feature;
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push(mapAccessMask(entry.accessmask));
            return result;
        }, {});
    
        // Convert grouped data to the desired format
        const resultData = Object.entries(groupedData).map(([feature, accessmasks]) => {
            return {
                feature: feature,
                accessmask: accessmasks.join(''),
            };
        });
    
        return resultData;
    };
    
    const processData2 = (data) => {
        // Group data by feature
        const groupedData = data.allreportId.reduce((result, entry) => {
            const key = entry.reportId;
            if (!result[key]) {
                result[key] = [];
            }
            if (entry.accessmask) {
                result[key].push(mapAccessMask(entry.accessmask));
            }
            return result;
        }, {});
    
        // Convert grouped data to the desired format
        const resultData = Object.entries(groupedData).map(([reportId, accessmasks]) => {
            return {
                reportId: reportId,
                accessmask: accessmasks.join(''),
            };
        });
    
        return resultData;
    };
    
    useEffect(() => {
        const selectButtonAtIndex1 = () => {
          const buttonAtIndex1 = document.getElementById("groupId0");
          console.log(buttonAtIndex1, "buttonAtIndex1");
      
          if (buttonAtIndex1) {
            buttonAtIndex1.click();
          }
        };
      
        // Ensure that the DOM is fully loaded before selecting the button
        if (document.readyState === 'complete') {
          selectButtonAtIndex1();
        } else {
          window.onload = selectButtonAtIndex1;
        }
      }, []);

      const[val,setval] = useState()

    //   useEffect(()=>{

    //     const initialState = listofallfeature.map((item) => {
    //         const featureObj = {};
    //         const accessMasks = ['Add', 'Edit', 'Delete', 'View', 'Export', 'Admin Mode(access to all record)'];
    //         featureObj[item.featurename] = accessMasks.map((mask) => ({ [mask]: false }));
    //         return featureObj;
    //     });

    //     accessfeaturesss.forEach(({ featurename, accessmask }) => {
    //         const featureIndex = initialState.findIndex(obj => obj.hasOwnProperty(featurename));
    //         if (featureIndex !== -1) {
    //             accessmask.split('').forEach(char => {
    //                 const access = mapAccessreversed(char);
    //                 if (access) {
    //                     const maskIndex = initialState[featureIndex][featurename].findIndex(obj => obj.hasOwnProperty(access));
    //                     if (maskIndex !== -1) {
    //                         initialState[featureIndex][featurename][maskIndex][access] = true;
    //                     }
    //                 }
    //             });
    //         }
    //     });
    //     setval(initialState)

    //   },[listofallfeature,accessfeaturesss])

      console.log(val,"val")

      
    
      
    //   const handleCheckboxChange = (e, accessmask, feature) => {
    //     // Check if the checkbox was previously checked
    //     const isChecked = e;
    
    //     // Check the initial state to determine the current state of the checkbox
    //     console.log(val)

    //     // setval(prev=>{
    //     //     const initialStateFeature = prev.findIndex(obj => obj.hasOwnProperty(feature));
    //     //     if(initialStateFeature){

    //     //     }

    //     // })
    //     const initialStateFeature = val.find(obj => obj.hasOwnProperty(feature));
    //     console.log(initialStateFeature,"initialStateFeature")
    //     if (initialStateFeature) {
    //         const maskObj = initialStateFeature[feature].find(obj => obj.hasOwnProperty(accessmask));
    //         if (maskObj) {
    //             // Get the current value of the checkbox from the initial state
    //             const initialValue = maskObj[accessmask];
    
    //             // If the current value matches the desired value, return early
    //             if (isChecked === initialValue) {
    //                 return;
    //             }
    //         }
    //     }

        
    
    //     // Update the checkbox state and the list of features
    //     setlistofReportId(prev => {
    //         const existingFeatureIndex = prev.featurelist.findIndex(
    //             f => f.feature === feature && f.accessmask === accessmask
    //         );
    //         if (existingFeatureIndex !== -1) {
    //             const updatedFeatureList = [...prev.featurelist];
    //             updatedFeatureList.splice(existingFeatureIndex, 1);
    
    //             // Update checkbox state
    //             const updatedCheckboxStates = { ...checkboxStates };
    //             updatedCheckboxStates[`${feature}_${accessmask}`] = false;
    //             setCheckboxStates(updatedCheckboxStates);
    
    //             return { ...prev, featurelist: updatedFeatureList };
    //         } else {
    //             const newFeatureList = [...prev.featurelist, { feature, accessmask }];
    
    //             // Update checkbox state
    //             const updatedCheckboxStates = { ...checkboxStates };
    //             updatedCheckboxStates[`${feature}_${accessmask}`] = true;
    //             setCheckboxStates(updatedCheckboxStates);
    
    //             return { ...prev, featurelist: newFeatureList };
    //         }
    //     });
    // };
    

    const handleCheckboxChange = (e, accessmask, feature) => {
       console.log(e,accessmask,feature,"accessmask")
        // if(accessmask==='Admin Mode(access to all record)'){
            
        // }
        setlistofReportId((prev) => {
            const existingFeatureIndex = prev.featurelist.findIndex(
                (f) => f.feature === feature && f.accessmask === accessmask    
            );
            console.log(existingFeatureIndex,"existingFeatureIndex")
            if (existingFeatureIndex !== -1) {
                const updatedFeatureList = [...prev.featurelist];
                updatedFeatureList.splice(existingFeatureIndex, 1);
    
                // Update checkbox state
                const updatedCheckboxStates = { ...checkboxStates };
                updatedCheckboxStates[`${feature}_${accessmask}`] = false;
                setCheckboxStates(updatedCheckboxStates);
    
                return { ...prev, featurelist: updatedFeatureList };
            } else {
                const newFeatureList = [...prev.featurelist, { feature, accessmask }];
    
                // Update checkbox state
                const updatedCheckboxStates = { ...checkboxStates };
                updatedCheckboxStates[`${feature}_${accessmask}`] = true;
                setCheckboxStates(updatedCheckboxStates);
    
                return { ...prev, featurelist: newFeatureList };
            }
        });
    };

    const handelclickgotoDashboard = () => {
        history('/Dashboard')
    }



  

    const mapAccessreversed = (accessmask) => {
        switch (accessmask) {
            case 'a':
                return 'Add';
            case 'd':
                return 'Delete';
            case 'e':
                return 'Edit';
            case 'v':
                return 'View';
            case 'p':
                return 'Export';
            case 'adve':
                return 'Admin Mode(access to all record)';
            default:
                return '';
        }
    };
    
    

    
    
    // console.log(initialState);
    

// console.log(initialState,"seek");
    return (
        <div>
            {popupaddateparameter && popupaddateparameter ? (<PopupAddGroup setpopupaddateparameter={setpopupaddateparameter}/>) : undefined}
            <div className="Header"><Header /></div>
            <div className="Assin_feature_to_group">
            <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
            <span>Assign Fetures And Reports To The Group</span>

        {/* <span style={{ fontStyle: "italic", fontSize: "18px" }}>New Database</span> */}
           </div>
            <div className='Assignation_sub_container'>
                <div className='Assignation_button_cnt'>
                    <Button onClick={handelsavefeature}>Save</Button>
                    {/* <Button>Reset</Button> */}
                </div>
                <div className='Assignation_button_cnt2'>
                    <Button onClick={() => { setpopupaddateparameter(true) }}>Add New Group</Button>
                    <Button onClick={handelAddFeature}>Add New Feature</Button>
                </div>
            </div>

            <div className='group_displayed'>
                {listofallgroup && listofallgroup?.map((colname, index) => (
                    <Button id={`groupId${index}`} 
                     style={{
                        marginRight:"5px",
                        backgroundColor: listofReportId.group_id === colname.group_id ? 'white' : '#424344',
                        color: listofReportId.group_id === colname.group_id ? '#424344' : 'white',
                        borderRadius:"5px"

                      }} key={index} onClick={(e)=>handleSelectGroup(e,colname.group_id)}>{colname.groupname}</Button>
                ))}
            </div>

            <div className='Assignation_table_container'>
                <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th></th>
                            <th><span className='AssignationAdFeature_search'>
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /></span></th>
                                {accessmask && accessmask.map((mask, maskIndex) => (
                                <td style={{textAlign:"center"}} key={`empty_${maskIndex}`}>{mask.value}</td>
                            ))}
                        </tr>
                </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>expend all</td>
                        </tr>
                        {listofallfeature && listofallfeature.map((feature, index) => (
                    <React.Fragment key={index}>
                        <tr>
                            <td></td>
                            <td className='dropright'>
                                <span>{feature.featurename}</span>
                                {/* && (feature.featurename !=="Report Management") && */}
                                <span>{feature.featurename ==="Report Management" && <ExpendableButton isOpen={expandedRows.includes(index)} toggle={() => handleRowToggle(index)} />}</span>
                            </td>
                            {accessmask && accessmask.map((colname, colIndex) => (
                                    <td key={colIndex} style={{textAlign:"center"}}>
                                        {colname.value!='Export' ? <input
                                            type="checkbox"
                                            checked={checkboxStates[`${feature.featurename}_${colname.value}`]}
                                            onChange={(e) => handleCheckboxChange(e.target.checked, colname.value, feature.featurename)}
                                            className="custom-control-input"
                                            id={`customCheck_${colIndex}_${colIndex + 1}`}
                                        /> :
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            disabled
                                            id={`customCheck_${colIndex}_${colIndex + 1}`}
                                        />
                                        }
                                    </td>
                                ))}
                        </tr>
                        {/* {expandedRows.includes(index) && (feature.featurename==="Report Management") && <TableRow setlistofreport={setlistofreport} listofreport={listofreport} listofReportId={listofReportId} setreportcheckboxStates={setreportcheckboxStates} reportcheckboxStates={reportcheckboxStates} />} */}
                    </React.Fragment>

                        ))}
                        {/* {isOpen&&<TableRow />} */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}



