import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import HighCharts from "../HighCharts/HighCharts";
import ReportDashBoardNew from "../DefaultPage/ReportDashBoardNew";
import { canvashframedataformodification } from "../../actions/canvascreation";
import { listofgroup } from "../../actions/newgroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import userGroupIcons from "../Dashboard/UserGroupIcons";
import "./RightSide.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

function Rightside() {
  const [selectedUserGroup, setSelectedUserGroup] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [togglestate, setTogglestate] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const toggleTab = (index) => {
    setTogglestate(index);
  };
  const history = useNavigate();
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state);
  console.log(apiData.auth, "******");
  // console.log("apiData", apiData.user)

  const user = JSON.parse(localStorage.getItem("profile"));
  console.log(user, "user_user");
  const loginuser = user?.loginuser;
  const [freamData, setfreamData] = useState([]);
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
  const frameChartdata = apiData?.canvascreation.canvasframedetail;

  const listofallgroup = apiData?.newgroup.list_of_group;
  console.log(frameChartdata, "frameChartdata");

  useEffect(() => {
    const frames = frameChartdata?.frames?.[0]?.frame || [];
    const framelayout = JSON.stringify(frames);
    localStorage.setItem("checkframehavedata", framelayout);
    if (frames.length > 0) {
      console.log("yyy");
      setfreamData(frames);
      setActiveTab(0);
    } else {
      console.log('No value found in localStorage for the key "finalfream"');
    }
  }, [frameChartdata]);

  const handleUserGroupChange = (value) => {
    console.log(value);
    dispatch(
      canvashframedataformodification({
        customer_id: user.customer_id,
        group_id: value,
      })
    );
    setSelectedUserGroup(value);
  };

  const handleTabChange = (key, dashboardname) => {
    console.log(key, dashboardname, "key");
    setActiveTab(key);
    const selecteddashboard = frameChartdata?.frames.filter(
      (dashoard) => dashoard.dashboard_name === dashboardname
    );
    console.log(selecteddashboard, "selecteddashboard");
    if (selecteddashboard) {
      setfreamData(selecteddashboard[0].frame);
    }
    // let selectedTabTitle = filteredGroupsCreatedDashboards[activeTab];
    // console.log(selectedTabTitle, "selected tab");
    // console.log(canvasDisplayObject[selectedTabTitle], "selected tab layout");
  };

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div>
        {frameChartdata?.frames && (
          <Tabs
            style={{ borderTopRightRadius: "0px" }}
            className="user_dashboard_tabs"
            activeKey={activeTab}
            onSelect={() => {}}
          >
            {frameChartdata.frames.length !== 0 &&
              frameChartdata.frames.map((dashboard, index) => (
                <Tab
                  eventKey={index}
                  key={index}
                  className={
                    index === activeTab ? "selected-tab" : "normal-tab"
                  }
                  title={
                    <span
                      className={
                        index === activeTab ? "active-tab-item" : "tab-item"
                      }
                      onClick={() =>
                        handleTabChange(index, dashboard.dashboard_name)
                      }
                    >
                      {dashboard.dashboard_name}
                    </span>
                  }
                ></Tab>
              ))}
          </Tabs>
        )}
      </div>
      <div>
        {frameChartdata?.frames?.length === 0 ||
        frameChartdata?.length === 0 ? (
          <ReportDashBoardNew />
        ) : (
          <div className="layoutSuperContainer">
            {" "}
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: freamData }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              isResizable={false}
              isDraggable={false}
            >
              {freamData &&
                freamData.map((item) => (
                  <div
                    key={item.i}
                    style={{
                      border: "2px solid gray",
                      boxShadow:
                        "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 4px 6px 0 rgba(0, 0, 0, 0.19)",
                      background: "white",
                      overflow: "hidden",
                      borderRadius: "5px",
                      width: `${item.w * 100}%`,
                      height: `${item.h * 30}px`,
                    }}
                  >
                    <HighCharts
                      width={`${item.w * 100}%`}
                      height={`${item.h * 38}px`}
                      charttype={item.chartType}
                    />
                  </div>
                ))}
            </ResponsiveGridLayout>
          </div>
        )}
      </div>
    </div>
  );
}

export default Rightside;
