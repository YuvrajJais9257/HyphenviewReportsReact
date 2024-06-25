import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header';
import { useDispatch, useSelector } from 'react-redux';
import { generateBoxTypeReport } from '../../actions/reportmanagement';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './../globalCSS/SearchTable/SearchTable.module.css'
import { Button } from '../globalCSS/Button/Button';



function ShowBoxchart() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();
  
  // Retrieving user data from localStorage
  const user = JSON.parse(localStorage.getItem("profile"))

  // Parsing query parameters from the URL
  const queryParameters = new URLSearchParams(location.search);
  const report_id = queryParameters.get('report_id');
  const access_mask = queryParameters.get('access_mask');

   // Retrieving data from Redux store
  const apiData = useSelector((state) => state)
  const generatboxreportdetail = apiData?.reportmanagement.getboxtypeofreportdetail;

  // State to store the image URL
  const [imageUrl, setImageUrl] = useState("");

  
   // Function to convert base64 data to image source
  const convertBase64ToImageSrc = (base64) => {
    return `data:image/png;base64,${base64}`;
  };

    // Effect to fetch and set the image URL
  useEffect(() => {
    if (report_id) {
      const febase64data = convertBase64ToImageSrc(generatboxreportdetail?.logo_path)
      if (generatboxreportdetail?.logo_path) {
        fetch(febase64data)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "logo.png", { type: "image/png" });
            setImageUrl(file)
          });
      }
    }

  }, [generatboxreportdetail]);

  
  // Effect to dispatch action to generate box type report
  useEffect(() => {
    dispatch(generateBoxTypeReport({ report_id: report_id, email: user.user_email_id, database_type: "mysql" }))
  }, [report_id])

  return (
    <div>
      <div className='show_box_detail'>
        <Header />
      </div>
      {/* <div styles={{border: "5px solid",position:"absolute",top: "50%",left: "50%",transform: "translate(-50%, -50%)",padding: "10px"}}> */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}>
        <div style={{ width: "300px", height: "150px", border: "2px solid black", borderRadius: "5px", backgroundColor: generatboxreportdetail?.backgroung_color }}>
          {imageUrl ? (
            <img
              style={{ height: "40px", width: "40px", float: "left", borderRadius: "100%" }}
              src={URL.createObjectURL(imageUrl)}
              alt=""
            />
          ) : null

          }
          <p style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold", color: generatboxreportdetail?.chart_react_color }}>{generatboxreportdetail?.report_title}</p>
          <p style={{ textAlign: "center", fontSize: "35px", fontWeight: "bold", color: generatboxreportdetail?.chart_react_color, textAlign: "center" }}>{generatboxreportdetail?.box_value_id}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: "30px" }}>
        <Button type='button' style={{ marginRight: "3px" }} onClick={() => { history(-1) }}>Back</Button>
      </div>

    </div>
  )
}

export default ShowBoxchart