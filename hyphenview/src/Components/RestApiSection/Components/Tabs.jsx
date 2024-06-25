import React, { useState, useContext } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import CreateJSONText from './CreateJSONText';
import TableComponent from './Tables';
import { DataContext } from './DataProvider';

const TabComponent=()=> {
  const [activeTab, setActiveTab] = useState("params");
  const {paramData, setParamData, headerData, setHeaderData}=useContext(DataContext);
  const [keys, setKeys]=useState([]);
  const [values, setValues]=useState([]);

  console.log(paramData);

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={handleTabSelect}
      transition={false}
      id="noanim-tab-example"
      className="mb-3"
    >
      <Tab eventKey="params" title="Params">
        {activeTab==='params' && <TableComponent text='Query Params' data={paramData} setData={setParamData}/>}
      </Tab>
      <Tab eventKey="headers" title="Headers">
      {activeTab==='headers' && <TableComponent text='Headers' data={headerData} setData={setHeaderData}/>}
      </Tab>
      <Tab eventKey="body" title="Body">
        {activeTab==='body'&& <CreateJSONText/>}
      </Tab>
    </Tabs>
  );
}

export default TabComponent;
