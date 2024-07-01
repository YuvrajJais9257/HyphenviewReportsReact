import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./NewSidebar.css";
import Logo from '../Images/hyphenwhite.png'
import Logo1 from '../Images/hyphenviewlogo.png'
import CustomDropdownNew from "./CustomDropDownNew";
import { listofgroup } from "../../actions/newgroup";
import { canvashframedataformodification } from "../../actions/canvascreation";
import userGroupIcons from "../Dashboard/UserGroupIcons";

const NewSidebar = ({ onToggle, isOpen }) => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  const user = JSON.parse(localStorage.getItem("profile"));
  const listofallgroup = apiData?.newgroup.list_of_group;
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [featurename, setFeaturename] = useState([]);


  useEffect(() => {
    if (user) {
      setFeaturename(user.features);
      setSelectedUserGroup(user.group_id);
    }
  }, []);


  const handleUserGroupChange = (value) => {
    dispatch(
      canvashframedataformodification({
        customer_id: user.customer_id,
        group_id: value,
      })
    );
    setSelectedUserGroup(value);
  };

  useEffect(() => {
    dispatch(
      canvashframedataformodification({
        customer_id: user.customer_id,
        group_id: user.group_id,
      })
    );
    dispatch(
      listofgroup({ email: user.user_email_id, database_type: "mysql" })
    );
  }, []);

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
  const handelClickDashboard = () => {
    history("/DashboardNew");
  };

  const handleClickFeature = (feature) => {
    if (feature === 'User Management') {
      history('/UserManagementList')
    } else if (feature === 'Report Management') {
      history('/ListOfReports')
    } else if (feature === 'Report Scheduler') {
      history('/ReportSchedulerList')
    } else if (feature === 'Dashboard Management') {
      history('/ListOfDashboardCanvas')
    }
  }

  const handelClicklogout = () => {
      history("/profile");
  };

  const onViewGroupIconClick = (e) => {
    e.stopPropagation();
    setShowGroups(!showGroups);
  };

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`sidebarcnt ${isOpen ? "open" : "closed"}`}>
      <div className="listofall-feature">
        {isOpen ? (
          <div className='New_SideBar_item' onClick={onToggle}>
            <img src={Logo} alt="Clickable Image"></img>
          </div>
        ) : (
          <div className='New_SideBar_item' onClick={onToggle} style={{ height: "64px", transition: "width 0.3s ease" }}>
            <img style={{ width: "30px", height: "30px", marginLeft: "3px" }} src={Logo1} alt="Clickable Image"></img>
          </div>
        )}
        <hr className='line_drow'></hr>
        <div id="dashboard" className="New_SideBar_item">
          <CustomDropdownNew
            isSidebarCollapsed={!isOpen}
            options={dropdownOptions}
            selectedOption={selectedUserGroup}
            onOptionSelect={handleUserGroupChange}
          />
        </div>
        {(featurename != 'undefined') && featurename?.map((feature, index) => (
          <div onClick={() => handleClickFeature(feature.featurename)} className="New_SideBar_item">
            {isOpen ? (
              <span className="dashboard_sidebar_icons_fixed">
                <img
                  className="dashboard_sidebar_icons"
                  src={feature.feature_lcon}
                  alt="userManagementLogo"
                />
                <span>{feature.featurename}</span>
              </span>
            ) : (
              <span className="dashboard_sidebar_icons_fixed">
                <img
                  className="dashboard_sidebar_icons"
                  src={feature.feature_lcon}
                  alt="userManagementLogo"
                />
              </span>
            )}
          </div>
        ))}
        {isOpen ? (
          <div className='New_SideBar_item' onClick={handelClicklogout} style={{ height: "64px", transition: "width 0.3s ease" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "20px", padding: "3px", marginLeft: "2px" }}>
              <span>
                <img src="/featureIcon/1_logout.png" className="profile_logo" alt="Logout Icon" style={{ width: "30px", height: "30px" }} />
              </span>
              <span className='hide_menu'>User Profile</span>
            </span>
          </div>
        ) : (
          <div className='New_SideBar_item' onClick={handelClicklogout}>
            <span style={{ display: "flex", alignItems: "center", gap: "20px", padding: "3px", marginLeft: "2px" }}>
              <span>
                <img src="/featureIcon/1_logout.png" className="profile_logo" alt="Logout Icon" />
              </span>
            </span>
          </div>

        )}

      </div>
    </div>
  );
};

export default NewSidebar;
