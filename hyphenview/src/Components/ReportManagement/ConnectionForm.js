
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../header';
import styles from './ConnectionForm.module.css';
import { Button } from './../globalCSS/Button/Button';
import { databaseconnection, databaseconnectionsetdefault } from '../../actions/auth';

function ConnectionForm() {

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('profile'));

  const location = useLocation(); // Get location from useLocation hook
  const navigate = useNavigate(); // Get navigate function from useNavigate hook

  // Initial state for connection data
  const initialState = {
    connection_type: '',
    database_type:'mysql',
    host: '',
    port: '',
    username: '',
    password: '',
    schema: '',
    active_user: user.user_email_id,
    save: 'no'
  };
  
  // State variables
  const [connectiondata, setConnection] = useState(initialState);
  const [Loading, setLoading] = useState(false);
  const [databaseSelectedtype, setDatabaseSelectedtype] = useState('Select the RDBMS');
  const [checkdatabaseconnection, setCheckdatabaseconnection] = useState('');

  const dispatch = useDispatch(); // Get dispatch function from useDispatch hook
  const apiData = useSelector((state) => state.auth); // Get data from Redux store
  const checkconnection = apiData.dbconnection; // Database connection status

  // Effect to set default database connection
  useEffect(()=>{
    dispatch(databaseconnectionsetdefault())
  },[])


   // Effect to update checkdatabaseconnection when checkconnection changes
  useEffect(() => {
    const filedoutput = checkconnection && checkconnection.detail;
    setCheckdatabaseconnection(filedoutput);
  }, [checkconnection]);
  
  const handleChange = (event) => {
    setDatabaseSelectedtype(event.target.value);
    setConnection({ ...connectiondata, [event.target.name]: event.target.value });
  };

  // Function to handle form submission
  const handelSubmit = async (e, save) => {
    e.preventDefault();
    setLoading(true);
    setConnection({ ...connectiondata, save });
    dispatch(databaseconnection({ ...connectiondata, save },navigate));
    setLoading(false);
  };
 
  // Function to handle change in database type
  const handelChange = (e) => {
    setConnection({ ...connectiondata, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="Header">
        <Header />
      </div>
      <div className='Connect_container'>
        {Loading && <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>}
        <div className="back_to_select_db_page">
          <span class="fas fa-house-user" aria-hidden="true" onClick={() => navigate('/Dashboard')}></span>
          <span onClick={() => navigate(-1)}>/ Database Management /</span>
          <span>New Database</span>
        </div>
        <div className={styles.generalcontainer}>
          <div className={styles.generalsubcontainer}>
            <div className={styles.title}>Test New Connection</div>
            <p style={{textAlign:"center",color:"red"}}>{checkdatabaseconnection}</p>
            <form onSubmit={handelSubmit}>
              <div className={styles.field}>
                <label htmlFor="Database_Type" className={styles.textfield}>
                  Database Type<span className="required-field"></span> :{' '}
                </label>
                <div className={styles.box}>
                  <select name="connection_type" value={databaseSelectedtype} onChange={handleChange}>
                    <option value="Select the RDBMS">Select the RDBMS</option>
                    <option value="mysql">MYSQL</option>
                    <option value="postgres">postgres</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="Host_Name" className={styles.textfield}>
                  Host Name<span className="required-field"></span> :{' '}
                </label>
                <div className={styles.box}><input type="text" value={connectiondata.host} onChange={handelChange} name="host" required /></div>
              </div>
              <div className={styles.field}>
                <label htmlFor="Port" className={styles.textfield}>
                  Port<span className="required-field"></span> :{" "}
                </label>
                <div className={styles.box}><input type="text" value={connectiondata.port} onChange={handelChange} name="port" required /></div>
              </div>
              <div className={styles.field}>
                <label htmlFor="UserName" className={styles.textfield}>
                  UserName<span className="required-field"></span> :{" "}
                </label>
                <div className={styles.box}><input type="text" value={connectiondata.username} onChange={handelChange} name="username" required /></div>
              </div>
              <div className={styles.field}>
                <label htmlFor="Password" className={styles.textfield}>
                  Password<span className="required-field"></span> :{" "}
                </label>
                <div className={styles.box}><input type="password" value={connectiondata.password} onChange={handelChange} name="password" required /></div>
              </div>
              <div className={styles.field}>
                <label htmlFor="Schema_SID_selection" className={styles.textfield}>
                  Schema/SID selection<span className="required-field"></span> :{" "}
                </label>
                <div className={styles.box}><input type="text" value={connectiondata.schema} onChange={handelChange} name="schema" required /></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button style={{ marginRight: '5px' }} type="submit" onClick={(e) => handelSubmit(e, 'no')}>Check Connection</Button>
                {checkdatabaseconnection === 'Valid Connection' &&
                  <Button style={{ marginRight: '5px' }} type="submit" onClick={(e) => handelSubmit(e, 'yes')}>Save Connection</Button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionForm;
