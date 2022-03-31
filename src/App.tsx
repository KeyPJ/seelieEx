import React, {useState} from 'react';
import Draggable, {ControlPosition, DraggableData, DraggableEvent} from 'react-draggable';
import './App.css';
import ExDialog from "./components/SeelieExDialog";

function App() {

    const [showExDialog, setShowExDialog] = useState(() => false)

    const nodeRef = React.useRef(null)

    const [position, setPosition] = useState<ControlPosition>(() => {
        const itemString = localStorage.getItem("seelieExPosition");
        if (typeof itemString == 'string' && itemString.length > 0) {
            return JSON.parse(itemString) as ControlPosition
        }
        return {x: 30, y: 500};
    });

    const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
        const {x, y} = data;
        localStorage.setItem("seelieExPosition", JSON.stringify({x, y}));
        setPosition({x, y})
        eventControl(e, data)
    }

    const [isDragging, setIsDragging] = useState<any>(false);

    const eventControl = (event: { type: any; }, info: any) => {
        if (event.type === 'mousemove' || event.type === 'touchmove') {
            setIsDragging(true)
        }
        if (event.type === 'mouseup' || event.type === 'touchend') {
            setTimeout(() => {
                setIsDragging(false);
            }, 100);
        }
    }

    return (
        <div className="App">
            <Draggable nodeRef={nodeRef} defaultPosition={position} onStop={handleDragStop} onDrag={eventControl}>
                <div ref={nodeRef}
                     className="fixed inset-0 max-w-max max-h-max flex items-center justify-center z-[1201]">
                    <button
                        type="button"
                        onClick={() => !isDragging && setShowExDialog(!showExDialog)}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                    >
                        SeelieEX
                    </button>
                </div>
            </Draggable>
            <div style={{display: showExDialog ? "" : "none"}}>
                <ExDialog/>
            </div>
        </div>
    );
}


export default App;
