import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ReportDashBoardNew.module.css";
import "./ReportDashBoardNew.css";
import { Card } from "react-bootstrap";
 
// Define the ReportDashBoardNew functional component 
const ReportDashBoardNew = () => {
  return (
    <>
      <div className="container-fluid">
        <div className={styles.field}>
          <div className={styles.box}>
          </div>
        </div>
        <div className="hero">
          <label htmlFor="hero" className={styles.textfield}>
            Hello Super Admin, Welcome.
          </label>
        </div>
        <div className="features-section">
          <div className="features">
            <div className="feature-top" style={{justifyContent:"space-around"}}>
            <Card className="feature" style={{width:"50%"}}>
                <Card.Body style={{ display: "inline-flex" }}>
                  <img
                    src="./featureIcon/Black_Dashboard.png"
                    className="logo"
                  />
                  <Card.Title>User Dashboard</Card.Title>
                </Card.Body>
              </Card>
            <Card className="feature" style={{width:"50%"}}>
                <Card.Body style={{ display: "inline-flex" }}>
                  <img
                    src="./featureIcon/Black_User_Management.png"
                    className="logo"
                  />
                  <Card.Title>User Management</Card.Title>
                </Card.Body>
              </Card>
                 
            </div>
            <div className="feature-bottom" style={{justifyContent:"space-around"}}>
            <Card className="feature" style={{width:"50%"}}>
                <Card.Body style={{ display: "inline-flex"}}>
                  <img src="./featureIcon/Black_Report_Management.png" className="logo" />
                  <Card.Title>Report Scheduler</Card.Title>
                </Card.Body>
              </Card>
              <Card className="feature" style={{width:"50%"}}>
                <Card.Body style={{ display: "inline-flex" }}>
                  <img
                    src="./featureIcon/Black_Report_Scheduler.png"
                    className="logo"
                  />
                  <Card.Title>Report Management</Card.Title>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
        <div className="default_footer">
        <p className="footer-text">
          Hyphenview is a self-service Business Intelligence & Data
          Visualization Platform. Caters end user to create Customizable
          Dashboard & Reports.
        </p>
      </div>
      </div>
     
    </>
  );
};
 
export default ReportDashBoardNew;