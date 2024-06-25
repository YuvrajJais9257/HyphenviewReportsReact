import React from 'react'
import { useDrag } from "react-dnd";
import './DragDrop.css'
function ChartType({ id, chart }) {
    console.log("chart",id,chart);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "text",
        item: { id: id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (
        <div
            ref={drag}
            width="auto"
            style={{ border: isDragging ? "4px solid black" : "0px" }}
        >{chart}</div>
    );
}

export default ChartType