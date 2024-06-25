
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './BuildQuery.css';
 
const BuildQuery = () => {
  const [tables, setTables] = useState([
    { name: 'access_group', columns: ['column1', 'column2'] },
    { name: 'audit_reportinfo', columns: ['column1', 'column2'] },
    {name: 'access_report', columns: ['column1','column2']},
    {name: 'audit_group', columns: ['column1','column2']}
    // ... other table objects with their columns
  ]);

  const location = useLocation();
  console.log(location,"location")
  const getSchema = location.state?.getSchema || null;

  console.log(getSchema,"getSchema")
 
  const [query, setquery] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [whereConditions, setWhereConditions] = useState([]);
 
  const [activeButton, setActiveButton] = useState('');
  const [Addingcolumn, setAddingcolumn] = useState([]);
 
  const sqlFunctions = [
    'COUNT',
    'SUM',
    'AVG',
    'MIN',
    'MAX'
  ];
 
  const [groupByColumns, setGroupByColumns] = useState([]);
  const [orderByColumns, setOrderByColumns] = useState([]);
  const [orderByDirection, setOrderByDirection] = useState('ASC');
  const [selectedSqlFunction, setSelectedSqlFunction] = useState(sqlFunctions[0]);
 
 
  const addTable = (table) => {
    console.log(typeof(table.columns),"table")
    if (!selectedTables.map(t => t.name).includes(table.name)) {
      setSelectedTables([...selectedTables, table]);
      const columnNames = table.columns.map((column)=>`${table.name}.${column}`)
      setAddingcolumn(prevAddingColumn => [...prevAddingColumn, ...columnNames]);
    }

  };
  console.log(Addingcolumn,"Addingcolumn")
 
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
 
  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const addWhereCondition = () => {
    const defaultColumn = selectedTables.length > 0 ? `${selectedTables[0].name}.${selectedTables[0].columns[0]}` : '';
    const newCondition = {
      column: defaultColumn,
      operator: '=',
      value: '',
      logical: 'AND'
    };
    setWhereConditions([...whereConditions, newCondition]);
  };
 
  const updateWhereCondition = (index, key, value) => {
    const newConditions = [...whereConditions];
    newConditions[index][key] = value;
    setWhereConditions(newConditions);
    
  };
 
  const removeWhereCondition = (index) => {
    setWhereConditions(whereConditions.filter((_, i) => i !== index));
  };
 
  const handleButtonClick = (button) => {
    setActiveButton(activeButton === button ? '' : button);
  };
 
  const getColumnsFromWhereConditions = () => {
    return whereConditions.map(condition => condition.column);
  };
 
  const handleOrderByColumnChange = (column) => {
    // setOrderByColumns(column);
    setOrderByColumns(prevState => {
      if (prevState.includes(column)) {
        return prevState.filter(c => c !== column);
      } else {
        return [...prevState, column];
      }
    });
  };
 
  const handleOrderByDirectionChange = (direction) => {
    setOrderByDirection(direction);
  };
 
  const handleSqlFunctionChange = (func) => {
    setSelectedSqlFunction(func);
  };
 
  const handleGroupByColumnChange = (column) => {
    // setGroupByColumns(groupByColumns.includes(column)
    //   ? groupByColumns.filter(c => c !== column)
    //   : [...groupByColumns, column]);
    setGroupByColumns(prevState => {
      if (prevState.includes(column)) {
        return prevState.filter(c => c !== column);
      } else {
        return [...prevState, column];
      }
    });
  };
 
 
    const handleGenerateQuery = () => {
      let query = 'SELECT ';
     
      // Add SQL function and columns to SELECT clause
      if (selectedSqlFunction && selectedTables.length) {
        query += `${selectedSqlFunction}(`;
        query += selectedTables.map(table =>
          table.columns.map(column => `${table.name}.${column}`).join(', ')
        ).join(', ');
        query += ') ';
      } else {
        // If no function is selected, add all columns
        query += selectedTables.map(table =>
          table.columns.map(column => `${table.name}.${column}`).join(', ')
        ).join(', ');
      }
   
      // Add tables to FROM clause
      query += ' FROM ' + selectedTables.map(table => table.name).join(', ');
   
      // Add WHERE conditions
      if (whereConditions.length) {
        query += ' WHERE ' + whereConditions.map(condition => {
          return `${condition.column} ${condition.operator} '${condition.value}' ${condition.logical}`;
        }).join(' ');
        // Remove the last logical operator (AND/OR)
        query = query.trim().replace(/\s(AND|OR)$/, '');
      }
     
      // Add GROUP BY clause
      if (groupByColumns.length) {
        query += ' GROUP BY ' + groupByColumns.join(', ');
      }
      // Add ORDER BY clause with selected columns and directions
      if (orderByColumns.length) {
        query += ' ORDER BY ' + orderByColumns.map(column => `${column} ${orderByDirection}`).join(', ');
      }
   
      // Update the query state
      setquery(query);
    };    
 
  return (
    <div className="query-builder">
 
      <div>
      <div className='textitems '>
      <h4>Search and Select Tables</h4>
      <input className='search'
          type="text"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={handleSearch}
      />
      </div>
 
      <div className="tables-list">
        {filteredTables.map((table) => (
          <div key={table.name} className="table-item" onClick={() => addTable(table)}>
            {table.name}
          </div>
        ))}
      </div>
      </div>
 
      <div class="vertical-line"></div>
 
      <div>
      <div className="selected-tables">
        {selectedTables.map((table) => (
          <div key={table.name} className="selected-table item">
            <h3>{table.name}</h3>
            {table.columns.map((column) => (
              <div key={column} className="column-item" onClick={() => addWhereCondition(`${table.name}.${column}`)}>
                {column}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="where-conditions">
        <h3>Where Conditions</h3>
        {whereConditions.map((condition, index) => (
          <div key={index} className="where-condition">
            <select
              value={condition.column}
              onChange={(e) => updateWhereCondition(index, 'column', e.target.value)}
              className="where-column-select"
            >
              {/* Generate options from selected tables */}
              {selectedTables.flatMap(table =>
                table.columns.map(column => (
                  <option key={`${table.name}.${column}`} value={`${table.name}.${column}`}>
                    {`${table.name}.${column}`}
                  </option>
                ))
              )}
            </select>
            <select
              value={condition.operator}
              onChange={(e) => updateWhereCondition(index, 'operator', e.target.value)}
              className="where-operator-select"
            >
              <option value="=">{"equal to"}</option>
              <option value="!=">{"not equal to"}</option>
              <option value="<">{"smaller than"}</option>
              <option value=">">{"greater than"}</option>
              <option value=">=">{"greater than equal to"}</option>
              <option value="<=">{"smaller than equal to"}</option>
              <option></option>
              {/* Add more operators as needed */}
            </select>
            <input
              type="text"
              value={condition.value}
              onChange={(e) => updateWhereCondition(index, 'value', e.target.value)}
              className="where-value-input"
            />
            <select
              value={condition.logical}
              onChange={(e) => updateWhereCondition(index, 'logical', e.target.value)}
              className="where-logical-select"
            >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            </select>
            <button onClick={() => removeWhereCondition(index)} className="where-remove-button">
              X
            </button>
          </div>
        ))}
        <button onClick={addWhereCondition} className="where-add-button">
          +
        </button>
      </div>
      <div className="action-buttons">
        <button onClick={() => handleButtonClick('Group By')} className={`action-button ${activeButton === 'Group By' ? 'active' : ''} butt`}>Group By</button>
        <button onClick={() => handleButtonClick('Order By')} className={`action-button ${activeButton === 'Order By' ? 'active' : ''} butt`}>Order By</button>
        <button onClick={() => handleButtonClick('SQL Functions')} className={`action-button ${activeButton === 'SQL Functions' ? 'active' : ''} butt`}>SQL Functions</button>
      </div>
      {activeButton === 'Order By' && (
          <div className="order-by-section">
            <select
              value={orderByColumns}
              onChange={(e) => handleOrderByColumnChange(e.target.value)}
            >
              {getColumnsFromWhereConditions().map((column, index) => (
                <option key={index} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <select className='topmargin'
              value={orderByDirection}
              onChange={(e) => handleOrderByDirectionChange(e.target.value)}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
          </div>
        )}
 
        {activeButton === 'SQL Functions' && (
          <div className="sql-functions-section">
            <select
              value={selectedSqlFunction}
              onChange={(e) => handleSqlFunctionChange(e.target.value)}
            >
              {sqlFunctions.map((func, index) => (
                <option key={index} value={func}>
                  {func}
                </option>
              ))}
            </select>  
          </div>
        )}
 
        {activeButton === 'Group By' && (
          <div className="group-by-section">
            {/* <select
              value={orderByColumns}
              onChange={(e) => handleGroupByColumnChange(e.target.value)}
            >
              {getColumnsFromWhereConditions().map((column, index) => (
                <option key={index} value={column}>
                  {column}
                </option>
              ))}
              </select> */}
             {getColumnsFromWhereConditions().map((column, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={groupByColumns.includes(column)}
                  onChange={() => handleGroupByColumnChange(column)}
                />
                {column}
              </div>
            ))}
          </div>
        )}
 
        <div className="query-box">
          <div className="query-display">
            {query}
          </div>
          <button className="generate-query-btn" onClick={handleGenerateQuery}>
          Generate Query
          </button>
        </div>
 
      </div>
    </div>
  );
};
 
export default BuildQuery;