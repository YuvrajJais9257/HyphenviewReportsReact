import React, { useEffect, useMemo, useState } from 'react';
import Header from '../header';
import './NewUser.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { listofgroup } from '../../actions/newgroup'
import {saveUser,resetmessageshown } from '../../actions/usermanagement'
import { Link } from 'react-router-dom';
import styles from './NewUser.module.css'
import { Button } from './../globalCSS/Button/Button';

function NewUser() {
    const history = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    const dispatch = useDispatch();
    const apiData = useSelector((state) => state);

    const message = apiData?.usermanagement?.save_user?.message;
    console.log(message,"message")

    useMemo(()=>{
      dispatch(resetmessageshown())
    },[])


    useEffect(() => {
        dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
    }, [])

    const userDetail = {
        groupname: "",
        date: "",
        new_user_email: "",
        email: user.user_email_id,
        database_type: "mysql",
        password: ""
    };

    const [userForm, setuserForm] = useState(userDetail);
    // const [selectReports, setSelectReports] = useState([]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const group_id = listofallgroup && listofallgroup?.filter((groupid)=>userForm.groupname===groupid.groupname)  
        if (group_id) {
            const updated = {
                group_id: group_id[0].group_id,
                date: '',
                new_user_email: userForm.new_user_email,
                email: user.user_email_id,
                database_type: 'mysql',
                password: userForm.password,
            };
            console.log(updated,"updated")
            dispatch(saveUser(updated,history));
            return;
        } 
            // dispatch(saveUser(updated,history)); 
    };


    const listofallgroup = apiData?.newgroup.list_of_group;
    console.log(listofallgroup, "listofallgroup")

    // const options = [
    //     { value: 'option1', label: 'Option 1' },
    //     { value: 'option2', label: 'Option 2' },
    //     // Add more options as needed
    // ];

    const handelChange = (e) => {
        console.log(e.target.value, "e.target.value")
        setuserForm({ ...userForm, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="Header">
                <Header />
            </div>
            <div className="New_user_management_page">
                <span className="fas fa-house-user" aria-hidden="true" onClick={() => history('/Dashboard')}></span>
                <span>/</span>
                <span>User Management</span>
                {/* <Button onClick={() => history(-1)}>New User</Button> */}
                {/* {['Admin','Super Admin'].includes(user.groupname) && <Link to={`/ReportAsination`} className='btn btn-default New_user_managemet_btn2'>Group Assignation</Link>} */}
            </div>
            <div  className={styles.generalcontainer}>
            
            <div className={styles.generalsubcontainer}>
            {message && (<div className='new_user_message'>{message}

            </div>)}
            <div className={styles.title}>Register New User</div>
                <form onSubmit={handleSubmit}>
                    {/* <div className={styles.field}>
                        <label htmlFor="email" className={styles.textfield}>User Name</label>
                        <div className={styles.box}><input
                            type="email"
                            name="email"
                            id="email"
                            pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"     
                            maxLength={45}
                            readOnly
                            disabled
                            placeholder="User Name"
                            value={userForm.email}
                            onChange={(e) => handelChange(e)}
                            required
                        /></div>
                    </div> */}

                    <div className={styles.field}>
                        <label htmlFor="new_user_email" className={styles.textfield}>User Name</label>
                        <div className={styles.box}> <input
                            type="email"
                            id="new_user_email"
                            name="new_user_email"
                            placeholder="Email Address"
                            value={userForm.new_user_email}
                            maxLength={45}
                            onChange={(e) => handelChange(e)}
                            required
                        /></div>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="groupname" className={styles.textfield}>Group Name/ID</label>
                       <div className={styles.box}><select
                            id="groupname"
                            // className='form-selector'
                            name="groupname"
                            aria-label="Default select example"
                            value={userForm.groupname}
                            onChange={handelChange}
                            required
                        >
                            <option value="" disabled>Select Group Name</option>
                            {listofallgroup && listofallgroup?.map(option => (
                                <option key={option.groupname} value={option.groupname}>{option.groupname}</option>
                            ))}
                        </select></div>
                    </div>
                    {/* Other form inputs go here */}
                    {/* ... (similarly handle password and other fields) */}
                    <div className={styles.field} >
                        <label htmlFor="password" className={styles.textfield}>Password</label>
                        <div className={styles.box}><input
                            type="password"
                            name='password'
                            id="password"
                            placeholder="Password"
                            value={userForm.password}
                            onChange={handelChange}
                            minLength={5}
                            maxLength={10}
                            required
                        /></div>
                    </div>

                    {/* Reports - Dashboard */}
                    {/* <div className={styles.form_control}>
                        <label htmlFor="reportsDashboard" className="form-label">Reports - Dashboard</label>
                        <Select
                            options={options}
                            isMulti
                            value={options.filter((option) => selectReports.includes(option.value))}
                            onChange={(selectedOptions) => setSelectReports(selectedOptions.map((option) => option.value))}
                        />
                    </div> */}
                    <div style={{textAlign:"center"}}>
                        <Button type="submit" >Add User</Button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}

export default NewUser;
