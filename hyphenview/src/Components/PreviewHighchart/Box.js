import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customPreviewChartData } from "../../actions/auth";
import styles from "./Box.module.css";
import iconYes from "../../assets/images/iconYes.png";
import iconNo from "../../assets/images/iconNo.png";

function Box({
  CustomDetail,
  setCustomDetail,
  setBackgroundcolor,
  setChartreactcolour,
  fontSize,
  setFontSize,
  statusValue,
  setStatusValue,
  statusValueColor,
  setStatusValueColor,
}) {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const booleanPositiveArray = [
    "yes",
    "true",
    "positive",
    "up",
    "1",
    "iconyes",
  ];
  const booleanNegativeArray = [
    "no",
    "false",
    "negative",
    "down",
    "0",
    "iconno",
  ];

  const CustomeDetailOfReport = JSON.parse(
    localStorage.getItem("customeDetailOfReport")
  );
  const [background_colour, setBackgroundColor] = useState("#ffffff");
  const [chart_react_colour, setFontColor] = useState("#000000");
  const [yesFontColor, setYesFontColor] = useState(
    CustomeDetailOfReport.status_value_color || "#9acd32"
  ); // Green for yes
  const [noFontColor, setNoFontColor] = useState(
    CustomeDetailOfReport.status_value_color || "#a52a2a"
  ); // Red for no
  const [imageUrl, setImageUrl] = useState("");
  const [imagefromid, setImagefromid] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [fontSizebox, setFontSizebox] = useState({
    font_size_title: "",
    font_size_value: "",
  });
  const [statusVal, setStatusVal] = useState("");
  const [statusValColor, setStatusValColor] = useState("");
  const [warning, setWarning] = useState("");

  const listoffontsize = ["5px", "10px", "15px", "20px"];

  const convertBase64ToImageSrc = (base64) => {
    return `data:image/png;base64,${base64}`;
  };

  useEffect(() => {
    const CustomeDetailOfReport = JSON.parse(
      localStorage.getItem("customeDetailOfReport")
    );

    const base64String = localStorage.getItem("uploadLogo");
    setBackgroundColor(CustomeDetailOfReport?.background_colour);
    setFontColor(CustomeDetailOfReport?.chart_react_colour);
    setFontSizebox({
      font_size_title: CustomeDetailOfReport?.font_size_title,
      font_size_value: CustomeDetailOfReport?.font_size_value,
    });
    setStatusVal(CustomeDetailOfReport?.status_value);
    setStatusValColor(CustomeDetailOfReport?.status_value_color);
    if (CustomeDetailOfReport?.report_id) {
      const febase64data = convertBase64ToImageSrc(
        CustomeDetailOfReport?.upload_logo
      );
      if (CustomeDetailOfReport?.upload_logo) {
        fetch(febase64data)
          .then((res) => res.blob())
          .then((blob) => {
            const file = new File([blob], "logo.png", { type: "image/png" });
            setImagefromid(file);
          });
      }
    }

    if (base64String) {
      fetch(base64String)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "logo.png", { type: "image/png" });
          setImageUrl(file);
        });
    }
  }, []);

  useEffect(() => {
    dispatch(
      customPreviewChartData({
        report_name: CustomeDetailOfReport.title,
        report_type: CustomeDetailOfReport.type,
        chart_type: CustomeDetailOfReport.chart_type,
        query: CustomeDetailOfReport.query,
        email: user.user_email_id,
        database_type: "mysql",
        connection_type: CustomeDetailOfReport.connection_type,
        schema: CustomeDetailOfReport.schema,
      })
    );
  }, []);

  useEffect(() => {
    let url;
    if (imageUrl) {
      url = URL.createObjectURL(imageUrl);
      setImageSrc(url);
    } else if (imagefromid) {
      url = URL.createObjectURL(imagefromid);
      setImageSrc(url);
    }

    // Cleanup the object URL on component unmount
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [imageUrl, imagefromid]);

  useEffect(() => {
    setFontSize({
      font_size_title: fontSizebox.font_size_title,
      font_size_value: fontSizebox.font_size_value,
    });
  }, [fontSizebox]);

  const apiData = useSelector((state) => state?.auth);
  const PreviewchartData =
    CustomeDetailOfReport?.status_value == null ||
    CustomeDetailOfReport?.status_value == undefined
      ? apiData?.custom_preview_box
      : CustomeDetailOfReport?.status_value;

  useEffect(() => {
    console.log(PreviewchartData, "chart data for preview");
    setStatusVal(PreviewchartData);
  }, [PreviewchartData]);

  const handleBackgroundColorChange = (e) => {
    const color = e.target.value;
    if (isBooleanPreview() && (isRedShade(color) || isGreenShade(color))) {
      setWarning(
        "Background color cannot be a red or green shade for boolean values."
      );
    } else {
      setWarning("");
      setBackgroundColor(color);
    }
  };

  const isBooleanPreview = () => {
    if (!PreviewchartData) return false;
    const dataStr = PreviewchartData.toString().toLowerCase();
    return (
      dataStr === "up" ||
      dataStr === "yes" ||
      dataStr === "true" ||
      dataStr === "1" ||
      dataStr === "no" ||
      dataStr === "false" ||
      dataStr === "down" ||
      dataStr === "0" ||
      dataStr === "positive" ||
      dataStr === "negative"
    );
  };

  const isRedShade = (color) => {
    const hexColor = rgbToHex(color);
    const redShades = ["#a52a2a", "#800000", "#ff0000", "#dc143c", "#b22222"];
    return redShades.includes(hexColor);
  };

  const isGreenShade = (color) => {
    const hexColor = rgbToHex(color);
    const greenShades = ["#9acd32", "#006400", "#008000", "#00ff00", "#32cd32"];
    return greenShades.includes(hexColor);
  };

  const rgbToHex = (color) => {
    let hex;
    if (color.startsWith("#")) {
      hex = color.toLowerCase();
    } else {
      const rgbRegex = /rgba?\((\d+),\s*(\d+),\s*(\d+)/;
      const result = rgbRegex.exec(color);
      if (result) {
        const r = parseInt(result[1]);
        const g = parseInt(result[2]);
        const b = parseInt(result[3]);
        hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
          .toString(16)
          .slice(1)}`;
      } else {
        hex = "#ffffff"; // Default to white if the color format is not recognized
      }
    }
    return hex;
  };

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value.toLowerCase();
    console.log(selectedValue, "valueToBeModified");
    let finalValue = selectedValue;

    const booleanPositiveArray = [
      "positive",
      "up",
      "yes",
      "true",
      "1",
      "iconYes",
    ];
    const booleanNegativeArray = [
      "negative",
      "down",
      "no",
      "false",
      "0",
      "iconNo",
    ];

    // Check if statusVal or preview_chart_data exists and is in the booleanPositiveArray
    if (statusVal && booleanPositiveArray.includes(statusVal)) {
      switch (selectedValue) {
        case "positive":
          finalValue = "positive";
          break;
        case "up":
          finalValue = "up";
          break;
        case "yes":
          finalValue = "yes";
          break;
        case "true":
          finalValue = "true";
          break;
        case "1":
          finalValue = "1";
          break;
        case "iconYes":
          finalValue = "iconYes";
          break;
        default:
          break;
      }
    }
    // Check if statusVal or preview_chart_data exists and is in the booleanNegativeArray
    else if (statusVal && booleanNegativeArray.includes(statusVal)) {
      switch (selectedValue) {
        case "positive":
          finalValue = "negative";
          break;
        case "up":
          finalValue = "down";
          break;
        case "yes":
          finalValue = "no";
          break;
        case "true":
          finalValue = "false";
          break;
        case "1":
          finalValue = "0";
          break;
        case "iconYes":
          finalValue = "iconNo";
          break;
        default:
          break;
      }
    }

    setStatusVal(finalValue);
  };

  useEffect(() => {
    if (isBooleanPreview()) {
      if (
        statusVal &&
        (statusVal.toLowerCase() === "yes" ||
          statusVal.toLowerCase() === "true" ||
          statusVal.toLowerCase() === "1" ||
          statusVal.toLowerCase() === "up" ||
          statusVal.toLowerCase() === "positive" ||
          statusVal.toLowerCase() === "iconyes")
      ) {
        setStatusValColor(yesFontColor);
      } else {
        setStatusValColor(noFontColor);
      }
    } else {
      setStatusValColor(statusValColor); // Or any other default color logic
    }
  }, [statusVal, yesFontColor, noFontColor]);

  useEffect(() => {
    setChartreactcolour(chart_react_colour);
    setBackgroundcolor(background_colour);
    setStatusValue(statusVal);
    setStatusValueColor(statusValColor);
  }, [background_colour, chart_react_colour, statusVal, statusValColor]);

  const renderStatusValContent = () => {
    if (!statusVal) {
      return null;
    }

    const customeStatusValue = CustomeDetailOfReport?.status_value?.toString();
    console.log(customeStatusValue, "customStatusValue");

    const statusValStr = statusVal?.toString().toLowerCase();

    if (
      statusValStr === "iconyes" ||
      (customeStatusValue && customeStatusValue.toLowerCase() === "iconyes")
    ) {
      return <img className="icon-for-display" src={iconYes} alt="Yes Icon" />;
    } else if (
      statusValStr === "iconno" ||
      (customeStatusValue && customeStatusValue.toLowerCase() === "iconno")
    ) {
      return <img src={iconNo} className="icon-for-display" alt="Down Icon" />;
    } else {
      return statusVal;
    }
  };

  console.log(statusVal, "statusVal");
  console.log(statusValColor, "statusValColor");
  const isPositive =
    statusVal &&
    booleanPositiveArray.includes(statusVal.toString().toLowerCase());
  const isNegative =
    statusVal &&
    booleanNegativeArray.includes(statusVal.toString().toLowerCase());

  return (
    <div className={styles.boxContainer}>
      {/* {CustomeDetailOfReport && (
        <div className={styles.reportTemplateName}>
          <p>{CustomeDetailOfReport.title}</p>
        </div>
      )} */}
      {PreviewchartData && (
        <div
          className={styles.previewBox}
          style={{ backgroundColor: background_colour }}
        >
          {imageSrc && <img src={imageSrc} alt="" />}

          <p
            className={styles.previewTitle}
            style={{
              fontSize: fontSizebox.font_size_title,
              color: chart_react_colour,
            }}
          >
            {CustomeDetailOfReport.title}
          </p>
          <div
            className={styles.previewContent}
            style={{
              fontSize: fontSizebox.font_size_value,
              color: (() => {
                if (isBooleanPreview()) {
                  if (
                    statusVal &&
                    (statusVal.toLowerCase() === "yes" ||
                      statusVal.toLowerCase() === "true" ||
                      statusVal.toLowerCase() === "1" ||
                      statusVal.toLowerCase() === "up" ||
                      statusVal.toLowerCase() === "positive")
                  ) {
                    return yesFontColor;
                  } else {
                    return noFontColor;
                  }
                } else {
                  return chart_react_colour;
                }
              })(),
            }}
          >
            {renderStatusValContent()}
          </div>
        </div>
      )}
      <div className={styles.controlsContainer}>
        <div className={styles.controlItem}>
          <label>Background Color:</label>
          <input
            type="color"
            value={background_colour}
            onChange={handleBackgroundColorChange}
          />
        </div>
        <div className={styles.controlItem}>
          <label>Status Head Color:</label>
          <input
            type="color"
            value={chart_react_colour}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </div>
        {console.log(chart_react_colour, "colorSetNow")}
        <div className={styles.controlItem}>
          <label>Select Title Font Size:</label>
          <select
            className={styles.fontsize_change}
            name="font_size_title"
            value={fontSizebox.font_size_title}
            onChange={(e) =>
              setFontSizebox({
                ...fontSizebox,
                font_size_title: e.target.value,
              })
            }
          >
            <option value="" disabled>
              Select Font Size
            </option>
            {listoffontsize.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlItem}>
          <label>Select Content Font Size:</label>
          <select
            className={styles.fontsize_change}
            name="font_size_value"
            value={fontSizebox.font_size_value}
            onChange={(e) =>
              setFontSizebox({
                ...fontSizebox,
                font_size_value: e.target.value,
              })
            }
          >
            <option value="" disabled>
              Select Font Size
            </option>
            {listoffontsize.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.status_value_controlsContainer}>
        <div className={styles.controlItem}>
          <label>Status Value Yes Color:</label>
          <input
            type="color"
            value={yesFontColor}
            onChange={(e) => setYesFontColor(e.target.value)}
          />
        </div>
        <div className={styles.controlItem}>
          <label>Status Value No Color:</label>
          <input
            type="color"
            value={noFontColor}
            onChange={(e) => setNoFontColor(e.target.value)}
          />
        </div>
        <div className={styles.controlItem}>
          <label>Select Preview Chart Data:</label>
          <select
            className={styles.fontsize_change}
            name="preview_chart_data"
            value={statusVal}
            onChange={handleSelectChange}
          >
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "positive"
                  : "negative"
              }
            >
              Positive/Negative
            </option>
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "up"
                  : "down"
              }
            >
              Up/Down
            </option>
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "yes"
                  : "no"
              }
            >
              Yes/No
            </option>
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "true"
                  : "false"
              }
            >
              True/False
            </option>
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "1"
                  : "0"
              }
            >
              1/0
            </option>
            <option
              value={
                booleanPositiveArray.includes(statusVal) ||
                booleanPositiveArray.includes(PreviewchartData)
                  ? "iconYes"
                  : "iconNo"
              }
            >
              iconYes/iconNo
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Box;
