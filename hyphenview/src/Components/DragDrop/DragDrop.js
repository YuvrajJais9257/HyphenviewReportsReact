
import React, { useState } from 'react';
import ChartType from './ChartType'
import { useDrop } from "react-dnd";
import './DragDrop.css'
function DragDrop({ chartType, setChartType }) {
    // const [board, setBoard] = useState([]);

    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: "text",
    //     drop: (item) => addImageToBoard(item.id),
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // }));

    // const addImageToBoard = (id) => {
    //     const pictureList = setChartType.filter((picture) => id === picture.id);
    //     setBoard((board) => [...board, pictureList[0]]);
    // };

    return (
        <div className='side_bar'>
            {chartType && chartType.map((charttype, index) => {
                // <div className="chart_type" key={index}>{charttype.chart}</div>
                return <div className="chart_type"><ChartType chart={charttype.chart} id={charttype.id} /></div>;
            })}
        </div>
    );
}

export default DragDrop;
