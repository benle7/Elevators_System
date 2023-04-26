import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './Building.css';
import ElevatorButton from './ElevatorButton';
import Elevator from './Elevator';
import Bell from '../media/bell.mp3'


const bell = new Audio(Bell)
// default values
const defaultElevator = {floor: 0, availability: true, colorStatus:"blackStatus"}
const defaultPosition = {x: 0, y: 0}
const dictFloorsText = {0:"Ground Floor",1:"1st",2:"2nd",3:"3rd",4:"4th",5:"5th",6:"6th",7:"7th",8:"8th",9:"9th"}


export default function Building() {
    // Take params from the Welcome page
    const {floorsN,elevatorsN} = useParams();
    const NumOfFloors = parseInt(floorsN)
    const NumOfElevators = parseInt(elevatorsN)

    // queue for save all the calls from buttons
    const [callsQueue, setCallsQueue] = useState([]);
    // queue for arrival elevators, that need to show position change
    const [arrivalQueue, setArrivalQueue] = useState([]);
    const [buttonsText, setButtonsText] = useState([...Array(NumOfFloors)].map((v, i) => 'Call'))
    const [elevators, setElevators] = useState([...Array(NumOfElevators)].map((v, i) => ({...defaultElevator})))
    const [positions, setPositions] = useState([...Array(NumOfElevators)].map((v, i) => ({...defaultPosition})))


    const addToCallsQueue = (floor) => {
        // apply when button pushed
        setCallsQueue(prev => [...prev, floor]);
    } 

    const addToArrivalQueue = (indexE, distance, target) => {
        // apply from 'call elevator'
        setArrivalQueue(prev => [...prev, {indexE: indexE, target:target, distance:distance}]);
    }

    const ClosestElevator = (target) => {
        const avaliblesElevators = elevators.map((e,i) => e.availability === true ? e.floor : null);
        const distances = avaliblesElevators.map(d => d !== null ? Math.abs(target - d) : Infinity);
        const minDistance = Math.min(...distances);
        let indexE = distances.findIndex(x => x === minDistance);
        return [indexE,minDistance];
    }

    const callElevator = (target) => {
        const result = ClosestElevator(target);
        const indexE = result[0];
        const minDistance = result[1];
        // take duration of movement
        const start = performance.now();
        addToArrivalQueue(indexE, minDistance, target);    
        const end = performance.now();
        console.log(end - start);
        if (arrivalQueue.length !== 0 ) {
            setArrivalQueue([]);
        }
        // arrived elevator -> return to call and available state
        setTimeout(() => { 
            setElevators(prev => prev.map((e,i) =>{ 
                if (i === indexE) {
                    let updatedElevator = e;
                    updatedElevator.availability = true;
                    updatedElevator.colorStatus = "blackStatus";
                    return updatedElevator;
                } else {return e}
            }));
        setButtonsText(prev => prev.map((text,i) => i === target ? 'Call': text));
        }, 2500);
    }

    const getFloorName = (floor) => {
        if (dictFloorsText[floor] !== undefined) {
            return dictFloorsText[floor];
        }
        return floor+'th';
    }

    const availableElavator = () => {
        return (elevators.some(e => e.availability === true));
    }


    useEffect(() => {
        // if there is call and available elavator -> handle the call.
        if (callsQueue.length !== 0 && availableElavator()) {
            callElevator(callsQueue[0]);
            setCallsQueue(callsQueue.slice(1));
        } 
    });

    useEffect(() => {
        // there is arrival elevator that need to show position change.
        if (arrivalQueue.length !== 0) 
        {
            const current = arrivalQueue[0];
            const indexE = current.indexE;
            const target = current.target;
            // change the text of the target floor buttton
            setButtonsText(prev => prev.map((t,i) => i === target ? 'Waiting': t));
            const n = elevators[indexE].floor - target;
            const floorHeight = document.querySelector('td').clientHeight;
            // new position of the elevator
            positions[indexE] = { x: positions[indexE].x, y: positions[indexE].y + n * floorHeight };
            // apply movement
            setPositions(positions);

            setTimeout(() => {
                // elevator in movement with red color and not available
                setElevators(prev => prev.map((e,i) => {
                    if (i  === indexE ) {
                        let updatedElevator = e;
                        updatedElevator.availability = false;
                        updatedElevator.colorStatus = "redStatus";
                        return updatedElevator;
                    } else {return e}
                    }));
                }, 20);

            setArrivalQueue(arrivalQueue.slice(1));

            setTimeout(()=>{
                // when finish the movement :
                // apply bell, change text button of target floor, change elevator color and floor
                bell.currentTime = 0;
                bell.play()
                setButtonsText(prev => prev.map((text,i) => i === target ? 'Arrived': text));
                setElevators(prev => prev.map((e,i) => 
                {
                    if (i  === indexE) {
                        let updatedElevator = e;
                        updatedElevator.floor = target;
                        updatedElevator.availability = false;
                        updatedElevator.colorStatus = "greenStatus";
                        return updatedElevator;
                    } else {return e}
                }));
            }, 1500)
        }
    }, [arrivalQueue]);


    return (
        <div>
            <table>
                <tbody>
                    {[...Array(NumOfFloors - 1)].map((v, i) => {
                        const floor = (NumOfFloors - 1) - i;
                        return (<tr>
                                    <td className="sideCol floorName">
                                        <label className="sideCol">{getFloorName(floor)}</label>
                                    </td>
                                    
                                    {[...Array(NumOfElevators)].map((v, i) => {
                                        return (
                                        <td>
                                        </td>
                                        )
                                    })}
                                    
                                    <td className="sideCol callBtnTd">
                                        <ElevatorButton floor={floor} text={buttonsText[floor]} callToElevator={addToCallsQueue} />
                                    </td>
                                </tr>)
                    })}
                        
                    <tr>
                        <td className="sideCol floorName">
                            <label className="sideCol">{getFloorName(0)}</label>
                        </td>
                        {elevators.map((e, i) => {
                            return (
                                <td>
                                    <Elevator colorStatus={e.colorStatus} position={positions[i]}/>      
                                </td>
                            )   
                        })}
                        <td className="sideCol callBtnTd">
                            <ElevatorButton floor={0} text={buttonsText[0]} callToElevator={addToCallsQueue} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
