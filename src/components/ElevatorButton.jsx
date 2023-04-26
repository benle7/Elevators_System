import React, {useState, useEffect} from 'react';
import './ElevatorButton.css'


const dictColors = {"Call":"callColor", "Waiting":"waitColor", "Arrived":"arriveColor"}


export default function ElevatorButton(props) {
    const [colorStatus, setColorStatus] = useState('callColor');

    // text changed -> colorStatus changed -> className changed -> style changed.
    useEffect(() => {
        setColorStatus(dictColors[props.text])
    }, [props.text])

    return (
    <button className={colorStatus} onClick={() =>props.callToElevator(props.floor)}>{props.text}</button>
    );
}
