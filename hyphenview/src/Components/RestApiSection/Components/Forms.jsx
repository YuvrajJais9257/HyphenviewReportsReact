import '../Components/Forms.css';
import { DataContext } from './DataProvider';
import React, { useState, useEffect, useContext, ReactDOM } from 'react';
import { Dropdown, Table } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { Button } from '../../globalCSS/Button/Button';
const FormComponent=({onSendClick})=>{
    const [requestType, setRequestType]=useState('GET');
    const [name, setName]=useState('');
    const [authType, setAuthType]=useState('none');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bearerToken, setBearerToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showBearerToken, setShowBearerToken] = useState(false);
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [authUrl, setAuthUrl] = useState('');
    const [tokenUrl, setTokenUrl] = useState('');
    const [refreshTokenUrl, setRefreshTokenUrl] = useState('');
    const [scope, setScope] = useState('');
    const [apiURL, setApiURL]=useState('');

    const {formData, setFormData, jsonText, paramData, headerData, dataSource, setDataSource, setAuthMethod, setUserName, setPass, setBearer, setId, setSecret, setToken, setRefreshToken, setScopeEntry, authMethod, userName, pass, bearer, id, secret, token, refreshToken, scopeEntry}=useContext(DataContext);

    const handlePassword=(e)=>{
      setPass(e.target.value);
    }

    const handleUsername=(e)=>{
      setUserName(e.target.value);
    }

    const handleAuthChange=(newAuth)=>{
      setAuthMethod(newAuth);
    }

    const handleDataSource=(e)=>{
      setDataSource(e.target.value);
    }

    const handleChangeRequest=(newRequest)=>{
        setRequestType(newRequest);
        setFormData({...formData, type: newRequest});
        console.log(formData.type);
      }
    
    const onURLChange=(e)=>{
        setFormData({...formData, url: e.target.value});
        console.log(formData.url);
    }

    const handleBearer=(e)=>{
      setBearer(e.target.value);
      setShowBearerToken(false);
    }

    const handleSecret=(e)=>{
      setSecret(e.target.value);
    }

    const handleId=(e)=>{
      setId(e.target.value);
    }

    const handleTokenUrl=(e)=>{
      setToken(e.target.value);
    }

    const handleRefreshToken=(e)=>{
      setRefreshToken(e.target.value);
    }

    const handleScope=(e)=>{
      setScopeEntry(e.target.value);
    }

    return(
        <>
        <div className='container postman-container'>
        <div className='name-container label-input-container'>
            <label>Data Source</label>
            <input type='text' value={dataSource} placeholder='Datasource Name' maxLength={25} required={true} onChange={(e)=>handleDataSource(e)}/>
        </div>
        <div className='label-input-container'>
             <div className='url-container'>
             <Dropdown className="request-dropdown-container label-input-container">
                    <Dropdown.Toggle variant='light' id="auth-method-dropdown" className='sharp-dropdown-toggle black-link'>
                        {formData.type}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="sharp-dropdown-menu">
                        <Dropdown.Item style={{textDecoration:'none !important',color:"black"}} onClick={()=>handleChangeRequest("GET")}>GET</Dropdown.Item>
                        <Dropdown.Item style={{textDecoration:'none !important',color:"black"}} onClick={()=>handleChangeRequest("POST")}>POST</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>
                <div style={{marginLeft: '50px'}} className='label-input-container'>
                <input style={{marginLeft:'5px'}} className='api-url-input' maxLength={90} type='text' placeholder='API URL' required={true}  onChange={(e)=>onURLChange(e)}/>
                </div>
        </div>
        <div className='auth-container'>
            <label style={{marginRight:'20px'}} >Authentication</label>
            <div style={{width: '100%'}}>
            <Dropdown className='sharp-dropdown-container label-input-container'>
        <Dropdown.Toggle variant="light" id="auth-method-dropdown" className="sharp-dropdown-toggle black-link ">
          {authMethod}
        </Dropdown.Toggle>
        <Dropdown.Menu className="sharp-dropdown-menu">
          <Dropdown.Item onClick={() => handleAuthChange('none')} href="#/none">none</Dropdown.Item>
          <Dropdown.Item onClick={() => handleAuthChange('Basic Auth')} href="#/basic-auth"> 
            Basic Auth</Dropdown.Item>
          <Dropdown.Item onClick={() => handleAuthChange('Bearer Token')} href="#/bearer-token">Bearer Token</Dropdown.Item>
          <Dropdown.Item onClick={() => handleAuthChange('OAuth2.0')} href="#/oauth2">OAuth2.0</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
            </div>
            </div>
            <div className='conditional-container'>
            {authMethod === 'Basic Auth' &&  (
        <>
          <div className="label-input-container">
            <label htmlFor="username">Username</label>
            <input maxLength={40} style={{marginLeft:'18px'}} placeholder='Username' type='text' value={userName} onChange={(e) => handleUsername(e)} />
          </div>
          <div className="label-input-container">
            <label htmlFor="password">Password</label>
            <input maxLength={25} style={{marginLeft:'18px'}}
              placeholder='Password'
              type={showPassword ? 'text' : 'password'}
              value={pass}
              onChange={(e) => handlePassword(e)}
            />
            
          </div>
        </>
      )}
      {authMethod === 'Bearer Token' && (
  <div className="label-input-container">
    <label htmlFor="bearer-token">Bearer Token</label>
    <div className="bearer-token-input">
      <input  maxLength={100}
        placeholder='Bearer token'
        type={showBearerToken ? 'text' : 'password'} 
        value={bearer}
        onChange={(e) => handleBearer(e)}
      />
      <div className="password-toggle-icon" onClick={() => setShowBearerToken(!showBearerToken)}>
        {showBearerToken ? <EyeSlashFill /> : <EyeFill />}
      </div>
    </div>
  </div>
)}
{authMethod === 'OAuth2.0' && (
  <>
  <div className="label-input-container">
  <label htmlFor="client-id">Client ID</label>
            <input style={{marginLeft:'30px'}}
              placeholder='Client ID'
              type='text'
              value={id}
              onChange={(e) => handleId(e)}
            />
  </div>
  <div className="label-input-container">
  <label htmlFor="client-secret">Client Secret</label>
            <input 
              placeholder='Client secret'
              type='password'
              value={secret}
              onChange={(e) => handleSecret(e)}
            />
  </div>
  <div className="label-input-container">
            <label htmlFor="token-url">Token URL</label>
            <input style={{marginLeft:'17px'}}
              placeholder='Token URL'
              type='text'
              value={token}
              onChange={(e) => handleTokenUrl(e)}
            />
          </div>
          <div className="label-input-container">
            <label style={{marginRight:'65px'}} htmlFor="refresh-token-url">Refresh <br/>Token <br/>URL</label>
            <input 
              placeholder='Refresh token URL'
              type='text'
              value={refreshToken}
              onChange={(e) => handleRefreshToken(e)}
            />
          </div>
          <div className="label-input-container">
            <label htmlFor="scope">Scope</label>
            <input style={{marginLeft:'39px'}}
              placeholder='Scope'
              type='text'
              value={scopeEntry}
              onChange={(e) => handleScope(e)}
            />
          </div>
</>
      )}
            </div>
            <div className="btn-container">
        <Button style={{marginTop:'15px'}}  variant='primary' onClick={()=>{onSendClick()}}>Test Connection</Button>
      </div>
        </div>
        </>
    )
}

export default FormComponent;
