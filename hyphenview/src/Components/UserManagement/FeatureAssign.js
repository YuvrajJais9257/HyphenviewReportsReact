import { Button } from './../globalCSS/Button/Button';
import { useState } from "react";
import './FeatureAssign.css'
import { uploadicon } from '../../actions/auth'
import { useDispatch } from 'react-redux';
import Header from '../header';

function FeatureAssign() {
    const [selectedFile, setSelectedFile] = useState({});
    const [featurename, setFeatureName] = useState('');
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file && file.type === "image/png" && file.size <= 1048576) { 
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            alert("Please select a PNG file with a maximum size of 1 MB.");
        }
    };
    
    const handleNameChange = (e) => {
        const checkFeature = user.features.some(item => item.featurename === e.target.value);    
        if (checkFeature) {
            alert("Please write down another feature name.");
        } else {
            setFeatureName(e.target.value);
        }
    };
    
    const handleUpload = (e) => {
        e.preventDefault();
        console.log(typeof(selectedFile),"selectedFile")
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('feature_name', featurename);
            formData.append('customer_id', user.customer_id);
            formData.append('database_type', "mysql");

            for (var pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            dispatch(uploadicon(formData));
        } else {
            alert("Please select a PNG file with a maximum size of 1 MB.");
        }
    };

    return (
        <div>
            <div className="Header"><Header /></div>

            <div className="Feature_container" enctype="multipart/form-data">
                <form onSubmit={handleUpload}>
                <div className="row">
                    <div className="col-25">
                        <label htmlFor="fname">Feature Name:</label>
                    </div>
                    <div className="col-75">
                        <input type="text" id="fname" name="firstname" value={featurename} onChange={handleNameChange} placeholder="Your name.." />
                    </div>
                </div>

                <div className="row">
                    <div className="col-25">
                        <label htmlFor="formFile">Feature Icon:</label>
                    </div>
                    <div className="col-75">
                        <input name="file" type="file" accept="image/png" onChange={handleFileChange} />
                    </div>
                </div>

                <div>
                    <span style={{fontWeight:"500",height:"40px",background:"linear-gradient(to top, lightgrey 0%, lightgrey 1%, #e0e0e0 26%, #efefef 48%, #d9d9d9 75%, #bcbcbc 100%)"}}> Note:- Ensure that only PNG files can be uploaded and that the maximum file size is not more than 1MB. </span>
                </div>

                <div style={{padding:"5px"}}className="row">
                    <div className="col-75">
                        <Button type="submit">Save</Button>
                    </div>
                </div>
                </form>
            </div>
        </div>
    );
}

export default FeatureAssign;
