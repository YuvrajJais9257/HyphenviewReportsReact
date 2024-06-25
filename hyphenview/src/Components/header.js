import React, { useState } from 'react';
import Logo from './Images/small2logoOnly.png';
import { useNavigate } from 'react-router-dom';
import './header.css'
function Header() {
  const history = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  const [dropdown, setDropDown] = useState("none")
  const userfeature = user.features.map((item) => item.featurename);
  console.log(userfeature)
  const logout = () => {

    // dispatch({ type: actionType.LOGOUT });

    history('/hyphenview');


  };


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <img src={Logo} alt="Logo" />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item" onClick={() => history('/hyphenview/Dashboard')}>
                <a className="nav-link active" aria-current="page" href="#">
                  Dashboard
                </a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="#">
                  Crystel Reports
                </a>
              </li> */}

              {userfeature.includes('User Management') && (<li
                className="nav-item"
                onClick={() => history('/hyphenview/UserManagementList')}
              >
                <a className="nav-link" href="#">
                  User Management
                </a>
              </li>)}
              {userfeature.includes('Report Management') && (
                <li
                  className="nav-item"
                  onClick={() => history('/hyphenview/ListOfReports')}
                >
                  <a className="nav-link" href="#">
                    Reports Management
                  </a>
                </li>)}
              {userfeature.includes('Report Scheduler') && (
                <li
                  className="nav-item"
                  onClick={() => history('/hyphenview/ReportSchedulerList')}
                >
                  <a className="nav-link" href="#">
                    Reports Scheduled
                  </a>
                </li>)}
              {/* <li className="nav-item" >
                <a
                  className="nav-link disabled"
                  href="#"
                  tabIndex="-1"
                  aria-disabled="true"
                >
                  Disabled
                </a>
              </li> */}

              {userfeature.includes('Dashboard Management') && (
                <li
                  className="nav-item"
                  onClick={() => history('/hyphenview/ListOfDashboardCanvas')}
                >
                  <a className="nav-link" href="#">
                    Dashboard Management
                  </a>
                </li>)}
            </ul>
          </div>
          <div className="header__profile_notification">
            <button className="header__profile_blank" onClick={() => dropdown == "none" ? setDropDown("block") : setDropDown("none")} >
              <span>{user?.groupname[0]}</span>

            </button>
          </div>

          <div className="header_dropdown" style={{ display: dropdown }}>
            <p className='log-out'>{user?.groupname}</p>
            <p onClick={() =>
              logout()} className='log-out'>Log out</p>
          </div>
        </div>



      </nav>
    </div>
  );
}

export default Header;
