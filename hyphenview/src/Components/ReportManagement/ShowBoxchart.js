import React, { useEffect, useMemo, useState } from "react";
import Header from "../header";
import { useDispatch, useSelector } from "react-redux";
import { generateBoxTypeReport } from "../../actions/reportmanagement";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./../globalCSS/SearchTable/SearchTable.module.css";
import { Button } from "../globalCSS/Button/Button";
import iconYes from "../../assets/images/iconYes.png";
import iconNo from "../../assets/images/iconNo.png";

function ShowBoxchart() {
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();

  // Retrieving user data from localStorage
  const user = JSON.parse(localStorage.getItem("profile"));

  // Parsing query parameters from the URL
  const queryParameters = new URLSearchParams(location.search);
  const report_id = queryParameters.get("report_id");
  const access_mask = queryParameters.get("access_mask");

  // Retrieving data from Redux store
  const apiData = useSelector((state) => state);
  const generatboxreportdetail =
    apiData?.reportmanagement.getboxtypeofreportdetail;
  console.log(generatboxreportdetail, "box detail");

  // State to store the image URL
  const [imageUrl, setImageUrl] = useState("");

  // Function to convert base64 data to image source
  const convertBase64ToImageSrc = (base64) => {
    return `data:image/png;base64,${base64}`;
  };

  // Effect to fetch and set the image URL
  useEffect(() => {
    if (report_id) {
      const febase64data = convertBase64ToImageSrc(
        generatboxreportdetail?.logo_path
      );
      if (generatboxreportdetail?.logo_path) {
        fetch(febase64data)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "logo.png", { type: "image/png" });
            setImageUrl(file);
          });
      }
    }
  }, [generatboxreportdetail]);

  // Effect to dispatch action to generate box type report
  useEffect(() => {
    dispatch(
      generateBoxTypeReport({
        report_id: report_id,
        email: user.user_email_id,
        database_type: "mysql",
      })
    );
  }, [report_id]);

  const [statusValueOrPhoto, setStatusValueOrPhoto] = useState(null);
  useEffect(() => {
    if (generatboxreportdetail) {
      const statusValue = generatboxreportdetail.status_value;
      const boxValueId = generatboxreportdetail.box_value_id;
      if (statusValue !== null && statusValue !== undefined) {
        setStatusValueOrPhoto(statusValue);
      } else if (boxValueId !== null && boxValueId !== undefined) {
        setStatusValueOrPhoto(boxValueId);
      } else {
        setStatusValueOrPhoto(null);
      }
    }
  }, [generatboxreportdetail]);

  console.log(statusValueOrPhoto, "statusValueOrPhoto");

  const renderContent = () => {
    if (statusValueOrPhoto === "iconyes") {
      return <img src={iconYes} alt="Yes Icon" height="50px" width="50px" />;
    } else if (statusValueOrPhoto === "iconno") {
      return <img src={iconNo} alt="No Icon" height="50px" width="50px" />;
    } else {
      return statusValueOrPhoto;
    }
  };

  return (
    <div>
      <div className="show_box_detail">
        <Header />
      </div>
      {/* <div styles={{border: "5px solid",position:"absolute",top: "50%",left: "50%",transform: "translate(-50%, -50%)",padding: "10px"}}> */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "70px" }}
      >
        <div
          style={{
            width: "300px",
            height: "150px",
            border: "2px solid black",
            borderRadius: "5px",
            backgroundColor: generatboxreportdetail?.backgroung_color,
          }}
        >
          {imageUrl ? (
            <img
              style={{
                height: "40px",
                width: "40px",
                float: "left",
                borderRadius: "100%",
              }}
              src={URL.createObjectURL(imageUrl)}
              alt=""
            />
          ) : null}
          <p
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: generatboxreportdetail?.chart_react_color,
            }}
          >
            {generatboxreportdetail?.report_title}
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "35px",
              fontWeight: "bold",
              color: generatboxreportdetail?.status_value_color,
              textAlign: "center",
            }}
          >
            {renderContent()}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <Button
          type="button"
          style={{ marginRight: "3px" }}
          onClick={() => {
            history(-1);
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
}

export default ShowBoxchart;
