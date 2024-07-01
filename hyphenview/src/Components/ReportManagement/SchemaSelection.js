import React, { useState } from 'react';
import './SchemaSelection.css';
import { useNavigate } from 'react-router-dom';
function SchemaSelection({ getSchema,databasename }) {
    const [selectedSchema, setSelectedSchema] = useState('select the schema/SID');
    let history = useNavigate();

    // Function to handle schema selection change
    const handleSchemaChange = (event) => {
        setSelectedSchema(event.target.value);
    };
    
    // Function to navigate to BuildQueryNew page
    const handleBuildQuery = async () => {
        if (selectedSchema === 'select the schema/SID') {
            alert("select shema")
        } else {
            // Store selected schema and database name in localStorage
            localStorage.setItem("SelectedSchema", JSON.stringify({selectedSchema : selectedSchema,databasename : databasename}));
            history('../BuildQueryNew')
        }
    };
    
     // Function to navigate to CustomQuery page
    const handleCustomQuery = async() => {

        if (selectedSchema === 'select the schema/SID') {
            alert("select shema")
        } else {
            localStorage.setItem("SelectedSchema", JSON.stringify({selectedSchema : selectedSchema,databasename : databasename}));
            history('../CustomQuery')
        }
    };

    return (
        <div>
            <div className='Select_schema_container'>
                <div className='Select_schema'>
                    <div className='schema_sid'><span style={{ float: "left", font: "8px" }}>Schema/SID Section : </span></div>
                    <select className='select_dbshema' value={selectedSchema} onChange={handleSchemaChange} required>
                        <option value='select the schema/SID'>select the schema/SID</option>
                        {getSchema?.map((schema) => <option  key={schema} value={schema}>{schema}</option>)}
                    </select>
                </div>
                <div className='Query_type'>
                    <button className='Query_button' type='button' onClick={handleBuildQuery}>Build Query</button>
                    <button className='Query_button' type='button' onClick={handleCustomQuery}>Custom Query</button>
                </div>
            </div>
        </div>
    );
}

export default SchemaSelection;
