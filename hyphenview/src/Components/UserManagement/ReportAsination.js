import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { useNavigate, usehistory } from 'react-router-dom'
import {assigngrouptouser } from '../../actions/auth'
import {listofgroup} from '../../actions/newgroup'
import { listOfuser} from '../../actions/usermanagement'
import { useDispatch, useSelector } from "react-redux";
import './ReportAsination.css'
import Pagination from './../Pagination/Pagination'
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { Button } from './../globalCSS/Button/Button';
function ReportAsination() {

  const user = JSON.parse(localStorage.getItem('profile'));
  const [search, setSearch] = useState("")
  const dispatch = useDispatch();
  const history = useNavigate();
  const apiData = useSelector((state) => state);

  useEffect(() => {
    dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
    dispatch(listOfuser({ email: user.user_email_id, database_type: "mysql" }))
  }, [])

  const listofuser = apiData?.usermanagement.allUserDetail;
  console.log(listofuser, "listofuser")
  const listofallgroup = apiData?.newgroup.list_of_group;
  console.log(listofallgroup, "listofallgroup")

  const handelclickgotoDashboard = () => {
    history('/hyphenview/Dashboard')
  }


  let PageSize = 3

  const [currentPage, setCurrentPage] = useState(1)
  const [checkboxes, setCheckboxes] = useState([])
  const [selectCheck, setselectCheck] = useState([])

  console.log(selectCheck, "checkboxes")
  const table = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize
    const lastPageIndex = firstPageIndex + PageSize
    return listofuser && listofuser?.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, listofuser])

  // Search filtering
  let results
  if (search) {
    results = listofuser?.filter(item => {
      let found = false
      Object.entries(item).map(([key, value]) => {
        console.log(value, "data is coming are not")
        if (String(value).toLowerCase().includes(search.toLowerCase())) {
          found = true
        }
      })
      return found
    })
    results.length = PageSize
  } else {
    results = table
  }
  console.log(results,"results")
  const handelsave = async (e) => {
    try {
      const userConfirmed = window.confirm("Do you want to change the role");
      console.log({ customer_id: user.customer_id, user_details: checkboxes },"Are you")
      if (userConfirmed) {
        dispatch(assigngrouptouser({ "customer_id": user.customer_id, "user_details": checkboxes },history))
      } else {
        console.log("User canceled the operation.");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  }
  console.log(results, "results")

  const handleRadioButtonChange = (user, group_id) => {
    setCheckboxes((prev) => {
      const updatedCheckboxes = [...prev];
      const existingUserIndex = updatedCheckboxes.findIndex((item) => item.user_email === user);
  
      if (existingUserIndex !== -1) {
        // Update the existing user's group_id
        updatedCheckboxes[existingUserIndex].group_id = group_id;
      } else {
        // Add a new object for the user with the group_id
        updatedCheckboxes.push({ user_email: user, group_id: group_id });
      }
      console.log(updatedCheckboxes, "updatedSelectCheck")
      return updatedCheckboxes;
    });
  };
  





  return (
    <div>
      <div className="Header">
        <Header />
      </div>
      <div className="Report_Assign_page">
        <span class="fas fa-house-user" aria-hidden="true" onClick={handelclickgotoDashboard}></span>
        <span>/</span>
        <span>Assign User to the Group</span>

        {/* <span style={{ fontStyle: "italic", fontSize: "18px" }}>New Database</span> */}
      </div>
      <div className='Save_Reset_button_cnt'>
        <Button onClick={handelsave}>Save</Button>
        {/* <button className='btn btn-default Assign_group_btn1'>Reset</button> */}
      </div>
      <div className='ReportAsination_table_sub_container'>
        <table className='table table-striped table-bordered table-hover' style={{ width: "100%" }}>
          <thead>
            <tr>
              <th></th>
              <th>User Name</th>
              {listofallgroup && listofallgroup?.map((colname, index) => (
                <th style={{textAlign:"center"}} key={index}>{colname.groupname}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Empty row after the header */}
            <tr>
              <td></td>
              <td><span className='ReportAsination_search'>
                <span className="fa fa-search form-control-feedback"></span>
                <input type="text" className={styles.inputSearch} placeholder="Search" value={search} maxLength={120} onChange={e => setSearch(e.target.value)} /></span></td>
              {listofallgroup && listofallgroup?.map((colname, colIndex) => (
                <td key={`empty_${colIndex}`}></td>
              ))}
            </tr>

            {/* Data rows */}
            {results && results.map((user, userIndex) => (
              <tr key={userIndex}>
                <td></td>
                <td>{user.user_email_id}</td>
                {listofallgroup && listofallgroup?.map((colname, colIndex) => (
                  <td key={colIndex} style={{textAlign:"center"}}>
                    <input
                      type="radio"
                      // checked={(checkboxes && checkboxes.some(item => Object.keys(item)[0] === user.user_email_id && item[user.user_email_id] === colname.group_id))}
                      // checked={(checkboxes.some(item => item.user_email === user.user_email_id && item.group_id === colname.group_id))||(colname.group_id===user.group_id)}
                      checked={
                        checkboxes.some(item => item.user_email === user.user_email_id && item.group_id === colname.group_id) ||
                        (colname.group_id === user.group_id && !checkboxes.some(item => item.user_email === user.user_email_id))
                      }
                      onChange={() => handleRadioButtonChange(user.user_email_id, colname.group_id)}
                      className={colname.group_id ? 'checked' : 'unchecked'}
                      id={`customCheck_${userIndex}_${colIndex + 1}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {/* <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={listofuser ? listofuser.length : 1}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
        /> */}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={listofuser ? listofuser.length : 1}
          pageSize={PageSize}
          onPageChange={page => setCurrentPage(page)}
          selectedGroups={selectCheck}
        />
      </div>
    </div>
  )
}

export default ReportAsination

{/* <input
                      type="radio"
                      // checked={user.group_id===colname.group_id ? true : false}
                      onChange={(e) => handleCheckboxChange(e.target.checked, user.user_email_id, colname.group_id)}
                      className={colname.group_id ? 'checked' : 'unchecked'}
                      id={`customCheck_${userIndex}_${colIndex + 1}`}
                    /> */}

                    // ||(colname.group_id===user.group_id)


