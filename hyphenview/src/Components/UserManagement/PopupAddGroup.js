import React, { useEffect, useMemo, useState } from 'react'
import { CloseIcon } from "../../assets/Icons";
import { addGroup, listofgroup,resertgroupmessage } from '../../actions/newgroup'
import './PopupAddGroup.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './../globalCSS/Button/Button';
function Popupaddparameter({ setpopupaddateparameter }) {
  const [AddGroup, setAddGroup] = useState();
  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const history = useNavigate();

  const apiData = useSelector((state) => state.newgroup);
  const response = apiData?.addgroupmessage?.message;
  console.log(response,"message")

  const handleResetPassword = async (e) => {
    e.preventDefault();
    dispatch(addGroup({ email: user.user_email_id, customer_id: user.customer_id, database_type: "mysql", group_name: AddGroup }, history))
    dispatch(listofgroup({ email: user.user_email_id, database_type: "mysql" }))
    // alert("Group Added Successfully!")
    // setpopupaddateparameter(false)
  }
  useEffect(() => {
    dispatch(resertgroupmessage())
  }, [])

 
  return (
    <div className='Add_Group_container'>
      <div className='popup__box'>
      {response && <div><p style={{  textAlign: "center",color: "red" }}> {response}</p></div>}
        <div class="mb-3" style={{ textAlign: "center" }}>
          <CloseIcon onClick={() => setpopupaddateparameter(false)} />
        </div>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label for="exampleFormControlTextarea1" class="form-label">Add New Group</label>
            <div className="col-md-8 inputGroupContainer">
              <div class="input-group flex-nowrap">
                <input type="text" name="groupname" value={AddGroup} class="form-control" placeholder="Group Name" aria-label="Group Name" aria-describedby="addon-wrapping" onChange={(e) => {
                  const inputValue = e.target.value; 
                  if (/^[a-zA-Z_]*$/.test(inputValue)) {
                    setAddGroup(inputValue);
                  }
                }} required />
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center",margin:"10px" }}><Button>Save</Button></div>
        </form>
      </div>
    </div>
  )
}

export default Popupaddparameter