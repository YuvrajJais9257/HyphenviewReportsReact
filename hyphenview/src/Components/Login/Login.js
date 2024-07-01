
// Auther: Ashish
import React, { useEffect, useMemo, useState } from "react";
import logo from '../Images/hyphenwhite.png';
import { useNavigate,useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import './login.css';
import { useDispatch } from "react-redux";
import {login,loginmessage} from "../../actions/auth";

function Login() {
    const initialState = {
        username: "",
        password: "",
    };
    const [form, setForm] = useState(initialState);

    // Handle input changes
    const handleChange = (e) => {
        if(e.target.name==='password'){
            dispatch(loginmessage())
            setForm({ ...form, [e.target.name]: e.target.value });

        }else{
            setForm({ ...form, [e.target.name]: e.target.value });

        }
        
    };
    const history = useNavigate(); // Hook for navigation
    const dispatch = useDispatch(); // Hook to dispatch actions
    const location = useLocation(); // Hook to get location

    const apiData = useSelector((state) => state?.auth);
    const loginmess = apiData?.authData;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(form, history));
        
    };

     // Run on component mount
    useEffect(()=>{
        dispatch(loginmessage())
		history('/',{state:{}})
       
	},[])

    return (
        <>
            <section>
                <div className="form-box">
                    <div className="form-value">
                        <form onSubmit={handleSubmit}>
                            <div style={{ textAlign: "center" }}>
                                <img src={logo} alt="Logo" />
                            </div>
                            <div className="inputbox">
                                <ion-icon name="mail-outline"></ion-icon>
                                <input
                                 type={"email"}
                                 pattern="^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"
                                 onChange={handleChange}
                                 name="username"
                                 maxLength={45}
                                 required
                                 autoComplete="off" />
                                <label for="">Email</label>
                            </div>
                            <div className="inputbox">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                                <input type="password"
                                 onChange={handleChange}
                                 name="password"
                                 autoComplete="off"
                                 maxLength={15}
                                 required />
                                <label for="">Password</label>
                            </div>
                        
                                 <button className="login_submit_button" type="submit">Log in</button>
                                 {loginmess && <p style={{marginTop: "1rem",margin: "2.2rem",fontSize: "13px",color: "red",textAlign:"center"}}>{loginmess. message}</p>}
                        </form>
                    </div>
                </div>
            </section>
            
        </>
    );
}

export default Login;



