import './Elevator.css'
import elevatorIcon from '../media/icons-elevator.svg';


export default function Elevator(props) {
    // colorStatus changed -> className changed -> style changed.
    // change position with transform & transition.
    return (
        <img className={props.colorStatus} src={elevatorIcon} style={{ transform: `translate(${props.position.x}px, ${props.position.y}px)`, transition: `transform 1.5s ease-in-out` }}/>
    );
}
