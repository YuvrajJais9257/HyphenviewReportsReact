import React, { useEffect, useState } from 'react'

function BoxPreview({ Boxdata }) {
  console.log("Boxdata", Boxdata)
  const [imageSrc, setImageSrc] = useState('');
  const convertBase64ToImageSrc = (base64) => {
    return `data:image/png;base64,${base64}`;
  };

  useEffect(() => {
    if (Boxdata?.logo_path) {
      const febase64data = convertBase64ToImageSrc(Boxdata.logo_path)
      fetch(febase64data)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "logo.png", { type: "image/png" });
          setImageSrc(URL.createObjectURL(file))
        });
    }
  }, [Boxdata]);



  const handleClick = () => {
    if (Boxdata?.drilldown === 'yes') {
      const databox = { report_title: Boxdata?.report_title };
      openNewWindow(databox);
    }else{
      alert("drilldown is not enabled")
    }
  };

  const openNewWindow = (datav) => {
    const queryString = new URLSearchParams(datav).toString();
    const newWindow =  window.open(`/hyphenview/drillDown?${queryString}`, '_blank', 'width=600,height=400');
    newWindow.document.close();
  };
  
  return (
    <div>
      <div onClick={handleClick} style={{ width: "auto", height: "auto", padding: "10px", backgroundColor: Boxdata?.backgroung_color }}>
        {Boxdata.logo_path != null && <img style={{ width: "40px", height: "40px", textAlign: "center", float: "left" }} src={imageSrc} />}
        <p style={{ textAlign: "center", fontSize: Boxdata?.font_size_title, padding: "5px", fontWeight: "bold", color: Boxdata.chart_react_color }}>{Boxdata?.report_title}</p>
        <p style={{ textAlign: "center", fontSize: Boxdata?.font_size_value, padding: "5px", fontWeight: "bold", textAlign: "center", color: Boxdata.chart_react_color }}>{Boxdata?.box_value}</p>
      </div>
    </div>
  )
}

export default BoxPreview