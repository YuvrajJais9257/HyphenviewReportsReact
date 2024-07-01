import React, { useState } from "react";
import './ApexChart.css';
import MySQLlogo from '../aserts/images/MySQLlogo.svg';
import sqlServer from '../aserts/images/mssqlserver.png';
import Oraclelogo from '../aserts/images/Oraclelogo.svg';
import DB2 from '../aserts/images/DB2.svg';
import PostgreSQLlogo from '../aserts/images/PostgreSQLlogo.svg';
import Verticalogo from '../aserts/images/Verticalogo(1).jpg';
import restAPI from '../aserts/images/restAPI.png';
import { Button } from './../globalCSS/Button/Button';
import DbConnection from "./DbConnection";
import Header from '../header';
import { useNavigate } from "react-router-dom";

export default function ShowButtonHover() {

    // Array of objects containing database logos and types
    const databaseCards = [
        { logo: MySQLlogo, alt: "MySQL Logo", type: "mysql" },
        { logo: sqlServer, alt: "Microsoft SQL Server Logo", type: "MsSQLServer" },
        { logo: Oraclelogo, alt: "Oracle Logo", type: "Oracle" },
        { logo: DB2, alt: "IBM Logo", type: "DB2" },
        { logo: PostgreSQLlogo, alt: "PostgreSQL Logo", type: "postgres" },
        { logo: Verticalogo, alt: "Vertica Logo", type: "vertica" },
        { logo: restAPI, alt: "REST API Logo", type: "restapi" },
    ];
     

     // State for managing database type, showing database connection component, hovered card, and clicked card
    const [DbType, setDbType] = useState(null);
    const [showDbConnection, setShowDbConnection] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [clickedCard, setClickedCard] = useState(null);
    const history = useNavigate();
    
    // Function to handle connect button click
    const handleConnectClick = (event, type) => {
        event.preventDefault();
        if (type === "restapi") {
            history('/HomePage')
        } else {
            setDbType(type);
            setShowDbConnection(true);
            setClickedCard(type); // Mark the clicked card
        }
    };


    // Function to handle mouse enter event on card
    const handleCardMouseEnter = (type) => {
        setHoveredCard(type);
    };


    // Function to handle mouse leave event on card
    const handleCardMouseLeave = () => {
        setHoveredCard(null);
    };


    // Function to navigate to Dashboard
    const handelclickgotoDashboard = () => {
        history('/Dashboard');
    };

    return (
        <div>
            <div className="Header">
                <Header />
            </div>
            <div className="Apexchart_icon_header">
                <span className="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
                <span>/</span>
                <span>Test Connection</span>
            </div>
            <div className="Database-Connection">
                {databaseCards.map((card, index) => (
                    <div key={index}
                        className="NewCards"
                        onMouseEnter={() => handleCardMouseEnter(card.type)}
                        onMouseLeave={handleCardMouseLeave}>
                        <div className="logoNew">
                            <img src={card.logo} alt={card.alt} />
                        </div>
                        <div className="footerNew">
                            {(hoveredCard === card.type || clickedCard === card.type) && (
                                <Button onClick={(event) => handleConnectClick(event, card.type)}>
                                    Connect
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div>{showDbConnection ? <DbConnection DbType={DbType} /> : null}</div>
        </div>
    );
}
