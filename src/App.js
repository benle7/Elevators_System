import logo from './media/logo.svg';
import './App.css';
import { Link } from 'react-router-dom';
import React, {useState, useEffect } from 'react';


function App() {
  // allow enter to the elevetors page just with valid values
  const [isValid, setisValid] = useState(true);
  const [floors, setFloors] = useState("10");
  const [elevators, setElevators] = useState("5");


  const handleInputChange = (e) => {
    const v = e.target.value;
    if(e.target.name == "floors") {
      setFloors(v);
    } else {
      setElevators(v);
    }
    if (!isNaN(v) && v != "") {
      if (e.target.name == "floors") {
        if (!isNaN(elevators) && elevators != "") {
          setisValid(true);
        } else {
          setisValid(false);
        }
      } else {
        if (!isNaN(floors) && floors != "") {
          setisValid(true);
        } else {
          setisValid(false);
        }
      }
    } else {
      setisValid(false);
    }
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Welcome !</p>

        <form>
            <div>
                <label className="inputLabel">
                  Floors :&nbsp;
                  <input className= "inputDetails" type="text" name="floors" defaultValue={floors} onChange={handleInputChange} />
                </label>
            </div>

            <div>
                <label className="inputLabel" >
                  Elevators :&nbsp;
                  <input className= "inputDetails" type="text" name="elevators" defaultValue={elevators} onChange={handleInputChange} />
                </label>
            </div>
        </form>

        {isValid ?
          <Link className="App-link" to={`/elevatorsApp/${floors}/${elevators}`}>Enter To The Elevators App</Link>
          :
          <span className="App-link">Select valid values</span>
        }
      </header>
    </div>
  );
}

export default App;
