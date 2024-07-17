import "./CardLayout.css";
import React, { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";

import { green_up_arrow, red_down_arrow } from "./status_Arrow";

const apiUrl = "http://localhost:3002/getGroupDashboardAccess";

const CardLayout = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      console.log(data, "received data");
    }
  }, [data]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <div className="server_status_card-container">
      {data ? (
        data.map((item, index) => (
          <Card key={index} body className="server_status_card">
            <div
              className={`groupname ${
                item.has_dashboard_access === "True"
                  ? "has-access"
                  : "no-access"
              }`}
            >
              {item.groupname}
            </div>
            <img
              src={
                item.has_dashboard_access === "True"
                  ? green_up_arrow
                  : red_down_arrow
              }
              alt={
                item.has_dashboard_access === "True"
                  ? "Green Up Arrow"
                  : "Red Down Arrow"
              }
              className="arrow-icon"
            />
          </Card>
        ))
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default CardLayout;
