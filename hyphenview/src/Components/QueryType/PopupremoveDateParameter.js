import React from 'react'
import { CloseIcon } from "../../assets/Icons";
import { useDispatch } from 'react-redux';
import { Button } from './../globalCSS/Button/Button';
import { testquryonCustompage, resettestquryonCustompage } from "../../actions/auth"
import './Popupremovedateparameter.css'
function PopupremoveDateParameter({ formdata, setformdata, setpopuppopupremoveateparameter }) {

    const dispatch = useDispatch();
    const handelChange = (e) => {
      if(e.target.name==='query'){
            dispatch(resettestquryonCustompage());
            setformdata({ ...formdata, [e.target.name]: e.target.value });
      
       }else{
        setformdata({ ...formdata, [e.target.name]: e.target.value });
       }
    }
    return (
        <div className='recommended-adjustments'>
            <div className='popup__box'>
                {/* <div className="form-group">
              <label className="col-md-4 control-label">Query</label>
              <div className="col-md-4 inputGroupContainer">
                <div class="input-group flex-nowrap">
                  <span  class="input-group-text" id="addon-wrapping">
                  <i class="fas fa-edit"></i>
                  </span>
                  <textarea
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    className="form-control"
                    name="query"
                    placeholder="Query"
                    value={formdata.query}
                    onChange={handelChange}
                  ></textarea>
                </div>

              </div>
            </div> */}
                <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Query</label>
                    <CloseIcon onClick={() => setpopuppopupremoveateparameter(false)} />
                    <div class="input-group flex-nowrap">
                        <span class="input-group-text" id="addon-wrapping">
                            <i class="fas fa-edit"></i>
                        </span>
                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" className="form-control"
                            name="query"
                            placeholder="Query"
                            value={formdata.query}
                            onChange={handelChange}></textarea></div>
                </div>


                {/* <div className="form-group">
                    <label className="col-md-4 control-label">Start Date</label>
                    <div className="col-md-4 inputGroupContainer">
                        <div class="input-group flex-nowrap">
                            <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                            <input type="date" name="start_date" class="form-control" placeholder="Start Date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.start_date} onChange={handelChange} required />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="col-md-4 control-label">End Date</label>
                    <div className="col-md-4 inputGroupContainer">
                        <div class="input-group flex-nowrap">
                            <span class="input-group-text" id="addon-wrapping"><i class="fas fa-calendar"></i></span>
                            <input type="date" name="end_date" class="form-control" placeholder="end_date" aria-label="Username" aria-describedby="addon-wrapping" value={formdata.end_date} onChange={handelChange} required />
                        </div>
                    </div>
                </div> */}
                <div className='Add_remove_data'>
                    <div className='save_changes_btn'><Button type='button' onClick={() => setpopuppopupremoveateparameter(false)}>Save</Button></div>
                    {/* <div className='save_changes_btn'><Button type='button' onClick={() => setpopuppopupremoveateparameter(false)}>Test Query</Button></div> */}
                </div>
                <p style={{ textAlign: 'bottom' }}>
                    <b style={{ color: 'red' }}>*</b>Example format: select * from
                    tablename where fieldname between {'{?StartDate}'} and {'{?EndDate}'}<br/>
                    <br />
                </p>
            </div>
        </div>
    )
}

export default PopupremoveDateParameter