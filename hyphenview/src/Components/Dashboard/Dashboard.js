import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import HighCharts from '../HighCharts/HighCharts';
import './Dashboard.css'
import Logo from '../Images/hyphenwhite.png'
import Logo1 from '../Images/hyphenviewlogo.png'
import ReportDashBoardNew from '../DefaultPage/ReportDashBoardNew';
import { canvashframedataformodification } from '../../actions/canvascreation';
import { listofgroup } from "../../actions/newgroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CustomDropdown from "./CustomDropDown";
import userGroupIcons from "./UserGroupIcons";

const ResponsiveGridLayout = WidthProvider(Responsive);
function DashboardNew() {


     // State variables for sidebar, features, user groups, and tabs
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [featurename, setFeaturename] = useState([]);
    const [selectedUserGroup, setSelectedUserGroup] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [freamData, setfreamData] = useState([]);
    
    const history = useNavigate();
    const dispatch = useDispatch();

    const apiData = useSelector((state) => state);
    const user = JSON.parse(localStorage.getItem('profile'))
    const usertype = user.groupname;


    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };

    
    // call the api's to showcase the frame data
    useEffect(() => {
        dispatch(canvashframedataformodification({ customer_id: user.customer_id, group_id: user.group_id }));
        dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }));
    }, []);

     


    // feath frames from the api 
    const frameChartdata = apiData?.canvascreation.canvasframedetail;
    const listofallgroup = apiData?.newgroup.list_of_group;


   // Set user frames and use this frames data to showcase the dashboard
    useEffect(() => {
        const frames = frameChartdata?.length != 0 && frameChartdata?.frames[0]?.frame || [];
        const framelayout = JSON.stringify(frames);
        localStorage.setItem('checkframehavedata', framelayout);
        if (frames.length > 0) {
            setfreamData(frames);
            setActiveTab(0);
        } else {
            console.log('No value found in localStorage for the key "finalfream"');
        }

    }, [frameChartdata]);

    
    // Set user features and selected group on user change
    useEffect(() => {
        if (user) {
            setFeaturename(user.features);
            setSelectedUserGroup(user.group_id);
        }
    }, []);

    // Navigation function for feature clicks
    const handleClickFeature = (feature) => {
        if (feature === 'User Management') {
            history('/hyphenview/UserManagementList')
        } else if (feature === 'Report Management') {
            history('/hyphenview/ListOfReports')
        } else if (feature === 'Report Scheduler') {
            history('/hyphenview/ReportSchedulerList')
        } else if (feature === 'Dashboard Management') {
            history('/hyphenview/ListOfDashboardCanvas')
        }
    }

    // Navigation function for logout
    const handelClicklogout = () => {
        history('/hyphenview/Profile')
    }

     // Handle user group change from dropdown
    const handleUserGroupChange = (value) => {
        dispatch(canvashframedataformodification({ customer_id: user.customer_id, group_id: value }));
        setSelectedUserGroup(value);
    };

    // Handle tab change to update active tab and frame data
    const handleTabChange = (key, dashboardname) => {
        setActiveTab(key);
        const selecteddashboard = frameChartdata?.frames.filter((dashoard) => dashoard.dashboard_name === dashboardname)
        if (selecteddashboard) {
            setfreamData(selecteddashboard[0].frame);
        }
    };


    // Prepare dropdown options for user groups
    const dropdownOptions = listofallgroup?.map((groupdetail) => {
        let icon;
        switch (groupdetail.groupname) {
            case "Admin":
                icon = userGroupIcons.Admin;
                break;
            case "Guest":
                icon = userGroupIcons.Guest;
                break;
            case "ReportEndUser":
                icon = userGroupIcons.ReportEndUser;
                break;
            case "Employes":
                icon = userGroupIcons.Employes;
                break;
            case "Hyphen":
                icon = userGroupIcons.Hyphen;
                break;
            default:
                icon = "";
        }
        return {
            value: groupdetail.group_id,
            label: groupdetail.groupname,
            icon: icon,
        };
    });


    return (
        <div className='Dashboard_container'>
            < div className='container_cnt'>

                <div className='left-sidebar'>
                    <div className={`left_sideofcontainer ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                        <div className="left_sideofcontainer">
                            <div className='Allcard'>
                                {isSidebarCollapsed ? (
                                    <div className='SideBar_item' onClick={toggleSidebar} style={{ height: "64px", transition: "width 0.3s ease" }}>
                                        <img style={{ width: "30px", height: "30px", marginLeft: "3px" }} src={Logo1}></img>
                                    </div>
                                ) : (
                                    <div className='SideBar_item' onClick={toggleSidebar}>
                                        <img src={Logo}></img>
                                    </div>
                                )}
                                <hr className='line_drow'></hr>
                                <div id="dashboard" className="SideBar_item">
                                    <CustomDropdown
                                        isSidebarCollapsed={isSidebarCollapsed}
                                        options={dropdownOptions}
                                        selectedOption={selectedUserGroup}
                                        onOptionSelect={handleUserGroupChange}
                                    />
                                </div>

                                {(featurename != 'undefined') && featurename?.map((feature, index) => (
                                    <div key={index} id={feature.featurename} className='SideBar_item' onClick={() => handleClickFeature(feature.featurename)} >
                                        {isSidebarCollapsed ? (
                                            <span style={{ display: "flex", alignItems: "center", gap: "20px", padding: "3px", marginLeft: "2px" }}>
                                                <img style={{ width: "30px", height: "30px", color: "white" }} src={feature.feature_lcon} />
                                            </span>
                                        ) : (
                                            <span style={{ display: "flex", alignItems: "center", gap: "20px", padding: "3px", marginLeft: "2px" }}>
                                                <img style={{ width: "30px", height: "30px", color: "white" }} src={feature.feature_lcon} />
                                                <span>{feature.featurename}</span>
                                            </span>
                                        )}
                                    </div>
                                ))}

                                <div className='SideBar_item' onClick={handelClicklogout}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "20px", padding: "3px", marginLeft: "2px" }}>
                                        <span> <img
                                            src="/featureIcon/1_logout.png"
                                            className="Dashboard_logo"
                                        /></span>
                                        <span id={isSidebarCollapsed ? 'logout_hide' : 'logout_show' } className='hide_menu'>User Profile</span>
                                    </span>
                                    {/* {!isSidebarCollapsed && <span className='hide_menu'>LogOut</span>} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>

                    <div
                        id="dashboard-tab-container"
                        className={
                            isSidebarCollapsed
                                ? "right_sideofcontainer collapsed"
                                : "right_sideofcontainer expanded"
                        }
                        style={{
                            marginLeft: isSidebarCollapsed ? "4%" : "20%",
                            width: isSidebarCollapsed ? "96%" : "80%",
                        }}
                    >
                        {frameChartdata && (
                            <Tabs
                                style={{ borderTopRightRadius: "0px" }}
                                className="dashboard-tabs"
                                activeKey={activeTab}
                                //   onSelect={handleTabChange}
                                onSelect={() => { }}
                            >
                                {(frameChartdata?.frames) != "undefined" && (frameChartdata?.length) != 0 && frameChartdata?.frames.map((dashboard, index) => (
                                    <Tab
                                        eventKey={index}
                                        key={index}
                                        className={index === activeTab ? "selected-tab" : "normal-tab"}
                                        title={
                                            <span
                                                className={
                                                    index === activeTab ? "active-tab-item" : "tab-item"
                                                }
                                                onClick={() => handleTabChange(index, dashboard.dashboard_name)}
                                            >
                                                {dashboard.dashboard_name}
                                            </span>
                                        }
                                    ></Tab>
                                ))}
                            </Tabs>
                        )}
                    </div>

                    <div
                        className={`right_sideofcontainer page-wrapper ${isSidebarCollapsed ? "collapsed" : "expanded"
                            }`}
                        style={{
                            marginLeft: isSidebarCollapsed ? "5%" : "20%",
                            width: isSidebarCollapsed ? "93%" : "80%",
                        }}
                    >
                        {/* <div  className= "right_sideofcontainer page-wrapper"> */}
                        {frameChartdata?.frames?.length === 0 || frameChartdata?.length === 0 ? (
                            <ReportDashBoardNew />
                        ) : (
                            <div className='layoutSuperContainer' style={{ backgroundColor: "rgb(245,245,245)" }} >
                                <ResponsiveGridLayout
                                    className='layout'
                                    layouts={{ lg: freamData }}
                                    breakpoints={{ lg: 1263, md: 1200, sm: 768, xs: 480, xxs: 0 }}
                                    cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                                    rowHeight={30}
                                    isResizable={false}
                                    isDraggable={false}
                                    width={1263}
                                >
                                    {freamData && freamData.map((item) => (
                                        <div
                                            key={item.i}

                                            style={{
                                                boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 4px 6px 0 rgba(0, 0, 0, 0.19)',
                                                background: 'white',
                                                overflow: 'hidden',
                                                // backgroundColor:"#001724",
                                                borderRadius: "5px",
                                                width: `${item.w * 100}%`,
                                                height: `${item.h * 30}px`,
                                            }}
                                        >
                                            <HighCharts width={`${item.w * 100}%`} height={`${item.h * 38}px`} charttype={item.chartType} />
                                        </div>
                                    ))}
                                </ResponsiveGridLayout>
                            </div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardNew