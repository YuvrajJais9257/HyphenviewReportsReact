import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { customPreviewChartData, savetheboxdata } from '../../actions/auth';
import { Button } from '../globalCSS/Button/Button';
import styles from './Box.module.css'
function Box({ setChartreactcolour, setBackgroundcolor, setFontSize }) {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'));
    const [background_colour, setBackgroundColor] = useState('#ffffff');
    const [chart_react_colour, setFontColor] = useState('#000000');
    const [imageUrl, setImageUrl] = useState("");
    const [imagefromid, setImagefromid] = useState("");
    const [imageSrc, setImageSrc] = useState('');
    const [fontSizebox, setFontSizebox] = useState({font_size_title:'',font_size_value:''})

    const listoffontsize= ['5px', '10px', '15px', '20px'];


    const convertBase64ToImageSrc = (base64) => {
        return `data:image/png;base64,${base64}`;
    };


    useEffect(() => {
        const CustomeDetailOfReport = JSON.parse(localStorage.getItem('customeDetailOfReport'));
        console.log(CustomeDetailOfReport, "CustomeDetailOfReport7")

        const base64String = localStorage.getItem("uploadLogo");
        setBackgroundColor(CustomeDetailOfReport?.background_colour)
        setFontColor(CustomeDetailOfReport?.chart_react_colour)
        setFontSizebox({font_size_title:CustomeDetailOfReport?.font_size_title,font_size_value:CustomeDetailOfReport?.font_size_value})
        if (CustomeDetailOfReport?.report_id) {
            const febase64data = convertBase64ToImageSrc(CustomeDetailOfReport?.upload_logo)
            if (CustomeDetailOfReport?.upload_logo) {
                fetch(febase64data)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], "logo.png", { type: "image/png" });
                        setImagefromid(file)
                    });
            }
        }

        if (base64String) {
            fetch(base64String)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "logo.png", { type: "image/png" });
                    setImageUrl(file)
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
        console.log("jhsdgfjh")
        let url;
        if (imageUrl) {
            console.log("jhsdgfjh2")
            url = URL.createObjectURL(imageUrl);
            setImageSrc(url);
        } else if (imagefromid) {
            console.log("jhsdgfjh3")
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

    console.log(imagefromid, imageUrl)

    useEffect(() => {
        setFontSize({
            font_size_title: fontSizebox.font_size_title,
            font_size_value: fontSizebox.font_size_value
        });
    }, [fontSizebox]);
    

    const apiData = useSelector((state) => state?.auth);
    const PreviewchartData = apiData?.custom_preview_box;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFontSize(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    useEffect(() => {
        setChartreactcolour(chart_react_colour)
        setBackgroundcolor(background_colour)

    }, [background_colour, chart_react_colour]);

      return (
        <div className={styles.boxContainer}>
            {PreviewchartData && (
                <div
                    className={styles.previewBox}
                    style={{
                        '--background-color': background_colour,
                        '--font-color': chart_react_colour,
                    }}>
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt=""
                        />
                    ) : null
                    }

                    <p className={styles.previewTitle} style={{ fontSize: fontSizebox.font_size_title }}>
                        {CustomeDetailOfReport.title}
                    </p>
                    <div className={styles.previewContent} style={{ fontSize: fontSizebox.font_size_value }}>
                        {PreviewchartData}
                    </div>

                </div>
            )}
            <div className={styles.controlsContainer}>
                <div className={styles.controlItem}>
                    <label>Background Color:</label>
                    <input
                        type="color"
                        value={background_colour}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                    />
                </div>
                <div className={styles.controlItem}>
                    <label>Font Color:</label>
                    <input
                        type="color"
                        value={chart_react_colour}
                        onChange={(e) => setFontColor(e.target.value)}
                    />
                </div>
                <div className={styles.controlItem}>
                    <label>Select Title Font Size:</label>
                    <select
                        className={styles.fontsize_change}
                        name="font_size_title"
                        value={fontSizebox.font_size_title}
                        onChange={(e) => setFontSizebox({...fontSizebox, font_size_title: e.target.value})}
                    > 
                        <option value="" disabled>Select Font Size</option>
                        {listoffontsize.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.controlItem}>
                    <label>Select Content Font Size:</label>
                    <select
                        className={styles.fontsize_change}
                        name='font_size_value'
                        value={fontSizebox.font_size_value}
                        onChange={(e) => setFontSizebox({...fontSizebox, font_size_value: e.target.value})}
                    >
                        <option value="" disabled>Select Font Size</option>
                        {listoffontsize.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
export default Box;
