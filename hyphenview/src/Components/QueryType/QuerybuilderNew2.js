import React, { useEffect, useMemo, useState } from 'react'
import Header from '../header'
import { useDispatch, useSelector } from 'react-redux';
import { schemametaData } from '../../actions/auth';
// import { Button } from '../../globalCSS/Button/Button';
import './BuildQueryNew.css'
import { Link } from 'react-router-dom';

export default function BuildQueryNew() {

    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('profile'))
        const shemaDetail = JSON.parse(localStorage.getItem('SelectedSchema'))
        console.log(shemaDetail, "shemaDetail")
        dispatch(schemametaData({ "schema_name": shemaDetail?.selectedSchema, "database_type": shemaDetail?.databasename, "email": user?.user_email_id }))
    }, [])

    const apiData = useSelector((state) => state?.auth);
    const tableData = apiData?.SchemaMetadata;
    console.log(tableData, "tableData")

    var tableMap = new Map();

    tableData?.map(column => {
        const tableName = column?.TABLE_NAME;

        if (!tableMap.has(tableName)) {
            tableMap.set(tableName, { name: tableName, columns: [] });
        }
        tableMap.get(tableName).columns.push(column.COLUMN_NAME);
    });

    var transformedData = Array.from(tableMap.values());

    console.log(transformedData, "transformedData");

    const sqlFunctions = [
        'COUNT(*)',
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
    const [joinConditions, setJoinConditions] = useState([]);
    const [activeButton, setActiveButton] = useState('');
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedColumns1, setSelectedColumns1] = useState([]);
    const [selectedColumns2, setSelectedColumns2] = useState([]);
    const [selectedOperators, setSelectedOperators] = useState([]);
    const [inputValues, setInputValues] = useState([]);
    const [logicalOperators, setLogicalOperators] = useState([]);
    const [joinClause, setJoinClause] = useState([]);
    const [groupByColumns, setGroupByColumns] = useState([]);
    const [selectColumn, setselectColumn] = useState([])
    const [selectedSqlFunction, setSelectedSqlFunction] = useState([]);
    const [mySqlFunctionColumn, setmySqlFunctionColumn] = useState([]);
    const [query, setquery] = useState('');
    const [orderByColumnDirection, setOrderByColumnDirection] = useState([]);
    const [sqlFunctionsByColumn, setSqlFunctionsByColumn] = useState([]);
    const [commonColumns, setCommonColumns] = useState([]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredTables = transformedData?.filter((table) =>
        table.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addTable = (table) => {
        setSelectedTables((prevSelectedTables) => {
            const isTableSelected = prevSelectedTables?.find((item) => item?.name === table?.name)
            console.log(isTableSelected, table, "isTableSelected")

            if (isTableSelected) {
                const updatedSelectedTables = prevSelectedTables.filter((selectedTable) => selectedTable.name !== table.name);

                const removedColumns = table.columns.map((column) => `${ table.name }.${ column }`);
                setAddingcolumn((prevAddingColumn) => prevAddingColumn.filter((column) => !removedColumns.includes(column)));

                return updatedSelectedTables;
            } else {
                const updatedSelectedTables = [...prevSelectedTables, table];
                const addedColumns = table.columns.map((column) => `${ table.name }.${ column }`);
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
        console.log(index, "whereIndex")
        setWhereConditions(whereConditions.filter((_, i) => i !== index));
    };

    const addJoinContainer = () => {
        const newCondition1 = { id: joinConditions.length + 1 };
        setJoinConditions([...joinConditions, newCondition1]);
    };

    const removeJoinCondition = (index) => {
        console.log(index, "joinIndex")
        setJoinConditions(joinConditions.filter((_, i) => i !== index));
    };

    const handleColumnChange = (e, index) => {
        const newSelectedColumns = [...selectedColumns];
        newSelectedColumns[index] = e.target.value;
        setSelectedColumns(newSelectedColumns);
    };

    const handleColumnChange1 = (e, index) => {
        const newSelectedColumns1 = [...selectedColumns1];
        newSelectedColumns1[index] = e.target.value;
        setSelectedColumns1(newSelectedColumns1);
    };

    const handleColumnChange2 = (e, index) => {
        const newSelectedColumns2 = [...selectedColumns2];
        newSelectedColumns2[index] = e.target.value;
        setSelectedColumns2(newSelectedColumns2);
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

    const handleJoinClauseChange = (e, index) => {
        const newJoinClause = [...joinClause];
        newJoinClause[index] = e.target.value;
        setJoinClause(newJoinClause);
    };

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
        setGroupByColumns(prevState => {
            if (prevState.includes(column)) {
                return prevState.filter(c => c !== column);
            } else {
                return [...prevState, column];
            }
        });

    };

    const handleOrderByColumnChange = (column) => {
        setOrderByColumnDirection(prevSelections => [
            ...prevSelections,
            { column, order: undefined }
        ]);
    };

    const handleOrderByDirectionChange = (index, order) => {
        setOrderByColumnDirection(prevSelections => {
            const updatedSelections = [...prevSelections];
            updatedSelections[index].order = order === 'DESC' ? 'DESC' : 'ASC';
            return updatedSelections;
        });
    }

    const handleGroupByColumnChangeforSQLFunction = (column) => {
        setSqlFunctionsByColumn(prevSelections => [
            ...prevSelections,
            { column, func: undefined }
        ]);
        // setmySqlFunctionColumn(prevState => {
        //     if (prevState.includes(column)) {
        //         return prevState.filter(c => c !== column);
        //     } else {
        //         return [...prevState, column];
        //     }
        // });
    };
    console.log(sqlFunctionsByColumn, "Again")

    const handleSqlFunctionChange = (index, func) => {
        setSqlFunctionsByColumn(prevSelections => {
            const updatedSelections = [...prevSelections];
            updatedSelections[index].func = func;
            // if(updatedSelections?.[index]?.func){
            //     updatedSelections[index].func = func;
            // }
            return updatedSelections;
        });
        // setSelectedSqlFunction(prevState => {
        //     if (prevState.includes(func)) {
        //         return prevState.filter(c => c !== func);
        //     } else {
        //         return [...prevState, func];
        //     }
        // });
    };
    console.log(selectedColumns, selectedOperators, inputValues, logicalOperators, joinClause, "logicalOperators")

    const findCommonColumns = (table1, table2) => {
        const columnsTable1 = transformedData.filter((table) => table.name == table1)
        const columnsTable2 = transformedData.filter((table) => table.name == table2)
        // get table1 and table2 all column array in columns variable 
        return columnsTable1[0].columns.filter(column => columnsTable2[0].columns.includes(column))
    };

    const buildWhereClause = (whereClause) => {

        var whereClauseString = "";
        var hasCondition = false;

        whereClause.map((item, index) => {
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
            } else if (item === "JOIN") {
                console.log(whereClause, "whereclauseagain")
                const table1 = whereClause[0].column.split(".")[0]
                const table2 = whereClause[3].column.split(".")[0]
                const common = findCommonColumns(table1, table2);
                console.log(common, "commoncolumncheck")
                setCommonColumns(common);
            }
        });
        return whereClauseString;
    }

    console.log(commonColumns, "heheh")


    const buildJoinClause = (joinClauses) => {
        console.log(joinClauses, "CROSS")
        var joinClauseString = "";
        if (joinClauses[0].value === ("INNER JOIN" || "RIGHT JOIN" || "LEFT JOIN" || "FULL JOIN")) {
            joinClauseString += " " + joinClauses[0].value + " " + joinClauses[0].column.split(".")[0] + " " + "ON" + " " + joinClauses[0].column + "=" + joinClauses[0].operator;
        }
        return joinClauseString;
    }

    const sqlCol = sqlFunctionsByColumn.map(obj => obj.column);
    const sqlFun = sqlFunctionsByColumn.map(obj => obj.func);

    console.log(sqlCol, sqlFun, "Again2")

    // function getSelectedSqlColumns() {
    //     var selectedSqlColumnssqlFunction = [];

    //         sqlCol.map((checkbox) => {
    //         selectedSqlColumnssqlFunction.push(checkbox);
    //     });
    //     return selectedSqlColumnssqlFunction;
    // }

    const handleGenerateQuery = () => {
        setquery('')
        var selectedColumnstostirefun = [];
        let query = 'SELECT ';

        var sqlFunctions = [];
        selectColumn.map((calitem) => {
            selectedColumnstostirefun.push(calitem)
        })

        const hasCommonElement = groupByColumns.some(col => sqlCol.includes(col));

        if (sqlFun.length > 0) {
            console.log("HARI")
            if (sqlFun !== "Select SQL Function" && sqlFun.length == 1) {
                // Only include SQL functions if not equal to "Select SQL Function"
                // var selectedSqlColumnsinmysqlFunction = getSelectedSqlColumns();
                // Get selected SQL columns
                if (hasCommonElement) {
                    alert('Select SQL Functions Columns different from GroupBy')
                    console.log("check")
                }
                else if (sqlCol.length > 0) {
                    sqlFunctions.push(sqlFun + "(" + sqlCol.join(", ") + ")");
                }
                // else if(sqlCol === undefined && sqlFun === 'COUNT(*)'){
                //     sqlFunctions.push(" COUNT(*) ");
                // }
            }
            else if (sqlFun.length > 1) {
                // var selectedSqlColumnsinmysqlFunction = getSelectedSqlColumns();
                if (hasCommonElement) {
                    alert('Select SQL Functions Columns different from GroupBy')
                    console.log("check")
                }
                if (sqlFun.includes('COUNT(*)') && sqlFun.includes('COUNT')) {
                    alert('Select any one COUNT function')
                }
                else {
                    sqlFunctions.push(sqlFunctionsByColumn.map(item =>` ${ item.func }(${ item.column })`));
                    console.log("valid")
                }
                // else if (sqlCol.length > 0 && sqlFun.includes('COUNT')) {
                //     if(sqlFun.includes('COUNT')){
                //         sqlFunctions.push(" COUNT(*) ")
                //     }
                //     const excludeCount = selectedSqlFunction.filter(item => item !== 'COUNT');
                //     sqlFunctions.push(excludeCount + "(" + sqlCol.join(", ") + ")");
                // }
            }
        }
        // if (selectedSqlFunction) {
        //     if (selectedSqlFunction !== "Select SQL Function" && selectedSqlFunction.length == 1) {
        //         console.log("checkpurpose1")
        //         // Only include SQL functions if not equal to "Select SQL Function"
        //         var selectedSqlColumnsinmysqlFunction = getSelectedSqlColumns();
        //         // Get selected SQL columns
        //         if (selectedSqlColumnsinmysqlFunction.length > 0) {
        //             console.log("checkpurpose2")
        //             sqlFunctions.push(selectedSqlFunction + "(" + selectedSqlColumnsinmysqlFunction.join(", ") + ")");
        //         }
        //         else if(selectedSqlFunction.length != 0 && selectedSqlColumnsinmysqlFunction.length == 0 && selectedSqlFunction == "COUNT"){
        //             console.log("checkpurpose3")
        //             sqlFunctions.push(selectedSqlFunction + "(" + "*" + ")");
        //         }
        //     }
        //     else if (selectedSqlFunction.length == 2){
        //         console.log("checkpurpose4")
        //         var selectedSqlColumnsinmysqlFunction = getSelectedSqlColumns();
        //         if (selectedSqlFunction.includes('COUNT(*)') && selectedSqlFunction.includes('COUNT')){
        //             alert('Select any one COUNT function')
        //         }
        //         else if (selectedSqlColumnsinmysqlFunction.length > 0 && selectedSqlFunction.includes('COUNT')) {
        //             if(selectedSqlFunction.includes('COUNT')){
        //                 sqlFunctions.push(" COUNT(*) ")
        //             }
        //             const excludeCount = selectedSqlFunction.filter(item => item !== 'COUNT');
        //             sqlFunctions.push(excludeCount + "(" + selectedSqlColumnsinmysqlFunction.join(", ") + ")");
        //         }
        //     }
        // }

        if (sqlFunctions.length > 0) {
            if (groupByColumns.length > 0) {
                selectedColumnstostirefun = selectedColumnstostirefun.filter(item => groupByColumns.includes(item));
                console.log(selectedColumnstostirefun, groupByColumns, "given1")
            }
            selectedColumnstostirefun = selectedColumnstostirefun.concat(sqlFunctions);
            query += selectedColumnstostirefun.join(", ") + " ";
            console.log(query, "given2")
            query += "FROM " + selectedTables.map((tab) => tab.name).join(", ");
        }

        console.log(selectedTables, "***")
        console.log(sqlFunctions, "sqlFunctions")

        if (selectedColumns.length === 0 && groupByColumns === 0) {
            query += '*';

            const parts = selectedColumns.map((column) => column.split('.')[0])
            const uniqueParts = [...new Set(parts)];
            console.log(query, parts, "parts")

            query += ' FROM '
            query += uniqueParts.map((table) => table).join(', ');
        }
        else if(selectedColumns.length != 0 && ((whereConditions.length == 0 || joinConditions.length == 0))) {
            query += selectedColumns.map((column) => column).join(', ');
            const parts = selectedColumns.map((column) => column.split('.')[0])
            const uniqueParts = [...new Set(parts)];
            console.log(query, parts, "parts")

            query += ' FROM '
            console.log(joinClause.length, joinClause[0], "This is the length")
            if (joinClause.length == 1 && joinClause[0] == "JOIN") {
                query += parts[0]
            }
            else {
                query += uniqueParts.map((table) => table).join(', ');
            }
        }

        if (joinConditions.length > 0) {
            var joinClauses = [];
            var lastElementIsCondition1 = false;
            whereConditions.map((_, index) => {
                var dropdown4 = selectedColumns1[index];
                var dropdown5 = selectedColumns2[index];
                var dropdown6 = joinClause[index];

                if (dropdown4 && dropdown5 && dropdown6) {
                    var condition1 = {
                        column: dropdown4,
                        operator: dropdown5,
                        value: dropdown6
                    };
                    joinClauses.push(condition1);
                    // lastElementIsCondition1 = true;
                } else if (lastElementIsCondition1) {
                    alert('Please fill out all condition fields or remove unnecessary conditions.', 'remove');
                }
            })
            if (joinClauses.length > 0) {
                var joinClauseString = buildJoinClause(joinClauses);
                query += joinClauseString;
                console.log(query, "queryshow")
            }
        }

        if (whereConditions.length > 0) {
            var whereClause = [];
            var lastElementIsCondition = false;
            whereConditions.map((_, index) => {
                var dropdown1 = selectedColumns[index];
                var dropdown2 = selectedOperators[index];
                var inputField = inputValues[index];
                var dropdown3 = logicalOperators[index];

                if (dropdown1 && dropdown2 && inputField) {
                    var condition = {
                        column: dropdown1,
                        operator: dropdown2,
                        value: inputField
                    };
                    whereClause.push(condition);
                    lastElementIsCondition = true;
                } else if (lastElementIsCondition) {
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

        console.log(groupByColumns, "groupByColumns")

        if (groupByColumns.length > 0) {
            var groupBy_Columns = [];
            groupByColumns.map((checkbox) => {
                groupBy_Columns.push(checkbox)
            });
            query += " GROUP BY " + groupBy_Columns.join(", ");
            console.log(query, "given3")
        }


        if (orderByColumnDirection) {
            var orderByClause = orderByColumnDirection.map(item => {
                return item.column + ' ' + item.order;
            }).join(', ');
            var orderByColumnClause = orderByColumnDirection.map(item => {
                return item.column;
            }).join(', ');
            var orderByTable = orderByColumnDirection.map(item => {
                return item.column.split('.')[0];
            }).join(', ');
            var orderByDirectionClause = orderByColumnDirection.map(item => {
                return item.order;
            }).join(', ');
            if (((groupByColumns.length || sqlFunctionsByColumn.length) && orderByColumnDirection.length) !== 0) {
                query += " ORDER BY " + orderByClause;
            } else if (orderByColumnDirection.length != 0) {
                query += orderByColumnClause + " FROM " + orderByTable + " ORDER BY " + orderByClause;
                console.log(query, "---")
            } else if (orderByColumnClause) {
                query += " * FROM " + orderByTable + " ORDER BY " + orderByColumnClause
            }
        }
        console.log('Generated Query:', query);
        setquery(query)
    };

    console.log(query, "query..")


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
                            {filteredTables?.map((table) => {
                                console.log()
                                return <div key={table.name} className="table_item">

                                    <input
                                        type="checkbox"
                                        checked={!!selectedTables?.find((item) => item?.name === table?.name)}
                                        onClick={() => addTable(table)}
                                    >
                                    </input>
                                    <span>{table.name}</span>
                                </div>
                            })}
                        </div>
                    </div>

                    <div className='BuildQuery_right'>
                        <div className='cardConatiner' style={{ display: 'block' }}>
                            {selectedTables.map((table) => (<div className='card' key={table.name}>
                                <div className="card-header">
                                    {table.name}</div>
                                {table.columns.map((column) => (
                                    <div key={column} className="column-item">
                                        <input
                                            className='column-checkbox'
                                            type="checkbox"
                                            checked={selectColumn.includes(`${ table.name }.${ column }`)}
                                            onClick={() => addWhereCondition(`${ table.name }.${ column }`)}
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
                                            <option value="" selected disabled>Column</option>
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
                                            <option value="" selected disabled>Operator</option>
                                            <option value="=">{"equal to"}</option>
                                            <option value="!=">{"not equal to"}</option>
                                            <option value="<">{"smaller than"}</option>
                                            <option value=">">{"greater than"}</option>
                                            <option value=">=">{"greater than equal to"}</option>
                                            <option value="<=">{"smaller than equal to"}</option>
                                            {/* Add more operators as needed */}
                                        </select>

                                        <input
                                            placeholder='Value'
                                            type="text"
                                            value={inputValues[index]}
                                            onChange={(e) => handleInputChange(e, index)}
                                            className="where-value-input"
                                        />
                                        <select
                                            value={logicalOperators[index]}
                                            onChange={(e) => handleLogicalOperatorChange(e, index)}
                                            className="where-select"
                                        >
                                            <option value="" selected disabled>Select Logical Operator</option>
                                            <option value="AND">AND</option>
                                            <option value="OR">OR</option>
                                        </select>
                                        {/* <select
                                            value={joinClause[index]}
                                            onChange={(e) => handleJoinClauseChange(e, index)}
                                            className="where-select"
                                        >   
                                            <option value=""selected disabled>Select Join</option>
                                            <option value="JOIN">JOIN</option>
                                        </select> */}
                                        <button className="where-remove-button" onClick={() => removeWhereCondition(index)}>
                                            X
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className='where_conditanal_container' style={{ display: "flex" }}>
                            <div className='where_header'>
                                <h2>Join Conditions</h2>
                                <button className='add_condition_btn' type='button' onClick={addJoinContainer}>+</button>
                            </div>
                            {joinConditions.map((condition, index) => (
                                <div key={condition.id} className='where_conatiner'>
                                    <div className='roww'>

                                        <select
                                            value={selectedColumns1[index]}
                                            onChange={(e) => handleColumnChange1(e, index)}
                                            className="where-select"
                                        >
                                            <option value="" selected disabled>Column 1</option>
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
                                            value={selectedColumns2[index]}
                                            onChange={(e) => handleColumnChange2(e, index)}
                                            className="where-select"
                                        >
                                            <option value="" selected disabled>Column 2</option>
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
                                            value={joinClause[index]}
                                            onChange={(e) => handleJoinClauseChange(e, index)}
                                            className="where-select"
                                        >
                                            <option value="" selected disabled>Select Join</option>
                                            <option value="INNER JOIN">INNER JOIN</option>
                                            <option value="LEFT JOIN">LEFT JOIN</option>
                                            <option value="RIGHT JOIN">RIGHT JOIN</option>
                                            <option value="FULL JOIN">FULL JOIN</option>
                                        </select>
                                        <button className="where-remove-button" onClick={() => removeJoinCondition(index)}>
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='query_builder_contaier' style={{ display: "block" }}>
                            <div className='query_builder_header'>
                                <button onClick={() => handleButtonClick('Group By')} className={`action - button ${activeButton === 'Group By' ? 'active' : ''} butt`}>Group By</button>
                            <button onClick={() => handleButtonClick('Order By')} className={`action - button ${activeButton === 'Order By' ? 'active' : ''} butt`}>Order By</button>
                        <button onClick={() => handleButtonClick('SQL Functions')} className={`action - button ${activeButton === 'SQL Functions' ? 'active' : ''} butt`}>SQL Functions</button>
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
                                        value={orderByColumnDirection}
                                        onChange={(e) => handleOrderByColumnChange(e.target.value)}
                                        multiple={true}
                                    >
                                        {console.log(orderByColumnDirection, "selectedorderByColumnDirections")}
                                        <option value="Select" disabled selected>Select Column</option>
                                        {getColumnsFromWhereConditions().map((column, index) => (
                                            <option key={index} value={column}>
                                                {column}
                                            </option>
                                        ))}
                                    </select>
                                    <select className='topmargin'
                                        value={orderByColumnDirection}
                                        onChange={(e) => handleOrderByDirectionChange(orderByColumnDirection.length - 1, e.target.value)}
                                    >
                                        <option value="Select" disabled>Select Order</option>
                                        <option value=" "> </option>
                                        <option value="DESC">DESC</option>
                                        <option value="ASC">ASC</option>
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
                                                checked={sqlFunctionsByColumn.find(item => item.column == column)}
                                                onChange={() => handleGroupByColumnChangeforSQLFunction(column)}
                                            />
                                            {/* <input
                                                            type="checkbox"
                                                            checked={mySqlFunctionColumn.includes(column)}
                                                            onChange={() => handleGroupByColumnChangeforSQLFunction(column)}
                                                        /> */}
                                            <span>{column}</span>
                                        </div>
                                    ))}
                                    <select
                                        value={sqlFunctionsByColumn}
                                        onChange={(e) => handleSqlFunctionChange(sqlFunctionsByColumn.length - 1, e.target.value)}
                                        // onChange={(e) => handleSqlFunctionChange(e.target.value)}
                                        multiple={true}
                                    >
                                        <option value="Select" disabled selected>Select SQL Function</option>
                                        {console.log(selectedSqlFunction, "selectedfunction")}
                                        {sqlFunctions.map((func, index) => (
                                            <option key={index} value={func}>
                                                {func}
                                            </option>
                                        ))}
                                    </select>
                                    {/* <select
                                                    value={selectedSqlFunction}
                                                    onChange={(e) => handleSqlFunctionChange(e.target.value)}
                                                    multiple={true}
                                                >
                                                    <option value="Select" disabled selected>Select SQL Function</option>
                                                    {console.log(selectedSqlFunction,"selectedfunction")}
                                                    {sqlFunctions.map((func, index) => (
                                                        <option key={index} value={func}>
                                                            {func}
                                                        </option>
                                                    ))}
                                                </select> */}
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
                </div >
            </div >
        </div >
    )
}