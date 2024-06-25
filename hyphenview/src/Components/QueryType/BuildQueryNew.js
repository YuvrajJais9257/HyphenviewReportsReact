import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { useDispatch,useSelector } from 'react-redux';
import { schemametaData } from '../../actions/auth';
import './BuildQueryNew.css'
import { Link } from 'react-router-dom';
function BuildQueryNew() {

    const [tableDetailData, settableDetailData] = useState()

    const dispatch = useDispatch();

    useEffect(()=>{
        const user= JSON.parse(localStorage.getItem('profile'))
        const shemaDetail= JSON.parse(localStorage.getItem('SelectedSchema'))
        console.log(shemaDetail,"shemaDetail")
        dispatch(schemametaData({"schema_name":shemaDetail?.selectedSchema,"database_type":"mysql","connection_type":shemaDetail?.databasename,"email":user?.user_email_id}))

        
    },[])
   
    const apiData = useSelector((state) => state?.auth); 
    const tableData = apiData?.SchemaMetadata;
    console.log(tableData,"tableData")

   var tableMap = new Map();


   tableData?.map(column => {
   const tableName = column?.TABLE_NAME;
   

  if (!tableMap.has(tableName)) {
    tableMap.set(tableName, { name: tableName, columns: [] });
  }
     
    tableMap.get(tableName).columns.push(column.COLUMN_NAME);

   });
   
  var transformedData = Array.from(tableMap.values());

  console.log(transformedData,"transformedData");

    

    

    const sqlFunctions = [
        'Select SQL Function',
        '*',
        'COUNT',
        'SUM',
        'AVG',
        'MIN',
        'MAX'
    ];
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTables, setSelectedTables] = useState([]);
    const [Addingcolumn, setAddingcolumn] = useState([]);
    const [whereConditions, setWhereConditions] = useState([]); // Initial condition
    const [activeButton, setActiveButton] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedOperators, setSelectedOperators] = useState(['=']);
    const [inputValues, setInputValues] = useState([]);
    const [logicalOperators, setLogicalOperators] = useState([]);
    const [groupByColumns, setGroupByColumns] = useState([]);

    const [selectColumn, setselectColumn] = useState([])
    const [orderByColumns, setOrderByColumns] = useState([]);
    const [orderByDirection, setOrderByDirection] = useState('Select');
    const [selectedSqlFunction, setSelectedSqlFunction] = useState([sqlFunctions[0]]);
    const [mySqlFunctionColumn, setmySqlFunctionColumn] = useState([]);
    const [query, setquery] = useState('');

    const [selectedTablesTogenerateQuery, setselectedTablesTogenerateQuery] = useState([]);



    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTables = transformedData?.filter((table) =>
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // const addTable = (table) => {
    //     if (!selectedTables.map(t => t.name).includes(table.name)) {
    //         setSelectedTables([...selectedTables, table]);
    //         const columnNames = table.columns.map((column) => `${table.name}.${column}`)
    //         setAddingcolumn(prevAddingColumn => [...prevAddingColumn, ...columnNames]);
    //     }
    // };

    // const addTable = (table) => {
    //     // Check if the table is already selected
    //     const isTableSelected = selectedTables.includes(table);

    //     // If the table is selected, remove it; otherwise, add it
    //     if (isTableSelected) {
    //         setSelectedTables(selectedTables.filter(selectedTable => selectedTable !== table));
    //         const columnNames = table.columns.map((column) => (`${table.name}.${column}`))
    //         setAddingcolumn(prevAddingColumn => [...prevAddingColumn, ...columnNames]);

    //     } else {
    //         const columnNames = table.columns.map((column) => `${table.name}.${column}`)
    //         setAddingcolumn(prevAddingColumn => [...prevAddingColumn, ...columnNames]);
    //         setSelectedTables([...selectedTables, table]);
    //     }
    // };

    const addTable = (table) => {
        setSelectedTables((prevSelectedTables) => {
          const isTableSelected = prevSelectedTables.includes(table);
          console.log(isTableSelected,table,"isTableSelected")
      
          if (isTableSelected) {
            const updatedSelectedTables = prevSelectedTables.filter((selectedTable) => selectedTable !== table);
      
            const removedColumns = table.columns.map((column) => `${table.name}.${column}`);
            setAddingcolumn((prevAddingColumn) => prevAddingColumn.filter((column) => !removedColumns.includes(column)));
      
            return updatedSelectedTables;
          } else {
            const updatedSelectedTables = [...prevSelectedTables, table];
            const addedColumns = table.columns.map((column) => `${table.name}.${column}`);
            setAddingcolumn((prevAddingColumn) => [...prevAddingColumn, ...addedColumns]);
      
            return updatedSelectedTables;
          }
        });
      };
      

    const addWhereContainer = () => {
        const newCondition = { id: whereConditions.length + 1 };
        setWhereConditions([...whereConditions, newCondition]);
    };

    const removeWhereCondition = (index) => {
        console.log(index, "index")
        setWhereConditions(whereConditions.filter((_, i) => i !== index));
    };



    const handleColumnChange = (e, index) => {
        const newSelectedColumns = [...selectedColumns];
        newSelectedColumns[index] = e.target.value;
        setSelectedColumns(newSelectedColumns);
    };

    const handleOperatorChange = (e, index) => {
        const newSelectedOperators = [...selectedOperators];
        newSelectedOperators[index] = e.target.value;
        setSelectedOperators(newSelectedOperators);
    };

    const handleInputChange = (e, index) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = e.target.value;
        setInputValues(newInputValues);
    };

    const handleLogicalOperatorChange = (e, index) => {
        const newLogicalOperators = [...logicalOperators];
        newLogicalOperators[index] = e.target.value;
        setLogicalOperators(newLogicalOperators);
    };

    


    // const addWhereCondition = (column) => {
    //     if (!selectColumn.includes(column)) {
    //         setselectColumn(prevSelectColumn => [...prevSelectColumn, column]);
            
    //     }
    // };

    const addWhereCondition = (column) => {
        setselectColumn((prevSelectColumn) => {
            if (prevSelectColumn.includes(column)) {
                return prevSelectColumn.filter((selectedColumn) => selectedColumn !== column);
            } else {
                return [...prevSelectColumn, column];
            }
        });
    };

    console.log(Addingcolumn);

    const handleButtonClick = (button) => {
        setActiveButton(activeButton === button ? '' : button);
    };

    const getColumnsFromWhereConditions = () => {
        return selectColumn.map(condition => condition);
    };

    const handleGroupByColumnChange = (column) => {
        // setGroupByColumns(groupByColumns.includes(column)
        //   ? groupByColumns.filter(c => c !== column)
        //   : [...groupByColumns, column]);\
        setGroupByColumns(prevState => {
            if (prevState.includes(column)) {
                return prevState.filter(c => c !== column);
            } else {
                return [...prevState, column];
            }
        });
        
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

    console.log(selectedSqlFunction,"selectedSqlFunction")

    const handleGroupByColumnChangeforSQLFunction = (column) => {

        setmySqlFunctionColumn(prevState => {
            if (prevState.includes(column)) {
                return prevState.filter(c => c !== column);
            } else {
                return [...prevState, column];
            }
        });

    }

    console.log(mySqlFunctionColumn,"mySqlFunctionColumn")
    console.log(selectedColumns,selectedOperators,inputValues,logicalOperators,"logicalOperators")


    const buildWhereClause = (whereClause) =>{
        var whereClauseString = "";
    var hasCondition = false;

    whereClause.map((item, index)=> {
        if (typeof item === "object") {
            if (hasCondition) {
                whereClauseString += " AND ";
            }
            whereClauseString += item.column + " " + item.operator + " '" + item.value + "'";
            hasCondition = true;
        } else if (item === "OR" || item === "AND") {
            if (index < whereClause.length - 1) { // Check if there's a next item
                whereClauseString += " " + item + " ";
                hasCondition = false;
            }
        }
    });

    return whereClauseString;

    }

    function getSelectedSqlColumns() {
        var selectedSqlColumnssqlFunction = [];
        mySqlFunctionColumn.map((checkbox) => {
            selectedSqlColumnssqlFunction.push(checkbox);
        });
        return selectedSqlColumnssqlFunction;
    }


    const handleGenerateQuery = () => {
        setquery('')
        var selectedColumnstostirefun = [];
        let query = 'SELECT ';

        var sqlFunctions = [];
        selectColumn.map((calitem)=>{
            selectedColumnstostirefun.push(calitem)
        })


        if (selectedSqlFunction) {
            
            if (selectedSqlFunction !== "Select SQL Function") {
                // Only include SQL functions if not equal to "Select SQL Function"
                var selectedSqlColumnsinmysqlFunction = getSelectedSqlColumns();
                // Get selected SQL columns
                if (selectedSqlColumnsinmysqlFunction.length > 0) {
                    sqlFunctions.push(selectedSqlFunction + "(" + selectedSqlColumnsinmysqlFunction.join(", ") + ")");
                }
            }
        }

        if (sqlFunctions.length > 0) {
            selectedColumnstostirefun = selectedColumnstostirefun.concat(sqlFunctions);
            query += selectedColumnstostirefun.join(", ") + " ";
            query += "FROM " + selectedTables.map((tab)=>tab.name).join(", ");
        }

        console.log(selectedTables,"*****")

        console.log(sqlFunctions,"sqlFunctions")
    
        if (selectedColumns.length === 0 && groupByColumns === 0 ) {
          query += '*';
          
           const parts = selectedColumns.map((column)=>column.split('.')[0])  
           const uniqueParts = [...new Set(parts)];
           console.log(query,parts,"parts")

           query += ' FROM '
    
        query += uniqueParts.map((table)=>table).join(', ');
        } else if(selectedColumns.length != 0) {
          query += selectedColumns.map((column)=>column).join(', ');
           const parts = selectedColumns.map((column)=>column.split('.')[0])  
           const uniqueParts = [...new Set(parts)];
           console.log(query,parts,"parts")

           query += ' FROM '
           query += uniqueParts.map((table)=>table).join(', ');
        }


        if(whereConditions.length>0)
        {
        var whereClause = [];
        var lastElementIsCondition = false;
        whereConditions.map((_, index)=>{
            var dropdown1 = selectedColumns[index];
            var dropdown2 = selectedOperators[index];
            var inputField = inputValues[index];
            var dropdown3 = logicalOperators[index];

            if(dropdown1 && dropdown2 && inputField){
                var condition = {
                    column: dropdown1,
                    operator: dropdown2,
                    value: inputField
                };
                whereClause.push(condition);
                lastElementIsCondition = true;
            }else if (lastElementIsCondition) {
                alert('Please fill out all condition fields or remove unnecessary conditions.', 'remove');
            }

            if (dropdown3 && lastElementIsCondition) {
                whereClause.push(dropdown3);
                lastElementIsCondition = false;
            }
        })

        if (whereClause.length > 0) {
            var whereClauseString = buildWhereClause(whereClause);
            query += " WHERE " + whereClauseString;
        }
    }

         console.log(groupByColumns,"groupByColumns")
         
        if (groupByColumns.length > 0) {
            var groupBy_Columns = [];
            groupByColumns.map((checkbox)=> {
                groupBy_Columns.push(checkbox)
            });
            query += " GROUP BY " + groupBy_Columns.join(", ");
        }
    

    if (orderByDirection) {
        var selectedOrderByColumn = orderByColumns[0];
        var selectedOrderByDirection = orderByDirection;

        if (selectedOrderByColumn && selectedOrderByDirection != "Select") {
            query +=selectedOrderByColumn + " FROM " + selectedOrderByColumn.split('.')[0] + " ORDER BY " + selectedOrderByColumn + " " + selectedOrderByDirection;
        }else if(selectedOrderByDirection === "Select" && selectedOrderByColumn){
            query += " * FROM " + selectedOrderByColumn.split('.')[0] + " ORDER BY " + selectedOrderByColumn

        }
    }

    
        // if (whereClause.length>0) {
        //   query += ` WHERE ${condition}`;
        // }
    
        // if (groupColumn) {
        //   query += ` GROUP BY ${groupColumn}`;
        // }
    
        // if (orderByColumn) {
        //   query += ` ORDER BY ${orderByColumn} ${orderByDirection || 'ASC'}`;
        // }
    
        console.log('Generated Query:', query);
        setquery(query)
      };

    console.log(query,"query..")
    

    return (
        <div>
            <div className='QueryBuilder_Container'>
                <div className='Header'>
                    <Header />
                </div>
                <div className='mainConatiner'>
                    <div className='BuildQuery_left'>
                        <div className='pannel_header'>
                            <h4>Search Table</h4>
                        </div>
                        <div className='table_search'>
                            <input className='search'
                                type="text"
                                placeholder="Search tables..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="tables-of-list">
                            {filteredTables?.map((table) => (
                                <div key={table.name} className="table_item" >
                                    <input
                                        type="checkbox"
                                        checked={selectedTables.includes(table)}
                                        onClick={() => addTable(table)}
                                    >
                                    </input>
                                    <span>{table.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='BuildQuery_right'>
                        <div className='cardConatiner' style={{ display: 'block' }}>
                            {selectedTables.map((table) => (<div className='buildquery_card'>
                                <div key={table.name} className="card-header">
                                    {table.name}</div>
                                {table.columns.map((column) => (
                                    <div key={column} className="column-item">
                                        <input
                                        className='column-checkbox'
                                        type="checkbox"
                                        checked={selectColumn.includes(`${table.name}.${column}`)}
                                        onClick={() => addWhereCondition(`${table.name}.${column}`)}

                                    />
                                        <span>{`${table.name}.${column}`}</span>
                                    </div>
                                ))}
                            </div>
                            ))}
                        </div>
                        <div className='where_conditanal_container' style={{ display: "flex" }}>
                            <div className='where_header'>
                                <h2>Where Conditions</h2>
                                <button className='add_condition_btn' type='button' onClick={addWhereContainer}>+</button>
                            </div>
                            {whereConditions.map((condition, index) => (
                                <div key={condition.id} className='where_conatiner'>
                                    <div className='roww'>
                                        <select
                                            value={selectedColumns[index]}
                                            onChange={(e) => handleColumnChange(e, index)}
                                            className="where-select"
                                        >
                                            {/* Generate options from selected tables */}
                                            {
                                                Addingcolumn.map(column => (
                                                    <option key={column} value={column}>
                                                        {column}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <select
                                            value={selectedOperators[index]}
                                            onChange={(e) => handleOperatorChange(e, index)}
                                            className="where-select"
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
                                            value={inputValues[index]}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="where-value-input"
                                        />
                                        <select
                                            value={logicalOperators[index]}
                                            onChange={(e) => handleLogicalOperatorChange(e, index)}
                                            className="where-select"
                                        >   <option value="---">---</option>
                                            <option value="AND">AND</option>
                                            <option value="OR">OR</option>
                                        </select>
                                        <button className="where-remove-button" onClick={() => removeWhereCondition(index)}>
                                            X
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='query_builder_contaier' style={{ display: "block" }}>
                            <div className='query_builder_header'>
                                <button onClick={() => handleButtonClick('Group By')} className={`action-button ${activeButton === 'Group By' ? 'active' : ''} butt`}>Group By</button>
                                <button onClick={() => handleButtonClick('Order By')} className={`action-button ${activeButton === 'Order By' ? 'active' : ''} butt`}>Order By</button>
                                <button onClick={() => handleButtonClick('SQL Functions')} className={`action-button ${activeButton === 'SQL Functions' ? 'active' : ''} butt`}>SQL Functions</button>
                            </div>

                            <div className='query_builder_content'>
                                <div className='section_of_container'>
                                    <div className='section_ontent'>
                                        {activeButton === 'Group By' && (
                                            <div className="group-by-section">
                                                {getColumnsFromWhereConditions().map((column, index) => (
                                                    <div key={index}>
                                                        <input
                                                            type="checkbox"
                                                            checked={groupByColumns.includes(column)}
                                                            onChange={() => handleGroupByColumnChange(column)}
                                                        />
                                                        <span>{column}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className='section_ontent'>
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
                                                    <option value="Select">Select</option>
                                                    <option value="ASC">ASC</option>
                                                    <option value="DESC">DESC</option>
                                                </select>
                                            </div>
                                        )}

                                    </div>
                                    <div className='section_ontent'>
                                        {activeButton === 'SQL Functions' && (
                                            <div className="sql-functions-section">
                                                {getColumnsFromWhereConditions().map((column, index) => (
                                                    <div key={index}>
                                                        <input
                                                            type="checkbox"
                                                            checked={mySqlFunctionColumn.includes(column)}
                                                            onChange={() => handleGroupByColumnChangeforSQLFunction(column)}
                                                        />
                                                        <span>{column}</span>
                                                    </div>
                                                ))}
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
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className='query_generator_container'>
                            <div className='query_generator_header'>
                                <h2>Generated Query</h2>
                            </div>
                            <div className='query_generator_content'>
                                <div className='query_generator_outer'>
                                    <textarea rols='5' cols='50' readOnly value={query}>
                                    </textarea>
                                </div>
                            </div>

                            <div className='query_controls'>
                                <button className='generatorQueryBtn1' onClick={handleGenerateQuery}> Generate Query </button>
                                <Link className='generatorQueryBtn2' to={`/CustomQuery?Query=${query}`}>Next </Link> 
                            </div>

                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default BuildQueryNew






 