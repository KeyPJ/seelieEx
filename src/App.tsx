import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './App.css';
import ExDialog from "./components/SeelieExDialog";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

    const [showExDialog, setShowExDialog] = useState(() => false)

    const nodeRef = React.useRef(null)

    return (
        <div className="App">
            <Draggable nodeRef={nodeRef}>
                <div ref={nodeRef} className="float-btn" onClick={() => setShowExDialog(!showExDialog)}>
                    SeelieEX
                </div>
            </Draggable>
            <div style={{display: showExDialog ? "" : "none"}}>
                <ExDialog/>
            </div>
        </div>
    );
}


export default App;
