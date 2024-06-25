

import React, { useEffect, useState } from 'react';
import Header from '../header';
import './ResetPassword.css';
import { resetPassword,resetmessagePassword } from '../../actions/usermanagement';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from './../globalCSS/Button/Button';

function ResetPassword() {
  const [resetForm, setResetForm] = useState();
  const user = JSON.parse(localStorage.getItem('profile'));
  const dispatch = useDispatch();
  const history = useNavigate();

 
  const [currpasstype, setPasswordType] = useState('password');
  const [conformpassword, setconformpassword] = useState('');
  const [newpasstype, setnewPasswordType] = useState('password');
  const [error, setError] = useState('');

  const queryParameters = new URLSearchParams(window.location.search);
  const user_email_id = queryParameters.get('user_email_id');

  const initialState = {
    new_password: '',
    database_type: 'mysql',
    email: user_email_id,
  };

  const [formdata, setformdata] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formdata.new_password !== conformpassword) {
      setError('New password and Confirm new password do not match.');
    } else {
      dispatch(resetPassword(formdata,history));
    }
  };

  const apiData = useSelector((state) => state);

  const message = apiData?.usermanagement?.reset_password?.message;
  const resetpass = apiData?.usermanagement?.reset_password;
  console.log(message,resetpass,"message")

  useEffect(()=>{
    dispatch(resetmessagePassword())
  },[])

  const handelChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
    setError('');
  };

  const handelChangeNewpassword = (e) => {
    setconformpassword(e.target.value);
    setError('');
  };

  useEffect(() => {
    setError('');
  }, []);

  return (
    <div>
      <div className="Header">
        <Header />
      </div>
      <div className="intairconatiner">
        <div className="resetpassword">
          <div className="title">Update Password</div>
          {message && <p>{message}</p>}
          {error && <p>{error}</p>}
          <form className="row g-3" onSubmit={handleSubmit} style={{ maxWidth: '450px' }}>
            <div className="field">
              <label className="textfield" htmlFor="staticEmail2">
                Email
              </label>
              <div className="box">
                <input type="email" readOnly value={user_email_id} />
              </div>
            </div>
            {/* <div className="field">
              <label className="textfield" htmlFor="inputPassword2">
                Current Password
              </label>
              <div className="box">
                <input
                  type={currpasstype}
                  name="current_password"
                  placeholder="Current Password"
                  value={formdata.current_password}
                  required
                  onChange={handelChange}
                />
                <span className="eye" onClick={() => setPasswordType(currpasstype === 'password' ? 'text' : 'password')}>
                  {currpasstype === 'password' ? <FaEyeSlash /> : <FaEye /> }
                </span>
              </div>
            </div> */}
            <div className="field">
              <label htmlFor="inputPassword2" className="textfield">
                New Password
              </label>
              <div className="box">
                <input
                  type={newpasstype}
                  name="new_password"
                  maxLength={10}
                  minLength={5}
                  id="inputPassword2"
                  placeholder="New Password"
                  value={formdata.new_password}
                  required
                  onChange={handelChange}
                />
                <span className="eye" onClick={() => setnewPasswordType(newpasstype === 'password' ? 'text' : 'password')}>
                  {newpasstype === 'password' ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="field">
              <label htmlFor="inputPassword2" className="textfield">
                Confirm Password
              </label>
              <div className="box">
                <input
                  name="conform_password"
                  type="password"
                  id="inputPassword2"
                  placeholder="Confirm Password"
                  value={conformpassword}
                  maxLength={10}
                  minLength={5}
                  required
                  onChange={handelChangeNewpassword}
                />
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <Button type="submit">
                Confirm
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;

